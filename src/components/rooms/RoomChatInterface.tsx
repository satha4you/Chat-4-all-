import React, { useState, useRef, useEffect } from 'react';
import { VoiceRoom, UserProfile, ChatMessage, Gift } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import {
  MessageCircle,
  Send,
  Gift as GiftIcon,
  Lock,
  Smile,
  Trash2,
  Shield,
  ArrowDown,
  Info,
  Sparkles,
  Users,
} from 'lucide-react';
import { playSoundEffect } from '../../utils/soundEffects';

interface RoomChatInterfaceProps {
  room: VoiceRoom;
  currentUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onUserClick: (user: UserProfile) => void;
  onPreviewGiftEffect?: (gift: Gift, count: number) => void;
  onClearChat?: () => void;
  onOpenGiftModal?: () => void;
  isModerator?: boolean;
  isUserOnMic?: boolean;
  micSeatIndex?: number;
}

const QUICK_GREETINGS = [
  'السلام عليكم ✋',
  'مساء الخير جميعًا ☕',
  'منوّرين الجلسة ✨',
  'حيّاكم الله يا هلا 🌹',
  'طرب وأصالة 🎶',
  'ما شاء الله 👏',
];

const QUICK_EMOJIS = ['👑', '👏', '🎵', '✨', '🌹', '☕', '🔥', '💎', '🦅', '🤍'];

