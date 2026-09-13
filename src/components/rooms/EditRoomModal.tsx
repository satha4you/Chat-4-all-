import React, { useState } from 'react';
import { VoiceRoom, RoomCategory } from '../../types';
import { RoomVerifiedBadge, RoomVerificationType } from '../common/RoomVerifiedBadge';
import { ROOM_CARD_GRADIENTS } from '../../data/roomGradients';
import { playSoundEffect } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Star,
  Sparkles,
  Palette,
  Edit3,
  Pin,
  FileText,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface EditRoomModalProps {
  room: VoiceRoom;
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomId: string, updates: Partial<VoiceRoom>) => void;
}

const ROOM_CATEGORIES: { id: RoomCategory; nameAr: string; icon: string }[] = [
  { id: 'chat', nameAr: 'عام وسوالف', icon: '💬' },
  { id: 'music', nameAr: 'طرب وموسيقى', icon: '🎵' },
  { id: 'poetry', nameAr: 'شعر وأدب', icon: '📜' },
  { id: 'culture', nameAr: 'ثقافة وحوار', icon: '🏛️' },
  { id: 'gaming', nameAr: 'ألعاب ومسابقات', icon: '🎮' },
  { id: 'vip_lounge', nameAr: 'ديوان VIP الملكي', icon: '👑' },
];

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  room,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(room.title);
  const [description, setDescription] = useState(room.description || '');
  const [category, setCategory] = useState<RoomCategory>(room.category);
  const [verificationType, setVerificationType] = useState<'none' | RoomVerificationType>(
    room.verified ? room.verificationType || 'gold' : 'none'
  );
  const [cardGradient, setCardGradient] = useState<string>(room.cardGradient || 'royal_gold');
  const [isPinned, setIsPinned] = useState<boolean>(Boolean(room.isPinned));
  const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(room.isFeatured));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('يرجى كتابة اسم مناسب للغرفة');
      return;
    }

    const isVerified = verificationType !== 'none';
    const effectiveVerificationType = isVerified ? (verificationType as RoomVerificationType) : undefined;

    const updates: Partial<VoiceRoom> = {
      title: trimmedTitle,
      description: description.trim(),
      category,
      cardGradient,
      verified: isVerified,
      verificationType: effectiveVerificationType,
      isPinned,
      isFeatured,
    };

    onSave(room.id, updates);
    playSoundEffect('vip_fanfare');

    if (isVerified || isFeatured) {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: verificationType === 'blue' ? ['#38BDF8', '#0284C7', '#BAE6FD'] : ['#F59E0B', '#FDE047', '#EAB308'],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0C0D14] border border-amber-500/40 shadow-2xl shadow-black/90 overflow-hidden text-right select-text">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-zinc-900 to-[#0C0D14] shrink-0">
          <div className="flex items-center gap-2 text-amber-300">
            <Edit3 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white">تعديل بيانات الغرفة وتوثيقها</h3>
              <p className="text-[11px] text-zinc-400">خاص بالمالك وإدارة المنصة لتنسيق الأسماء والتوثيق</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-inner">
            <div className="text-[10px] font-bold text-zinc-400 mb-1 flex items-center justify-between">
              <span>معاينة مظهر الغرفة للمستخدمين:</span>
              {verificationType !== 'none' && (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  توثيق معتمد
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-[#12131C] p-3 rounded-xl border border-zinc-800">
              <h4 className="text-sm font-black text-white truncate flex-1">
                {title.trim() || 'اسم الغرفة الصوتية'}
              </h4>
              {verificationType !== 'none' && (
                <RoomVerifiedBadge type={verificationType as RoomVerificationType} size="md" showLabel={true} />
              )}
            </div>
          </div>

          {/* Section 1: Room Title (اسم الغرفة) */}
          <div>
            <label className="block text-xs font-black text-zinc-200 mb-1.5 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>اسم الغرفة الصوتية *</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب اسم الغرفة الجديد..."
              maxLength={70}
              className="w-full bg-[#141624] border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-zinc-500 focus:outline-none transition-all"
              required
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              {title.length}/70 حرف • سيظهر الاسم الجديد لجميع الزوار على الفور
            </span>
          </div>

          {/* Section 2: Room Verification (توثيق الغرفة بالنجمة الذهبية أو الزرقاء) */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>توثيق الغرفة (اختيار المالك):</span>
              </label>
              <span className="text-[10px] text-zinc-400">اختر نوع التوثيق المميز للغرفة</span>
            </div>

            {/* 3 Interactive Cards for Verification Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Unverified */}
              <button
                type="button"
                onClick={() => setVerificationType('none')}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  verificationType === 'none'
                    ? 'bg-zinc-800 border-zinc-500 ring-2 ring-zinc-500/40'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-300">بدون توثيق</span>
                  {verificationType === 'none' && <Check className="w-4 h-4 text-zinc-300" />}
                </div>
                <p className="text-[10px] text-zinc-500">غرفة قياسية بدون شارة نجمة</p>
              </button>

              {/* Option 2: Gold Star Verification */}
              <button
                type="button"
                onClick={() => setVerificationType('gold')}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  verificationType === 'gold'
                    ? 'bg-gradient-to-b from-amber-950/60 to-zinc-900 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-amber-500/40 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <RoomVerifiedBadge type="gold" size="sm" />
                    <span className="text-xs font-black text-amber-300">نجمة ذهبية ⭐</span>
                  </div>
                  {verificationType === 'gold' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[10px] text-amber-200/70">توثيق ملكي نخبوي فاخر</p>
              </button>

              {/* Option 3: Blue Star Verification */}
              <button
                type="button"
                onClick={() => setVerificationType('blue')}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  verificationType === 'blue'
                    ? 'bg-gradient-to-b from-sky-950/60 to-zinc-900 border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-sky-500/40 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <RoomVerifiedBadge type="blue" size="sm" />
                    <span className="text-xs font-black text-sky-300">نجمة زرقاء ⭐</span>
                  </div>
                  {verificationType === 'blue' && <Check className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-[10px] text-sky-200/70">توثيق رسمي معتمد للمنصة</p>
              </button>
            </div>
          </div>

          {/* Section 3: Room Description */}
          <div>
            <label className="block text-xs font-black text-zinc-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>وصف وموضوع الغرفة</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة أو رسالة ترحيبية برواد الغرفة..."
              rows={2}
              maxLength={220}
              className="w-full bg-[#141624] border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Section 4: Room Category */}
          <div>
            <label className="block text-xs font-black text-zinc-200 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>تصنيف الغرفة</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    category === cat.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Cover Gradient */}
          <div>
            <label className="block text-xs font-black text-zinc-200 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>تدرج غلاف بطاقة الغرفة</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROOM_CARD_GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setCardGradient(g.id)}
                  className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 ${
                    cardGradient === g.id
                      ? 'border-amber-400 bg-zinc-800 ring-1 ring-amber-400'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                    style={{ backgroundColor: g.accentColor }}
                  />
                  <span className="text-[11px] font-bold text-zinc-200 truncate">{g.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Additional Admin Toggles (Pin / Featured) */}
          <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-amber-400" />
                تثبيت الغرفة بأعلى الواجهة
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ترقية إلى غرفة مميزة برعاية الإدارة
              </span>
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs transition-transform active:scale-95 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات فورًا</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
