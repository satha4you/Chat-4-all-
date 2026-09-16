import { getSocket } from './realtime';

// WebRTC Configuration using public Google STUN servers for cross-device & NAT traversal
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
};

export interface WebRTCManagerCallbacks {
  onRemoteStreamAdded?: (userId: string, stream: MediaStream) => void;
  onRemoteStreamRemoved?: (userId: string) => void;
}

export class WebRTCVoiceManager {
  private roomId: string;
  private currentUserId: string;
  private localStream: MediaStream | null = null;
  // userId -> RTCPeerConnection
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  // userId -> socketId
  private userSocketMap: Map<string, string> = new Map();
  // socketId -> userId
  private socketUserMap: Map<string, string> = new Map();
  // userId -> HTMLAudioElement
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private callbacks: WebRTCManagerCallbacks;
  private isMuted: boolean = true;
  private isDestroyed: boolean = false;

  constructor(roomId: string, currentUserId: string, callbacks: WebRTCManagerCallbacks = {}) {
    this.roomId = roomId;
    this.currentUserId = currentUserId;
    this.callbacks = callbacks;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    const socket = getSocket();

    // 1. Another speaker joined while we are speaking
    socket.on('webrtc:speaker_joined', async (data: { socketId: string; userId: string; seatIndex: number }) => {
      if (this.isDestroyed || data.userId === this.currentUserId) return;
      this.userSocketMap.set(data.userId, data.socketId);
      this.socketUserMap.set(data.socketId, data.userId);

      // If we have a local stream, initiate call to the new speaker
      if (this.localStream) {
        await this.createPeerConnectionAndOffer(data.socketId, data.userId);
      }
    });

    // 2. Speaker stepped down
    socket.on('webrtc:speaker_left', (data: { socketId?: string; userId: string; seatIndex: number }) => {
      this.closePeer(data.userId);
    });

    // 3. Active speakers received on join
    socket.on('webrtc:active_speakers', async (data: { speakers: Array<{ userId: string; seatIndex: number }> }) => {
      // Handled when user takes seat
    });

    // 4. Incoming WebRTC Offer
    socket.on('webrtc:offer', async (data: { senderSocketId: string; senderUserId: string; offer: RTCSessionDescriptionInit; seatIndex: number }) => {
      if (this.isDestroyed || data.senderUserId === this.currentUserId) return;
      this.userSocketMap.set(data.senderUserId, data.senderSocketId);
      this.socketUserMap.set(data.senderSocketId, data.senderUserId);

      await this.handleIncomingOffer(data.senderSocketId, data.senderUserId, data.offer);
    });

    // 5. Incoming WebRTC Answer
    socket.on('webrtc:answer', async (data: { senderSocketId: string; senderUserId: string; answer: RTCSessionDescriptionInit }) => {
      if (this.isDestroyed || data.senderUserId === this.currentUserId) return;
      const pc = this.peerConnections.get(data.senderUserId);
      if (pc && pc.signalingState !== 'closed') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (e) {
          console.warn('[WebRTC] Error setting remote description:', e);
        }
      }
    });