export const RoomChatInterface: React.FC<RoomChatInterfaceProps> = ({
  room,
  currentUser,
  messages,
  onSendMessage,
  onUserClick,
  onPreviewGiftEffect,
  onClearChat,
  onOpenGiftModal,
  isModerator = false,
  isUserOnMic = false,
  micSeatIndex,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Filter messages strictly to this room to ensure complete isolation
  const roomMessages = messages.filter(
    (msg) => !msg.roomId || msg.roomId === room.id
  );

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [roomMessages.length]);

  const handleScroll = () => {
    if (!chatScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setShowScrollBottomBtn(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
    setShowEmojiPicker(false);
    playSoundEffect('bell');
  };

  const handleQuickGreeting = (phrase: string) => {
    onSendMessage(phrase);
    playSoundEffect('bell');
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div
      id={`room_chat_interface_${room.id}`}
      className="w-full flex-1 min-h-0 bg-[#08090D] flex flex-col md:border-r border-zinc-800/80 relative select-text"
    >
      {/* Messages Scroll Area - Full height for high visibility and clear text reading */}
      <div
        ref={chatScrollRef}
        onScroll={handleScroll}
        className="flex-1 p-3 overflow-y-auto space-y-2 text-xs select-text scroll-smooth"
      >
        {roomMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500 space-y-2">
            <MessageCircle className="w-8 h-8 text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">لا توجد رسائل سابقة في هذه الغرفة</p>
            <p className="text-[11px] text-zinc-500 max-w-[200px]">
              كن أول من يبادر بالتحية والتفاعل مع رواد الغرفة!
            </p>
          </div>
        ) : (
          roomMessages.map((msg) => {
            // Gift Card
            if (msg.type === 'gift') {
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    if (msg.giftData && onPreviewGiftEffect) {
                      onPreviewGiftEffect(msg.giftData.gift, msg.giftData.count);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-amber-950/50 to-zinc-900 border border-amber-500/40 shadow cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.01] group"
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

            // System Message
            if (msg.type === 'system') {
              return (
                <div
                  key={msg.id}
                  className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-amber-200/90 text-center leading-relaxed"
                >
                  {msg.content}
                </div>
              );
            }

            // Text Message from Participant
            const isMe = msg.sender.id === currentUser.id;
            const isSenderOwner = msg.sender.role === 'owner';
            const isSenderHost = msg.sender.id === room.host.id;
            const isSenderOwnerAndHost = isSenderOwner && isSenderHost;
            const isSenderMod = !isSenderHost && ((room.moderators || []).includes(msg.sender.id) || msg.sender.role === 'moderator');
            const isSenderVip = msg.sender.vipTier && msg.sender.vipTier !== 'none';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar with Golden Glow Effect for VIP subscribers */}
                <div
                  className={`relative shrink-0 transition-all duration-300 ${
                    isSenderVip
                      ? 'p-0.5 rounded-full ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.85)] bg-gradient-to-tr from-amber-500 to-yellow-300 animate-pulse'
                      : ''
                  }`}
                >
                  <AvatarWithFrame
                    user={msg.sender}
                    size="xs"
                    showCrown={false}
                    onClick={() => onUserClick(msg.sender)}
                  />
                </div>

                <div
                  className={`flex-1 min-w-0 rounded-2xl p-3 border transition-colors shadow-sm ${
                    isMe
                      ? 'bg-[#241A0B] hover:bg-[#2C1F0D] border-amber-500/60 shadow-amber-950/40 text-right'
                      : 'bg-[#161826] hover:bg-[#1C1F32] border-zinc-700/80'
                  }`}
                >
                  {/* Sender Name & Badges - Clean and never overlapping */}
                  <div className={`flex items-center justify-between gap-1 mb-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <VIPName user={msg.sender} size="xs" showRoleTag={false} />
                      {isSenderOwnerAndHost ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 border border-amber-400/50 text-[9px] font-black text-amber-300 shrink-0 shadow-sm whitespace-nowrap">
                          المالك والمضيف 👑
                        </span>
                      ) : isSenderOwner ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300 shrink-0 whitespace-nowrap">
                          المالك 👑
                        </span>
                      ) : isSenderHost ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-400 shrink-0 whitespace-nowrap">
                          المضيف 👑
                        </span>
                      ) : isSenderMod ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-[9px] font-bold text-blue-300 shrink-0 whitespace-nowrap">
                          مشرف 🛡️
                        </span>
                      ) : null}
                      {isMe && (
                        <span className="text-[10px] text-amber-300/80 font-bold">
                          (أنت)
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 ${isMe ? 'text-amber-200/80' : 'text-zinc-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Text Content - High contrast for crystal-clear readability */}
                  <p className={`text-[13px] break-words leading-relaxed whitespace-pre-wrap select-text tracking-wide ${
                    isMe ? 'text-amber-50 font-semibold' : 'text-white font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'
                  }`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBottomBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 p-2 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-all flex items-center gap-1 text-[11px] font-bold z-10"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>أحدث الرسائل</span>
        </button>
      )}

      {/* Quick Greetings Pills Bar - High contrast buttons */}
      <div className="px-2 py-2 bg-[#0A0B12] border-t border-zinc-700/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
        {QUICK_GREETINGS.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickGreeting(phrase)}
            className="px-3 py-1.5 rounded-xl bg-[#181B2B] hover:bg-[#24283D] border border-zinc-600/80 text-xs text-zinc-100 font-bold whitespace-nowrap shrink-0 transition-all hover:text-white hover:border-amber-400/60 active:scale-95 shadow-sm"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Emoji Picker Popup Bar */}
      {showEmojiPicker && (
        <div className="px-2 py-2 bg-[#121420] border-t border-zinc-700 grid grid-cols-5 gap-1.5 shrink-0 animate-in fade-in slide-in-from-bottom-2">
          {QUICK_EMOJIS.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="p-1.5 rounded-lg bg-[#1B1E30] hover:bg-zinc-700 text-sm flex items-center justify-center transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Mic ascend writing area bar - Completely neat and organized without overlap */}
      {isUserOnMic && (
        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-950/70 via-[#181308] to-[#0A0B12] border-t border-amber-500/30 flex items-center justify-between gap-2 text-[11px] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-400 font-bold text-[10px] shrink-0">مكان كتابة المتحدث:</span>
            <div className="truncate">
              {currentUser.role === 'owner' && currentUser.id === room.host.id ? (
                <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/25 to-yellow-400/20 border border-amber-400/50 text-amber-300 font-black text-[10px]">
                  المالك والمضيف 👑
                </span>
              ) : currentUser.role === 'owner' ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-[10px]">
                  المالك 👑
                </span>
              ) : currentUser.id === room.host.id ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-[10px]">
                  المضيف 👑
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                  متحدث على المايك 🎙️
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium shrink-0">
            {micSeatIndex !== undefined ? `المقعد #${micSeatIndex + 1}` : 'على المسرح'}
          </span>
        </div>
      )}

      {/* Message Input & Send Form - High contrast input and clear labels */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 bg-[#0A0B12] border-t border-zinc-700/80 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2.5 rounded-xl border transition-colors ${
            showEmojiPicker
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-[#181B2B] border-zinc-700 text-zinc-300 hover:text-white'
          }`}
          title="رموز تعبيرية سريعة"
        >
          <Smile className="w-4 h-4" />
        </button>

        {onOpenGiftModal && (
          <button
            type="button"
            onClick={onOpenGiftModal}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-md shadow-rose-900/40 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
            title="إرسال هدية للمضيف أو المتحدثين"
          >
            <GiftIcon className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">هدية</span>
          </button>
        )}

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isUserOnMic
              ? currentUser.role === 'owner' && currentUser.id === room.host.id
                ? 'اكتب رسالتك بصفتك (المالك والمضيف 👑)...'
                : currentUser.role === 'owner'
                  ? 'اكتب رسالتك بصفتك (المالك 👑)...'
                  : currentUser.id === room.host.id
                    ? 'اكتب رسالتك بصفتك (المضيف 👑)...'
                    : 'اكتب رسالتك كمتحدث على المايك 🎙️...'
              : 'اكتب رسالة واضحة لرواد الغرفة...'
          }
          maxLength={250}
          className="flex-1 bg-[#151726] border-2 border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs font-medium text-white placeholder-zinc-400 focus:outline-none transition-colors min-w-0"
        />

        {isModerator && onClearChat && roomMessages.length > 1 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل ترغب في مسح سجل رسائل الغرفة؟')) {
                onClearChat();
              }
            }}
            className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-zinc-900 transition-colors shrink-0"
            title="مسح محادثة الغرفة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          title="إرسال الرسالة إلى الغرفة"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
};
