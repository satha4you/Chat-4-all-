import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { Trophy, Crown, Gift, Flame, Sparkles, Star } from 'lucide-react';

interface LeaderboardViewProps {
  users: UserProfile[];
  onUserClick: (user: UserProfile) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users, onUserClick }) => {
  const [filter, setFilter] = useState<'supporters' | 'creators' | 'level'>('supporters');

  // Sorted list based on filter
  const sortedUsers = [...users].sort((a, b) => {
    if (filter === 'supporters') {
      return b.totalGiftsValue - a.totalGiftsValue;
    } else if (filter === 'creators') {
      return b.followersCount - a.followersCount;
    } else {
      return b.level - a.level;
    }
  });

  const topThree = sortedUsers.slice(0, 3);
  const restUsers = sortedUsers.slice(3);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn text-zinc-100">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
          <Trophy className="w-4 h-4" />
          <span>لوحة شرف ديوان VIP</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          كبار الشخصيات والداعمين المتصدرين 👑
        </h1>
        <p className="text-xs md:text-sm text-zinc-400">
          النخبة الأكثر تأثيرًا ودعمًا في الغرف الصوتية
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'supporters', label: 'كبار الداعمين 🎁', icon: Gift },
          { id: 'creators', label: 'أشهر المضيفين 🎙️', icon: Flame },
          { id: 'level', label: 'أعلى المستويات ⭐', icon: Star },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filter === t.id
                ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Podium Display */}
      {sortedUsers.length === 1 ? (
        <div className="flex justify-center pt-4 pb-2">
          <div
            onClick={() => onUserClick(topThree[0])}
            className="w-full max-w-sm flex flex-col items-center p-6 rounded-3xl bg-gradient-to-b from-amber-950/70 via-yellow-950/40 to-zinc-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 cursor-pointer group hover:-translate-y-2 transition-all relative"
          >
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs shadow">
              المركز الأول في الصدارة 👑
            </div>
            <div className="text-4xl mb-2 mt-2">🥇</div>
            <AvatarWithFrame user={topThree[0]} size="lg" showCrown={true} />
            <div className="mt-3 text-center space-y-1">
              <VIPName user={topThree[0]} size="md" />
              <div className="text-xs font-black text-amber-300">
                {filter === 'supporters'
                  ? `${topThree[0].totalGiftsValue.toLocaleString()} 🪙 كوينز دعم`
                  : filter === 'creators'
                  ? `${topThree[0].followersCount.toLocaleString()} متابع`
                  : `المستوى الملكي Lv.${topThree[0].level}`}
              </div>
              <div className="text-[11px] text-zinc-400 pt-1">
                المالك الرسمي والأدمن العام لمنصة ديوان VIP
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 md:gap-4 items-end pt-6 pb-2">
          {/* 2nd Place */}
          {topThree[1] && (
            <div
              onClick={() => onUserClick(topThree[1])}
              className="flex flex-col items-center p-3 md:p-4 rounded-3xl bg-gradient-to-b from-slate-900/60 to-zinc-950 border border-slate-400/40 cursor-pointer group hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-1">🥈</div>
              <AvatarWithFrame user={topThree[1]} size="md" showCrown={true} />
              <div className="mt-2 text-center">
                <VIPName user={topThree[1]} size="xs" />
                <div className="text-[11px] font-bold text-slate-300 mt-1">
                  {filter === 'supporters'
                    ? `${topThree[1].totalGiftsValue.toLocaleString()} 🪙`
                    : filter === 'creators'
                    ? `${topThree[1].followersCount.toLocaleString()} متابع`
                    : `Lv.${topThree[1].level}`}
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Center Big Gold) */}
          {topThree[0] && (
            <div
              onClick={() => onUserClick(topThree[0])}
              className="flex flex-col items-center p-4 md:p-6 rounded-3xl bg-gradient-to-b from-amber-950/70 via-yellow-950/40 to-zinc-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 cursor-pointer group hover:-translate-y-2 transition-all relative"
            >
              <div className="absolute -top-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs shadow">
                المركز الأول 👑
              </div>
              <div className="text-3xl mb-1">🥇</div>
              <AvatarWithFrame user={topThree[0]} size="lg" showCrown={true} />
              <div className="mt-2 text-center">
                <VIPName user={topThree[0]} size="sm" />
                <div className="text-xs font-black text-amber-300 mt-1">
                  {filter === 'supporters'
                    ? `${topThree[0].totalGiftsValue.toLocaleString()} 🪙 كوينز`
                    : filter === 'creators'
                    ? `${topThree[0].followersCount.toLocaleString()} متابع`
                    : `Lv.${topThree[0].level}`}
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div
              onClick={() => onUserClick(topThree[2])}
              className="flex flex-col items-center p-3 md:p-4 rounded-3xl bg-gradient-to-b from-amber-950/40 to-zinc-950 border border-amber-700/40 cursor-pointer group hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-1">🥉</div>
              <AvatarWithFrame user={topThree[2]} size="md" showCrown={true} />
              <div className="mt-2 text-center">
                <VIPName user={topThree[2]} size="xs" />
                <div className="text-[11px] font-bold text-amber-500 mt-1">
                  {filter === 'supporters'
                    ? `${topThree[2].totalGiftsValue.toLocaleString()} 🪙`
                    : filter === 'creators'
                    ? `${topThree[2].followersCount.toLocaleString()} متابع`
                    : `Lv.${topThree[2].level}`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of the users list */}
      {restUsers.length > 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 overflow-hidden divide-y divide-zinc-800/60">
          {restUsers.map((user, idx) => (
            <div
              key={user.id}
              onClick={() => onUserClick(user)}
              className="p-3.5 flex items-center justify-between hover:bg-zinc-900/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-black text-xs text-zinc-500">
                  #{idx + 4}
                </span>
                <AvatarWithFrame user={user} size="sm" showCrown={true} />
                <div>
                  <VIPName user={user} size="xs" />
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span>{user.country.flag}</span>
                    <span>{user.country.nameAr}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <VIPBadge tier={user.vipTier} size="xs" />
                <span className="text-xs font-bold text-amber-400">
                  {filter === 'supporters'
                    ? `${user.totalGiftsValue.toLocaleString()} 🪙`
                    : filter === 'creators'
                    ? `${user.followersCount.toLocaleString()} متابع`
                    : `Lv.${user.level}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
