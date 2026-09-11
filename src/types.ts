export type VIPTier = 'none' | 'bronze' | 'silver' | 'gold' | 'royal' | 'mythic';

export type VIPThemeColorKey =
  | 'royal_gold'
  | 'crimson_ruby'
  | 'emerald_sovereign'
  | 'sapphire_ocean'
  | 'amethyst_cosmic'
  | 'neon_cyber_cyan'
  | 'sunset_amber'
  | 'platinum_silver';

export type UserRole = 'user' | 'moderator' | 'admin' | 'owner';

export type RoomType = 'public' | 'private' | 'vip';

export type RoomCategory = 'chat' | 'music' | 'poetry' | 'gaming' | 'culture' | 'vip_lounge';

export interface VIPConfig {
  tier: VIPTier;
  nameAr: string;
  nameEn: string;
  crownIcon: string;
  nameColorClass: string;
  borderGlowClass: string;
  badgeBg: string;
  frameStyle: 'none' | 'bronze_falcon' | 'silver_wolf' | 'gold_eagle' | 'royal_lion' | 'mythic_sovereign' | 'royal_golden_purple_bronze' | 'royal_golden_purple_silver' | 'royal_golden_purple_gold' | 'royal_golden_purple_lion' | 'royal_golden_purple_mythic';
  perks: string[];
  priceDescriptionAr: string;
  priceDescriptionEn: string;
  levelMultiplier: number;
}

export interface UserBadge {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  descriptionAr: string;
  color: string;
  unlockedAt?: string;
}

export interface Gift {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  coins: number;
  animationType:
    | 'sparkle'
    | 'rain'
    | 'royal_banner'
    | 'fireworks'
    | 'supercar'
    | 'falcon'
    | 'dragon'
    | 'swords'
    | 'horse'
    | 'yacht'
    | 'galaxy'
    | 'jet'
    | 'crown_burst'
    | 'dallah_pour'
    | 'rose_shower'
    | 'phoenix'
    | 'rocket'
    | 'treasure_chest'
    | 'diamond_rain'
    | 'golden_throne'
    | 'emerald_burst';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  vipTier: VIPTier;
  vipExpiresAt: string | null; // ISO string or null
  isVipActive: boolean;
  country: {
    code: string;
    nameAr: string;
    nameEn: string;
    flag: string;
  };
  level: number;
  xp: number;
  bio: string;
  status: string;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
  receivedGiftsCount: number;
  totalGiftsValue: number;
  badges: UserBadge[];
  coins: number;
  email?: string;
  passcode?: string;
  isBanned?: boolean;
  customNameColor?: string;
  customFrameUrl?: string;
  themeColor?: VIPThemeColorKey;
  verified?: boolean;
  verificationType?: 'gold' | 'blue';
}

export interface RoomSeat {
  seatIndex: number;
  user: UserProfile | null;
  isMuted: boolean;
  isLocked: boolean;
  isSpeaking?: boolean;
  audioLevel?: number; // 0 to 100 for visualizer
}

export interface ChatMessage {
  id: string;
  roomId?: string;
  sender: UserProfile;
  content: string;
  type: 'text' | 'gift' | 'system' | 'vip_entry';
  giftData?: {
    gift: Gift;
    count: number;
    receiverName: string;
  };
  timestamp: string;
}

export interface VoiceRoom {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: RoomCategory;
  type: RoomType;
  minVipTier?: VIPTier;
  host: UserProfile;
  moderators: string[]; // User IDs
  seats: RoomSeat[];
  listenersCount: number;
  listeners: UserProfile[];
  isPinned?: boolean;
  isFeatured?: boolean; // ترقية الغرفة لتكون مميزة برعاية الإدارة
  isLive: boolean;
  createdAt: string;
  tags: string[];
  backgroundTheme: string;
  cardGradient?: string; // تدرج لون الغلاف (Gradient) لبطاقة الغرفة
  ratings?: Record<string, number>; // معرف المستخدم -> التقييم من 1 إلى 5
  averageRating?: number; // متوسط تقييم الغرفة بالنجوم
  totalRatingsCount?: number; // إجمالي عدد المقيمين
}

export interface VIPSubscriptionRequest {
  id: string;
  userId: string;
  user: UserProfile;
  requestedTier: VIPTier;
  requestedDurationMonths: number;
  contactMethod: 'whatsapp' | 'telegram' | 'phone';
  contactDetails: string;
  notes: string;
  paymentReference?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface ModerationReport {
  id: string;
  reporter: UserProfile;
  reportedUser?: UserProfile;
  reportedRoomId?: string;
  roomTitle?: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface SystemAnnouncement {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  type: 'info' | 'vip_promo' | 'system_update' | 'event';
  createdAt: string;
  isPinned?: boolean;
}

export type ActiveTab = 'rooms' | 'vip_club' | 'top_users' | 'direct_messages' | 'my_profile';

export type DeviceViewMode = 'responsive' | 'mobile_shell';

export interface OwnerContactInfo {
  whatsappNumber: string;
  whatsappLink: string;
  telegramHandle: string;
  telegramLink: string;
  email: string;
  phone: string;
  customInstructionsAr: string;
  customInstructionsEn?: string;
  supportHours?: string;
  isActive?: boolean;
}
