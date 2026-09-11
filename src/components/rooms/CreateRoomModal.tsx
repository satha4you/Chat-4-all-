import React, { useState } from 'react';
import { VoiceRoom, UserProfile, RoomCategory, RoomType, VIPTier } from '../../types';
import { X, Mic, Lock, Crown, Sparkles, Check, Palette } from 'lucide-react';
import { ROOM_CARD_GRADIENTS, DEFAULT_ROOM_GRADIENT } from '../../data/roomGradients';

interface CreateRoomModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRoom: VoiceRoom) => void;
}

const CATEGORIES: { id: RoomCategory; nameAr: string; icon: string }[] = [
  { id: 'vip_lounge', nameAr: 'ديوانية VIP ووجهاء', icon: '👑' },
  { id: 'music', nameAr: 'طرب وعزف وموسيقى', icon: '🎵' },
  { id: 'poetry', nameAr: 'شعر وخواطر وأدب', icon: '📜' },
  { id: 'chat', nameAr: 'سوالف وقهوة وتعارف', icon: '☕' },
  { id: 'culture', nameAr: 'نقاشات وثقافة وتقنية', icon: '💡' },
  { id: 'gaming', nameAr: 'ألعاب ومسابقات وتحديات', icon: '🎮' },
];

const ROOM_COVERS = [
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RoomCategory>('vip_lounge');
  const [roomType, setRoomType] = useState<RoomType>('public');
  const [minVipTier, setMinVipTier] = useState<VIPTier>('bronze');
  const [seatCount, setSeatCount] = useState<number>(8);
  const [selectedCover, setSelectedCover] = useState(ROOM_COVERS[0]);
  const [selectedGradient, setSelectedGradient] = useState<string>(DEFAULT_ROOM_GRADIENT.id);
  const [tagsInput, setTagsInput] = useState('#ديوانية #ترحيب');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const initialSeats = Array.from({ length: seatCount }, (_, idx) => ({
      seatIndex: idx,
      user: idx === 0 ? currentUser : null,
      isMuted: idx !== 0,
      isLocked: false,
      isSpeaking: false,
      audioLevel: 0,
    }));

    const tags = tagsInput
      .split(' ')
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newRoom: VoiceRoom = {
      id: 'room_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'غرفة صوتية مميزة للحديث والتعارف.',
      coverImage: selectedCover,
      category,
      type: roomType,
      minVipTier: roomType === 'vip' ? minVipTier : undefined,
      host: currentUser,
      moderators: [],
      seats: initialSeats,
      listenersCount: 1,
      listeners: [],
      isPinned: false,
      isLive: true,
      createdAt: new Date().toISOString(),
      tags,
      backgroundTheme: 'from-amber-950/60 via-zinc-900 to-black',
      cardGradient: selectedGradient,
      ratings: {},
      averageRating: 5.0,
      totalRatingsCount: 0,
    };

    onCreate(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#13141C] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black">إنشاء غرفة صوتية جديدة</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-zinc-800 text-zinc-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Room Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">اسم الغرفة *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: 👑 ديوانية المساء الملكية | حياكم الله"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Room Type (Public, Private, VIP) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">نوع الغرفة والوصول</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRoomType('public')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  roomType === 'public'
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-md'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>عامة (للجميع)</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('vip')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  roomType === 'vip'
                    ? 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>حصري VIP 👑</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('private')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  roomType === 'private'
                    ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-md'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>خاصة (بدعوة)</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">تصنيف الغرفة</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all truncate ${
                    category === cat.id
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Cover Gradient (Gradient الغلاف) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>لون غلاف البطاقة (Gradient)</span>
              </label>
              <span className="text-[10px] text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                يميز بطاقتك في قائمة الغرف
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {ROOM_CARD_GRADIENTS.map((grad) => {
                const isSelected = selectedGradient === grad.id;
                return (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => setSelectedGradient(grad.id)}
                    className={`relative p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between h-20 overflow-hidden cursor-pointer active:scale-95 ${
                      isSelected
                        ? `${grad.borderClass} ${grad.glowClass} ring-2 ring-offset-1 ring-offset-[#13141C] ring-amber-400/80`
                        : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/70'
                    }`}
                  >
                    {/* Top gradient preview swatch line */}
                    <div className={`absolute top-0 inset-x-0 h-1.5 ${grad.topStripClass}`} />

                    {/* Gradient background preview wash */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${grad.gradientClass} opacity-85 pointer-events-none`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="text-base">{grad.icon}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black shadow-sm">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="relative z-10">
                      <span className="text-[11px] font-bold text-zinc-100 line-clamp-1">
                        {grad.nameAr}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Preview Box */}
            {(() => {
              const currentGrad = ROOM_CARD_GRADIENTS.find((g) => g.id === selectedGradient) || DEFAULT_ROOM_GRADIENT;
              const catObj = CATEGORIES.find((c) => c.id === category);
              return (
                <div className="p-3 rounded-2xl bg-[#08080A] border border-zinc-800/80">
                  <div className="text-[10px] font-bold text-zinc-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      معاينة مظهر بطاقتك في قائمة الغرف:
                    </span>
                    <span className="text-amber-400 font-bold">{currentGrad.nameAr}</span>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-2xl p-3 border transition-all duration-300 bg-gradient-to-b ${currentGrad.gradientClass} ${currentGrad.borderClass} ${currentGrad.glowClass}`}
                  >
                    {/* Top accent strip */}
                    <div className={`absolute top-0 inset-x-0 h-1 ${currentGrad.topStripClass}`} />

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-bold border border-emerald-800/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          مباشر الآن
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-amber-200 text-[10px] font-bold border border-amber-500/30">
                          {catObj?.icon} {catObj?.nameAr}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <span>★ 5.0</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-zinc-100 line-clamp-1">
                      {title.trim() || 'اسم الغرفة الصوتية يظهر هنا...'}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {description.trim() || 'نبذة عن موضوع الجلسة الحوارية وقواعدها...'}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.nickname}
                          className="w-5 h-5 rounded-full border border-amber-400/50"
                        />
                        <span className="text-[10px] text-zinc-300 font-bold">{currentUser.nickname}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-black flex items-center gap-1">
                        دخول الغرفة ←
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Number of Seats */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">عدد المقاعد على المسرح</label>
            <div className="flex gap-2">
              {[6, 8, 10, 12].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setSeatCount(cnt)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    seatCount === cnt
                      ? 'border-amber-400 bg-amber-500 text-black font-black'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                  }`}
                >
                  {cnt} مقاعد
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">وصف الغرفة وقواعد الحوار</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة عن موضوع الجلسة..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">الهاشتاقات (Tags)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#طرب #شعر #نقاش"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              بدء الغرفة الصوتية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
