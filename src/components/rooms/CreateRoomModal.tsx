import React, { useState } from 'react';
import { VoiceRoom, UserProfile, RoomCategory, RoomType, VIPTier } from '../../types';
import { X, Mic, Lock, Crown, Sparkles, Check } from 'lucide-react';

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
