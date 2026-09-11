import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  VoiceRoom,
  VIPTier,
  VIPSubscriptionRequest,
  ModerationReport,
  SystemAnnouncement,
  ActiveTab,
  DeviceViewMode,
  Gift,
  RoomCategory,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_VIP_REQUESTS,
  INITIAL_REPORTS,
  INITIAL_ANNOUNCEMENTS,
  VIP_CONFIGS,
} from './data/initialData';
import { AppHeader } from './components/navigation/AppHeader';
import { BottomNav } from './components/navigation/BottomNav';
import { RoomCard } from './components/rooms/RoomCard';
import { LiveVoiceRoom } from './components/rooms/LiveVoiceRoom';
import { CreateRoomModal } from './components/rooms/CreateRoomModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { VIPStoreView } from './components/vip/VIPStoreView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { DirectMessagesView } from './components/chat/DirectMessagesView';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { AvatarWithFrame } from './components/common/AvatarWithFrame';
import { VIPBadge } from './components/common/VIPBadge';
import { VIPName } from './components/common/VIPName';
import { GoldFallingParticles } from './components/common/GoldFallingParticles';
import { 
  Crown, 
  Mic, 
  Sparkles, 
  Search, 
  Flame, 
  Music, 
  BookOpen, 
  Coffee, 
  Lightbulb, 
  Gamepad2, 
  Plus,
  Bell,
  CheckCircle,
  ExternalLink,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from './utils/soundEffects';

export default function App() {
  // Persistence states
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('royal_voice_users');
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const demoUserIds = new Set(['user_gold_1', 'user_silver_1', 'user_bronze_1', 'user_current_visitor', 'user_regular_1']);
          const filtered = parsed.filter((u) => !demoUserIds.has(u.id));
          const existingIds = new Set(filtered.map((u) => u.id));
          const merged = [...filtered, ...INITIAL_USERS.filter((u) => !existingIds.has(u.id))];
          const owner = merged.find((u) => u.id === 'user_owner');
          if (owner) {
            owner.email = 'Satha4you@gmail.com';
            owner.role = 'owner';
            owner.vipTier = 'mythic';
            owner.isVipActive = true;
            owner.verified = true;
            if (!owner.verificationType) {
              owner.verificationType = 'gold';
            }
            if ((owner.coins || 0) < 100000) owner.coins = 1000000;
            return merged.length > 0 ? merged : INITIAL_USERS;
          }
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('royal_voice_current_user_id');
    const demoUserIds = new Set(['user_gold_1', 'user_silver_1', 'user_bronze_1', 'user_current_visitor', 'user_regular_1']);
    if (saved && !demoUserIds.has(saved)) {
      return saved;
    }
    return 'user_owner';
  });

  const [rooms, setRooms] = useState<VoiceRoom[]>(() => {
    const saved = localStorage.getItem('royal_voice_rooms');
    if (saved) {
      try {
        const parsed: VoiceRoom[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const demoRoomIds = new Set(['room_diwan_royal', 'room_tarab_oud', 'room_poetry_lounge', 'room_tech_future']);
          const filtered = parsed.filter((r) => !demoRoomIds.has(r.id));
          if (filtered.length > 0) {
            return filtered;
          }
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ROOMS;
  });

  const [vipRequests, setVipRequests] = useState<VIPSubscriptionRequest[]>(() => {
    const saved = localStorage.getItem('royal_voice_vip_requests');
    return saved ? JSON.parse(saved) : INITIAL_VIP_REQUESTS;
  });

  const [reports, setReports] = useState<ModerationReport[]>(() => {
    const saved = localStorage.getItem('royal_voice_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => {
    const saved = localStorage.getItem('royal_voice_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('rooms');
  const [deviceMode, setDeviceMode] = useState<DeviceViewMode>('responsive');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<VoiceRoom | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showAdminAuth, setShowAdminAuth] = useState<boolean>(false);
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);
  const [targetDmUser, setTargetDmUser] = useState<UserProfile | null>(null);
  const [goldParticlesEnabled, setGoldParticlesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('royal_gold_particles_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('royal_gold_particles_enabled', String(goldParticlesEnabled));
    } catch (e) {
      console.warn(e);
    }
  }, [goldParticlesEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_voice_users', JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_voice_rooms', JSON.stringify(rooms));
    } catch (e) {
      console.warn(e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_voice_vip_requests', JSON.stringify(vipRequests));
    } catch (e) {
      console.warn(e);
    }
  }, [vipRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_voice_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('royal_voice_announcements', JSON.stringify(announcements));
    } catch (e) {
      console.warn(e);
    }
  }, [announcements]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const pendingRequestsCount = vipRequests.filter((r) => r.status === 'pending').length;

  // Handlers
  const handleUpdateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );

    // If inspected user is updated
    setInspectedUser((prev) => (prev && prev.id === userId ? { ...prev, ...updates } : prev));
    setUserToEdit((prev) => (prev && prev.id === userId ? { ...prev, ...updates } : prev));

    // Propagate changes to room host and seated users immediately
    setRooms((prev) =>
      prev.map((room) => {
        const isHost = room.host.id === userId;
        const hasSeat = room.seats.some((s) => s.user?.id === userId);
        if (!isHost && !hasSeat) return room;
        return {
          ...room,
          host: isHost ? { ...room.host, ...updates } : room.host,
          seats: room.seats.map((seat) =>
            seat.user?.id === userId ? { ...seat, user: { ...seat.user, ...updates } } : seat
          ),
        };
      })
    );

    if (activeVoiceRoom) {
      setActiveVoiceRoom((prev) => {
        if (!prev) return null;
        const isHost = prev.host.id === userId;
        const hasSeat = prev.seats.some((s) => s.user?.id === userId);
        if (!isHost && !hasSeat) return prev;
        return {
          ...prev,
          host: isHost ? { ...prev.host, ...updates } : prev.host,
          seats: prev.seats.map((seat) =>
            seat.user?.id === userId ? { ...seat, user: { ...seat.user, ...updates } } : seat
          ),
        };
      });
    }
  };

  const handleUpdateRoom = (roomId: string, updates: Partial<VoiceRoom>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r))
    );
    if (activeVoiceRoom && activeVoiceRoom.id === roomId) {
      setActiveVoiceRoom((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (activeVoiceRoom && activeVoiceRoom.id === roomId) {
      setActiveVoiceRoom(null);
    }
  };

  const handleCreateRoom = (newRoom: VoiceRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setActiveVoiceRoom(newRoom);
    playSoundEffect('bell');
  };

  const handleApproveVipRequest = (
    request: VIPSubscriptionRequest,
    durationMonths: number,
    tier: VIPTier
  ) => {
    const now = new Date();
    now.setMonth(now.getMonth() + durationMonths);
    const expiresAt = now.toISOString();

    handleUpdateUser(request.userId, {
      vipTier: tier,
      isVipActive: true,
      vipExpiresAt: expiresAt,
    });

    setVipRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: 'approved', processedAt: new Date().toISOString() } : r
      )
    );

    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleRejectVipRequest = (requestId: string) => {
    setVipRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  const handleAddAnnouncement = (newAnn: SystemAnnouncement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleResolveReport = (reportId: string, action: 'ban_user' | 'dismiss') => {
    const rep = reports.find((r) => r.id === reportId);
    if (action === 'ban_user' && rep?.reportedUser) {
      handleUpdateUser(rep.reportedUser.id, { isBanned: true });
    }
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'ban_user' ? 'resolved' : 'dismissed' } : r))
    );
  };

  const handleSendGiftToUser = (receiver: UserProfile, gift: Gift) => {
    handleUpdateUser(receiver.id, {
      receivedGiftsCount: receiver.receivedGiftsCount + 1,
      totalGiftsValue: receiver.totalGiftsValue + gift.coins,
      xp: receiver.xp + gift.coins * 2,
    });
  };

  const handleLoginAsOwner = () => {
    setCurrentUserId('user_owner');
    localStorage.setItem('royal_voice_current_user_id', 'user_owner');
    playSoundEffect('vip_fanfare');
  };

  const handleLogout = () => {
    setCurrentUserId('user_owner');
    localStorage.setItem('royal_voice_current_user_id', 'user_owner');
    setShowAdmin(false);
    setActiveVoiceRoom(null);
    playSoundEffect('bell');
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'vip'
        ? r.type === 'vip'
        : r.category === selectedCategory;

    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.host.nickname.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Full-Page Dedicated Live Voice Room Experience
  if (activeVoiceRoom) {
    return (
      <DeviceFrame deviceMode={deviceMode}>
        <div className="relative w-full h-full min-h-screen bg-[#07070B] flex flex-col overflow-hidden select-none">
          <LiveVoiceRoom
            room={activeVoiceRoom}
            currentUser={currentUser}
            onLeave={() => setActiveVoiceRoom(null)}
            onUserClick={(user) => setInspectedUser(user)}
            onUpdateRoom={(updated) => handleUpdateRoom(updated.id, updated)}
          />

          {/* Inspect User Profile Modal from inside room */}
          <UserProfileModal
            user={inspectedUser}
            currentUser={currentUser}
            isOpen={!!inspectedUser}
            onClose={() => setInspectedUser(null)}
            onOpenEditProfile={(target) => {
              setUserToEdit(target || currentUser);
              setShowEditProfile(true);
            }}
            onOpenVipStore={() => {
              setInspectedUser(null);
              setActiveTab('vip_club');
              setActiveVoiceRoom(null);
            }}
            onOpenAdminEdit={() => {
              setInspectedUser(null);
              setShowAdmin(true);
              setActiveVoiceRoom(null);
            }}
            onUpdateThemeColor={(colorKey) => {
              if (inspectedUser) {
                handleUpdateUser(inspectedUser.id, { themeColor: colorKey });
                setInspectedUser((prev) => (prev ? { ...prev, themeColor: colorKey } : null));
              }
            }}
            onLogout={handleLogout}
          />

          {/* Edit Profile Modal from inside room */}
          <EditProfileModal
            user={userToEdit || currentUser}
            isOpen={showEditProfile}
            onClose={() => {
              setShowEditProfile(false);
              setUserToEdit(null);
            }}
            onSave={(updates) => {
              const targetId = (userToEdit || currentUser).id;
              handleUpdateUser(targetId, updates);
              setShowEditProfile(false);
              setUserToEdit(null);
            }}
          />
        </div>
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame deviceMode={deviceMode}>
      <div className="relative min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#050505]">
        
        {/* Subtle Ambient Royal Gold Particles / Leaves Background */}
        <GoldFallingParticles
          enabled={goldParticlesEnabled}
          className={deviceMode === 'mobile_shell' ? 'absolute inset-0' : 'fixed inset-0'}
          opacity={0.6}
          particleCount={45}
        />

        {/* Main Header Bar */}
        <AppHeader
          currentUser={currentUser}
          activeRole={currentUser.role}
          deviceMode={deviceMode}
          onToggleDeviceMode={() =>
            setDeviceMode(deviceMode === 'responsive' ? 'mobile_shell' : 'responsive')
          }
          onOpenAdmin={() => {
            if (currentUser.role === 'owner' || currentUser.id === 'user_owner') {
              setShowAdmin(true);
            } else {
              setShowAdminAuth(true);
            }
          }}
          onOpenCreateRoom={() => setShowCreateRoom(true)}
          onOpenProfile={() => setInspectedUser(currentUser)}
          onOpenVipStore={() => setActiveTab('vip_club')}
          pendingRequestsCount={pendingRequestsCount}
          goldParticlesEnabled={goldParticlesEnabled}
          onToggleGoldParticles={() => setGoldParticlesEnabled((prev) => !prev)}
          onLogout={handleLogout}
          onOpenAdminAuth={() => setShowAdminAuth(true)}
        />

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-6">
          {showAdmin ? (
            /* Admin Control Dashboard */
            <AdminDashboard
              currentUser={currentUser}
              users={users}
              rooms={rooms}
              vipRequests={vipRequests}
              reports={reports}
              announcements={announcements}
              onUpdateUser={handleUpdateUser}
              onUpdateRoom={handleUpdateRoom}
              onDeleteRoom={handleDeleteRoom}
              onApproveVipRequest={handleApproveVipRequest}
              onRejectVipRequest={handleRejectVipRequest}
              onAddAnnouncement={handleAddAnnouncement}
              onResolveReport={handleResolveReport}
              onCloseAdmin={() => setShowAdmin(false)}
            />
          ) : activeTab === 'vip_club' ? (
            /* VIP Club & Manual Subscription View */
            <VIPStoreView
              currentUser={currentUser}
              onSubmitRequest={(req) => setVipRequests((prev) => [req, ...prev])}
              onOpenDirectContact={() => {}}
            />
          ) : activeTab === 'top_users' ? (
            /* Leaderboard of Top VIP Supporters */
            <LeaderboardView
              users={users}
              onUserClick={(user) => setInspectedUser(user)}
            />
          ) : activeTab === 'direct_messages' ? (
            /* Direct Private Messaging */
            <DirectMessagesView
              currentUser={currentUser}
              users={users}
              onUserClick={(user) => setInspectedUser(user)}
              targetUser={targetDmUser}
            />
          ) : activeTab === 'my_profile' ? (
            /* Detailed Profile View of Current User */
            <div className="max-w-2xl mx-auto">
              <UserProfileModal
                user={currentUser}
                currentUser={currentUser}
                isOpen={true}
                onClose={() => setActiveTab('rooms')}
                onOpenEditProfile={(target) => {
                  setUserToEdit(target || currentUser);
                  setShowEditProfile(true);
                }}
                onOpenVipStore={() => setActiveTab('vip_club')}
                onOpenAdminEdit={() => setShowAdmin(true)}
                onUpdateThemeColor={(colorKey) => handleUpdateUser(currentUser.id, { themeColor: colorKey })}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            /* Rooms Home Feed (Primary View) */
            <div className="space-y-6">
              
              {/* VIP Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14120B] via-[#0E0E12] to-[#0A0A0A] border border-amber-500/25 p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-right">
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h2 className="text-lg md:text-xl font-black text-white">
                        أهلًا بك يا {currentUser.nickname} في ديوان VIP
                      </h2>
                      <VIPBadge tier={currentUser.vipTier} size="xs" showText={false} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      غرف صوتية حية، دردشة مباشرة، وعضويات VIP متميزة بتيجان وإطارات ملكية.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('vip_club')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    <Crown className="w-4 h-4" />
                    <span>ترقية العضوية للـ VIP</span>
                  </button>
                </div>
              </div>

              {/* Announcements Bar */}
              {announcements.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#0E0E0E] border border-zinc-800/80 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold truncate">
                    <Bell className="w-4 h-4 shrink-0" />
                    <span className="truncate">{announcements[0].titleAr}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('vip_club')}
                    className="text-[11px] text-amber-300 hover:underline shrink-0 font-semibold"
                  >
                    معرفة المزيد ←
                  </button>
                </div>
              )}

              {/* Categories Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-1">
                  {[
                    { id: 'all', label: 'الكل', icon: Sparkles },
                    { id: 'vip', label: 'غرف VIP 👑', icon: Crown },
                    { id: 'music', label: 'طرب وعود 🎵', icon: Music },
                    { id: 'poetry', label: 'شعر وأدب 📜', icon: BookOpen },
                    { id: 'culture', label: 'ثقافة وتقنية 💡', icon: Lightbulb },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-amber-500 text-black font-black shadow-md'
                          : 'bg-[#0E0E0E] hover:bg-[#161616] text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="w-4 h-4 text-zinc-500 absolute top-2.5 right-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن غرفة أو مضيف..."
                    className="w-full bg-[#0E0E0E] border border-zinc-800 rounded-full pr-9 pl-4 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Rooms Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-zinc-200 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    الغرف الصوتية المباشرة ({filteredRooms.length})
                  </h3>
                  <button
                    onClick={() => setShowCreateRoom(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>غرفة جديدة</span>
                  </button>
                </div>

                {filteredRooms.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-[#161105]/80 via-[#0A0A0A] to-[#07070A] rounded-3xl border border-amber-500/30 space-y-4 shadow-2xl">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-3.5 text-black shadow-lg shadow-amber-500/20 flex items-center justify-center">
                      <Crown className="w-9 h-9 text-black" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1.5">
                      <h4 className="text-base sm:text-lg font-black text-white">
                        مرحبًا بك يا {currentUser.nickname}! 👑
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        تم تنظيف جميع الغرف والحسابات التجريبية بنجاح. حساب المالك الرسمي هو الأساسي والمفعل في كل شيء (التحكم الكامل، إنشاء الغرف، واختبار الهدايا والصوت).
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateRoom(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>تدشين أول غرفة صوتية رسمية 🎙️</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        currentUser={currentUser}
                        onJoin={(r) => {
                          setActiveVoiceRoom(r);
                          playSoundEffect('bell');
                        }}
                        onUserClick={(user) => setInspectedUser(user)}
                        onToggleFeatured={(r) => {
                          const nextFeatured = !r.isFeatured;
                          handleUpdateRoom(r.id, { isFeatured: nextFeatured });
                          if (nextFeatured) {
                            playSoundEffect('vip_fanfare');
                            confetti({
                              particleCount: 75,
                              spread: 70,
                              origin: { y: 0.6 },
                            });
                          } else {
                            playSoundEffect('bell');
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </main>

        {/* Global Bottom Navigation (Visible when not in live room) */}
        {!activeVoiceRoom && (
          <BottomNav
            activeTab={activeTab}
            onChangeTab={(tab) => {
              setShowAdmin(false);
              setActiveTab(tab);
            }}
            currentUser={currentUser}
          />
        )}

        {/* User Profile Modal */}
        <UserProfileModal
          user={inspectedUser}
          currentUser={currentUser}
          isOpen={inspectedUser !== null}
          onClose={() => setInspectedUser(null)}
          onSendGift={handleSendGiftToUser}
          onOpenEditProfile={(target) => {
            const targetUser = target || inspectedUser || currentUser;
            setUserToEdit(targetUser);
            setShowEditProfile(true);
          }}
          onOpenDirectChat={(user) => {
            setTargetDmUser(user);
            setActiveTab('direct_messages');
          }}
          onOpenAdminEdit={(user) => {
            setInspectedUser(null);
            setShowAdmin(true);
          }}
          onLogout={handleLogout}
          onOpenVipStore={() => {
            setInspectedUser(null);
            setActiveTab('vip_club');
          }}
          onUpdateThemeColor={(colorKey) => {
            if (inspectedUser) {
              handleUpdateUser(inspectedUser.id, { themeColor: colorKey });
              setInspectedUser((prev) => prev ? { ...prev, themeColor: colorKey } : null);
            }
          }}
        />

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={userToEdit || currentUser}
          isOpen={showEditProfile}
          onClose={() => {
            setShowEditProfile(false);
            setUserToEdit(null);
          }}
          onSave={(updates) => {
            const targetId = (userToEdit || currentUser).id;
            handleUpdateUser(targetId, updates);
            setShowEditProfile(false);
            setUserToEdit(null);
          }}
        />

        {/* Create Room Modal */}
        <CreateRoomModal
          currentUser={currentUser}
          isOpen={showCreateRoom}
          onClose={() => setShowCreateRoom(false)}
          onCreate={handleCreateRoom}
        />

        {/* Admin Passcode Authentication Modal */}
        <AdminAuthModal
          isOpen={showAdminAuth}
          onClose={() => setShowAdminAuth(false)}
          onSuccess={() => {
            setShowAdminAuth(false);
            setShowAdmin(true);
          }}
          onLoginAsOwner={handleLoginAsOwner}
        />

      </div>
    </DeviceFrame>
  );
}
