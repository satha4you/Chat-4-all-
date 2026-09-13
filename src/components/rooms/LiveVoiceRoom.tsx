import React, { useState, useEffect, useRef } from 'react';
import { VoiceRoom, UserProfile, RoomSeat, ChatMessage, Gift } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { INITIAL_GIFTS } from '../../data/initialData';
import { playSoundEffect } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { GiftCelebrationOverlay, ActiveGiftEvent } from './effects/GiftCelebrationOverlay';
import { launchGiftConfetti, getGiftEffectConfig } from '../../utils/giftEffects';
import { RoomChatInterface } from './RoomChatInterface';
import { RoomRatingModal } from './RoomRatingModal';
import {
  Mic,
  MicOff,
  Hand,
  Gift as GiftIcon,
  LogOut,
  Send,
  Users,
  Shield,
  Volume2,
  Lock,
  Unlock,
  UserX,
  Sparkles,
  Music,
  Smile,
  Crown,
  ChevronDown,
  VolumeX,
  MessageCircle,
  Pin,
  Eye,
  Zap,
  Coins,
  Star,
  UserPlus,
  UserMinus,
  Edit3,
} from 'lucide-react';
import { RoomModeratorsModal } from './RoomModeratorsModal';
import { EditRoomModal } from './EditRoomModal';
import { RoomVerifiedBadge } from '../common/RoomVerifiedBadge';

interface LiveVoiceRoomProps {
  room: VoiceRoom;
  currentUser: UserProfile;
  allUsers?: UserProfile[];
  onLeave: () => void;
  onUserClick: (user: UserProfile) => void;
  onUpdateRoom: (updatedRoom: VoiceRoom) => void;
}

