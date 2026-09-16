import { io, Socket } from 'socket.io-client';
import { UserProfile, RoomSeat, ChatMessage } from '../types';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    // In browser, connect to current host:port
    socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[Realtime] Socket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Realtime] Socket disconnected:', reason);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Realtime] Socket connection error:', err.message);
    });
  }

  return socketInstance;
}

// Helper methods for room actions
export function joinRealtimeRoom(roomId: string, user: UserProfile) {
  const socket = getSocket();
  socket.emit('room:join', { roomId, user });
}

export function leaveRealtimeRoom(roomId: string) {
  const socket = getSocket();
  socket.emit('room:leave', { roomId });
}

export function takeRealtimeSeat(roomId: string, seatIndex: number, user: UserProfile) {
  const socket = getSocket();
  socket.emit('room:take_seat', { roomId, seatIndex, user });
}

export function leaveRealtimeSeat(roomId: string, userId: string) {
  const socket = getSocket();
  socket.emit('room:leave_seat', { roomId, userId });
}

export function toggleRealtimeMic(roomId: string, userId: string, isMuted: boolean, isSpeaking?: boolean) {
  const socket = getSocket();
  socket.emit('room:toggle_mic', { roomId, userId, isMuted, isSpeaking });
}

export function updateRealtimeSpeakingStatus(roomId: string, userId: string, isSpeaking: boolean, audioLevel: number) {
  const socket = getSocket();
  socket.emit('room:speaking_status', { roomId, userId, isSpeaking, audioLevel });
}

export function sendRealtimeChatMessage(roomId: string, message: ChatMessage) {
  const socket = getSocket();
  socket.emit('chat:send_message', { roomId, message });
}

export function clearRealtimeChat(roomId: string, systemMsg: ChatMessage) {
  const socket = getSocket();
  socket.emit('chat:clear', { roomId, systemMsg });
}

export function broadcastRealtimeGift(roomId: string, event: any, chatMsg: ChatMessage) {
  const socket = getSocket();
  socket.emit('gift:send', { roomId, event, chatMsg });
}

export function sendRealtimeModeratorAction(roomId: string, action: 'mute' | 'lock' | 'kick', seatIndex: number) {
  const socket = getSocket();
  socket.emit('room:moderator_action', { roomId, action, seatIndex });
}