    // 6. Incoming ICE Candidate
    socket.on('webrtc:ice_candidate', async (data: { senderSocketId: string; candidate: RTCIceCandidateInit }) => {
      if (this.isDestroyed) return;
      const userId = this.socketUserMap.get(data.senderSocketId);
      if (!userId) return;

      const pc = this.peerConnections.get(userId);
      if (pc && pc.remoteDescription && data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.warn('[WebRTC] Error adding ICE candidate:', e);
        }
      }
    });
  }

  /**
   * Set the active microphone stream when user sits on a seat
   */
  public async setLocalStream(stream: MediaStream | null) {
    this.localStream = stream;

    if (stream) {
      // Add local audio track to all existing peer connections
      const audioTrack = stream.getAudioTracks()[0];
      for (const [userId, pc] of this.peerConnections.entries()) {
        const senders = pc.getSenders();
        const audioSender = senders.find((s) => s.track?.kind === 'audio');
        if (audioSender) {
          audioSender.replaceTrack(audioTrack);
        } else {
          pc.addTrack(audioTrack, stream);
        }
      }
    } else {
      // Remove tracks
      for (const pc of this.peerConnections.values()) {
        pc.getSenders().forEach((s) => {
          if (s.track) s.track.stop();
        });
      }
    }
  }

  /**
   * Connect to an existing speaker in the room
   */
  public async connectToSpeaker(targetSocketId: string, targetUserId: string) {
    if (targetUserId === this.currentUserId) return;
    this.userSocketMap.set(targetUserId, targetSocketId);
    this.socketUserMap.set(targetSocketId, targetUserId);
    await this.createPeerConnectionAndOffer(targetSocketId, targetUserId);
  }

  private async createPeerConnectionAndOffer(targetSocketId: string, targetUserId: string) {
    if (this.peerConnections.has(targetUserId)) {
      this.closePeer(targetUserId);
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnections.set(targetUserId, pc);

    // If we have microphone stream, add it
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket.emit('webrtc:ice_candidate', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming remote audio track
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received audio track from user ${targetUserId}`);
      this.handleRemoteStream(targetUserId, event.streams[0]);
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.closePeer(targetUserId);
      }
    };

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
      });
      await pc.setLocalDescription(offer);

      const socket = getSocket();
      socket.emit('webrtc:offer', {
        targetSocketId,
        offer,
        senderUserId: this.currentUserId,
        seatIndex: 0,
      });
    } catch (err) {
      console.warn('[WebRTC] Create offer error:', err);
    }
  }

  private async handleIncomingOffer(senderSocketId: string, senderUserId: string, offer: RTCSessionDescriptionInit) {
    if (this.peerConnections.has(senderUserId)) {
      this.closePeer(senderUserId);
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnections.set(senderUserId, pc);

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        socket.emit('webrtc:ice_candidate', {
          targetSocketId: senderSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received remote stream from user ${senderUserId}`);
      this.handleRemoteStream(senderUserId, event.streams[0]);
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const socket = getSocket();
      socket.emit('webrtc:answer', {
        targetSocketId: senderSocketId,
        answer,
        senderUserId: this.currentUserId,
      });
    } catch (err) {
      console.warn('[WebRTC] Handle incoming offer error:', err);
    }
  }

  private handleRemoteStream(userId: string, stream: MediaStream) {
    // Attach to an audio element to play through device speaker / headphones
    let audioEl = this.remoteAudioElements.get(userId);
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.autoplay = true;
      audioEl.muted = false;
      this.remoteAudioElements.set(userId, audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.play().catch((e) => {
      console.warn('[WebRTC] Autoplay restricted or user gesture required:', e);
    });

    if (this.callbacks.onRemoteStreamAdded) {
      this.callbacks.onRemoteStreamAdded(userId, stream);
    }
  }

  private closePeer(userId: string) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }

    const audioEl = this.remoteAudioElements.get(userId);
    if (audioEl) {
      audioEl.srcObject = null;
      audioEl.remove();
      this.remoteAudioElements.delete(userId);
    }

    if (this.callbacks.onRemoteStreamRemoved) {
      this.callbacks.onRemoteStreamRemoved(userId);
    }
  }

  public setMasterMute(muted: boolean) {
    this.isMuted = muted;
    for (const audioEl of this.remoteAudioElements.values()) {
      audioEl.muted = muted;
    }
  }

  public destroy() {
    this.isDestroyed = true;
    for (const userId of Array.from(this.peerConnections.keys())) {
      this.closePeer(userId);
    }
    this.peerConnections.clear();
    this.remoteAudioElements.clear();
    this.userSocketMap.clear();
    this.socketUserMap.clear();
  }
}
