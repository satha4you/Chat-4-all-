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
  isModerator?: boolean;
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
  isModerator = false,
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
      className="w-full md:w-80 h-72 md:h-full bg-[#0B0C12] flex flex-col border-t md:border-t-0 md:border-r border-zinc-800 relative select-text"
    >
      {/* Top Header of Room-Specific Chat */}
      <div className="px-3.5 py-2.5 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-white">الدردشة الحية</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[9px] text-emerald-300 font-bold flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span>خاصة بالغرفة</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[170px]">
              مرئية فقط لرواد: {room.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
            {roomMessages.length}
          </span>
          {isModerator && onClearChat && roomMessages.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في مسح سجل رسائل هذه الغرفة؟')) {
                  onClearChat();
                }
              }}
              className="p-1 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
              title="مسح محادثة الغرفة للمشرفين"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Room Scope Privacy Banner */}
      <div className="px-3 py-1.5 bg-gradient-to-r from-amber-950/30 via-zinc-900/50 to-amber-950/20 border-b border-amber-500/20 text-[10px] text-amber-300/80 flex items-center gap-1.5 shrink-0">
        <Info className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="truncate">
          🔒 الرسائل مرئية فقط للمشاركين الحاضرين في هذه الغرفة.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatScrollRef}
        onScroll={handleScroll}
        className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs select-text scroll-smooth"
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
            const isHostMsg = msg.sender.id === room.host.id;
            const isModMsg = !isHostMsg && (room.moderators.includes(msg.sender.id) || msg.sender.role === 'owner');

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <AvatarWithFrame
                  user={msg.sender}
                  size="xs"
                  showCrown={false}
                  onClick={() => onUserClick(msg.sender)}
                />

                <div
                  className={`flex-1 min-w-0 rounded-2xl p-2.5 border transition-colors ${
                    isMe
                      ? 'bg-amber-950/40 border-amber-500/30 text-right'
                      : 'bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800/80'
                  }`}
                >
                  {/* Sender Name & Badges */}
                  <div className={`flex items-center justify-between gap-1 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <VIPName user={msg.sender} size="xs" />
                      {isHostMsg && (
                        <span className="px-1 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-[9px] font-bold text-amber-400 shrink-0">
                          المضيف 👑
                        </span>
                      )}
                      {isModMsg && (
                        <span className="px-1 py-0.2 rounded bg-blue-500/20 border border-blue-500/30 text-[9px] font-bold text-blue-400 shrink-0">
                          مشرف 🛡️
                        </span>
                      )}
                      {isMe && (
                        <span className="text-[9px] text-zinc-500 font-normal">
                          (أنت)
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-zinc-500 shrink-0">{msg.timestamp}</span>
                  </div>

                  {/* Message Text Content */}
                  <p className="text-xs text-zinc-100 break-words leading-relaxed whitespace-pre-wrap">
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

      {/* Quick Greetings Pills Bar */}
      <div className="px-2 py-1.5 bg-zinc-950 border-t border-zinc-800/70 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
        {QUICK_GREETINGS.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickGreeting(phrase)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 font-medium whitespace-nowrap shrink-0 transition-colors active:scale-95"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Emoji Picker Popup Bar */}
      {showEmojiPicker && (
        <div className="px-2 py-2 bg-zinc-900 border-t border-zinc-800 grid grid-cols-5 gap-1.5 shrink-0 animate-in fade-in slide-in-from-bottom-2">
          {QUICK_EMOJIS.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm flex items-center justify-center transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Message Input & Send Form */}
      <form
        onSubmit={handleSubmit}
        className="p-2 bg-zinc-950 border-t border-zinc-800 flex items-center gap-1.5 shrink-0"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl border transition-colors ${
            showEmojiPicker
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title="رموز تعبيرية سريعة"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`اكتب رسالة لرواد الغرفة فقط...`}
          maxLength={250}
          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          title="إرسال الرسالة إلى الغرفة"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
};
