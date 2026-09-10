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
} from 'lucide-react';

interface LiveVoiceRoomProps {
  room: VoiceRoom;
  currentUser: UserProfile;
  onLeave: () => void;
  onUserClick: (user: UserProfile) => void;
  onUpdateRoom: (updatedRoom: VoiceRoom) => void;
}

export const LiveVoiceRoom: React.FC<LiveVoiceRoomProps> = ({
  room,
  currentUser,
  onLeave,
  onUserClick,
  onUpdateRoom,
}) => {
  const [currentSeats, setCurrentSeats] = useState<RoomSeat[]>(room.seats);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: room.host,
      content: `مرحبًا بكم في "${room.title}"! يرجى الالتزام بالأدب والاحترام في الحوار.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
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

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isHost = room.host.id === currentUser.id;
  const isModerator = isHost || room.moderators.includes(currentUser.id) || currentUser.role === 'owner';
  const mySeatIndex = currentSeats.findIndex((s) => s.user?.id === currentUser.id);
  const isSeated = mySeatIndex !== -1;

  // VIP Entry Fanfare on join
  useEffect(() => {
    if (currentUser.vipTier === 'royal' || currentUser.vipTier === 'gold') {
      playSoundEffect('vip_fanfare');
      setVipEntranceBanner(`👑 انضم ${currentUser.nickname} (${currentUser.vipTier.toUpperCase()} VIP) إلى الديوان الصوتي!`);
      const timer = setTimeout(() => setVipEntranceBanner(null), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const startRealMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

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
    }
    const updated = currentSeats.map((s, i) =>
      i === mySeatIndex ? { ...s, isMuted: !nextState } : s
    );
    setCurrentSeats(updated);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: currentUser,
      content: inputText.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
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

      {/* Top Room Header Bar */}
      <div className="px-4 py-3 bg-zinc-950/90 border-b border-amber-500/20 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onLeave}
            className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            title="مغادرة الغرفة والعودة للرئيسية"
          >
            <LogOut className="w-3.5 h-3.5 rotate-180 text-rose-300" />
            <span className="hidden sm:inline">مغادرة الغرفة</span>
            <span className="sm:hidden">خروج</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black text-zinc-100 truncate">{room.title}</h2>
              {room.isFeatured && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] flex items-center gap-1 shadow-sm shrink-0">
                  <Sparkles className="w-3 h-3 fill-black" />
                  غرفة مميزة
                </span>
              )}
              {room.type === 'vip' && <VIPBadge tier="gold" size="xs" showText={false} />}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>المضيف:</span>
              <VIPName user={room.host} size="xs" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Admin Room Upgrade Button */}
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
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
                room.isFeatured
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border border-yellow-300'
                  : 'bg-[#18150D] hover:bg-[#252012] text-amber-300 border border-amber-500/40'
              }`}
              title={room.isFeatured ? 'إلغاء تمييز الغرفة كـ VIP' : 'ترقية الغرفة لتكون مميزة برعاية الإدارة'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{room.isFeatured ? '⭐ غرفة مميزة' : '⭐ ترقية لمميزة'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shadow-sm" title="رصيدك الحالي من الكوينز">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>{currentUser.coins.toLocaleString('ar-SA')}</span>
          </div>

          <button
            onClick={() => setShowAudienceModal(true)}
            className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-1.5 hover:border-amber-500/40"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{room.listenersCount + currentSeats.filter((s) => s.user).length}</span>
          </button>

          {isModerator && (
            <span className="p-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black" title="أنت مشرف في هذه الغرفة">
              <Shield className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      {/* Main Room Body: Stage (Seats) & Live Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Voice Stage (Host + Seats Grid) */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between border-b md:border-b-0 md:border-l border-zinc-800/80">
          
          {/* Seats Grid */}
          <div>
            <div className="text-[11px] font-bold text-amber-400/80 mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                المسرح الصوتي ({currentSeats.filter((s) => s.user).length}/{currentSeats.length})
              </span>
              {isSeated && (
                <button
                  onClick={handleLeaveSeat}
                  className="text-xs text-rose-400 hover:text-rose-300 underline"
                >
                  النزول من المايك
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-y-4 gap-x-2 place-items-center">
              {currentSeats.map((seat) => {
                const isOccupied = seat.user !== null;
                const isMySeat = seat.user?.id === currentUser.id;

                return (
                  <div
                    key={seat.seatIndex}
                    className="flex flex-col items-center group relative cursor-pointer"
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
                              <div className="absolute -inset-1.5 rounded-full ring-4 ring-amber-400/70 shadow-[0_0_25px_rgba(245,158,11,0.85)] pointer-events-none animate-pulse" />
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-400 text-white text-[9px] font-black shadow-xl animate-bounce flex items-center gap-1 whitespace-nowrap z-25 border border-white/40">
                                <span>🎁</span>
                                <span>{activeGiftEvent?.gift.icon || '✨'}</span>
                                <span>هدية</span>
                              </div>
                            </>
                          )}
                          <AvatarWithFrame
                            user={seat.user!}
                            size="md"
                            isSpeaking={seat.isSpeaking}
                            audioLevel={seat.audioLevel}
                            showCrown={true}
                          />
                          {/* Mute indicator on avatar */}
                          {seat.isMuted && (
                            <div className="absolute bottom-0 right-0 p-1 bg-red-600 rounded-full border border-black shadow">
                              <MicOff className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all ${
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

                    {/* Seat Label & Nickname */}
                    <div className="mt-1 text-center max-w-[80px]">
                      {isOccupied ? (
                        <>
                          <VIPName user={seat.user!} size="xs" showCrown={false} />
                          {seat.seatIndex === 0 && (
                            <span className="block text-[9px] text-amber-400 font-bold">المضيف</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-zinc-500">
                          {seat.isLocked ? 'مقفل' : 'متاح'}
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-1 p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-600 shadow"
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

          {/* Quick Soundboard / Reactions Bar */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <button
                onClick={() => handleSoundboardPlay('applause')}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-1 shrink-0 transition-transform active:scale-95"
                title="تصفيق حار"
              >
                👏 <span className="hidden sm:inline">تصفيق</span>
              </button>
              <button
                onClick={() => handleSoundboardPlay('oud_chord')}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-amber-300 flex items-center gap-1 shrink-0 transition-transform active:scale-95"
                title="عزف عود طربي"
              >
                🎵 <span className="hidden sm:inline">طرب</span>
              </button>
              <button
                onClick={() => handleSoundboardPlay('vip_fanfare')}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-yellow-300 flex items-center gap-1 shrink-0 transition-transform active:scale-95"
                title="أبواق ملكية"
              >
                🎺 <span className="hidden sm:inline">ملكيات</span>
              </button>
              <button
                onClick={() => handleSoundboardPlay('bell')}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-1 shrink-0 transition-transform active:scale-95"
                title="جرس تنبيه"
              >
                🔔
              </button>
            </div>

            {/* Send Gift Trigger */}
            <button
              onClick={() => {
                setSelectedSeatForGift(room.host);
                setShowGiftModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-rose-900/30 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
            >
              <GiftIcon className="w-4 h-4" />
              <span>إرسال هدية</span>
            </button>
          </div>
        </div>

        {/* Live Chat Panel */}
        <div className="w-full md:w-80 h-64 md:h-full bg-[#0E0F17] flex flex-col border-t md:border-t-0 border-zinc-800">
          
          {/* Chat Header */}
          <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
              الدردشة الحية
            </span>
            <span className="text-[10px] text-zinc-500">رسائل مباشرة</span>
          </div>

          {/* Messages Stream */}
          <div ref={chatScrollRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
            {messages.map((msg) => {
              if (msg.type === 'gift') {
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      if (msg.giftData) {
                        handlePreviewGiftEffect(msg.giftData.gift, msg.giftData.count);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-amber-950/50 to-zinc-900 border border-amber-500/40 shadow cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.02] group"
                    title="انقر لتشغيل التأثير البصري والألعاب النارية"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <GiftIcon className="w-3.5 h-3.5 text-rose-400 group-hover:scale-125 transition-transform" />
                        <span>{msg.content}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5 shrink-0">
                        <span>🎆</span>
                        <span>تأثير</span>
                      </span>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-amber-200/90 text-center">
                    {msg.content}
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-2 group">
                  <AvatarWithFrame
                    user={msg.sender}
                    size="xs"
                    showCrown={false}
                    onClick={() => onUserClick(msg.sender)}
                  />
                  <div className="flex-1 min-w-0 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl p-2 border border-zinc-800/60">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <VIPName user={msg.sender} size="xs" />
                      <span className="text-[9px] text-zinc-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-200 break-words leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-2 bg-zinc-950 border-t border-zinc-800 flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالة للغرفة..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold transition-all shadow"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Floating Mic / Seating Bar */}
      <div className="px-4 py-2.5 bg-zinc-950/95 border-t border-amber-500/30 flex items-center justify-between z-30 shrink-0">
        
        {/* Left Side: Mic status & controls */}
        <div className="flex items-center gap-2">
          {isSeated ? (
            <button
              onClick={handleToggleMic}
              className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                isMicOn
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black ring-2 ring-emerald-300'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isMicOn ? (
                <>
                  <Mic className="w-4 h-4" />
                  <span>المايك يعمل</span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>المايك مكتوم</span>
                </>
              )}
            </button>
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

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              <div className="text-[11px] font-bold text-amber-400">المتحدثون على المسرح:</div>
              {currentSeats
                .filter((s) => s.user)
                .map((s) => (
                  <div
                    key={s.seatIndex}
                    onClick={() => {
                      setShowAudienceModal(false);
                      onUserClick(s.user!);
                    }}
                    className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AvatarWithFrame user={s.user!} size="xs" showCrown={false} />
                      <VIPName user={s.user!} size="xs" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      مقعد {s.seatIndex + 1}
                    </span>
                  </div>
                ))}

              <div className="text-[11px] font-bold text-zinc-400 mt-4">المستمعون:</div>
              {room.listeners.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setShowAudienceModal(false);
                    onUserClick(user);
                  }}
                  className="p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <AvatarWithFrame user={user} size="xs" showCrown={false} />
                    <VIPName user={user} size="xs" />
                  </div>
                  <VIPBadge tier={user.vipTier} size="xs" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
