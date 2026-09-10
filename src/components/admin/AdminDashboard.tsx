import React, { useState, useRef, useEffect } from 'react';
import {
  UserProfile,
  VoiceRoom,
  VIPTier,
  VIPSubscriptionRequest,
  ModerationReport,
  SystemAnnouncement,
  UserBadge,
  VIPConfig,
} from '../../types';
import {
  VIP_CONFIGS,
  INITIAL_BADGES,
  OWNER_CONTACT_INFO,
  ADMIN_SECURITY_CONFIG,
  ARAB_COUNTRIES,
  ROYAL_SAMPLE_AVATARS,
} from '../../data/initialData';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import {
  ShieldAlert,
  Users,
  Crown,
  Mic,
  Gift,
  Bell,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Search,
  Plus,
  Settings,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Pin,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Award,
  RefreshCw,
  Mail,
  KeyRound,
  ShieldCheck,
  Camera,
  Upload,
  Image as ImageIcon,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/soundEffects';

interface AdminDashboardProps {
  currentUser: UserProfile;
  users: UserProfile[];
  rooms: VoiceRoom[];
  vipRequests: VIPSubscriptionRequest[];
  reports: ModerationReport[];
  announcements: SystemAnnouncement[];
  onUpdateUser: (userId: string, updates: Partial<UserProfile>) => void;
  onUpdateRoom: (roomId: string, updates: Partial<VoiceRoom>) => void;
  onDeleteRoom: (roomId: string) => void;
  onApproveVipRequest: (request: VIPSubscriptionRequest, durationMonths: number, tier: VIPTier) => void;
  onRejectVipRequest: (requestId: string, reason?: string) => void;
  onAddAnnouncement: (announcement: SystemAnnouncement) => void;
  onResolveReport: (reportId: string, action: 'ban_user' | 'dismiss') => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  rooms,
  vipRequests,
  reports,
  announcements,
  onUpdateUser,
  onUpdateRoom,
  onDeleteRoom,
  onApproveVipRequest,
  onRejectVipRequest,
  onAddAnnouncement,
  onResolveReport,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    'owner_profile' | 'overview' | 'vip_requests' | 'users' | 'rooms' | 'badges' | 'broadcast' | 'reports' | 'settings'
  >('owner_profile');

  // Find the owner profile user
  const ownerUser = users.find((u) => u.role === 'owner' || u.id === 'user_owner') || currentUser;

  // Owner Profile Editing State
  const [ownerUsername, setOwnerUsername] = useState(ownerUser.username);
  const [ownerNickname, setOwnerNickname] = useState(ownerUser.nickname);
  const [ownerAvatar, setOwnerAvatar] = useState(ownerUser.avatar);
  const [ownerCustomAvatarUrl, setOwnerCustomAvatarUrl] = useState('');
  const [ownerBio, setOwnerBio] = useState(ownerUser.bio || '');
  const [ownerStatus, setOwnerStatus] = useState(ownerUser.status || '');
  const [ownerCountryCode, setOwnerCountryCode] = useState(ownerUser.country?.code || 'SA');
  const [ownerVipTier, setOwnerVipTier] = useState<VIPTier>(ownerUser.vipTier || 'royal');
  const [ownerCoins, setOwnerCoins] = useState(ownerUser.coins || 150000);
  const [ownerVerified, setOwnerVerified] = useState(ownerUser.verified ?? true);
  const [ownerUploadError, setOwnerUploadError] = useState<string | null>(null);
  const [ownerSavedSuccess, setOwnerSavedSuccess] = useState(false);
  const ownerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Keep owner state in sync when ownerUser changes
  useEffect(() => {
    setOwnerUsername(ownerUser.username);
    setOwnerNickname(ownerUser.nickname);
    setOwnerAvatar(ownerUser.avatar);
    setOwnerBio(ownerUser.bio || '');
    setOwnerStatus(ownerUser.status || '');
    setOwnerCountryCode(ownerUser.country?.code || 'SA');
    setOwnerVipTier(ownerUser.vipTier || 'royal');
    setOwnerCoins(ownerUser.coins || 150000);
    setOwnerVerified(ownerUser.verified ?? true);
  }, [ownerUser.id, ownerUser.avatar, ownerUser.nickname, ownerUser.coins, ownerUser.vipTier]);

  // User management state (for all users)
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  const [editVipTier, setEditVipTier] = useState<VIPTier>('gold');
  const [editDurationMonths, setEditDurationMonths] = useState<number>(3);
  const [editIsVipActive, setEditIsVipActive] = useState<boolean>(true);
  const [editVerified, setEditVerified] = useState<boolean>(false);
  const [editCoins, setEditCoins] = useState<number>(0);
  const [editNickname, setEditNickname] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [editCustomAvatarUrl, setEditCustomAvatarUrl] = useState<string>('');
  const userEditFileInputRef = useRef<HTMLInputElement | null>(null);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'vip_promo' | 'system_update'>('vip_promo');

  // Contact settings state
  const [ownerWhatsApp, setOwnerWhatsApp] = useState(OWNER_CONTACT_INFO.whatsappNumber);
  const [ownerTelegram, setOwnerTelegram] = useState(OWNER_CONTACT_INFO.telegramHandle);
  const [customInstructions, setCustomInstructions] = useState(OWNER_CONTACT_INFO.customInstructionsAr);

  // Statistics calculation
  const totalUsersCount = users.length;
  const vipRoyalCount = users.filter((u) => u.vipTier === 'royal' && u.isVipActive).length;
  const vipGoldCount = users.filter((u) => u.vipTier === 'gold' && u.isVipActive).length;
  const vipSilverCount = users.filter((u) => u.vipTier === 'silver' && u.isVipActive).length;
  const vipBronzeCount = users.filter((u) => u.vipTier === 'bronze' && u.isVipActive).length;
  const totalActiveVips = vipRoyalCount + vipGoldCount + vipSilverCount + vipBronzeCount;
  const pendingRequestsCount = vipRequests.filter((r) => r.status === 'pending').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.nickname.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const handleOpenUserEdit = (user: UserProfile) => {
    setSelectedUserForEdit(user);
    setEditVipTier(user.vipTier);
    setEditIsVipActive(user.isVipActive);
    setEditVerified(user.verified || false);
    setEditCoins(user.coins);
    setEditNickname(user.nickname);
    setEditAvatar(user.avatar);
    setEditCustomAvatarUrl('');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    let expiresAt: string | null = selectedUserForEdit.vipExpiresAt;
    if (editVipTier !== 'none' && editIsVipActive) {
      const now = new Date();
      now.setMonth(now.getMonth() + editDurationMonths);
      expiresAt = now.toISOString();
    } else if (editVipTier === 'none') {
      expiresAt = null;
    }

    const finalAvatar = editCustomAvatarUrl.trim() || editAvatar || selectedUserForEdit.avatar;

    onUpdateUser(selectedUserForEdit.id, {
      nickname: editNickname.trim() || selectedUserForEdit.username,
      avatar: finalAvatar,
      vipTier: editVipTier,
      isVipActive: editVipTier !== 'none' ? editIsVipActive : false,
      vipExpiresAt: expiresAt,
      verified: editVerified,
      coins: editCoins,
    });

    playSoundEffect('vip_fanfare');
    setSelectedUserForEdit(null);
  };

  const handleOwnerFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setOwnerUploadError('يرجى اختيار ملف صورة صالح (JPG, PNG, GIF, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setOwnerUploadError('حجم الصورة كبير جدًا (الحد الأقصى 5 ميجابايت)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        setOwnerAvatar(res);
        setOwnerCustomAvatarUrl('');
        setOwnerUploadError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveOwnerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveAvatar = ownerCustomAvatarUrl.trim() || ownerAvatar;
    const countryObj = ARAB_COUNTRIES.find((c) => c.code === ownerCountryCode) || ownerUser.country;

    onUpdateUser(ownerUser.id, {
      username: ownerUsername.replace(/^@/, '').trim().toLowerCase() || ownerUser.username,
      nickname: ownerNickname.trim() || ownerUser.username,
      avatar: effectiveAvatar,
      bio: ownerBio.trim(),
      status: ownerStatus.trim(),
      vipTier: ownerVipTier,
      isVipActive: true,
      verified: ownerVerified,
      coins: ownerCoins,
      country: {
        code: countryObj.code,
        nameAr: countryObj.nameAr,
        nameEn: countryObj.nameAr,
        flag: countryObj.flag,
      },
    });

    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
    setOwnerSavedSuccess(true);
    setTimeout(() => setOwnerSavedSuccess(false), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    const newAnnouncement: SystemAnnouncement = {
      id: 'ann_' + Date.now(),
      titleAr: broadcastTitle.trim(),
      titleEn: broadcastTitle.trim(),
      contentAr: broadcastContent.trim(),
      contentEn: broadcastContent.trim(),
      type: broadcastType,
      createdAt: new Date().toISOString(),
      isPinned: true,
    };

    onAddAnnouncement(newAnnouncement);
    playSoundEffect('bell');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.3 }
    });
    setBroadcastTitle('');
    setBroadcastContent('');
    alert('تم إرسال الإشعار لجميع مستخدمي المنصة بنجاح!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-zinc-100 animate-fadeIn select-none">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0A0A0A] border border-zinc-800 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/10 font-black">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black text-white">لوحة تحكم مالك المنصة (Admin Control)</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
                تحكم يدوي كامل
              </span>
            </div>
            
            {/* General Admin / Owner Account Info */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141414] border border-amber-500/30 text-[11px] text-amber-300 font-medium">
                <Mail className="w-3 h-3 text-amber-400" />
                <span className="font-mono text-zinc-200">{ADMIN_SECURITY_CONFIG.adminEmail}</span>
                <span className="text-[10px] text-emerald-400 font-bold">(المالك والأدمن العام)</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141414] border border-zinc-800 text-[11px] text-zinc-400 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>حماية الرمز: نشطة وموثقة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('owner_profile')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>تعديل ملف المالك 👑</span>
          </button>
          <button
            onClick={onCloseAdmin}
            className="px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#202020] text-xs font-bold text-zinc-200 border border-zinc-700 transition-colors"
          >
            العودة للتطبيق ✕
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        {[
          { id: 'owner_profile', label: '👑 ملف المالك', highlight: true },
          { id: 'vip_requests', label: '👑 طلبات اشتراك VIP', count: pendingRequestsCount, highlight: true },
          { id: 'overview', label: '📊 الإحصائيات العامة' },
          { id: 'users', label: '👥 إدارة المستخدمين', count: users.length },
          { id: 'rooms', label: '🎙️ الغرف الصوتية', count: rooms.length },
          { id: 'broadcast', label: '📢 إرسال إشعارات عامة' },
          { id: 'badges', label: '🎨 التيجان والشارات' },
          { id: 'reports', label: '🚨 البلاغات والأمان', count: pendingReportsCount },
          { id: 'settings', label: '⚙️ إعدادات التواصل والدفع' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black'
                : 'bg-[#0A0A0A] hover:bg-[#141414] text-zinc-300 border border-zinc-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                  tab.highlight && tab.count > 0
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-zinc-800 text-zinc-200'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 0: Owner Profile Management */}
      {activeTab === 'owner_profile' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-black border border-amber-500/30">
            <div>
              <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                تعديل وتخصيص الملف الشخصي للمالك والمؤسس 👑
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                بصفتك الإدارة العامة، يمكنك رفع صورة شخصية للمالك مباشرة من جهازك، أو اختيار صورة من المعرض الملكي، وتعديل اسمه، نبذته، حالته ورصيده.
              </p>
            </div>
            {ownerSavedSuccess && (
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4" />
                تم حفظ وتحديث ملف المالك بنجاح!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Profile Card Preview */}
            <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-amber-500/30 flex flex-col items-center text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                معاينة مباشرة لحساب المالك
              </span>

              <div className="relative mt-2">
                <AvatarWithFrame
                  user={{
                    ...ownerUser,
                    avatar: ownerCustomAvatarUrl.trim() || ownerAvatar,
                    nickname: ownerNickname.trim() || ownerUser.nickname,
                    vipTier: ownerVipTier,
                    isVipActive: true,
                    verified: ownerVerified,
                  }}
                  size="2xl"
                  showCrown={true}
                  showLevel={true}
                  className="drop-shadow-2xl"
                />
              </div>

              <div>
                <VIPName
                  nickname={ownerNickname || ownerUser.nickname}
                  vipTier={ownerVipTier}
                  size="lg"
                  showCrown={true}
                />
                <div className="text-xs text-zinc-500 font-mono mt-0.5">@{ownerUser.username}</div>
                <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">{ADMIN_SECURITY_CONFIG.adminEmail}</div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <VIPBadge tier={ownerVipTier} size="sm" />
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1">
                  <span>{ARAB_COUNTRIES.find((c) => c.code === ownerCountryCode)?.flag || '🇸🇦'}</span>
                  <span>{ARAB_COUNTRIES.find((c) => c.code === ownerCountryCode)?.nameAr || 'السعودية'}</span>
                </span>
                {ownerVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/40 text-blue-300 border border-blue-800/40 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    موثق رسميًا
                  </span>
                )}
              </div>

              {ownerStatus && (
                <div className="w-full bg-[#050505] p-3 rounded-2xl border border-zinc-800/80 text-xs text-zinc-300 italic">
                  "{ownerStatus}"
                </div>
              )}

              <div className="w-full pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>رصيد المالك:</span>
                <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                  <span>{ownerCoins.toLocaleString()}</span>
                  <span>🪙</span>
                </span>
              </div>
            </div>

            {/* Owner Edit Form */}
            <form onSubmit={handleSaveOwnerProfile} className="lg:col-span-2 p-6 rounded-3xl bg-[#0A0A0A] border border-zinc-800 space-y-5">
              {/* Avatar Section */}
              <div className="p-4 rounded-2xl bg-[#050505] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    تعديل صورة المالك الشخصية
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerAvatar(ownerUser.avatar);
                      setOwnerCustomAvatarUrl('');
                      setOwnerUploadError(null);
                    }}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    استعادة الأصلية
                  </button>
                </div>

                {/* Upload Buttons & Drag-Drop */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    ref={ownerFileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleOwnerFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => ownerFileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>رفع صورة من جهازك (ملف صورة)</span>
                  </button>

                  <span className="text-xs text-zinc-500">أو اسحب وأفلت صورة هنا</span>
                </div>

                {ownerUploadError && (
                  <div className="text-xs text-rose-400 font-bold bg-rose-950/20 p-2 rounded-xl border border-rose-800/30">
                    {ownerUploadError}
                  </div>
                )}

                {/* Image URL Input */}
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">أو رابط صورة خارجي مباشر (Image URL):</label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-zinc-500 absolute top-2.5 right-3" />
                    <input
                      type="url"
                      placeholder="https://example.com/owner-photo.jpg"
                      value={ownerCustomAvatarUrl}
                      onChange={(e) => {
                        setOwnerCustomAvatarUrl(e.target.value);
                        setOwnerUploadError(null);
                      }}
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <div className="text-[11px] text-zinc-400 mb-1.5 font-bold">أو اختر من المعرض الملكي الفاخر:</div>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {ROYAL_SAMPLE_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setOwnerAvatar(av);
                          setOwnerCustomAvatarUrl('');
                          setOwnerUploadError(null);
                        }}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                          (ownerCustomAvatarUrl.trim() || ownerAvatar) === av
                            ? 'border-amber-400 scale-110 shadow-lg ring-2 ring-amber-400/50'
                            : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names and Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">اسم المستخدم (@Username):</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">@</span>
                    <input
                      type="text"
                      required
                      value={ownerUsername.replace(/^@/, '')}
                      onChange={(e) => setOwnerUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      placeholder="owner_royal"
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl pr-7 pl-3 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500 text-left dir-ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">الاسم المميز للمالك (Nickname):</label>
                  <input
                    type="text"
                    required
                    value={ownerNickname}
                    onChange={(e) => setOwnerNickname(e.target.value)}
                    placeholder="مثال: المالك والأدمن العام 👑"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">الدولة:</label>
                  <select
                    value={ownerCountryCode}
                    onChange={(e) => setOwnerCountryCode(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {ARAB_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Message / Quote */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الحالة / الاقتباس (Status):</label>
                <input
                  type="text"
                  value={ownerStatus}
                  onChange={(e) => setOwnerStatus(e.target.value)}
                  placeholder="مثال: مالك ومؤسس منصة الغرف الصوتية الملكية 👑 | مرحبًا بكم جميعًا"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">النبذة التعريفية (Bio):</label>
                <textarea
                  rows={3}
                  value={ownerBio}
                  onChange={(e) => setOwnerBio(e.target.value)}
                  placeholder="اكتب نبذة تظهر في الملف التعريفي للمالك..."
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* VIP Tier and Coins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">رتبة VIP المالك:</label>
                  <select
                    value={ownerVipTier}
                    onChange={(e) => setOwnerVipTier(e.target.value as VIPTier)}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {(['mythic', 'royal', 'gold', 'silver', 'bronze'] as VIPTier[]).map((t) => (
                      <option key={t} value={t}>
                        {VIP_CONFIGS[t].crownIcon} {VIP_CONFIGS[t].nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">رصيد الكوينز 🪙:</label>
                  <input
                    type="number"
                    value={ownerCoins}
                    onChange={(e) => setOwnerCoins(Number(e.target.value))}
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Verified Badge Checkbox */}
              <div className="flex items-center justify-between p-3.5 bg-[#050505] rounded-2xl border border-zinc-800">
                <div>
                  <div className="text-xs font-bold text-zinc-200">توثيق الحساب الرسمي (شارة التوثيق الزرقاء 🛡️)</div>
                  <div className="text-[11px] text-zinc-500">إظهار شارة التوثيق الذهبية/الزرقاء بجانب اسم المالك في كافة الغرف</div>
                </div>
                <input
                  type="checkbox"
                  checked={ownerVerified}
                  onChange={(e) => setOwnerVerified(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>حفظ وتحديث ملف المالك الآن 👑</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: VIP Subscription Requests (Manual Approval) */}
      {activeTab === 'vip_requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-amber-300 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              طلبات تفعيل وترقية VIP اليدوية ({pendingRequestsCount} بانتظار الموافقة)
            </h2>
            <span className="text-xs text-zinc-400">
              تأكد من استلام الدفع الخارجي ثم اضغط موافقة لتفعيل التاج فورًا
            </span>
          </div>

          {vipRequests.length === 0 ? (
            <div className="p-8 text-center bg-[#0A0A0A] rounded-3xl border border-zinc-800 text-zinc-400">
              لا توجد طلبات اشتراك معلقة حاليًا.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vipRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                    req.status === 'pending'
                      ? 'bg-[#0E0C0A] border-amber-500/40 shadow-xl'
                      : 'bg-[#0A0A0A] border-zinc-800 opacity-60'
                  }`}
                >
                  <div>
                    {/* User & Requested Tier */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <AvatarWithFrame user={req.user} size="md" showCrown={true} />
                        <div>
                          <VIPName user={req.user} size="sm" />
                          <div className="text-xs text-zinc-400">@{req.user.username}</div>
                        </div>
                      </div>
                      <VIPBadge tier={req.requestedTier} size="md" />
                    </div>

                    {/* Request Details */}
                    <div className="p-3 bg-black/40 rounded-2xl space-y-1.5 text-xs text-zinc-300 border border-zinc-800/80 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">الباقة المطلوبة:</span>
                        <span className="font-bold text-amber-400">{VIP_CONFIGS[req.requestedTier].nameAr}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">المدة المطلوبة:</span>
                        <span className="font-bold text-zinc-100">{req.requestedDurationMonths} أشهر</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">طريقة التواصل:</span>
                        <span className="font-bold text-emerald-400 font-mono">{req.contactDetails} ({req.contactMethod})</span>
                      </div>
                      {req.paymentReference && (
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">مرجع الحوالة:</span>
                          <span className="font-mono text-yellow-300 font-bold">{req.paymentReference}</span>
                        </div>
                      )}
                      {req.notes && (
                        <div className="pt-1.5 border-t border-zinc-800 text-[11px] text-zinc-400">
                          "{req.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => onApproveVipRequest(req, req.requestedDurationMonths, req.requestedTier)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>موافقة وتفعيل VIP ({req.requestedDurationMonths} شهر)</span>
                      </button>
                      <button
                        onClick={() => onRejectVipRequest(req.id)}
                        className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold"
                        title="رفض الطلب"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-center text-emerald-400 py-1.5 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                      ✓ تم تفعيل العضوية وتحديث التاج
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 mb-1">إجمالي المستخدمين</div>
              <div className="text-2xl font-black text-white">{totalUsersCount}</div>
            </div>
            <div className="p-4 rounded-3xl bg-gradient-to-b from-amber-950/40 to-zinc-900 border border-amber-500/40">
              <div className="text-xs text-amber-300 mb-1">إجمالي مشتركي الـ VIP</div>
              <div className="text-2xl font-black text-amber-400">{totalActiveVips}</div>
            </div>
            <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 mb-1">الغرف الصوتية الحية</div>
              <div className="text-2xl font-black text-emerald-400">{rooms.length}</div>
            </div>
            <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400 mb-1">الطلبات المعلقة</div>
              <div className="text-2xl font-black text-yellow-400">{pendingRequestsCount}</div>
            </div>
          </div>

          {/* VIP Tiers Breakdown */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-black text-zinc-200">توزيع مشتركي رتب VIP:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-pink-500/40 text-center">
                <div className="text-xl font-black text-pink-300">{vipRoyalCount}</div>
                <div className="text-xs font-bold text-pink-200 mt-1">💎👑 VIP Royal</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-yellow-500/40 text-center">
                <div className="text-xl font-black text-yellow-400">{vipGoldCount}</div>
                <div className="text-xs font-bold text-amber-200 mt-1">👑 VIP Gold</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-400/40 text-center">
                <div className="text-xl font-black text-slate-200">{vipSilverCount}</div>
                <div className="text-xs font-bold text-slate-300 mt-1">🥈 VIP Silver</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-700/40 text-center">
                <div className="text-xl font-black text-amber-500">{vipBronzeCount}</div>
                <div className="text-xs font-bold text-amber-400 mt-1">🥉 VIP Bronze</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute top-3 right-3" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو المعرف..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pr-9 pl-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-xs text-zinc-400">
              عرض {filteredUsers.length} من أصل {users.length} مستخدم
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/60">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">رتبة VIP</th>
                  <th className="py-3 px-4">تاريخ الانتهاء</th>
                  <th className="py-3 px-4">المستوى</th>
                  <th className="py-3 px-4">الرصيد 🪙</th>
                  <th className="py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredUsers.map((user) => {
                  const isOwner = user.role === 'owner' || user.id === 'user_owner';
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${
                        isOwner ? 'bg-amber-950/20 hover:bg-amber-950/30 border-y border-amber-500/30' : 'hover:bg-zinc-900/40'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <AvatarWithFrame user={user} size="sm" showCrown={true} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <VIPName user={user} size="xs" />
                              {isOwner && (
                                <span className="px-2 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black">
                                  المالك 👑
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <VIPBadge tier={user.vipTier} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {user.vipExpiresAt
                          ? new Date(user.vipExpiresAt).toLocaleDateString('ar-SA')
                          : isOwner
                          ? 'دائم (غير محدود)'
                          : 'غير مفعل'}
                      </td>
                      <td className="py-3 px-4 font-bold text-yellow-400">Lv.{user.level}</td>
                      <td className="py-3 px-4 font-bold text-amber-300">{user.coins.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {isOwner && (
                            <button
                              onClick={() => setActiveTab('owner_profile')}
                              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black flex items-center gap-1 shadow-sm"
                            >
                              <Crown className="w-3 h-3" />
                              <span>تعديل المالك</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenUserEdit(user)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل الحساب والصورة</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Rooms Management */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-[#0A0A0A] border border-zinc-800">
            <div>
              <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                إدارة الغرف الصوتية النشطة وترقية الغرف المميزة ({rooms.length})
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                يمكنك ترقية أي غرفة لتصبح "غرفة مميزة ⭐" تظهر في الصدارة بإطار ملكي ذهبي وشارة رعاية الإدارة، أو تثبيتها بأعلى القائمة.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                ⭐ {rooms.filter((r) => r.isFeatured).length} غرف مميزة
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                📌 {rooms.filter((r) => r.isPinned).length} مثبتة
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const isFeatured = room.isFeatured;
              return (
                <div
                  key={room.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                    isFeatured
                      ? 'bg-gradient-to-b from-[#181305] via-[#0D0D10] to-[#0A0A0A] border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-zinc-900/80 border-zinc-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 truncate">
                        <h4 className="font-black text-zinc-100 text-sm truncate">{room.title}</h4>
                        {isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black flex items-center gap-1 shadow-sm shrink-0">
                            <Sparkles className="w-3 h-3 fill-black" />
                            غرفة مميزة برعاية الإدارة 👑
                          </span>
                        )}
                      </div>
                      {room.isPinned && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0">
                          📌 مثبتة
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{room.description}</p>

                    <div className="text-xs text-zinc-400 mb-3 flex items-center gap-2">
                      <span>المضيف:</span>
                      <VIPName user={room.host} size="xs" />
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center gap-4 bg-black/40 p-2.5 rounded-2xl mb-3 border border-zinc-800/60">
                      <span>المتحدثون: {room.seats.filter((s) => s.user).length}/{room.seats.length}</span>
                      <span>المستمعون: {room.listenersCount}</span>
                      <span className="capitalize">النوع: {room.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
                    {/* Featured Room Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextFeatured = !room.isFeatured;
                        onUpdateRoom(room.id, { isFeatured: nextFeatured });
                        if (nextFeatured) {
                          playSoundEffect('vip_fanfare');
                          confetti({
                            particleCount: 70,
                            spread: 70,
                            origin: { y: 0.6 },
                          });
                        } else {
                          playSoundEffect('bell');
                        }
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
                        isFeatured
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40'
                      }`}
                      title={isFeatured ? 'إلغاء تمييز الغرفة' : 'ترقية لتكون غرفة مميزة برعاية الإدارة'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isFeatured ? '⭐ غرفة مميزة (إلغاء)' : '⭐ ترقية إلى غرفة مميزة'}</span>
                    </button>

                    {/* Pin Toggle */}
                    <button
                      type="button"
                      onClick={() => onUpdateRoom(room.id, { isPinned: !room.isPinned })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
                        room.isPinned
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                      title="تثبيت بأعلى الرئيسية"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{room.isPinned ? 'مثبتة' : 'تثبيت'}</span>
                    </button>

                    {/* Delete Room */}
                    <button
                      type="button"
                      onClick={() => onDeleteRoom(room.id)}
                      className="py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-400 border border-rose-800/40 text-xs font-bold flex items-center gap-1"
                      title="إغلاق وحذف الغرفة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إغلاق</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Broadcast Announcements */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Bell className="w-5 h-5" />
            <h3>إرسال إشعار وتنبيه لجميع مستخدمي المنصة</h3>
          </div>
          <p className="text-xs text-zinc-400">
            سيظهر الإشعار لجميع الأعضاء والـ VIP في صفحة الإشعارات وبانرات التنبيهات الملكية.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">نوع الإشعار:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vip_promo', label: 'ترقية وعروض VIP 👑' },
                  { id: 'info', label: 'تنبيه إداري عام 📢' },
                  { id: 'system_update', label: 'تحديث منصة ⚡' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBroadcastType(t.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      broadcastType === t.id
                        ? 'border-amber-400 bg-amber-500 text-black font-black'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">عنوان الإشعار:</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="مثال: خصومات حصرية على باقات VIP الملكية هذا الأسبوع"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">نص الرسالة:</label>
              <textarea
                rows={4}
                required
                value={broadcastContent}
                onChange={(e) => setBroadcastContent(e.target.value)}
                placeholder="اكتب تفاصيل التنبيه هنا..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال البث لجميع المستخدمين</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Badges & Crowns config */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">الأوسمة والشارات الملكية المعتمدة</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_BADGES.map((badge) => (
              <div key={badge.id} className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${badge.color} text-2xl shadow`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">{badge.nameAr}</h4>
                  <p className="text-xs text-zinc-400">{badge.descriptionAr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-200">بلاغات المستخدمين ({reports.length})</h3>
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-500">
              لا توجد أي بلاغات حاليًا.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{rep.reason}</span>
                      <span className="text-zinc-500">({new Date(rep.createdAt).toLocaleDateString('ar-SA')})</span>
                    </div>
                    <p className="text-xs text-zinc-300 mb-1">تفاصيل: {rep.details}</p>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                      <span>المبلّغ: {rep.reporter.nickname}</span>
                      {rep.reportedUser && <span>المبلّغ عنه: {rep.reportedUser.nickname}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onResolveReport(rep.id, 'ban_user')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      حظر المستخدم
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
                    >
                      تجاهل البلاغ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: Settings (Owner contact details & Admin Credentials) */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#0A0A0A] border border-zinc-800 space-y-6">
          
          {/* Security & Admin Credentials Overview */}
          <div className="p-4 rounded-2xl bg-[#050505] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                بيانات المالك والأدمن العام المعتمدة
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                موثق رسميًا
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-zinc-800 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500">البريد الإلكتروني المعتمد:</div>
                  <div className="font-mono font-bold text-zinc-200 text-[11px]">{ADMIN_SECURITY_CONFIG.adminEmail}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-zinc-800 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500">رمز الدخول للوحة التحكم:</div>
                  <div className="font-mono font-bold text-amber-400 text-[11px]">{ADMIN_SECURITY_CONFIG.adminPasscode}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              بيانات التواصل للاشتراكات اليدوية (تظهر للمستخدمين)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              هذه البيانات تظهر لجميع المستخدمين عند طلب ترقية حساباتهم للتواصل معك مباشرة.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">البريد الإلكتروني الرسمي:</label>
              <input
                type="text"
                disabled
                value={ADMIN_SECURITY_CONFIG.adminEmail}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">رقم واتساب المالك:</label>
              <input
                type="text"
                value={ownerWhatsApp}
                onChange={(e) => setOwnerWhatsApp(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">معرّف تيليجرام المالك:</label>
              <input
                type="text"
                value={ownerTelegram}
                onChange={(e) => setOwnerTelegram(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">تعليمات الدفع والتحويل الخارجي:</label>
              <textarea
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              onClick={() => {
                alert('تم حفظ إعدادات التواصل بنجاح!');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md cursor-pointer"
            >
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}

      {/* User Edit Modal (When clicked on user list) */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black">تعديل رتبة وصلاحيات العضو</h3>
              </div>
              <button onClick={() => setSelectedUserForEdit(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="mt-4 space-y-4 text-right">
              {/* User overview & Avatar Edit */}
              <div className="p-3 bg-[#050505] rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <AvatarWithFrame
                    user={{
                      ...selectedUserForEdit,
                      avatar: editCustomAvatarUrl.trim() || editAvatar || selectedUserForEdit.avatar,
                    }}
                    size="md"
                    showCrown={true}
                  />
                  <div>
                    <VIPName user={selectedUserForEdit} size="sm" />
                    <div className="text-xs text-zinc-400">@{selectedUserForEdit.username}</div>
                    {selectedUserForEdit.email && (
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">{selectedUserForEdit.email}</div>
                    )}
                  </div>
                </div>

                {/* Avatar change control */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      تعديل صورة هذا العضو:
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={userEditFileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditAvatar(res);
                              setEditCustomAvatarUrl('');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => userEditFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1 border border-zinc-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة جديدة</span>
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="url"
                        placeholder="أو ضع رابط صورة مباشر..."
                        value={editCustomAvatarUrl}
                        onChange={(e) => setEditCustomAvatarUrl(e.target.value)}
                        className="w-full text-[11px] bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nickname change */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">الاسم المميز (Nickname):</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* VIP Tier Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">مستوى الـ VIP:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'bronze', 'silver', 'gold', 'royal', 'mythic'] as VIPTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditVipTier(t)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between ${
                        editVipTier === t
                          ? 'border-amber-400 bg-amber-500 text-black font-black'
                          : 'border-zinc-800 bg-[#050505] text-zinc-300'
                      }`}
                    >
                      <span>{VIP_CONFIGS[t].nameAr}</span>
                      <span>{VIP_CONFIGS[t].crownIcon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration / Extension */}
              {editVipTier !== 'none' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">تمديد الاشتراك بـ:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { m: 1, label: '+شهر' },
                      { m: 3, label: '+3 أشهر' },
                      { m: 6, label: '+6 أشهر' },
                      { m: 12, label: '+سنة' },
                    ].map((item) => (
                      <button
                        key={item.m}
                        type="button"
                        onClick={() => setEditDurationMonths(item.m)}
                        className={`py-2 rounded-xl border text-xs font-bold ${
                          editDurationMonths === item.m
                            ? 'border-amber-400 bg-amber-500 text-black font-black'
                            : 'border-zinc-800 bg-[#050505] text-zinc-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified account toggle */}
              <div className="flex items-center justify-between p-3 bg-[#050505] rounded-2xl border border-zinc-800">
                <span className="text-xs font-bold text-zinc-200">علامة التوثيق الرسمية 🛡️</span>
                <input
                  type="checkbox"
                  checked={editVerified}
                  onChange={(e) => setEditVerified(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              {/* Adjust Coins */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">رصيد الكوينز 🪙:</label>
                <input
                  type="number"
                  value={editCoins}
                  onChange={(e) => setEditCoins(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تطبيق وحفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
