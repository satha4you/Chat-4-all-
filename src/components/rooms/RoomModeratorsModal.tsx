import React, { useState } from 'react';
import { VoiceRoom, UserProfile } from '../../types';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import {
  Shield,
  Crown,
  Search,
  UserPlus,
  UserMinus,
  CheckCircle2,
  Users,
  Mic,
  VolumeX,
  Lock,
  Sparkles,
  X,
  HelpCircle,
  Award
} from 'lucide-react';
import { playSoundEffect } from '../../utils/soundEffects';

interface RoomModeratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: VoiceRoom;
  currentUser: UserProfile;
  allUsers?: UserProfile[];
  onAssignModerator: (user: UserProfile) => void;
  onRemoveModerator: (userId: string) => void;
}

export const RoomModeratorsModal: React.FC<RoomModeratorsModalProps> = ({
  isOpen,
  onClose,
  room,
  currentUser,
  allUsers = [],
  onAssignModerator,
  onRemoveModerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'room_members' | 'current_mods'>('all');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRoomHost = room.host.id === currentUser.id;
  const isGeneralManager = currentUser.role === 'owner' || currentUser.role === 'admin';
  const canManage = isRoomHost || isGeneralManager;

  const moderatorIds = new Set<string>(room.moderators || []);

  // Collect all unique members present in the room (listeners + seated users)
  const seatedUsers = room.seats.map((s) => s.user).filter((u): u is UserProfile => u !== null);
  const roomMembersMap = new Map<string, UserProfile>();
  
  // Add listeners
  (room.listeners || []).forEach((u) => {
    if (u && u.id) roomMembersMap.set(u.id, u);
  });
  // Add seated users
  seatedUsers.forEach((u) => {
    if (u && u.id) roomMembersMap.set(u.id, u);
  });

  const roomPresentUsers = Array.from(roomMembersMap.values()).filter((u) => u.id !== room.host.id);

  // Map of all known users to resolve moderator profiles
  const allKnownUsersMap = new Map<string, UserProfile>();
  allUsers.forEach((u) => allKnownUsersMap.set(u.id, u));
  roomPresentUsers.forEach((u) => allKnownUsersMap.set(u.id, u));
  allKnownUsersMap.set(room.host.id, room.host);
  allKnownUsersMap.set(currentUser.id, currentUser);

  // Current moderators list
  const currentModerators: UserProfile[] = Array.from(moderatorIds).map((id: string) => {
    const existing = allKnownUsersMap.get(id);
    if (existing) return existing;
    return {
      id,
      username: `user_${id.slice(-4)}`,
      name: 'مشرف الغرفة',
      nickname: 'مشرف الغرفة',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'moderator',
      vipTier: 'silver',
      level: 5,
      coins: 1000,
      xp: 500,
      followersCount: 0,
      followingCount: 0,
      receivedGiftsCount: 0,
      totalGiftsValue: 0,
    } as unknown as UserProfile;
  });

  // Candidate users available across the platform (excluding host and current user if self)
  const candidatePool = allUsers.length > 0 ? allUsers : roomPresentUsers;
  const filteredCandidates = candidatePool.filter((u) => {
    if (u.id === room.host.id) return false;
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nickname.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'current_mods') {
      return moderatorIds.has(u.id);
    }
    if (activeTab === 'room_members') {
      return roomMembersMap.has(u.id);
    }
    return true;
  });

  const handleAssign = (user: UserProfile) => {
    if (!canManage) return;
    onAssignModerator(user);
    setFeedbackNotice(`تم تعيين "${user.nickname}" مشرفاً للغرفة بنجاح 🛡️`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleRemove = (user: UserProfile) => {
    if (!canManage) return;
    onRemoveModerator(user.id);
    setFeedbackNotice(`تم إلغاء الإشراف عن "${user.nickname}"`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#171524] via-[#100F1A] to-[#0A0912] border border-amber-500/40 rounded-3xl shadow-2xl text-zinc-100 flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full bg-[#171524] rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">إدارة مشرفي الغرفة</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    {currentModerators.length} مشرفين
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  {isRoomHost ? 'بصفتك مالك الغرفة' : 'بصفتك المدير العام'}: يمكنك تعيين مشرفين من الأعضاء لمساعدتك في إدارة المايكات وتنظيم الجلسة.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback notice toast inside modal */}
          {feedbackNotice && (
            <div className="mt-3 p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-bold text-center animate-bounce">
              {feedbackNotice}
            </div>
          )}

          {/* Search Input */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute top-2.5 right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عضو لتعيينه مشرفاً..."
              className="w-full bg-[#0C0B14] border border-zinc-700/80 rounded-xl pr-9 pl-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-zinc-400 hover:text-white text-xs"
              >
                مسح
              </button>
            )}
          </div>

          {/* Tabs Filter */}
          <div className="mt-3 flex items-center gap-1.5 p-1 rounded-xl bg-[#0C0B14] border border-zinc-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              كافة الأعضاء ({candidatePool.length})
            </button>
            <button
              onClick={() => setActiveTab('room_members')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'room_members'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              حاضرو الغرفة ({roomPresentUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('current_mods')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'current_mods'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              المشرفون المعينون ({currentModerators.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Section: Currently Assigned Moderators */}
          {activeTab !== 'room_members' && currentModerators.length > 0 && !searchQuery && (
            <div className="space-y-2">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>مشرفو الغرفة الحاليون ({currentModerators.length})</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {currentModerators.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/30 via-zinc-900/60 to-zinc-900/40 border border-blue-500/40 flex items-center justify-between gap-3 shadow-sm hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AvatarWithFrame user={mod} size="xs" showCrown={false} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <VIPName user={mod} size="xs" />
                          <span className="px-1.5 py-0.2 rounded-md bg-blue-500/25 border border-blue-400/40 text-[9px] font-black text-blue-300">
                            مشرف الغرفة 🛡️
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                          {mod.country?.flag ? `${mod.country.flag} ` : ''}مستوى {mod.level || 1} • {mod.nickname}
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <button
                        onClick={() => handleRemove(mod)}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/50 text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                        title="إلغاء صلاحية الإشراف"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>إلغاء الإشراف</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for current moderators tab */}
          {activeTab === 'current_mods' && currentModerators.length === 0 && (
            <div className="p-8 text-center bg-[#0F0E17] rounded-2xl border border-zinc-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-300 font-bold">لا يوجد مشرفون معينون لهذه الغرفة حتى الآن.</p>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                يمكنك التبديل إلى تبويب "حاضرو الغرفة" أو "كافة الأعضاء" واختيار أي عضو وتعيينه مشرفاً بنقرة واحدة.
              </p>
              <button
                onClick={() => setActiveTab('room_members')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black shadow-md hover:bg-amber-400 transition-colors"
              >
                تصفح أعضاء الغرفة لتعيين مشرف
              </button>
            </div>
          )}

          {/* Section: Candidate Members to promote */}
          {activeTab !== 'current_mods' && (
            <div className="space-y-2">
              <div className="text-xs font-black text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {activeTab === 'room_members' ? 'الأعضاء المتواجدون بالغرفة' : 'اختيار وتعيين مشرف من الأعضاء'}
                  </span>
                </span>
                <span className="text-[10px] text-zinc-500">انقر للتعيين الفوري</span>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="p-6 text-center bg-[#0F0E17] rounded-2xl border border-zinc-800 text-xs text-zinc-400">
                  لم يتم العثور على أعضاء يطابقون البحث.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredCandidates.map((user) => {
                    const isMod = moderatorIds.has(user.id);
                    const isPresent = roomMembersMap.has(user.id);

                    return (
                      <div
                        key={user.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isMod
                            ? 'bg-blue-950/20 border-blue-500/40'
                            : 'bg-zinc-900/40 hover:bg-zinc-900/70 border-zinc-800/80 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AvatarWithFrame user={user} size="xs" showCrown={false} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <VIPName user={user} size="xs" />
                              {isPresent && (
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                                  متواجد الآن
                                </span>
                              )}
                              {isMod && (
                                <span className="px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black">
                                  مشرف 🛡️
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                              {user.country?.flag ? `${user.country.flag} ` : ''}مستوى {user.level || 1} • {user.nickname}
                            </div>
                          </div>
                        </div>

                        {canManage && (
                          <div>
                            {isMod ? (
                              <button
                                onClick={() => handleRemove(user)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                                <span>إلغاء الإشراف</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAssign(user)}
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black shadow-md shadow-amber-950/30 flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>تعيين كمشرف 🛡️</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Guide Box: Moderator Privileges */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-[11px] text-amber-200">
            <div className="font-black flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>صلاحيات مشرف الغرفة لمساعدة المالك:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-zinc-300 text-[10px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>كتم وإلغاء كتم مايك المتحدثين</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>قفل وفتح مقاعد المسرح الصوتي</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>إنزال المتحدثين المخالفين من المايك</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>مسح وتنظيف سجل الدردشة العامة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>شارة (مشرف الغرفة 🛡️) في المقاعد والدردشة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>التحكم فقط لمالك الغرفة والمدير العام</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-zinc-400">
            الغرفة: <span className="text-amber-300 font-bold">{room.title}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