export const LiveVoiceRoom: React.FC<LiveVoiceRoomProps> = ({
  room,
  currentUser,
  allUsers = [],
  onLeave,
  onUserClick,
  onUpdateRoom,
}) => {
  const [currentSeats, setCurrentSeats] = useState<RoomSeat[]>(room.seats);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`royal_room_chat_${room.id}`);
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((m) => !m.roomId || m.roomId === room.id);
        }
      }
    } catch (e) {
      // fallback
    }
    return [
      {
        id: `msg_welcome_${room.id}`,
        roomId: room.id,
        sender: room.host,
        content: `مرحبًا بكم في "${room.title}"! هذه الدردشة النصية خاصة وحصرية برواد هذه الغرفة فقط.`,
        type: 'system',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Sync messages strictly for this room
  useEffect(() => {
    try {
      const roomMsgs = messages.filter((m) => !m.roomId || m.roomId === room.id);
      localStorage.setItem(`royal_room_chat_${room.id}`, JSON.stringify(roomMsgs));
    } catch (e) {
      // ignore
    }
  }, [messages, room.id]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRoomAudioMuted, setIsRoomAudioMuted] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedSeatForGift, setSelectedSeatForGift] = useState<UserProfile | null>(room.host);
  const [selectedGiftItem, setSelectedGiftItem] = useState<Gift>(INITIAL_GIFTS[0]);
  const [giftComboCount, setGiftComboCount] = useState<number>(1);
  const [giftFilterTab, setGiftFilterTab] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [activeGiftEvent, setActiveGiftEvent] = useState<ActiveGiftEvent | null>(null);
  const [highlightedSeatUserId, setHighlightedSeatUserId] = useState<string | null>(null);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [selectedSeatAction, setSelectedSeatAction] = useState<RoomSeat | null>(null);
  const [vipEntranceBanner, setVipEntranceBanner] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showModeratorsModal, setShowModeratorsModal] = useState<boolean>(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState<boolean>(false);

  // Rating computations
  const ratingsRecord = room.ratings || {};
  const ratingEntries = Object.values(ratingsRecord) as number[];
  const roomRatingCount = ratingEntries.length > 0 ? ratingEntries.length : (room.totalRatingsCount || 0);
  const roomRatingAvg = ratingEntries.length > 0
    ? (ratingEntries.reduce((sum: number, r: number) => sum + r, 0) / ratingEntries.length)
    : (room.averageRating !== undefined ? room.averageRating : 5.0);
  const userExistingRating = ratingsRecord[currentUser.id];

  const handleSaveRoomRating = (stars: number, feedbackTag?: string) => {
    const updatedRatings = { ...(room.ratings || {}), [currentUser.id]: stars };
    const values = Object.values(updatedRatings) as number[];
    const newAvg = values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
    const newCount = values.length;

    const updatedRoom: VoiceRoom = {
      ...room,
      ratings: updatedRatings,
      averageRating: Number(newAvg.toFixed(1)),
      totalRatingsCount: newCount,
    };

    onUpdateRoom(updatedRoom);

    // Announce in room chat
    const starStr = '⭐'.repeat(stars);
    const tagStr = feedbackTag ? ` "${feedbackTag}"` : '';
    const ratingChatMsg: ChatMessage = {
      id: 'msg_rate_' + Date.now(),
      roomId: room.id,
      sender: currentUser,
      content: `🌟 قام ${currentUser.name} بتقييم الغرفة بـ ${stars} نجوم ${starStr}${tagStr}`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, ratingChatMsg]);
  };

  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micGainNodeRef = useRef<GainNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isHost = room.host.id === currentUser.id;
  const isModerator = isHost || (room.moderators || []).includes(currentUser.id) || currentUser.role === 'owner' || currentUser.role === 'admin';
  const isRoomManager = isHost || currentUser.role === 'owner' || currentUser.role === 'admin';
  const mySeatIndex = currentSeats.findIndex((s) => s.user?.id === currentUser.id);
  const isSeated = mySeatIndex !== -1;

  // Handle assigning a room moderator by room owner or general manager
  const handleAssignModerator = (targetUser: UserProfile) => {
    if (!isRoomManager) return;
    const currentMods = room.moderators || [];
    if (currentMods.includes(targetUser.id)) return;

    const updatedMods = [...currentMods, targetUser.id];
    const updatedRoom: VoiceRoom = {
      ...room,
      moderators: updatedMods,
    };
    onUpdateRoom(updatedRoom);

    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    const modAnnounceMsg: ChatMessage = {
      id: 'msg_mod_' + Date.now(),
      roomId: room.id,
      sender: currentUser,
      content: `🛡️ قام ${room.host.id === currentUser.id ? 'مالك الغرفة' : 'المدير العام'} (${currentUser.nickname}) بتعيين ${targetUser.nickname} مشرفاً رسمياً للغرفة لمساعدته في الإدارة!`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, modAnnounceMsg]);
  };

  // Handle removing a room moderator
  const handleRemoveModerator = (userId: string) => {
    if (!isRoomManager) return;
    const currentMods = room.moderators || [];
    const updatedMods = currentMods.filter((id) => id !== userId);
    const updatedRoom: VoiceRoom = {
      ...room,
      moderators: updatedMods,
    };
    onUpdateRoom(updatedRoom);

    playSoundEffect('bell');

    const removeModMsg: ChatMessage = {
      id: 'msg_unmod_' + Date.now(),
      roomId: room.id,
      sender: currentUser,
      content: `ℹ️ تم إلغاء صلاحية الإشراف عن العضو من قِبل إدارة الغرفة.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, removeModMsg]);
  };

  // VIP Entry Fanfare on join
  useEffect(() => {
    if (currentUser.vipTier === 'royal' || currentUser.vipTier === 'gold') {
      playSoundEffect('vip_fanfare');
      setVipEntranceBanner(`👑 انضم ${currentUser.nickname} (${currentUser.vipTier.toUpperCase()} VIP) إلى الديوان الصوتي!`);
      const timer = setTimeout(() => setVipEntranceBanner(null), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Real microphone capture when seated and mic is active
  useEffect(() => {
    if (isSeated && isMicOn) {
      startRealMicrophone();
    } else {
      stopRealMicrophone();
    }

    return () => {
      stopRealMicrophone();
    };
  }, [isSeated, isMicOn]);

  // Handle master room mute changes on active microphone output
  useEffect(() => {
    if (micGainNodeRef.current && audioContextRef.current) {
      const targetGain = isRoomAudioMuted ? 0 : 0.35;
      micGainNodeRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.05);
    }
  }, [isRoomAudioMuted]);

  // Simulated ambient voice activity on other active seats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeats((prevSeats) =>
        prevSeats.map((seat, idx) => {
          if (idx === mySeatIndex) return seat; // Don't override local user state
          if (!seat.user || seat.isMuted) {
            return { ...seat, isSpeaking: false, audioLevel: 0 };
          }
          // Random speaking simulation for other participants
          const shouldSpeak = Math.random() > 0.45;
          const level = shouldSpeak ? Math.floor(Math.random() * 70) + 30 : 0;
          return { ...seat, isSpeaking: shouldSpeak, audioLevel: level };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [mySeatIndex]);

  // Vocal formant speech synthesis for room listeners when participants on stage are speaking
  useEffect(() => {
    if (isRoomAudioMuted) {
      if (synthGainRef.current && audioContextRef.current) {
        synthGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.05);
      }
      return;
    }

    const otherSpeakers = currentSeats.filter(
      (s, idx) => idx !== mySeatIndex && s.isSpeaking && s.user && !s.isMuted
    );

    if (otherSpeakers.length > 0) {
      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        if (!synthGainRef.current) {
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.06, ctx.currentTime);

          // Vocal Formant Filters (speech vowel resonance 520Hz & 1450Hz)
          const f1 = ctx.createBiquadFilter();
          f1.type = 'bandpass';
          f1.frequency.setValueAtTime(520, ctx.currentTime);
          f1.Q.setValueAtTime(2.5, ctx.currentTime);

          const f2 = ctx.createBiquadFilter();
          f2.type = 'bandpass';
          f2.frequency.setValueAtTime(1450, ctx.currentTime);
          f2.Q.setValueAtTime(3.5, ctx.currentTime);

          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, ctx.currentTime);

          const sub = ctx.createOscillator();
          sub.type = 'triangle';
          sub.frequency.setValueAtTime(70, ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.setValueAtTime(3.8, ctx.currentTime);

          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(20, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          osc.connect(f1);
          sub.connect(f1);
          f1.connect(f2);
          f2.connect(masterGain);
          masterGain.connect(ctx.destination);

          osc.start();
          sub.start();
          lfo.start();

          synthGainRef.current = masterGain;
        } else {
          synthGainRef.current.gain.setTargetAtTime(0.06, ctx.currentTime, 0.1);
        }
      } catch (e) {
        // audio policy fallback
      }
    } else {
      if (synthGainRef.current && audioContextRef.current) {
        synthGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.15);
      }
    }
  }, [currentSeats, mySeatIndex, isRoomAudioMuted]);

  const startRealMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Broadcast audio to room speakers with master gain
      const micGain = audioCtx.createGain();
      micGain.gain.setValueAtTime(isRoomAudioMuted ? 0 : 0.35, audioCtx.currentTime);
      source.connect(micGain);
      micGain.connect(audioCtx.destination);
      micGainNodeRef.current = micGain;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.floor((average / 128) * 100));

        setCurrentSeats((prev) =>
          prev.map((s, i) =>
            i === mySeatIndex
              ? { ...s, isSpeaking: normalized > 15, audioLevel: normalized }
              : s
          )
        );

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
      playSoundEffect('mic_on');
    } catch (err) {
      console.warn('Microphone permission not granted, fallback to simulated mic:', err);
      // Simulated mic active
      setCurrentSeats((prev) =>
        prev.map((s, i) =>
          i === mySeatIndex ? { ...s, isSpeaking: true, audioLevel: 65 } : s
        )
      );
    }
  };

  const stopRealMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micGainNodeRef.current) {
      micGainNodeRef.current.disconnect();
      micGainNodeRef.current = null;
    }
    if (synthGainRef.current) {
      synthGainRef.current.disconnect();
      synthGainRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (isSeated && mySeatIndex !== -1) {
      setCurrentSeats((prev) =>
        prev.map((s, i) =>
          i === mySeatIndex ? { ...s, isSpeaking: false, audioLevel: 0 } : s
        )
      );
    }
  };

  const handleTakeSeat = (seatIndex: number) => {
    if (isSeated) {
      // Move seat
      const updated = currentSeats.map((s, i) => {
        if (i === mySeatIndex) return { ...s, user: null, isSpeaking: false };
        if (i === seatIndex) return { ...s, user: currentUser, isMuted: !isMicOn };
        return s;
      });
      setCurrentSeats(updated);
    } else {
      // Sit on seat
      const target = currentSeats[seatIndex];
      if (target.isLocked && !isModerator) {
        alert('هذا المقعد مقفل من قبل المشرف.');
        return;
      }
      const updated = currentSeats.map((s, i) =>
        i === seatIndex ? { ...s, user: currentUser, isMuted: true } : s
      );
      setCurrentSeats(updated);
      setIsMicOn(false);
      setHasRaisedHand(false);
      playSoundEffect('bell');
    }
  };

  const handleLeaveSeat = () => {
    stopRealMicrophone();
    setIsMicOn(false);
    const updated = currentSeats.map((s, i) =>
      i === mySeatIndex ? { ...s, user: null, isSpeaking: false, audioLevel: 0 } : s
    );
    setCurrentSeats(updated);
    playSoundEffect('mic_off');
  };

  const handleToggleMic = () => {
    if (!isSeated) return;
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    if (!nextState) {
      playSoundEffect('mic_off');
      if (micStreamRef.current) {
        micStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = false));
      }
      if (micGainNodeRef.current && audioContextRef.current) {
        micGainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
    } else {
      playSoundEffect('mic_on');
      if (micStreamRef.current) {
        micStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
      }
      if (micGainNodeRef.current && audioContextRef.current) {
        micGainNodeRef.current.gain.setValueAtTime(isRoomAudioMuted ? 0 : 0.35, audioContextRef.current.currentTime);
      }
    }
    const updated = currentSeats.map((s, i) =>
      i === mySeatIndex ? { ...s, isMuted: !nextState } : s
    );
    setCurrentSeats(updated);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      roomId: room.id,
      sender: currentUser,
      content: content.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleClearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `msg_welcome_${Date.now()}`,
      roomId: room.id,
      sender: room.host,
      content: `تم مسح سجل الدردشة من قِبل إدارة الغرفة. المحادثة مرئية فقط لرواد «${room.title}».`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    try {
      localStorage.setItem(`royal_room_chat_${room.id}`, JSON.stringify([welcomeMsg]));
    } catch (e) {
      // ignore
    }
  };

  const handleSendGift = (gift: Gift, count: number = giftComboCount) => {
    const receiver = selectedSeatForGift || room.host;
    
    // 1. Launch dynamic confetti fireworks & synthesized sound effects
    launchGiftConfetti(gift, count);

    // 2. Set active gift event for celebration banner & floating particle canvas
    setActiveGiftEvent({
      id: 'gift_ev_' + Date.now(),
      gift,
      sender: currentUser,
      receiver,
      comboCount: count,
      timestamp: Date.now(),
    });

    // 3. Highlight target receiver seat on stage
    setHighlightedSeatUserId(receiver.id);
    setTimeout(() => {
      setHighlightedSeatUserId((curr) => (curr === receiver.id ? null : curr));
    }, 4500);

    // 4. Create rich chat record
    const giftMsg: ChatMessage = {
      id: 'msg_gift_' + Date.now(),
      roomId: room.id,
      sender: currentUser,
      content: `أرسل ${count > 1 ? `x${count} ` : ''}${gift.nameAr} ${gift.icon} إلى ${receiver.nickname}!`,
      type: 'gift',
      giftData: {
        gift,
        count,
        receiverName: receiver.nickname,
      },
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, giftMsg]);
    setShowGiftModal(false);
  };

  const handlePreviewGiftEffect = (gift: Gift, count: number = giftComboCount) => {
    const receiver = selectedSeatForGift || room.host;
    launchGiftConfetti(gift, count);

    setActiveGiftEvent({
      id: 'preview_' + Date.now(),
      gift,
      sender: currentUser,
      receiver,
      comboCount: count,
      timestamp: Date.now(),
    });

    setHighlightedSeatUserId(receiver.id);
    setTimeout(() => {
      setHighlightedSeatUserId((curr) => (curr === receiver.id ? null : curr));
    }, 4500);
  };

  const handleSoundboardPlay = (sound: 'applause' | 'oud_chord' | 'bell' | 'vip_fanfare') => {
    playSoundEffect(sound);
    setShowSoundboard(false);
  };

  // Moderator seat action
  const handleModeratorSeatAction = (action: 'mute' | 'lock' | 'kick', seat: RoomSeat) => {
    if (!isModerator) return;
    if (action === 'mute') {
      setCurrentSeats((prev) =>
        prev.map((s) => (s.seatIndex === seat.seatIndex ? { ...s, isMuted: !s.isMuted } : s))
      );
    } else if (action === 'lock') {
      setCurrentSeats((prev) =>
        prev.map((s) => (s.seatIndex === seat.seatIndex ? { ...s, isLocked: !s.isLocked } : s))
      );
    } else if (action === 'kick') {
      setCurrentSeats((prev) =>
        prev.map((s) => (s.seatIndex === seat.seatIndex ? { ...s, user: null, isSpeaking: false } : s))
      );
    }
    setSelectedSeatAction(null);
  };

  return (
    <div className="relative w-full h-full flex-1 bg-gradient-to-b from-[#13141F] via-[#0B0C12] to-[#08080C] text-zinc-100 flex flex-col overflow-hidden select-none">
      
      {/* Gift Celebration & Particle Visual Effects Overlay */}
      <GiftCelebrationOverlay
        activeGiftEvent={activeGiftEvent}
        onDismiss={() => setActiveGiftEvent(null)}
      />

      {/* VIP Entrance Fanfare Banner */}
      {vipEntranceBanner && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-gradient-to-r from-purple-900/90 via-amber-600/90 to-pink-600/90 border border-yellow-300/80 rounded-2xl p-3 shadow-2xl text-center backdrop-blur-md animate-bounce">
          <div className="text-xs font-black text-amber-200 drop-shadow flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>{vipEntranceBanner}</span>
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          </div>
        </div>
      )}

      {/* Top Room Header Bar - Structured in two clear rows to prevent any overlap on mobile */}
      <div className="bg-zinc-950/95 border-b border-amber-500/20 backdrop-blur-md z-20 shrink-0">
        {/* Row 1: Exit button + Room Title/Host info + Stats (Audience, Coins, Mod) */}
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Right side: Exit Button + Room Title & Host */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={onLeave}
              className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer shadow-sm"
              title="مغادرة الغرفة والعودة للرئيسية"
            >
              <LogOut className="w-3.5 h-3.5 rotate-180 text-rose-300" />
              <span>خروج</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <h2 className="text-xs sm:text-sm font-black text-zinc-100 truncate">{room.title}</h2>
                {room.verified && room.verificationType && (
                  <RoomVerifiedBadge type={room.verificationType} size="sm" showLabel={true} />
                )}
                {room.type === 'vip' && <VIPBadge tier="gold" size="xs" showText={false} />}
                {isRoomManager && (
                  <button
                    onClick={() => setShowEditRoomModal(true)}
                    className="p-1 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                    title="تعديل اسم الغرفة وتوثيقها"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span className="hidden xs:inline">تعديل الغرفة والتوثيق</span>
                  </button>
                )}
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center gap-1 truncate mt-0.5">
                <span className="text-zinc-500 shrink-0">المضيف:</span>
                <span className="truncate text-zinc-300 font-bold">{room.host.nickname}</span>
                {room.host.vipTier && (
                  <span className="text-[9px] text-amber-400 font-black shrink-0">👑 VIP</span>
                )}
              </div>
            </div>
          </div>

          {/* Left side: Listeners, Coins, Moderator */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audience */}
            <button
              onClick={() => setShowAudienceModal(true)}
              className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center gap-1 hover:border-amber-500/40 transition-colors"
              title="قائمة الحضور والمستمعين"
            >
              <Users className="w-3 h-3 text-amber-400" />
              <span>{room.listenersCount + currentSeats.filter((s) => s.user).length}</span>
            </button>

            {/* Coins */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black"
              title="رصيدك الحالي من الكوينز"
            >
              <Coins className="w-3 h-3 text-yellow-400" />
              <span>{currentUser.coins.toLocaleString('ar-SA')}</span>
            </div>

            {/* Moderator Badge */}
            {isModerator && (
              <span
                className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black"
                title="أنت مشرف في هذه الغرفة"
              >
                <Shield className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Secondary Action & Rating Strip - Clean and never collides with Title */}
        <div className="px-3 py-1.5 bg-[#0c0d12]/90 border-t border-zinc-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            {/* Room Star Rating Button */}
            <button
              onClick={() => setShowRatingModal(true)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 ${
                userExistingRating
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-sm'
              }`}
              title={`تقييم الغرفة بالنجوم - متوسط التقييم: ${roomRatingAvg.toFixed(1)} من 5`}
            >
              <Star className={`w-3 h-3 ${userExistingRating ? 'fill-amber-400 text-amber-400' : 'fill-black text-black'}`} />
              <span>{roomRatingAvg.toFixed(1)}</span>
              <span className="text-[10px] font-medium">
                {userExistingRating ? `(قيّمت ${userExistingRating}★)` : 'قيّم الغرفة'}
              </span>
            </button>

            {/* Room Audio Speaker Output Mute Toggle */}
            <button
              onClick={() => setIsRoomAudioMuted(!isRoomAudioMuted)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0 ${
                isRoomAudioMuted
                  ? 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
                  : 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
              }`}
              title={isRoomAudioMuted ? 'صوت الغرفة مكتوم - انقر لتشغيل الصوت' : 'صوت المتحدثين يعمل - انقر لكتم صوت الغرفة'}
            >
              {isRoomAudioMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-rose-400" />
                  <span>الصوت مكتوم</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>صوت المتحدثين مفعّل</span>
                </>
              )}
            </button>

            {/* Room Moderators Management Button for Room Owner or General Manager */}
            {isRoomManager && (
              <button
                onClick={() => setShowModeratorsModal(true)}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-950/80 to-indigo-950/80 hover:from-blue-900/90 text-blue-300 hover:text-blue-100 border border-blue-500/50 text-[10px] font-black flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                title="إدارة وتعيين مشرفي الغرفة لمساعدتك في التحكم والمايكات"
              >
                <Shield className="w-3 h-3 text-blue-400" />
                <span>مشرفو الغرفة</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 text-[9px] font-bold">
                  {(room.moderators || []).length}
                </span>
              </button>
            )}
          </div>

          {/* Featured Room Pill & Admin Upgrade Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {room.isFeatured && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>غرفة مميزة</span>
              </span>
            )}

            {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
              <button
                onClick={() => {
                  const nextFeatured = !room.isFeatured;
                  onUpdateRoom({ ...room, isFeatured: nextFeatured });
                  if (nextFeatured) {
                    playSoundEffect('vip_fanfare');
                    confetti({
                      particleCount: 75,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                  } else {
                    playSoundEffect('bell');
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  room.isFeatured
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-black shadow-sm'
                }`}
                title={room.isFeatured ? 'إلغاء تمييز الغرفة' : 'ترقية الغرفة لتكون مميزة'}
              >
                <Sparkles className="w-3 h-3" />
                <span>{room.isFeatured ? 'إلغاء التمييز' : '⭐ تمييز الغرفة'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Room Body: Stage (Seats) & Live Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Voice Stage (Host + Seats Grid) */}
        <div className="shrink-0 p-3 sm:p-3.5 border-b md:border-b-0 md:border-l border-zinc-800/80 bg-[#090A0F] md:flex-1 md:overflow-y-auto">
          
          {/* Seats Grid */}
          <div>
            <div className="text-[11px] font-bold text-amber-400/80 mb-2.5 flex items-center justify-between px-1">
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                المسرح الصوتي ({currentSeats.filter((s) => s.user).length}/{currentSeats.length})
              </span>
              {isSeated && (
                <button
                  onClick={handleLeaveSeat}
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-bold"
                >
                  النزول من المايك
                </button>
              )}
            </div>

            {/* Compact Seats Grid - 4 Columns, Fits screen comfortably */}
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-y-3.5 gap-x-2 place-items-center">
              {currentSeats.map((seat) => {
                const isOccupied = seat.user !== null;
                const isMySeat = seat.user?.id === currentUser.id;

                return (
                  <div
                    key={seat.seatIndex}
                    className="flex flex-col items-center group relative cursor-pointer select-none"
                    onClick={() => {
                      if (isOccupied) {
                        onUserClick(seat.user!);
                      } else {
                        handleTakeSeat(seat.seatIndex);
                      }
                    }}
                  >
                    {/* Seat Avatar or Empty Seat Slot */}
                    <div className="relative">
                      {isOccupied ? (
                        <div className="relative">
                          {/* Animated gift target ripple & floating icon when receiving a gift */}
                          {seat.user?.id === highlightedSeatUserId && (
                            <>
                              <div className="absolute -inset-2.5 rounded-full border-2 border-amber-400/90 animate-ping pointer-events-none" />
                              <div className="absolute -inset-1.5 rounded-full ring-4 ring-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.85)] pointer-events-none animate-pulse" />
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-400 text-white text-[9px] font-black shadow-xl animate-bounce flex items-center gap-1 whitespace-nowrap z-25 border border-white/40">
                                <span>🎁</span>
                                <span>{activeGiftEvent?.gift.icon || '✨'}</span>
                                <span>هدية</span>
                              </div>
                            </>
                          )}
                          <AvatarWithFrame
                            user={seat.user!}
                            size="sm"
                            isSpeaking={seat.isSpeaking}
                            audioLevel={seat.audioLevel}
                            showCrown={true}
                          />
                          {/* Interactive Mute/Unmute indicator or toggle button on avatar */}
                          {isMySeat ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMic();
                              }}
                              className={`absolute -bottom-1 -right-1 p-1 rounded-full border border-black shadow-md transition-transform active:scale-90 z-20 ${
                                isMicOn
                                  ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                  : 'bg-rose-600 text-white hover:bg-rose-500'
                              }`}
                              title={isMicOn ? 'انقر لكتم المايك' : 'انقر لتشغيل المايك'}
                            >
                              {isMicOn ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5" />}
                            </button>
                          ) : seat.isMuted ? (
                            <div className="absolute bottom-0 right-0 p-1 bg-red-600 rounded-full border border-black shadow">
                              <MicOff className="w-2 h-2 text-white" />
                            </div>
                          ) : (
                            <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border border-black shadow">
                              <Mic className="w-2 h-2 text-black" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-13 h-13 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                            seat.isLocked
                              ? 'border-zinc-800 bg-zinc-950/40 text-zinc-600'
                              : 'border-amber-500/40 bg-zinc-900/60 hover:bg-amber-950/40 hover:border-amber-400 text-amber-300'
                          }`}
                        >
                          {seat.isLocked ? (
                            <Lock className="w-4 h-4 text-zinc-600" />
                          ) : (
                            <>
                              <Mic className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                              <span className="text-[9px] mt-0.5 font-bold">مقعد {seat.seatIndex + 1}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Seat Label & Nickname - Formatted so Owner & Host never overlap */}
                    <div className="mt-1 text-center w-full max-w-[84px] sm:max-w-[92px] px-0.5 flex flex-col items-center justify-center">
                      {isOccupied ? (
                        <>
                          <div className="truncate max-w-full px-0.5">
                            <VIPName user={seat.user!} size="xs" showCrown={false} showRoleTag={false} />
                          </div>
                          {seat.user?.role === 'owner' && (seat.seatIndex === 0 || seat.user?.id === room.host.id) ? (
                            <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 border border-amber-400/50 text-[9px] font-black text-amber-300 leading-tight whitespace-nowrap shadow-sm">
                              المالك والمضيف 👑
                            </span>
                          ) : seat.user?.role === 'owner' ? (
                            <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-black text-amber-300 leading-tight whitespace-nowrap">
                              المالك 👑
                            </span>
                          ) : seat.seatIndex === 0 || seat.user?.id === room.host.id ? (
                            <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-400 leading-tight whitespace-nowrap">
                              المضيف 👑
                            </span>
                          ) : (room.moderators || []).includes(seat.user?.id || '') ? (
                            <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-[9px] font-bold text-blue-300 leading-tight whitespace-nowrap">
                              مشرف 🛡️
                            </span>
                          ) : seat.isSpeaking ? (
                            <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[8px] font-bold text-emerald-300 leading-tight animate-pulse whitespace-nowrap">
                              🎙️ يتحدث...
                            </span>
                          ) : (
                            <span className="block text-[8px] text-zinc-500 leading-tight truncate max-w-full mt-0.5">
                              {seat.user?.country?.flag ? `${seat.user.country.flag} ` : ''}مستوى {seat.user?.level || 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {seat.isLocked ? 'مقفل' : `مقعد ${seat.seatIndex + 1}`}
                        </span>
                      )}
                    </div>

                    {/* Moderator Action Button trigger */}
                    {isModerator && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSeatAction(seat);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1.5 -right-1 p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-600 shadow z-20"
                        title="إدارة المقعد"
                      >
                        <Shield className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Room Chat Interface Scoped to Participants in This Specific Room */}
        <RoomChatInterface
          room={room}
          currentUser={currentUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          onUserClick={onUserClick}
          onPreviewGiftEffect={handlePreviewGiftEffect}
          onClearChat={handleClearChat}
          onOpenGiftModal={() => {
            setSelectedSeatForGift(room.host);
            setShowGiftModal(true);
          }}
          isModerator={isModerator}
          isUserOnMic={isSeated}
          micSeatIndex={mySeatIndex !== -1 ? mySeatIndex : undefined}
        />
      </div>

      {/* Bottom Floating Mic / Seating Bar */}
      <div className="px-4 py-2.5 bg-zinc-950/95 border-t border-amber-500/30 flex items-center justify-between z-30 shrink-0">
        
        {/* Left Side: Mic status & controls */}
        <div className="flex items-center gap-2">
          {isSeated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMic}
                className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ${
                  isMicOn
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black ring-2 ring-emerald-300'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
                title={isMicOn ? 'انقر لكتم صوت المايك' : 'انقر لتشغيل المايك والسماح للجميع بسماعك'}
              >
                {isMicOn ? (
                  <>
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>المايك مفعّل ومسموع للجميع</span>
                    <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-bold">كتم</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>المايك مكتوم (انقر للتحدث)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleLeaveSeat}
                className="px-3 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 text-xs font-bold transition-colors"
                title="النزول من مقعد التحدث"
              >
                النزول
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setHasRaisedHand(!hasRaisedHand);
                if (!hasRaisedHand) {
                  playSoundEffect('bell');
                  const targetEmpty = currentSeats.find((s) => !s.user && !s.isLocked);
                  if (targetEmpty) {
                    handleTakeSeat(targetEmpty.seatIndex);
                  }
                }
              }}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                hasRaisedHand
                  ? 'bg-amber-500 text-black font-black animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>{hasRaisedHand ? 'تم طلب المايك ✋' : 'طلب الصعود للمايك'}</span>
            </button>
          )}
        </div>

        {/* Right Side: Quick Action info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSeatForGift(room.host);
              setShowGiftModal(true);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-zinc-800"
            title="إهداء المضيف"
          >
            <GiftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onLeave}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs font-bold transition-colors"
          >
            مغادرة
          </button>
        </div>
      </div>

      {/* Send Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#11121B] border border-amber-500/40 rounded-3xl p-5 md:p-6 shadow-2xl text-zinc-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-amber-500/30 text-rose-400">
                  <GiftIcon className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>إرسال هدية إلى:</span>
                    <span className="text-amber-300 font-black">{selectedSeatForGift?.nickname || room.host.nickname}</span>
                  </h3>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>تأثيرات بصرية وانطلاق قصاصات وألعاب نارية فورية</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGiftModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              {/* Recipient select */}
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1.5">اختر مستلم الهدية من المسرح:</label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {currentSeats
                    .filter((s) => s.user)
                    .map((s) => {
                      const isSelected = selectedSeatForGift?.id === s.user?.id;
                      return (
                        <button
                          key={s.seatIndex}
                          onClick={() => setSelectedSeatForGift(s.user!)}
                          className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                              : 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          <AvatarWithFrame user={s.user!} size="xs" showCrown={false} />
                          <span className="truncate max-w-[85px]">{s.user?.nickname}</span>
                          {s.seatIndex === 0 && (
                            <span className="text-[9px] px-1 rounded bg-amber-500/30 text-amber-300">مضيف</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Combo Multiplier Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>مضاعف القوة والتأثير (COMBO):</span>
                  </label>
                  <span className="text-[10px] text-amber-400/90 font-medium">كلما زاد الكومبو زادت كثافة الألعاب النارية</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 5, 10, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGiftComboCount(num)}
                      className={`py-1.5 rounded-xl border text-xs font-black transition-all ${
                        giftComboCount === num
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-300 shadow-md scale-105'
                          : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      x{num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gifts Filter & Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>قائمة الهدايا التفاعلية ({INITIAL_GIFTS.length} هدية متوفرة):</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">انقر للمعاينة أو الإرسال</span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    { id: 'all', label: `الكل (${INITIAL_GIFTS.length})` },
                    { id: 'common', label: `شائعة (${INITIAL_GIFTS.filter(g => g.rarity === 'common').length})` },
                    { id: 'rare', label: `💎 نادرة (${INITIAL_GIFTS.filter(g => g.rarity === 'rare').length})` },
                    { id: 'epic', label: `🌟 فاخرة (${INITIAL_GIFTS.filter(g => g.rarity === 'epic').length})` },
                    { id: 'legendary', label: `👑 أسطورية (${INITIAL_GIFTS.filter(g => g.rarity === 'legendary').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGiftFilterTab(tab.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        giftFilterTab === tab.id
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
                          : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Gifts Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {INITIAL_GIFTS.filter((g) => giftFilterTab === 'all' || g.rarity === giftFilterTab).map((gift) => {
                    const isSelected = selectedGiftItem?.id === gift.id;
                    const effectConfig = getGiftEffectConfig(gift.id);

                    return (
                      <div
                        key={gift.id}
                        onClick={() => setSelectedGiftItem(gift)}
                        className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center group text-center ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-950/70 via-zinc-900 to-zinc-900 border-amber-400 shadow-lg ring-1 ring-amber-400/50 scale-[1.02]'
                            : 'bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {/* Rarity Tag */}
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mb-1 text-white bg-gradient-to-r ${effectConfig.rarityBadgeBg} opacity-90`}>
                          {gift.rarity === 'legendary' ? '👑 أسطوري' : gift.rarity === 'epic' ? '🌟 ملحمي' : gift.rarity === 'rare' ? '💎 نادر' : '✨ مميز'}
                        </span>

                        {/* Gift Icon */}
                        <span className="text-3xl group-hover:scale-125 transition-transform duration-200 my-0.5 drop-shadow">
                          {gift.icon}
                        </span>

                        {/* Gift Name */}
                        <span className="text-[10px] font-bold text-zinc-200 truncate w-full mt-0.5">
                          {gift.nameAr}
                        </span>

                        {/* Price */}
                        <span className="text-[10px] font-black text-amber-400 mt-0.5">
                          {gift.coins * giftComboCount} 🪙
                        </span>

                        {/* Quick preview mini button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGiftItem(gift);
                            handlePreviewGiftEffect(gift, giftComboCount);
                          }}
                          className="mt-1 px-1.5 py-0.5 rounded-md bg-zinc-800 hover:bg-amber-500 hover:text-black text-[9px] text-zinc-400 font-bold transition-colors flex items-center gap-0.5"
                          title="معاينة التأثير البصري والألعاب النارية"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          <span>معاينة</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-3 border-t border-zinc-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">الإجمالي:</span>
                <span className="text-amber-400 font-black text-sm">
                  {selectedGiftItem.coins * giftComboCount} 🪙
                </span>
                <span className="text-zinc-500 text-[11px]">
                  ({selectedGiftItem.nameAr} x{giftComboCount})
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePreviewGiftEffect(selectedGiftItem, giftComboCount)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>معاينة التأثير 🎆</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendGift(selectedGiftItem, giftComboCount)}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-500 hover:opacity-95 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <GiftIcon className="w-4 h-4 text-black" />
                  <span>إرسال الهدية الآن 🎁</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Moderator Seat Controls Modal */}
      {selectedSeatAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#13141F] border border-amber-500/40 rounded-2xl p-5 shadow-2xl text-zinc-100">
            <div className="text-sm font-bold text-amber-300 mb-3 flex items-center justify-between">
              <span>تحكم المشرف (مقعد {selectedSeatAction.seatIndex + 1})</span>
              <button onClick={() => setSelectedSeatAction(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2">
              {/* Room Owner / Manager Moderator Assignment Action */}
              {isRoomManager && selectedSeatAction.user && selectedSeatAction.user.id !== room.host.id && (
                <button
                  onClick={() => {
                    const isAlreadyMod = (room.moderators || []).includes(selectedSeatAction.user!.id);
                    if (isAlreadyMod) {
                      handleRemoveModerator(selectedSeatAction.user!.id);
                    } else {
                      handleAssignModerator(selectedSeatAction.user!);
                    }
                    setSelectedSeatAction(null);
                  }}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-between transition-colors ${
                    (room.moderators || []).includes(selectedSeatAction.user.id)
                      ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-600/50 text-rose-300'
                      : 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/50 text-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>{(room.moderators || []).includes(selectedSeatAction.user.id) ? 'إلغاء إشراف الغرفة عن العضو' : 'تعيين العضو كمشرف للغرفة 🛡️'}</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">صلاحية المالك</span>
                </button>
              )}

              {selectedSeatAction.user && (
                <>
                  <button
                    onClick={() => handleModeratorSeatAction('mute', selectedSeatAction)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold flex items-center gap-2"
                  >
                    <VolumeX className="w-4 h-4 text-amber-400" />
                    <span>{selectedSeatAction.isMuted ? 'إلغاء كتم الصوت' : 'كتم مايك العضو'}</span>
                  </button>

                  <button
                    onClick={() => handleModeratorSeatAction('kick', selectedSeatAction)}
                    className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/60 text-xs font-bold text-rose-300 flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    <span>إنزال العضو من المايك</span>
                  </button>
                </>
              )}

              <button
                onClick={() => handleModeratorSeatAction('lock', selectedSeatAction)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold flex items-center gap-2"
              >
                {selectedSeatAction.isLocked ? (
                  <>
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>فتح المقعد للجميع</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>قفل المقعد</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audience List Modal */}
      {showAudienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#13141F] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-zinc-100 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">الحاضرون في الغرفة ({room.listenersCount})</h3>
              </div>
              <button onClick={() => setShowAudienceModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {/* Quick Moderator Management shortcut for Room Owner */}
              {isRoomManager && (
                <div className="p-2.5 rounded-2xl bg-blue-950/30 border border-blue-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-black text-blue-200">مشرفو الغرفة ({(room.moderators || []).length})</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowAudienceModal(false);
                      setShowModeratorsModal(true);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black"
                  >
                    لوحة المشرفين ⚙️
                  </button>
                </div>
              )}

              <div className="text-[11px] font-bold text-amber-400">المتحدثون على المسرح:</div>
              {currentSeats
                .filter((s) => s.user)
                .map((s) => {
                  const isMod = (room.moderators || []).includes(s.user!.id);
                  const isUserHost = s.user!.id === room.host.id;

                  return (
                    <div
                      key={s.seatIndex}
                      className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <div
                        onClick={() => {
                          setShowAudienceModal(false);
                          onUserClick(s.user!);
                        }}
                        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                      >
                        <AvatarWithFrame user={s.user!} size="xs" showCrown={false} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <VIPName user={s.user!} size="xs" />
                            {isUserHost ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                المالك 👑
                              </span>
                            ) : isMod ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-black">
                                مشرف 🛡️
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-zinc-500">مقعد {s.seatIndex + 1}</span>
                        </div>
                      </div>

                      {isRoomManager && !isUserHost && (
                        <div>
                          {isMod ? (
                            <button
                              onClick={() => handleRemoveModerator(s.user!.id)}
                              className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-500/40"
                              title="إلغاء الإشراف"
                            >
                              إلغاء
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAssignModerator(s.user!)}
                              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black flex items-center gap-1 shadow-sm"
                              title="تعيين كمشرف للغرفة"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>مشرف</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

              <div className="text-[11px] font-bold text-zinc-400 mt-4">المستمعون:</div>
              {room.listeners.map((user) => {
                const isMod = (room.moderators || []).includes(user.id);
                const isUserHost = user.id === room.host.id;

                return (
                  <div
                    key={user.id}
                    className="p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 flex items-center justify-between"
                  >
                    <div
                      onClick={() => {
                        setShowAudienceModal(false);
                        onUserClick(user);
                      }}
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                    >
                      <AvatarWithFrame user={user} size="xs" showCrown={false} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <VIPName user={user} size="xs" />
                          {isMod && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-black">
                              مشرف 🛡️
                            </span>
                          )}
                        </div>
                        <VIPBadge tier={user.vipTier} size="xs" />
                      </div>
                    </div>

                    {isRoomManager && !isUserHost && (
                      <div>
                        {isMod ? (
                          <button
                            onClick={() => handleRemoveModerator(user.id)}
                            className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-500/40"
                            title="إلغاء الإشراف"
                          >
                            إلغاء
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAssignModerator(user)}
                            className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black flex items-center gap-1 shadow-sm"
                            title="تعيين كمشرف للغرفة"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>مشرف</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isRoomManager && (
              <div className="pt-3 border-t border-zinc-800 shrink-0">
                <button
                  onClick={() => {
                    setShowAudienceModal(false);
                    setShowModeratorsModal(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-black shadow flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>فتح إدارة مشرفي الغرفة كاملة 🛡️</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Room Star Rating Modal */}
      <RoomRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        room={room}
        currentUser={currentUser}
        onSaveRating={handleSaveRoomRating}
      />

      {/* Room Moderators Management Modal */}
      <RoomModeratorsModal
        isOpen={showModeratorsModal}
        onClose={() => setShowModeratorsModal(false)}
        room={room}
        currentUser={currentUser}
        allUsers={allUsers}
        onAssignModerator={handleAssignModerator}
        onRemoveModerator={handleRemoveModerator}
      />

      {/* Edit Room & Verification Modal for Owner / Host */}
      <EditRoomModal
        room={room}
        isOpen={showEditRoomModal}
        onClose={() => setShowEditRoomModal(false)}
        onSave={(roomId, updates) => {
          const updatedRoom: VoiceRoom = {
            ...room,
            ...updates,
          };
          onUpdateRoom(updatedRoom);
          
          playSoundEffect('vip_fanfare');
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
          });

          const starNote = updates.verified
            ? ` وتم توثيق الغرفة رسميًا بـ (${updates.verificationType === 'blue' ? 'النجمة الزرقاء 🔷' : 'النجمة الذهبية ⭐'})`
            : '';
          
          setMessages((prev) => [
            ...prev,
            {
              id: `msg_room_edit_${Date.now()}`,
              roomId: room.id,
              sender: currentUser,
              content: `📢 قام مالك الغرفة بتحديث إعدادات وبيانات الغرفة ("${updates.title || room.title}")${starNote}!`,
              type: 'system',
              timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }}
      />
    </div>
  );
};
