import React from 'react';
import { VoiceRoom, VIPTier, UserProfile } from '../../types';
import { VIPBadge } from '../common/VIPBadge';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPName } from '../common/VIPName';
import { Users, Lock, Crown, Mic, Sparkles, Pin } from 'lucide-react';

interface RoomCardProps {
  room: VoiceRoom;
  currentUser?: UserProfile;
  onJoin: (room: VoiceRoom) => void;
  onUserClick?: (user: any) => void;
  onToggleFeatured?: (room: VoiceRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  currentUser,
  onJoin, 
  onUserClick,
  onToggleFeatured,
}) => {
  const activeSpeakers = room.seats.filter((s) => s.user !== null);
  const isVipOnly = room.type === 'vip';
  const isPrivate = room.type === 'private';
  const isFeatured = room.isFeatured;
  const isAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  return (
    <div
      onClick={() => onJoin(room)}
      className={`group relative overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
        isFeatured
          ? 'bg-gradient-to-b from-[#181305] via-[#0D0D10] to-[#08080A] border-2 border-amber-400/80 shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:border-amber-400'
          : 'bg-[#0A0A0A] hover:bg-[#0F0F0F] border border-zinc-800 hover:border-amber-500/40 hover:shadow-black/60'
      }`}
    >
      {/* Featured & Pinned Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
        {isFeatured && (
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-[10px] flex items-center gap-1 shadow-md shadow-amber-500/20">
            <Sparkles className="w-3 h-3 fill-black" />
            غرفة مميزة
          </span>
        )}
        {room.isPinned && (
          <div className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
            <Pin className="w-3 h-3 rotate-45" />
            مثبت
          </div>
        )}
        {isAdmin && onToggleFeatured && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(room);
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 transition-all ${
              isFeatured
                ? 'bg-zinc-900/90 text-zinc-400 hover:text-rose-400 border border-zinc-700'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 shadow-sm'
            }`}
            title="التحكم بالترقية لمميزة (أدمن)"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>{isFeatured ? 'إلغاء التمييز' : '⭐ ترقية لمميزة'}</span>
          </button>
        )}
      </div>

      {/* Room Category / Type Pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isVipOnly && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[11px] flex items-center gap-1 shadow-sm">
              <Crown className="w-3 h-3" />
              غرفة VIP
            </span>
          )}
          {isPrivate && (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 text-[11px] font-bold flex items-center gap-1 border border-zinc-800">
              <Lock className="w-3 h-3" />
              غرفة خاصة
            </span>
          )}
          {!isVipOnly && !isPrivate && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 text-[11px] font-bold border border-emerald-800/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              مباشر الآن
            </span>
          )}
        </div>

        {/* Listeners count */}
        <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-[#050505] px-2.5 py-1 rounded-full border border-zinc-800/80">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{room.listenersCount + activeSpeakers.length}</span>
        </div>
      </div>

      {/* Title & Host info */}
      <div className="mb-4">
        <h3 className="text-base font-black text-zinc-100 line-clamp-1 group-hover:text-amber-300 transition-colors leading-snug">
          {room.title}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
          {room.description}
        </p>

        {/* Host User Info */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-800/60">
          <AvatarWithFrame
            user={room.host}
            size="sm"
            showCrown={true}
            onClick={(e) => {
              e?.stopPropagation();
              onUserClick?.(room.host);
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-zinc-400">المضيف:</span>
              <VIPName user={room.host} size="xs" />
            </div>
            <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
              <span>{room.host.country.flag}</span>
              <span>{room.host.country.nameAr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seats Avatars Preview Bar */}
      <div className="bg-[#050505] rounded-2xl p-2.5 border border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden">
          {activeSpeakers.slice(0, 5).map((seat, i) => (
            <div key={i} className="relative z-10 transition-transform group-hover:translate-x-0.5">
              <AvatarWithFrame
                user={seat.user!}
                size="xs"
                isSpeaking={seat.isSpeaking}
                showCrown={false}
              />
            </div>
          ))}
          {activeSpeakers.length === 0 && (
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              المقاعد متاحة
            </span>
          )}
        </div>

        <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
          <span>دخول الغرفة</span>
          <span className="text-base group-hover:translate-x-1 transition-transform">←</span>
        </div>
      </div>
    </div>
  );
};
