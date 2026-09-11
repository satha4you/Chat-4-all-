import React, { useState } from 'react';
import { VoiceRoom, UserProfile } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPName } from '../common/VIPName';
import { playSoundEffect } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Star, X, Sparkles, CheckCircle2, Award, Heart, MessageSquare } from 'lucide-react';

interface RoomRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: VoiceRoom;
  currentUser: UserProfile;
  onSaveRating: (stars: number, feedbackTag?: string) => void;
}

const FEEDBACK_TAGS = [
  '🎙️ حوار راقي ومحترم',
  '👑 إدارة واستقبال ملكي',
  '🎵 طرب وفن أصيل',
  '✨ أجواء ممتعة ومرحة',
  '🤝 مجتمع ودود وأخوي',
  '🔥 تفاعل قوي ومميز',
];

const STAR_DESCRIPTIONS: Record<number, { title: string; subtitle: string; color: string }> = {
  1: { title: 'ضعيف', subtitle: 'تجربة دون المتوقع وتحتاج إلى تحسين', color: 'text-zinc-400' },
  2: { title: 'مقبول', subtitle: 'جلسة مقبولة ولكن ينقصها التفاعل', color: 'text-amber-300' },
  3: { title: 'جيد', subtitle: 'أجواء جيدة وحوار لطيف وممتع', color: 'text-amber-400' },
  4: { title: 'ممتاز ورائع', subtitle: 'إدارة مميزة ومحتوى صوتي جذاب', color: 'text-yellow-400' },
  5: { title: 'ملكي أسطوري ⭐', subtitle: 'غرفة استثنائية ونخبوية بأعلى المعايير', color: 'text-amber-300' },
};

export const RoomRatingModal: React.FC<RoomRatingModalProps> = ({
  isOpen,
  onClose,
  room,
  currentUser,
  onSaveRating,
}) => {
  const existingUserRating = room.ratings?.[currentUser.id];
  const [selectedStars, setSelectedStars] = useState<number>(existingUserRating || 5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDisplayStars = hoverStars > 0 ? hoverStars : selectedStars;
  const starInfo = STAR_DESCRIPTIONS[currentDisplayStars] || STAR_DESCRIPTIONS[5];

  // Calculate current stats
  const ratingsRecord = room.ratings || {};
  const ratingEntries = Object.values(ratingsRecord) as number[];
  const totalCount = ratingEntries.length;
  const currentAvg =
    totalCount > 0
      ? ratingEntries.reduce((sum: number, r: number) => sum + r, 0) / totalCount
      : room.averageRating || 5.0;

  const handleStarClick = (star: number) => {
    setSelectedStars(star);
    playSoundEffect('bell');
  };

  const handleSubmit = () => {
    onSaveRating(selectedStars, selectedTag || undefined);
    setIsSuccess(true);
    playSoundEffect('gift_sparkle');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#F43F5E', '#10B981'],
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0D0E15] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center shadow-inner">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-100 flex items-center gap-1.5">
                <span>تقييم الغرفة الصوتية</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[11px] text-zinc-400">شارك رأيك وقيّم تجربتك في هذه الغرفة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room & Host Preview card */}
        <div className="bg-[#05060A] rounded-2xl p-3.5 border border-zinc-800/80 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarWithFrame user={room.host} size="sm" showCrown={true} />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-zinc-200 truncate">{room.title}</h3>
              <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <span>المضيف:</span>
                <VIPName user={room.host} size="xs" />
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-amber-300">{currentAvg.toFixed(1)}</span>
            </div>
            <span className="text-[9px] text-zinc-500 mt-0.5 block">
              {totalCount > 0 ? `${totalCount} مقيّم` : 'غرفة جديدة'}
            </span>
          </div>
        </div>

        {isSuccess ? (
          /* Success message */
          <div className="py-8 flex flex-col items-center justify-center text-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-emerald-300">تم تسجيل تقييمك بنجاح!</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              شكراً لمشاركتك برأيك. يساهم تقييمك في إبراز الغرف المتميزة ورفع تصنيفها في المنصة.
            </p>
          </div>
        ) : (
          <>
            {/* Interactive Stars Row */}
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-zinc-400 block mb-3">
                {existingUserRating
                  ? 'اختر عدد النجوم لتحديث تقييمك:'
                  : 'كم نجمة تستحق هذه الغرفة برأيك؟'}
              </span>

              <div className="flex items-center justify-center gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= currentDisplayStars;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      className={`p-1.5 transition-all duration-200 transform hover:scale-125 active:scale-95 cursor-pointer rounded-2xl ${
                        isActive ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                      title={`${star} من 5`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                          isActive ? 'fill-amber-400 stroke-amber-300' : 'fill-transparent stroke-zinc-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Description Pill */}
              <div className="mt-4 inline-flex flex-col items-center px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className={`text-sm font-black ${starInfo.color} flex items-center gap-1.5`}>
                  <span>{currentDisplayStars} / 5</span>
                  <span>-</span>
                  <span>{starInfo.title}</span>
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">{starInfo.subtitle}</span>
              </div>
            </div>

            {/* Quick Positive Tags */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-zinc-400 mb-2">
                كلمة تقدير أو وسام تميّز للغرفة (اختياري):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {FEEDBACK_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(isSelected ? '' : tag)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold text-right transition-all border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Previous Rating Notice */}
            {existingUserRating && (
              <div className="mb-4 px-3 py-2 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  تقييمك الحالي المسجل: <strong>{existingUserRating} نجوم</strong>. سيتم تحديثه بالتقييم الجديد عند الضغط على تأكيد.
                </span>
              </div>
            )}

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Star className="w-4 h-4 fill-black" />
                <span>{existingUserRating ? 'تحديث التقييم' : 'تأكيد وإرسال التقييم'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
