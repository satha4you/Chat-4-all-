import React, { useState } from 'react';
import { UserProfile, ChatMessage } from '../../types';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPName } from '../common/VIPName';
import { playSoundEffect } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SendUserMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserProfile | null;
  currentUser: UserProfile;
  onSendMessage: (targetUserId: string, messageText: string) => void;
}

export const SendUserMessageModal: React.FC<SendUserMessageModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(targetUser.id, message.trim());
    playSoundEffect('bell');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 1200);
  };

  const applyTemplate = (text: string) => {
    setMessage(text);
    playSoundEffect('bell');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-[#181226] to-[#0E0F14] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">إرسال رسالة خاصة للمستخدم</h3>
              <p className="text-[11px] text-zinc-400">ستصل الرسالة مباشرة إلى صندوق المحادثات الخاصة للعضو</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target User Info */}
        <div className="p-4 bg-zinc-950/70 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarWithFrame user={targetUser} size="sm" showCrown={true} />
            <div>
              <div className="flex items-center gap-1.5">
                <VIPName user={targetUser} size="xs" />
                <span className="text-[10px] text-zinc-400 font-mono">@{targetUser.username}</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                {targetUser.country.flag} {targetUser.country.nameAr} • المستوى {targetUser.level}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
              مستقبل الرسالة
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Quick templates */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-400">عبارات سريعة:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => applyTemplate(`مرحبًا بك يا ${targetUser.nickname}! نود إعلامك بأنه تم تحديث بيانات حسابك بنجاح. 👑`)}
                className="text-[10px] px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
              >
                تحديث الحساب 👑
              </button>
              <button
                type="button"
                onClick={() => applyTemplate(`أهلًا بك يا ${targetUser.nickname}! شكرًا لتفاعلك وتواجدك المميز في غرف ديوان VIP الصوتية ✨`)}
                className="text-[10px] px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/20"
              >
                شكر وتقدير ✨
              </button>
              <button
                type="button"
                onClick={() => applyTemplate(`تنبيه رسمي من إدارة ديوان VIP: يرجى الالتزام بقوانين الغرف والذوق العام أثناء التحدث 🛡️`)}
                className="text-[10px] px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-500/20"
              >
                تنبيه إداري 🛡️
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">نص الرسالة</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك للمستخدم هنا..."
              className="w-full bg-[#12131C] border border-zinc-700 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {isSent && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs font-bold text-center animate-fadeIn">
              ✓ تم إرسال الرسالة بنجاح إلى المستخدم!
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSent || !message.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>إرسال الرسالة الآن</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
