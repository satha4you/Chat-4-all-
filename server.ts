import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer as createViteServer } from 'vite';

// Real-time voice room types
interface ConnectedUser {
  socketId: string;
  user: any;
  roomId?: string;
  isMuted?: boolean;
}

interface RoomState {
  id: string;
  seats: Array<{
    seatIndex: number;
    user: any | null;
    isMuted: boolean;
    isLocked: boolean;
    isSpeaking?: boolean;
    audioLevel?: number;
  }>;
  listeners: any[];
  messages: any[];
}

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// In-memory server-authoritative state for real-time rooms
const activeRooms: Map<string, RoomState> = new Map();
// Socket ID -> ConnectedUser
const connectedUsers: Map<string, ConnectedUser> = new Map();

function getOrCreateRoom(roomId: string): RoomState {
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, {
      id: roomId,
      seats: Array.from({ length: 8 }, (_, i) => ({
        seatIndex: i,
        user: null,
        isLocked: false,
        isMuted: true,
        isSpeaking: false,
        audioLevel: 0,
      })),
      listeners: [],
      messages: [],
    });
  }
  return activeRooms.get(roomId)!;
}

// Socket.io initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 30000,
  pingInterval: 10000,
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    roomsCount: activeRooms.size,
    usersCount: connectedUsers.size,
  });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = activeRooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// Realtime WebSocket & WebRTC Signaling Logic
