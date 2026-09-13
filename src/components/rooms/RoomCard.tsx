import React from 'react';
import { VoiceRoom, VIPTier, UserProfile } from '../../types';
import { VIPBadge } from '../common/VIPBadge';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPName } from '../common/VIPName';
import { RoomVerifiedBadge } from '../common/RoomVerifiedBadge';
import { Users, Lock, Crown, Mic, Sparkles, Pin, Star, Edit3 } from 'lucide-react';
import { ROOM_CARD_GRADIENTS } from '../../data/roomGradients';

interface RoomCardProps {
  room: VoiceRoom;
  currentUser?: UserProfile;
  onJoin: (room: VoiceRoom) => void;
  onUserClick?: (user: any) => void;
  onToggleFeatured?: (room: VoiceRoom) => void;
  onEditRoom?: (room: VoiceRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  currentUser,
  onJoin, 
  onUserClick,
  onToggleFeatured,
  onEditRoom,
}) => {
  const activeSpeakers = room.seats.filter((s) => s.user !== null);
  const hasActiveSpeakers = activeSpeakers.length > 0;
  const isVipOnly = room.type === 'vip';
  const isPrivate = room.type === 'private';
  const isFeatured = room.isFeatured;
  const isAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';
  const canEdit = isAdmin || currentUser?.id === room.host.id;

  // Gradient cover style
  const gradientConfig = ROOM_CARD_GRADIENTS.find((g) => g.id === room.cardGradient) || (
    isFeatured ? ROOM_CARD_GRADIENTS[0] : null
  );

  // Rating calculation
  const ratingsMap = room.ratings || {};
  const ratingVals = Object.values(ratingsMap) as number[];
  const totalRatings = ratingVals.length > 0 ? ratingVals.length : (room.totalRatingsCount || 0);
  const avgRating = ratingVals.length > 0 
    ? (ratingVals.reduce((acc: number, curr: number) => acc + curr, 0) / ratingVals.length) 
    : (room.averageRating !== undefined ? room.averageRating : 5.0);

  return (
    <div
      onClick={() => onJoin(room)}
      className={`group relative overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between ${
        hasActiveSpeakers ? 'room-calm-pulse' : ''
      } ${
        isFeatured
          ? 'bg-gradient-to-b from-[#181305] via-[#0D0D10] to-[#08080A] border-2 border-amber-400/80 shadow-[0_0_22px_rgba(217,119,6,0.25)] hover:border-amber-400'
          : gradientConfig
            ? `bg-gradient-to-b ${gradientConfig.gradientClass} border ${gradientConfig.borderClass} ${gradientConfig.glowClass}`
            : 'bg-[#0A0A0A] hover:bg-[#0F0F0F] border border-zinc-800 hover:border-amber-500/40 hover:shadow-black/60'
      }`}
    >
      {/* Calm Pulse Ambient Ring for Active Speaking Rooms */}
      {hasActiveSpeakers && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-amber-400/25 shadow-[inset_0_0_24px_rgba(245,158,11,0.06)] animate-pulse" />
      )}

      {/* Top Accent Gradient Strip */}
      <div
        className={`absolute top-0 inset-x-0 h-1 z-20 ${
          gradientConfig
            ? gradientConfig.topStripClass
            : isFeatured
              ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600'
              : 'bg-gradient-to-r from-amber-500/40 via-zinc-700/40 to-transparent'
        }`}
      />

      {/* Ambient Glow Orb from chosen Gradient */}
      {gradientConfig && (
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-35"
          style={{ backgroundColor: gradientConfig.accentColor }}
        />
      )}

      {/* Row 1: Primary Status & Counters (Live / VIP / Pinned + Rating + Listeners) */}
      <div className="flex items-center justify-between gap-2 z-10">
        {/* Right side: Room Status / Type Pill + Pinned */}
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {isVipOnly && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] flex items-center gap-1 shadow-sm shrink-0">
              <Crown className="w-3 h-3" />
              غرفة VIP
            </span>
          )}
          {isPrivate && (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 text-[10px] font-bold flex items-center gap-1 border border-zinc-800 shrink-0">
              <Lock className="w-3 h-3" />
              غرفة خاصة
            </span>
          )}
          {!isVipOnly && !isPrivate && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 text-[10px] font-bold border border-emerald-800/50 flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>مباشر الآن</span>
              {hasActiveSpeakers && (
                <span className="flex items-end gap-0.5 mr-0.5 text-emerald-400 h-3" title="يوجد متحدثين حالياً على المايك">
                  <span className="w-0.5 bg-emerald-400 rounded-full soundwave-bar-1" />
                  <span className="w-0.5 bg-emerald-400 rounded-full soundwave-bar-2" />
                  <span className="w-0.5 bg-emerald-400 rounded-full soundwave-bar-3" />
                </span>
              )}
            </span>
          )}
          {room.isPinned && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm shrink-0">
              <Pin className="w-2.5 h-2.5 rotate-45" />
              مثبت
            </span>
          )}
          {room.verified && room.verificationType && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border shrink-0 ${
                room.verificationType === 'blue'
                  ? 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
              }`}
              title={room.verificationType === 'blue' ? 'غرفة موثقة بالنجمة الزرقاء ⭐' : 'غرفة موثقة بالنجمة الذهبية ⭐'}
            >
              <RoomVerifiedBadge type={room.verificationType} size="xs" />
              <span>{room.verificationType === 'blue' ? 'موثقة زرقاء' : 'موثقة ذهبية'}</span>
            </span>
          )}
        </div>

        {/* Left side: Rating and Listeners count - Always clean and distinct */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Star Rating Badge */}
          <div
            className="flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 shadow-sm"
            title={`متوسط التقييم: ${avgRating.toFixed(1)} من 5 (${totalRatings} تقييم)`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{avgRating.toFixed(1)}</span>
          </div>

          {/* Listeners count */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-300 bg-[#07080B] px-2.5 py-0.5 rounded-full border border-zinc-800/90 shadow-sm">
            <Users className="w-3 h-3 text-amber-400" />
            <span>{room.listenersCount + activeSpeakers.length}</span>
          </div>
        </div>
      </div>

      {/* Row 2 (Conditional): Featured Badge & Admin Control Strip - Clean separate row to prevent collisions */}
      {(isFeatured || (isAdmin && onToggleFeatured)) && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 z-10">
          {isFeatured ? (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-[10px] flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-amber-400 text-amber-400" />
              غرفة مميزة
            </span>
          ) : (
            <span />
          )}

          {isAdmin && onToggleFeatured && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(room);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer ${
                isFeatured
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-300 border border-zinc-700'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
              title="التحكم بالترقية لمميزة (أدمن)"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isFeatured ? 'إلغاء التمييز' : '⭐ ترقية لمميزة'}</span>
            </button>
          )}
        </div>
      )}

      {/* Title & Host info */}
      <div className="mt-3 mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-sm sm:text-base font-black text-zinc-100 line-clamp-1 group-hover:text-amber-300 transition-colors leading-snug">
            {room.title}
          </h3>
          {room.verified && room.verificationType && (
            <RoomVerifiedBadge type={room.verificationType} size="sm" />
          )}
          {canEdit && onEditRoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditRoom(room);
              }}
              className="p-1 rounded-lg bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 border border-zinc-700/60 hover:border-amber-400/40 transition-colors cursor-pointer shrink-0 ml-auto"
              title="تعديل اسم الغرفة وتوثيقها"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
        {room.description && (
          <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
            {room.description}
          </p>
        )}

        {/* Host User Info & Rating Stars Bar - Generous spacing for avatar wings */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-zinc-800/70">
          <div className="flex items-center gap-3 min-w-0">
            {/* Host Avatar with safe wing clearance container */}
            <div className="shrink-0 px-1 flex items-center justify-center">
              <AvatarWithFrame
                user={room.host}
                size="sm"
                showCrown={true}
                onClick={(e) => {
                  e?.stopPropagation();
                  onUserClick?.(room.host);
                }}
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-zinc-500 font-bold shrink-0">المضيف:</span>
                <div className="truncate">
                  <VIPName user={room.host} size="xs" />
                </div>
              </div>
              <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                {room.host.country?.flag && <span>{room.host.country.flag}</span>}
                <span className="truncate">{room.host.country?.nameAr || 'الوطن العربي'}</span>
                {room.host.role === 'owner' && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/40 shrink-0">
                    المالك
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Star rating visual */}
          <div
            className="flex flex-col items-end shrink-0 pl-1"
            title={`متوسط التقييم: ${avgRating.toFixed(1)} من 5 (${totalRatings} تقييم)`}
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-2.5 h-2.5 ${
                    s <= Math.round(avgRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-zinc-800 text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] text-zinc-400 mt-0.5 font-bold">
              {totalRatings > 0 ? `${totalRatings} تقييم` : 'غرفة جديدة'}
            </span>
          </div>
        </div>
      </div>

      {/* Seats Preview Bar - Organized & Distinct Slots */}
      <div className="bg-[#050507]/90 rounded-2xl p-2.5 border border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {activeSpeakers.slice(0, 5).map((seat, i) => (
            <div
              key={i}
              className="relative p-0.5 rounded-full bg-zinc-900 border border-zinc-700/60 hover:border-amber-400/80 transition-transform hover:scale-105 shrink-0"
              title={`${seat.user?.nickname} (مقعد ${seat.seatIndex + 1})`}
            >
              <AvatarWithFrame
                user={seat.user!}
                size="xs"
                isSpeaking={seat.isSpeaking}
                showCrown={false}
              />
              {seat.seatIndex === 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-black font-black px-1 rounded-full shadow">
                  👑
                </span>
              )}
            </div>
          ))}
          {activeSpeakers.length === 0 && (
            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              المقاعد متاحة للحديث
            </span>
          )}
          {hasActiveSpeakers && (
            <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>{activeSpeakers.length} على المايك</span>
            </span>
          )}
          {room.seatCount && (
            <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900/90 px-2 py-0.5 rounded-full border border-zinc-800 shrink-0">
              {activeSpeakers.length}/{room.seatCount} مقعد
            </span>
          )}
        </div>

        <div className="text-xs font-bold text-amber-400 flex items-center gap-1 shrink-0">
          <span>دخول</span>
          <span className="text-base group-hover:translate-x-1 transition-transform">←</span>
        </div>
      </div>
    </div>
  );
};
