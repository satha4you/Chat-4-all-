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
  OwnerContactInfo,
  PushNotification,
  PushNotificationColor,
  Gift as GiftType,
} from '../../types';
import {
  VIP_CONFIGS,
  INITIAL_BADGES,
  INITIAL_GIFTS,
  AVAILABLE_LOCAL_GIFT_ASSETS,
  OWNER_CONTACT_INFO,
  ADMIN_SECURITY_CONFIG,
  ARAB_COUNTRIES,
  ROYAL_SAMPLE_AVATARS,
} from '../../data/initialData';
import { Gift3DIcon } from '../common/Gift3DIcon';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { VIPBadge } from '../common/VIPBadge';
import { VIPName } from '../common/VIPName';
import { VerifiedBadge, VerificationType } from '../common/VerifiedBadge';
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
  Phone,
  MessageCircle,
  ExternalLink,
  Globe,
  Ban,
  UserX,
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
  contactInfo?: OwnerContactInfo;
  gifts?: GiftType[];
  onUpdateGifts?: (updatedGifts: GiftType[]) => void;
  onUpdateContactInfo?: (newInfo: Partial<OwnerContactInfo>) => void;
  onUpdateUser: (userId: string, updates: Partial<UserProfile>) => void;
  onUpdateRoom: (roomId: string, updates: Partial<VoiceRoom>) => void;
  onDeleteRoom: (roomId: string) => void;
  onApproveVipRequest: (request: VIPSubscriptionRequest, durationMonths: number, tier: VIPTier) => void;
  onRejectVipRequest: (requestId: string, reason?: string) => void;
  onAddAnnouncement: (announcement: SystemAnnouncement) => void;
  onSendPushNotification?: (notification: PushNotification) => void;
  onResolveReport: (reportId: string, action: 'ban_user' | 'dismiss') => void;
  onDeleteUser?: (userId: string) => void;
  onBanUser?: (userId: string, isBanned: boolean) => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  rooms,
  vipRequests,
  reports,
  announcements,
  contactInfo = OWNER_CONTACT_INFO,
  gifts,
  onUpdateGifts,
  onUpdateContactInfo,
  onUpdateUser,
  onUpdateRoom,
  onDeleteRoom,
  onApproveVipRequest,
  onRejectVipRequest,
  onAddAnnouncement,
  onSendPushNotification,
  onResolveReport,
  onDeleteUser,
  onBanUser,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    'owner_profile' | 'vip_requests' | 'gifts' | 'overview' | 'users' | 'rooms' | 'badges' | 'broadcast' | 'reports' | 'settings'
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
  const [ownerVerificationType, setOwnerVerificationType] = useState<VerificationType>(
    ownerUser.verificationType || 'gold'
  );
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
    setOwnerVerificationType(ownerUser.verificationType || 'gold');
  }, [ownerUser.id, ownerUser.avatar, ownerUser.nickname, ownerUser.coins, ownerUser.vipTier, ownerUser.verificationType]);

  // User management state (for all users)
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [editIsBanned, setEditIsBanned] = useState<boolean>(false);
  const [editVipTier, setEditVipTier] = useState<VIPTier>('gold');
  const [editDurationMonths, setEditDurationMonths] = useState<number>(3);
  const [editIsVipActive, setEditIsVipActive] = useState<boolean>(true);
  const [editVerified, setEditVerified] = useState<boolean>(false);
  const [editVerificationType, setEditVerificationType] = useState<VerificationType>('blue');
  const [editCoins, setEditCoins] = useState<number>(0);
  const [editNickname, setEditNickname] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [editCustomAvatarUrl, setEditCustomAvatarUrl] = useState<string>('');
  const userEditFileInputRef = useRef<HTMLInputElement | null>(null);

  // Broadcast & Instant Push Notification state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'vip_promo' | 'system_update'>('vip_promo');
  const [pushColorScheme, setPushColorScheme] = useState<PushNotificationColor>('royal_gold');
  const [pushDuration, setPushDuration] = useState<number>(8);
  const [sendAsPushToast, setSendAsPushToast] = useState<boolean>(true);
  const [pushSentSuccess, setPushSentSuccess] = useState<boolean>(false);

  // Gifts management state
  const activeGifts = gifts && gifts.length > 0 ? gifts : INITIAL_GIFTS;
  const [giftSearchQuery, setGiftSearchQuery] = useState('');
  const [editingGift, setEditingGift] = useState<GiftType | null>(null);
  const [giftEditNameAr, setGiftEditNameAr] = useState('');
  const [giftEditNameEn, setGiftEditNameEn] = useState('');
  const [giftEditCoins, setGiftEditCoins] = useState<number>(100);
  const [giftEditRarity, setGiftEditRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [giftSavedNotice, setGiftSavedNotice] = useState<string | null>(null);

  const handleStartEditGift = (gift: GiftType) => {
    setEditingGift(gift);
    setGiftEditNameAr(gift.nameAr);
    setGiftEditNameEn(gift.nameEn || '');
    setGiftEditCoins(gift.coins);
    setGiftEditRarity(gift.rarity);
  };

  const handleSaveGiftEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGift) return;

    const updatedList = activeGifts.map((g) => {
      if (g.id === editingGift.id) {
        return {
          ...g,
          nameAr: giftEditNameAr.trim() || g.nameAr,
          nameEn: giftEditNameEn.trim() || g.nameEn,
          coins: Math.max(1, Number(giftEditCoins) || 1),
          rarity: giftEditRarity,
        };
      }
      return g;
    });

    if (onUpdateGifts) {
      onUpdateGifts(updatedList);
    }
    playSoundEffect('vip_fanfare');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setGiftSavedNotice(`تم بنجاح تحديث وتثبيت اسم وسعر الهدية (${giftEditNameAr.trim() || editingGift.nameAr})!`);
    setTimeout(() => setGiftSavedNotice(null), 3500);
    setEditingGift(null);
  };

  const handleResetGiftsToDefault = () => {
    if (window.confirm('هل تريد استعادة جميع أسماء وأسعار الهدايا إلى الوضع الافتراضي الأصلي؟')) {
      if (onUpdateGifts) {
        onUpdateGifts(INITIAL_GIFTS);
      }
      playSoundEffect('bell');
      setGiftSavedNotice('تمت استعادة الهدايا إلى الأسماء والأسعار الافتراضية بنجاح.');
      setTimeout(() => setGiftSavedNotice(null), 3500);
    }
  };

  // Contact settings state
  const [ownerWhatsApp, setOwnerWhatsApp] = useState(contactInfo.whatsappNumber || OWNER_CONTACT_INFO.whatsappNumber);
  const [ownerTelegram, setOwnerTelegram] = useState(contactInfo.telegramHandle || OWNER_CONTACT_INFO.telegramHandle);
  const [ownerEmail, setOwnerEmail] = useState(contactInfo.email || OWNER_CONTACT_INFO.email);
  const [ownerPhone, setOwnerPhone] = useState(contactInfo.phone || OWNER_CONTACT_INFO.phone);
  const [ownerSupportHours, setOwnerSupportHours] = useState(contactInfo.supportHours || OWNER_CONTACT_INFO.supportHours || '');
  const [customInstructions, setCustomInstructions] = useState(contactInfo.customInstructionsAr || OWNER_CONTACT_INFO.customInstructionsAr);
  const [contactSavedSuccess, setContactSavedSuccess] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setOwnerWhatsApp(contactInfo.whatsappNumber || '');
      setOwnerTelegram(contactInfo.telegramHandle || '');
      setOwnerEmail(contactInfo.email || '');
      setOwnerPhone(contactInfo.phone || '');
      setOwnerSupportHours(contactInfo.supportHours || '');
      setCustomInstructions(contactInfo.customInstructionsAr || '');
    }
  }, [contactInfo]);

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
    setEditIsBanned(user.isBanned || false);
    setEditVipTier(user.vipTier);
    setEditIsVipActive(user.isVipActive);
    setEditVerified(user.verified || false);
    setEditVerificationType(user.verificationType || (user.role === 'owner' ? 'gold' : 'blue'));
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
      verificationType: editVerificationType,
      coins: editCoins,
      isBanned: editIsBanned,
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
      verificationType: ownerVerificationType,
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

    // If instant push notification is enabled (default true)
    if (sendAsPushToast && onSendPushNotification) {
      const newPush: PushNotification = {
        id: 'push_' + Date.now(),
        title: broadcastTitle.trim(),
        message: broadcastContent.trim(),
        colorScheme: pushColorScheme,
        timestamp: new Date().toISOString(),
        senderName: currentUser.nickname || currentUser.username || 'المالك أحمد النهر',
        senderRole: 'المالك 👑',
        senderAvatar: currentUser.avatar,
        durationSeconds: pushDuration,
      };
      onSendPushNotification(newPush);
    }

    playSoundEffect('bell');
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.3 }
    });

    setPushSentSuccess(true);
    setTimeout(() => setPushSentSuccess(false), 5000);

    setBroadcastTitle('');
    setBroadcastContent('');
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
                <span className="text-[10px] text-emerald-400 font-bold">(المالك أحمد النهر)</span>
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
            onClick={() => setActiveTab('settings')}
            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="تعديل معلومات التواصل الرسمية في الموقع"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">تعديل التواصل 📱</span>
          </button>
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
          { id: 'gifts', label: '🎁 إدارة وتعديل الهدايا والأسعار', highlight: true, count: activeGifts.length },
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
                    verificationType: ownerVerificationType,
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
                  verified={ownerVerified}
                  verificationType={ownerVerificationType}
                  role="owner"
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
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border shadow-sm ${
                      ownerVerificationType === 'gold'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                        : 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    }`}
                  >
                    <VerifiedBadge type={ownerVerificationType} size="xs" />
                    <span>{ownerVerificationType === 'gold' ? 'توثيق ذهبي ملكي ⭐' : 'توثيق أزرق معتمد 🛡️'}</span>
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
                    placeholder="مثال: المالك أحمد النهر"
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

              {/* Verified Badge Controls for Owner */}
              <div className="p-4 bg-[#050505] rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>توثيق حساب المالك الرسمي</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      إظهار شارة التوثيق الرسمية بجانب اسم المالك في كافة الغرف والمحادثات
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={ownerVerified}
                    onChange={(e) => setOwnerVerified(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                {ownerVerified && (
                  <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-300">
                      اختر لون ونوع شارة توثيق حساب المالك:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Gold Option */}
                      <button
                        type="button"
                        onClick={() => setOwnerVerificationType('gold')}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          ownerVerificationType === 'gold'
                            ? 'bg-amber-500/15 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-white'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <VerifiedBadge type="gold" size="md" />
                          <div>
                            <div className="text-xs font-black text-amber-300">توثيق ذهبي ملكي ⭐</div>
                            <div className="text-[10px] text-zinc-400">الافتراضي والمعتمد لحساب المالك</div>
                          </div>
                        </div>
                        {ownerVerificationType === 'gold' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                        )}
                      </button>

                      {/* Blue Option */}
                      <button
                        type="button"
                        onClick={() => setOwnerVerificationType('blue')}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          ownerVerificationType === 'blue'
                            ? 'bg-sky-500/15 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.2)] text-white'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <VerifiedBadge type="blue" size="md" />
                          <div>
                            <div className="text-xs font-black text-sky-300">توثيق أزرق معتمد 🛡️</div>
                            <div className="text-[10px] text-zinc-400">الشارة الزرقاء المعتمدة</div>
                          </div>
                        </div>
                        {ownerVerificationType === 'blue' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
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

      {/* TAB: Gifts Management */}
      {activeTab === 'gifts' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border border-amber-500/30">
            <div>
              <h2 className="text-base font-black text-amber-300 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                التحكم بالهدايا والأسعار الملكية ({activeGifts.length} هدية متوفرة)
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                بصفتك مالك المنصة، يمكنك تغيير مسميات وأسعار وتصنيفات جميع الهدايا وحفظها فورياً في المنظومة.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetGiftsToDefault}
              className="px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-bold border border-zinc-700 transition-colors shrink-0"
            >
              استعادة الافتراضيات ↺
            </button>
          </div>

          {/* Success Notice */}
          {giftSavedNotice && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{giftSavedNotice}</span>
            </div>
          )}

          {/* Search filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث عن هدية بالاسم أو التصنيف..."
                value={giftSearchQuery}
                onChange={(e) => setGiftSearchQuery(e.target.value)}
                className="w-full bg-[#0E0E12] border border-zinc-800 focus:border-amber-500/80 rounded-2xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gifts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeGifts
              .filter((g) => {
                const q = giftSearchQuery.toLowerCase();
                return (
                  g.nameAr.toLowerCase().includes(q) ||
                  g.nameEn.toLowerCase().includes(q) ||
                  g.id.toLowerCase().includes(q) ||
                  g.rarity.toLowerCase().includes(q)
                );
              })
              .map((gift) => {
                const isLegendary = gift.rarity === 'legendary';
                const isEpic = gift.rarity === 'epic';
                const isRare = gift.rarity === 'rare';

                return (
                  <div
                    key={gift.id}
                    className={`p-4 rounded-3xl border flex flex-col justify-between transition-all relative group ${
                      isLegendary
                        ? 'bg-gradient-to-b from-amber-950/30 to-zinc-950 border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : isEpic
                        ? 'bg-gradient-to-b from-purple-950/20 to-zinc-950 border-purple-500/30'
                        : isRare
                        ? 'bg-gradient-to-b from-blue-950/20 to-zinc-950 border-blue-500/30'
                        : 'bg-[#0E0E12] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Top Rarity Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isLegendary
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black'
                            : isEpic
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : isRare
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {isLegendary
                          ? '👑 أسطورية'
                          : isEpic
                          ? '🌟 فاخرة وملحمية'
                          : isRare
                          ? '💎 نادرة'
                          : '✨ شائعة'}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">#{gift.id.replace('gift_', '')}</span>
                    </div>

                    {/* Icon preview */}
                    <div className="my-2 flex flex-col items-center justify-center p-3 bg-black/40 rounded-2xl border border-zinc-800/60">
                      <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                        {gift.icon && (gift.icon.startsWith('/') || gift.icon.startsWith('http') || gift.icon.startsWith('data:')) ? (
                          <img src={gift.icon} alt={gift.nameAr} className="w-full h-full object-contain" />
                        ) : (
                          <Gift3DIcon giftId={gift.id} icon={gift.icon} size="lg" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <h4 className="text-sm font-black text-zinc-100">{gift.nameAr}</h4>
                        <span className="text-[11px] text-zinc-400">{gift.nameEn}</span>
                      </div>
                    </div>

                    {/* Current Price & Action */}
                    <div className="mt-2 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-black text-sm">{gift.coins}</span>
                        <span className="text-[11px] text-zinc-400">🪙 كوينز</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEditGift(gift)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل السعر والاسم</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Edit Gift Modal */}
          {editingGift && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md bg-[#121218] border border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-5 text-zinc-100 animate-scaleUp">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-amber-300">تعديل الهدية: {editingGift.nameAr}</h3>
                      <p className="text-[11px] text-zinc-400">تغيير السعر بالكوينز والمسمى الرسمي</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingGift(null)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Gift Visual Preview */}
                <div className="flex items-center justify-center p-4 bg-black/40 rounded-2xl border border-zinc-800/80 gap-4">
                  <div className="w-16 h-16 flex items-center justify-center drop-shadow-lg">
                    {editingGift.icon && (editingGift.icon.startsWith('/') || editingGift.icon.startsWith('http') || editingGift.icon.startsWith('data:')) ? (
                      <img src={editingGift.icon} alt={editingGift.nameAr} className="w-full h-full object-contain" />
                    ) : (
                      <Gift3DIcon giftId={editingGift.id} icon={editingGift.icon} size="lg" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-300">المعاينة الحالية:</div>
                    <div className="text-sm font-bold text-zinc-100">{giftEditNameAr || editingGift.nameAr}</div>
                    <div className="text-xs text-amber-400 font-mono mt-0.5">{giftEditCoins} كوينز 🪙</div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveGiftEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      اسم الهدية بالعربية (المعروض للمستخدمين):
                    </label>
                    <input
                      type="text"
                      required
                      value={giftEditNameAr}
                      onChange={(e) => setGiftEditNameAr(e.target.value)}
                      placeholder="مثال: يخت الملياردير الذهبي"
                      className="w-full bg-[#08080C] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      اسم الهدية بالإنجليزية (اختياري):
                    </label>
                    <input
                      type="text"
                      value={giftEditNameEn}
                      onChange={(e) => setGiftEditNameEn(e.target.value)}
                      placeholder="مثال: Royal Billionaire Yacht"
                      className="w-full bg-[#08080C] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        سعر الهدية (بالكوينز 🪙):
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={giftEditCoins}
                        onChange={(e) => setGiftEditCoins(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-[#08080C] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        درجة الندرة / الفخامة:
                      </label>
                      <select
                        value={giftEditRarity}
                        onChange={(e) => setGiftEditRarity(e.target.value as any)}
                        className="w-full bg-[#08080C] border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none"
                      >
                        <option value="common">✨ شائعة</option>
                        <option value="rare">💎 نادرة</option>
                        <option value="epic">🌟 فاخرة وملحمية</option>
                        <option value="legendary">👑 أسطورية ملوكية</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditingGift(null)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-95 text-black text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ وتثبيت التعديل 💾</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">رتبة VIP</th>
                  <th className="py-3 px-4">التوثيق</th>
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
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black shadow-sm">
                            <Ban className="w-3 h-3 text-rose-400" />
                            <span>محظور 🚫</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>نشط ✅</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <VIPBadge tier={user.vipTier} size="xs" />
                      </td>
                      <td className="py-3 px-4">
                        {user.verified ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
                              (user.verificationType || (isOwner ? 'gold' : 'blue')) === 'gold'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                                : 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                            }`}
                          >
                            <VerifiedBadge
                              type={user.verificationType || (isOwner ? 'gold' : 'blue')}
                              size="xs"
                            />
                            <span>
                              {(user.verificationType || (isOwner ? 'gold' : 'blue')) === 'gold'
                                ? 'ذهبي ⭐'
                                : 'أزرق 🛡️'}
                            </span>
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px] px-2 py-0.5 rounded-md bg-zinc-900/60 border border-zinc-800/60">
                            غير موثق
                          </span>
                        )}
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isOwner ? (
                            <button
                              onClick={() => setActiveTab('owner_profile')}
                              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black flex items-center gap-1 shadow-sm"
                            >
                              <Crown className="w-3 h-3" />
                              <span>تعديل المالك</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenUserEdit(user)}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1"
                                title="تعديل الحساب والصورة"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">تعديل</span>
                              </button>

                              {/* Ban / Unban Toggle Button */}
                              <button
                                onClick={() => {
                                  if (onBanUser) {
                                    onBanUser(user.id, !user.isBanned);
                                  } else {
                                    onUpdateUser(user.id, { isBanned: !user.isBanned });
                                  }
                                  playSoundEffect('bell');
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                                  user.isBanned
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                                }`}
                                title={user.isBanned ? 'فك الحظر عن المستخدم' : 'حظر المستخدم من المنصة'}
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>{user.isBanned ? 'فك الحظر' : 'حظر'}</span>
                              </button>

                              {/* Permanent Delete Button */}
                              <button
                                onClick={() => setUserToDelete(user)}
                                className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 text-xs font-bold flex items-center gap-1 transition-all"
                                title="حذف الحساب نهائياً من الموقع"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </>
                          )}
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

          {rooms.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/60 rounded-3xl border border-zinc-800 space-y-3">
              <Mic className="w-8 h-8 text-amber-400/60 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-300">لا توجد غرف صوتية نشطة حاليًا</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                تم تنظيف جميع الغرف التجريبية بالكامل. الغرف التي ينشئها المالك ستظهر هنا فورًا للإشراف، التثبيت، والترقية.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* TAB 5: Broadcast Announcements & Realtime Instant Push Notification */}
      {activeTab === 'broadcast' && (
        <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <Bell className="w-5 h-5 text-amber-400 animate-wiggle" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  إرسال إشعار فوري لجميع المتصلين (Push Notification)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  تنبيه مباشر يظهر أعلى شاشة جميع المستخدمين المتصلين في نفس اللحظة مع مؤثر صوتي وتدرج لوني فخم.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
              صلاحية المالك الملكي 👑
            </span>
          </div>

          {pushSentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>تم بث الإشعار بنجاح! ظهر الآن كرسالة منبثقة ملونة في أعلى الشاشة لجميع المستخدمين المتصلين.</span>
              </div>
              <button
                type="button"
                onClick={() => setPushSentSuccess(false)}
                className="text-emerald-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-5">
            {/* Color Scheme Selection for Push Toast */}
            <div>
              <label className="block text-xs font-black text-zinc-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>لون وتصميم الإشعار المنبثق أعلى الشاشة:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'royal_gold', label: 'ذهب ملكي', border: 'border-amber-400', bg: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-400' },
                  { id: 'emerald', label: 'زمرد فاخر', border: 'border-emerald-400', bg: 'bg-emerald-500/20 text-emerald-300', dot: 'bg-emerald-400' },
                  { id: 'crimson', label: 'ياقوت أحمر', border: 'border-rose-400', bg: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-400' },
                  { id: 'sapphire', label: 'أزرق ياقوتي', border: 'border-sky-400', bg: 'bg-sky-500/20 text-sky-300', dot: 'bg-sky-400' },
                  { id: 'violet', label: 'بنفسجي إمبراطوري', border: 'border-purple-400', bg: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-400' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPushColorScheme(c.id as PushNotificationColor)}
                    className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      pushColorScheme === c.id
                        ? `${c.border} ${c.bg} ring-2 ring-amber-400/50 scale-[1.03] shadow-md`
                        : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Category & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">نوع التصنيف:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'vip_promo', label: 'عروض VIP 👑' },
                    { id: 'info', label: 'تنبيه إداري 📢' },
                    { id: 'system_update', label: 'تحديث منصة ⚡' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBroadcastType(t.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all truncate text-center ${
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
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  مدة بقاء الإشعار المنبثق في أعلى الشاشة:
                </label>
                <select
                  value={pushDuration}
                  onChange={(e) => setPushDuration(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>5 ثوانٍ (سريع)</option>
                  <option value={8}>8 ثوانٍ (متوسط موصى به)</option>
                  <option value={12}>12 ثانية (طويل وهام)</option>
                  <option value={18}>18 ثانية (إعلان إداري مطول)</option>
                </select>
              </div>
            </div>

            {/* Notification Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                عنوان الإشعار (يظهر بالخط العريض أعلى الشاشة):
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="مثال: تنبيه هام من المالك لجميع أعضاء ديوان الصوت 👑"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                نص الرسالة المنبثقة:
              </label>
              <textarea
                rows={3}
                required
                value={broadcastContent}
                onChange={(e) => setBroadcastContent(e.target.value)}
                placeholder="مثال: نرحب بجميع الأعضاء الجدد، تم فتح مسابقة الغرف الصوتية وتوزيع جوائز VIP الليلة في تمام الساعة 9 مساءً!"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* Live Preview of Push Notification */}
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>معاينة الإشعار المنبثق كما سيظهر فورًا للمستخدمين:</span>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 bg-gradient-to-r ${
                  pushColorScheme === 'royal_gold'
                    ? 'from-[#2A1B04] to-[#120B02] border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/10'
                    : pushColorScheme === 'emerald'
                    ? 'from-[#032314] to-[#010E08] border-emerald-400/60 text-emerald-200 shadow-lg shadow-emerald-500/10'
                    : pushColorScheme === 'crimson'
                    ? 'from-[#29050A] to-[#110104] border-rose-500/60 text-rose-200 shadow-lg shadow-rose-500/10'
                    : pushColorScheme === 'sapphire'
                    ? 'from-[#04162E] to-[#010914] border-sky-400/60 text-sky-200 shadow-lg shadow-sky-500/10'
                    : 'from-[#20052B] to-[#0D0112] border-purple-400/60 text-purple-200 shadow-lg shadow-purple-500/10'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-500 text-black font-black shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-0.5">
                    <span className="font-bold text-amber-300">تنبيه فوري من المالك • {currentUser.nickname || 'المالك'}</span>
                    <span>الآن</span>
                  </div>
                  <h4 className="text-xs font-black text-white">
                    {broadcastTitle.trim() || 'عنوان الإشعار المنبثق...'}
                  </h4>
                  <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">
                    {broadcastContent.trim() || 'تفاصيل نص التنبيه الفوري للمستخدمين...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4 text-black stroke-[2.5]" />
              <span>إرسال الإشعار المنبثق لجميع المستخدمين المتصلين الآن 🚀</span>
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
                بيانات المالك أحمد النهر المعتمدة
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

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                بيانات التواصل الرسمية لطلبات الترقية (تحكم المالك)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                هذه البيانات تظهر للأعضاء في متجر VIP، ونافذة التواصل مع المالك لطلب الترقية اليدوية أو الاستفسارات.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>قابلة للتعديل والحفظ الفوري</span>
            </span>
          </div>

          {contactSavedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>تم حفظ وتحديث ملف التواصل مع المالك بنجاح! تم نشر التعديلات لجميع الأعضاء.</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">حُفظت محليًا وعالميًا</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>البريد الإلكتروني الرسمي للمالك:</span>
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Satha4you@gmail.com"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>رقم واتساب المالك المباشر (مع الرمز الدولي):</span>
                </label>
                <input
                  type="text"
                  value={ownerWhatsApp}
                  onChange={(e) => setOwnerWhatsApp(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>معرّف تيليجرام المالك:</span>
                </label>
                <input
                  type="text"
                  value={ownerTelegram}
                  onChange={(e) => setOwnerTelegram(e.target.value)}
                  placeholder="@RoyalVoiceOwner"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>رقم الهاتف المباشر للاتصال (اختياري):</span>
                </label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>أوقات وساعات التواجد والرد على الطلبات:</span>
              </label>
              <input
                type="text"
                value={ownerSupportHours}
                onChange={(e) => setOwnerSupportHours(e.target.value)}
                placeholder="متاح يوميًا من الساعة 10:00 صباحًا حتى 02:00 بعد منتصف الليل"
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>تعليمات وتوجيهات طلب ترقية VIP وطرق الدفع الخارجي:</span>
              </label>
              <textarea
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="يرجى التواصل عبر البريد الرسمي أو الواتساب مع ذكر اسم المستخدم ونوع باقة VIP المطلوبة..."
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* Quick Preview Box */}
            <div className="p-3.5 rounded-2xl bg-[#08090E] border border-zinc-800/80 space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                <span>معاينة ما يراه المستخدم في نافذة التواصل:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-mono">
                  ✉️ {ownerEmail || 'Satha4you@gmail.com'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono">
                  💬 {ownerWhatsApp || 'لا يوجد'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-sky-400 font-mono">
                  ✈️ {ownerTelegram || 'لا يوجد'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const cleanWa = ownerWhatsApp.replace(/[^0-9]/g, '');
                  const cleanTg = ownerTelegram.replace('@', '');
                  const updated: OwnerContactInfo = {
                    email: ownerEmail.trim() || 'Satha4you@gmail.com',
                    whatsappNumber: ownerWhatsApp.trim(),
                    whatsappLink: cleanWa ? `https://wa.me/${cleanWa}` : '',
                    telegramHandle: ownerTelegram.trim().startsWith('@') ? ownerTelegram.trim() : `@${ownerTelegram.trim()}`,
                    telegramLink: cleanTg ? `https://t.me/${cleanTg}` : '',
                    phone: ownerPhone.trim() || ownerWhatsApp.trim(),
                    supportHours: ownerSupportHours.trim(),
                    customInstructionsAr: customInstructions.trim(),
                    customInstructionsEn: contactInfo.customInstructionsEn,
                    isActive: true,
                  };

                  if (onUpdateContactInfo) {
                    onUpdateContactInfo(updated);
                  }
                  
                  setContactSavedSuccess(true);
                  playSoundEffect('vip_fanfare');
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 }
                  });

                  setTimeout(() => {
                    setContactSavedSuccess(false);
                  }, 4000);
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>حفظ وتعميم معلومات التواصل رسميًا</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOwnerWhatsApp(OWNER_CONTACT_INFO.whatsappNumber);
                  setOwnerTelegram(OWNER_CONTACT_INFO.telegramHandle);
                  setOwnerEmail(OWNER_CONTACT_INFO.email);
                  setOwnerPhone(OWNER_CONTACT_INFO.phone);
                  setOwnerSupportHours(OWNER_CONTACT_INFO.supportHours || '');
                  setCustomInstructions(OWNER_CONTACT_INFO.customInstructionsAr);
                  if (onUpdateContactInfo) {
                    onUpdateContactInfo(OWNER_CONTACT_INFO);
                  }
                  playSoundEffect('bell');
                }}
                className="px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="استعادة القيم الافتراضية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>
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

              {/* Verified account controls */}
              <div className="p-3.5 bg-[#050505] rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">توثيق الحساب الرسمي</span>
                    <span className="text-[11px] text-zinc-400">تفعيل شارة التوثيق المعتمدة للمستخدم</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editVerified}
                    onChange={(e) => setEditVerified(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {editVerified && (
                  <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-300">
                      اختر لون ونوع شارة التوثيق:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Gold Option */}
                      <button
                        type="button"
                        onClick={() => setEditVerificationType('gold')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          editVerificationType === 'gold'
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <VerifiedBadge type="gold" size="sm" />
                          <div>
                            <div className="text-xs font-black text-amber-300">ذهبي ملكي ⭐</div>
                            <div className="text-[9px] text-zinc-400">شارة ذهبية فاخرة</div>
                          </div>
                        </div>
                        {editVerificationType === 'gold' && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </button>

                      {/* Blue Option */}
                      <button
                        type="button"
                        onClick={() => setEditVerificationType('blue')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          editVerificationType === 'blue'
                            ? 'bg-sky-500/20 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <VerifiedBadge type="blue" size="sm" />
                          <div>
                            <div className="text-xs font-black text-sky-300">أزرق معتمد 🛡️</div>
                            <div className="text-[9px] text-zinc-400">شارة زرقاء رسمية</div>
                          </div>
                        </div>
                        {editVerificationType === 'blue' && (
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                        )}
                      </button>
                    </div>

                    {/* Preview of user with the badge */}
                    <div className="mt-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">المعاينة مع الاسم:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-100">{editNickname || selectedUserForEdit.nickname}</span>
                        <VerifiedBadge type={editVerificationType} size="xs" />
                      </div>
                    </div>
                  </div>
                )}
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

              {/* Ban Toggle inside edit modal */}
              {selectedUserForEdit.role !== 'owner' && selectedUserForEdit.id !== 'user_owner' && (
                <div className="p-3 bg-[#050505] rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ban className={`w-4 h-4 ${editIsBanned ? 'text-rose-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-zinc-200">حظر العضو من الموقع</div>
                      <div className="text-[10px] text-zinc-400">منعه من دخول الغرف والمحادثات الصوتية</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditIsBanned(!editIsBanned)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      editIsBanned
                        ? 'bg-rose-500/30 border-rose-500 text-rose-200 shadow-sm'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {editIsBanned ? '🚫 محظور حالياً' : '✅ نشط وغير محظور'}
                  </button>
                </div>
              )}

              {/* Danger Zone: Delete user */}
              {selectedUserForEdit.role !== 'owner' && selectedUserForEdit.id !== 'user_owner' && (
                <div className="pt-2 border-t border-red-950/60 flex items-center justify-between">
                  <div className="text-[11px] text-red-400">إجراء المالك النهائي:</div>
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUserForEdit;
                      setSelectedUserForEdit(null);
                      setUserToDelete(u);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/60 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف هذا الحساب نهائياً</span>
                  </button>
                </div>
              )}

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

      {/* User Deletion Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0C0D14] border border-red-600/50 rounded-3xl p-6 shadow-2xl text-zinc-100 overflow-hidden text-right">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">تأكيد حذف الحساب نهائياً</h3>
                <p className="text-xs text-red-300/80">إجراء المالك - مسح تام من المنصة</p>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <AvatarWithFrame user={userToDelete} size="md" />
                <div>
                  <div className="font-bold text-sm text-zinc-100">{userToDelete.nickname}</div>
                  <div className="text-xs text-zinc-400 font-mono">@{userToDelete.username}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">معرف الحساب: {userToDelete.id}</div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-red-950/20 p-3 rounded-xl border border-red-900/30">
                هل أنت متأكد تماماً من رغبتك في حذف هذا الحساب نهائياً؟ سيتم مسح بيانات المستخدم تماماً، وطرده من أي غرفة نشطة، ولن يتمكن من الدخول بهذا الحساب مرة أخرى.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
              >
                إلغاء التراجع
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteUser) {
                    onDeleteUser(userToDelete.id);
                  }
                  playSoundEffect('bell');
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-950 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>نعم، احذف الحساب نهائياً</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