io.on('connection', (socket: Socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // 1. User joins room
  socket.on('room:join', ({ roomId, user }: { roomId: string; user: any }) => {
    if (!roomId || !user) return;

    // Leave any previous room
    const prev = connectedUsers.get(socket.id);
    if (prev?.roomId && prev.roomId !== roomId) {
      leaveRoom(socket, prev.roomId);
    }

    connectedUsers.set(socket.id, {
      socketId: socket.id,
      user,
      roomId,
      isMuted: true,
    });

    socket.join(roomId);
    const roomState = getOrCreateRoom(roomId);

    // Add to listeners list if not already present
    const existingListenerIdx = roomState.listeners.findIndex((u) => u.id === user.id);
    if (existingListenerIdx === -1) {
      roomState.listeners.push({ ...user, socketId: socket.id });
    } else {
      roomState.listeners[existingListenerIdx] = { ...user, socketId: socket.id };
    }

    // Broadcast updated state to room
    io.to(roomId).emit('room:state_update', {
      roomId,
      seats: roomState.seats,
      listeners: roomState.listeners,
      listenersCount: roomState.listeners.length,
    });

    // Notify others that a user joined
    socket.to(roomId).emit('room:user_joined', {
      user,
      socketId: socket.id,
    });

    // Send recent messages to newly joined user
    socket.emit('room:init_history', {
      messages: roomState.messages.slice(-50),
    });

    // Notify seated peers for WebRTC mesh signaling
    const seatedPeers = roomState.seats
      .filter((s) => s.user && s.user.id !== user.id)
      .map((s) => ({
        userId: s.user.id,
        seatIndex: s.seatIndex,
      }));

    socket.emit('webrtc:active_speakers', {
      speakers: seatedPeers,
    });

    console.log(`[Room Join] User ${user.nickname || user.username} joined room ${roomId}. Total listeners: ${roomState.listeners.length}`);
  });

  // 2. User leaves room
  socket.on('room:leave', ({ roomId }: { roomId: string }) => {
    leaveRoom(socket, roomId);
  });

  // 3. Take Seat / Sit Down
  socket.on('room:take_seat', ({ roomId, seatIndex, user }: { roomId: string; seatIndex: number; user: any }) => {
    const roomState = getOrCreateRoom(roomId);
    if (seatIndex < 0 || seatIndex >= roomState.seats.length) return;

    // Check if user already sits on another seat
    roomState.seats = roomState.seats.map((s, idx) => {
      if (s.user?.id === user.id && idx !== seatIndex) {
        return { ...s, user: null, isSpeaking: false, isMuted: true, audioLevel: 0 };
      }
      return s;
    });

    // Assign seat
    roomState.seats[seatIndex] = {
      ...roomState.seats[seatIndex],
      user: { ...user, socketId: socket.id },
      isMuted: true,
      isSpeaking: false,
      audioLevel: 0,
    };

    io.to(roomId).emit('room:seats_update', {
      roomId,
      seats: roomState.seats,
    });

    // Notify room of new speaker for WebRTC peer connection
    io.to(roomId).emit('webrtc:speaker_joined', {
      socketId: socket.id,
      userId: user.id,
      seatIndex,
    });

    console.log(`[Seat] User ${user.nickname} took seat ${seatIndex} in room ${roomId}`);
  });

  // 4. Leave Seat / Step down to audience
  socket.on('room:leave_seat', ({ roomId, userId }: { roomId: string; userId: string }) => {
    const roomState = getOrCreateRoom(roomId);
    let freedSeatIndex = -1;

    roomState.seats = roomState.seats.map((s, idx) => {
      if (s.user?.id === userId) {
        freedSeatIndex = idx;
        return { ...s, user: null, isSpeaking: false, isMuted: true, audioLevel: 0 };
      }
      return s;
    });

    io.to(roomId).emit('room:seats_update', {
      roomId,
      seats: roomState.seats,
    });

    if (freedSeatIndex !== -1) {
      io.to(roomId).emit('webrtc:speaker_left', {
        socketId: socket.id,
        userId,
        seatIndex: freedSeatIndex,
      });
    }
  });

  // 5. Toggle Microphone State (Muted / Speaking)
  socket.on('room:toggle_mic', ({ roomId, userId, isMuted, isSpeaking }: { roomId: string; userId: string; isMuted: boolean; isSpeaking?: boolean }) => {
    const roomState = getOrCreateRoom(roomId);
    roomState.seats = roomState.seats.map((s) => {
      if (s.user?.id === userId) {
        return {
          ...s,
          isMuted,
          isSpeaking: isMuted ? false : isSpeaking ?? s.isSpeaking,
        };
      }
      return s;
    });

    io.to(roomId).emit('room:seats_update', {
      roomId,
      seats: roomState.seats,
    });
  });

  // 6. Voice Audio Level indicator (for visualizer)
  socket.on('room:speaking_status', ({ roomId, userId, isSpeaking, audioLevel }: { roomId: string; userId: string; isSpeaking: boolean; audioLevel: number }) => {
    const roomState = getOrCreateRoom(roomId);
    roomState.seats = roomState.seats.map((s) => {
      if (s.user?.id === userId) {
        return {
          ...s,
          isSpeaking,
          audioLevel,
        };
      }
      return s;
    });

    socket.to(roomId).emit('room:audio_status', {
      userId,
      isSpeaking,
      audioLevel,
    });
  });

  // 7. Moderator actions on seats (mute / lock / kick)
  socket.on('room:moderator_action', ({ roomId, action, seatIndex }: { roomId: string; action: 'mute' | 'lock' | 'kick'; seatIndex: number }) => {
    const roomState = getOrCreateRoom(roomId);
    if (seatIndex < 0 || seatIndex >= roomState.seats.length) return;

    const seat = roomState.seats[seatIndex];
    if (action === 'mute') {
      seat.isMuted = !seat.isMuted;
      seat.isSpeaking = false;
    } else if (action === 'lock') {
      seat.isLocked = !seat.isLocked;
      if (seat.isLocked && seat.user) {
        seat.user = null;
        seat.isSpeaking = false;
      }
    } else if (action === 'kick') {
      const kickedUser = seat.user;
      seat.user = null;
      seat.isSpeaking = false;
      if (kickedUser) {
        io.to(roomId).emit('webrtc:speaker_left', {
          userId: kickedUser.id,
          seatIndex,
        });
      }
    }

    io.to(roomId).emit('room:seats_update', {
      roomId,
      seats: roomState.seats,
    });
  });

  // 8. Room Chat Message (Instant broadcast across all devices)
  socket.on('chat:send_message', ({ roomId, message }: { roomId: string; message: any }) => {
    if (!roomId || !message) return;
    const roomState = getOrCreateRoom(roomId);

    // Keep message history
    roomState.messages.push(message);
    if (roomState.messages.length > 200) {
      roomState.messages.shift();
    }

    // Broadcast to all sockets in the room
    io.to(roomId).emit('chat:new_message', {
      roomId,
      message,
    });
  });

  // 9. Clear room chat
  socket.on('chat:clear', ({ roomId, systemMsg }: { roomId: string; systemMsg: any }) => {
    const roomState = getOrCreateRoom(roomId);
    roomState.messages = systemMsg ? [systemMsg] : [];
    io.to(roomId).emit('chat:cleared', {
      roomId,
      systemMsg,
    });
  });

  // 10. Gift event celebration broadcast
  socket.on('gift:send', ({ roomId, event, chatMsg }: { roomId: string; event: any; chatMsg: any }) => {
    const roomState = getOrCreateRoom(roomId);
    if (chatMsg) {
      roomState.messages.push(chatMsg);
    }
    io.to(roomId).emit('gift:broadcast', {
      roomId,
      event,
      chatMsg,
    });
  });

  // 11. WebRTC Signaling: Offer, Answer, ICE Candidate
  socket.on('webrtc:offer', ({ targetSocketId, offer, senderUserId, seatIndex }: { targetSocketId: string; offer: any; senderUserId: string; seatIndex: number }) => {
    io.to(targetSocketId).emit('webrtc:offer', {
      senderSocketId: socket.id,
      senderUserId,
      offer,
      seatIndex,
    });
  });

  socket.on('webrtc:answer', ({ targetSocketId, answer, senderUserId }: { targetSocketId: string; answer: any; senderUserId: string }) => {
    io.to(targetSocketId).emit('webrtc:answer', {
      senderSocketId: socket.id,
      senderUserId,
      answer,
    });
  });

  socket.on('webrtc:ice_candidate', ({ targetSocketId, candidate }: { targetSocketId: string; candidate: any }) => {
    io.to(targetSocketId).emit('webrtc:ice_candidate', {
      senderSocketId: socket.id,
      candidate,
    });
  });

  // Direct 1-to-1 Messages (Global)
  socket.on('dm:send', ({ targetUserId, message }: { targetUserId: string; message: any }) => {
    // Find target user socket
    for (const [sId, cUser] of connectedUsers.entries()) {
      if (cUser.user?.id === targetUserId) {
        io.to(sId).emit('dm:new_message', {
          senderUserId: message.sender.id,
          message,
        });
      }
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const cUser = connectedUsers.get(socket.id);
    if (cUser?.roomId) {
      leaveRoom(socket, cUser.roomId);
    }
    connectedUsers.delete(socket.id);
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
  });
});

function leaveRoom(socket: Socket, roomId: string) {
  const cUser = connectedUsers.get(socket.id);
  socket.leave(roomId);

  if (activeRooms.has(roomId)) {
    const roomState = activeRooms.get(roomId)!;
    const userId = cUser?.user?.id;

    if (userId) {
      // Remove from listeners
      roomState.listeners = roomState.listeners.filter((u) => u.id !== userId);

      // Remove from seats if sitting
      let leftSeatIndex = -1;
      roomState.seats = roomState.seats.map((s, idx) => {
        if (s.user?.id === userId) {
          leftSeatIndex = idx;
          return { ...s, user: null, isSpeaking: false, isMuted: true, audioLevel: 0 };
        }
        return s;
      });

      // Broadcast update
      io.to(roomId).emit('room:state_update', {
        roomId,
        seats: roomState.seats,
        listeners: roomState.listeners,
        listenersCount: roomState.listeners.length,
      });

      if (leftSeatIndex !== -1) {
        io.to(roomId).emit('webrtc:speaker_left', {
          socketId: socket.id,
          userId,
          seatIndex: leftSeatIndex,
        });
      }

      socket.to(roomId).emit('room:user_left', {
        userId,
        socketId: socket.id,
      });
    }
  }

  if (cUser) {
    cUser.roomId = undefined;
  }
}

// Vite integration / Static Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Royal Voice Real-Time Backend & Signaling Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
