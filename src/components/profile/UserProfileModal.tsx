import React, { useState } from 'react';
import { UserProfile, VIPTier, Gift, VIPThemeColorKey } from '../../types';
import { VIP_CONFIGS, INITIAL_GIFTS } from '../../data/initialData';
import { LuxuryGamingProfile } from './LuxuryGamingProfile';
import { RealisticCrown } from '../common/RealisticCrown';
import { 
  X, 
  MapPin, 
  Calendar, 
  Award, 
  Gift as GiftIcon, 
  Users, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  Sparkles, 
  Crown, 
  Edit3,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../utils/soundEffects';

interface UserProfileModalProps {
  user: UserProfile | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onFollowToggle?: (userId: string) => void;
  onSendGift?: (receiver: UserProfile, gift: Gift) => void;
  onOpenEditProfile?: (targetUser?: UserProfile) => void;
  onOpenDirectChat?: (user: UserProfile) => void;
  onOpenAdminEdit?: (user: UserProfile) => void;
  onLogout?: () => void;
  onOpenVipStore?: () => void;
  onOpenOwnerContact?: () => void;
  onEditContactInfo?: () => void;
  onUpdateThemeColor?: (colorKey: VIPThemeColorKey) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  currentUser,
  isOpen,
  onClose,
  onFollowToggle,
  onSendGift,
  onOpenEditProfile,
  onOpenDirectChat,
  onOpenAdminEdit,
  onLogout,
  onOpenVipStore,
  onOpenOwnerContact,
  onEditContactInfo,
  onUpdateThemeColor,
}) => {
  if (!isOpen || !user) return null;

  const isSelf = currentUser.id === user.id;
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'owner';
  const isOwner = currentUser.role === 'owner' || currentUser.id === 'user_owner';
  
  // Interactive Tier Preview State
  const [previewTier, setPreviewTier] = useState<VIPTier | null>(null);
  const effectiveTier: VIPTier = previewTier || user.vipTier;

  const [activeTab, setActiveTab] = useState<'overview' | 'gifts' | 'badges'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollowToggle?.(user.id);
    playSoundEffect('bell');
  };

  const handleQuickGift = (gift: Gift) => {
    if (currentUser.coins < gift.coins) {
      alert('رصيدك من الذهب لا يكفي لإرسال هذه الهدية! يمكنك الشحن من متجر VIP.');
      return;
    }
    onSendGift?.(user, gift);
    setShowGiftSelector(false);
    playSoundEffect('gift_sparkle');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const handleSelectTierPreview = (tierKey: VIPTier) => {
    setPreviewTier(tierKey);
    playSoundEffect('vip_fanfare');
    if (tierKey === 'mythic' || tierKey === 'royal') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 }
      });
    }
  };

  // Dynamic modal border glow based on tier
  const getModalBorderClass = () => {
    switch (effectiveTier) {
      case 'mythic':
        return 'border-2 border-yellow-300 shadow-[0_0_55px_rgba(168,85,247,0.7)]';
      case 'royal':
        return 'border-2 border-amber-400 shadow-[0_0_40px_rgba(147,51,234,0.5)]';
      case 'gold':
        return 'border border-amber-400/90 shadow-[0_0_30px_rgba(234,179,8,0.4)]';
      case 'silver':
        return 'border border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.3)]';
      case 'bronze':
        return 'border border-amber-600/80 shadow-[0_0_20px_rgba(217,119,6,0.3)]';
      default:
        return 'border border-zinc-800';
    }
  };

  const tierLabel = {
    none: 'عضو',
    bronze: 'VIP 1 البرونزي',
    silver: 'VIP 2 الفضي',
    gold: 'VIP 3 الذهبي',
    royal: 'VIP 4 الملكي',
    mythic: 'VIP 5 الأسطوري الأسمى',
  }[effectiveTier];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className={`relative w-full max-w-2xl overflow-hidden bg-[#07030F] rounded-3xl text-zinc-100 max-h-[94vh] flex flex-col transition-all duration-500 ${getModalBorderClass()}`}>
        
        {/* Top Header Bar */}
        <div className="relative z-30 px-4 py-3 bg-gradient-to-r from-[#180A2E] via-[#100520] to-[#08020E] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <RealisticCrown tier={effectiveTier} size="xs" animated={true} />
            <span className="text-xs font-bold text-amber-300">
              الملف الشخصي الملكي - {tierLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => onOpenAdminEdit?.(user)}
                className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                title="لوحة تحكم المالك"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>المالك</span>
              </button>
            )}
            {(isSelf || isAdmin) && onOpenEditProfile && (
              <button
                onClick={() => onOpenEditProfile?.(user)}
                className="px-3 py-1 text-xs font-bold rounded-full bg-[#161616] hover:bg-[#202020] text-zinc-200 border border-zinc-700 shadow-md flex items-center gap-1.5 transition-colors"
                title="تعديل الملف والصورة الشخصية"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>تعديل</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white transition-all backdrop-blur-sm border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Card Scrollable Body */}
        <div className="relative p-2 sm:p-4 flex-1 overflow-y-auto space-y-4">
          
          {/* THE NEW LUXURY FANTASY GAMING PROFILE SYSTEM (100% responsive, zero text overlapping, crystal UI) */}
          <LuxuryGamingProfile
            user={user}
            tier={effectiveTier}
            isSelf={isSelf}
            isAdmin={isAdmin}
            onOpenEditProfile={onOpenEditProfile}
            onSelectTier={handleSelectTierPreview}
            onUpdateThemeColor={onUpdateThemeColor}
            onUpgradeClick={() => {
              onClose();
              onOpenVipStore?.();
            }}
          />

          {/* Profile Meta: Join Date & Country */}
          <div className="flex items-center justify-between text-xs text-zinc-400 px-4 py-2.5 bg-[#0D0519] rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.country.flag} {user.country.nameAr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>تاريخ الانضمام للديوان: {user.joinedDate}</span>
            </div>
          </div>

          {/* Navigation Tabs (Overview, Gifts, Badges) */}
          <div className="flex border-b border-zinc-800 mb-3 gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'gifts'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>الهدايا المستلمة</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full font-mono">
                {user.receivedGiftsCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'badges'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>الأوسمة الملكية</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#0D0519] border border-zinc-800 rounded-xl flex items-center justify-between">
                <span className="text-zinc-400">إجمالي قيمة الهدايا:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  {user.totalGiftsValue.toLocaleString()} 🪙 ذهبة
                </span>
              </div>
              <div className="p-3 bg-[#0D0519] border border-zinc-800 rounded-xl flex items-center justify-between">
                <span className="text-zinc-400">نقاط الخبرة (XP):</span>
                <span className="font-bold text-emerald-400">{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div className="text-center py-6 text-zinc-400 text-xs bg-[#0D0519] rounded-xl border border-zinc-800">
              <GiftIcon className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
              <p>تم استلام {user.receivedGiftsCount} هدية ملكية في الغرف الصوتية</p>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Array.isArray(user.badges) && user.badges.length > 0 ? (
                user.badges.map((badge: any, idx: number) => {
                  const badgeName = typeof badge === 'string' ? badge : (badge?.nameAr || badge?.nameEn || 'شارة ملكية');
                  const badgeIcon = typeof badge === 'object' && badge?.icon ? badge.icon : '🏅';
                  const badgeDesc = typeof badge === 'object' && badge?.descriptionAr ? badge.descriptionAr : '';
                  const badgeColor = typeof badge === 'object' && badge?.color ? badge.color : 'from-amber-500 to-yellow-400';

                  return (
                    <div
                      key={badge?.id || idx}
                      className="p-3 rounded-2xl bg-[#0D0519] border border-amber-500/25 hover:border-amber-500/50 text-center flex flex-col items-center transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${badgeColor} flex items-center justify-center text-xl mb-1.5 shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform`}>
                        {badgeIcon}
                      </div>
                      <div className="text-xs font-bold text-amber-200 line-clamp-1">{badgeName}</div>
                      {badgeDesc && (
                        <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {badgeDesc}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 sm:col-span-3 text-center py-6 text-zinc-500 text-xs bg-[#0D0519] rounded-xl border border-zinc-800">
                  <Award className="w-8 h-8 text-amber-500/30 mx-auto mb-2" />
                  <p>لا توجد أوسمة معتمدة لهذا الحساب حالياً</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Gift Sending Box */}
          {showGiftSelector && (
            <div className="mt-4 p-3 bg-[#0D0519] border border-amber-500/40 rounded-2xl animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <GiftIcon className="w-4 h-4" />
                  اختر هدية لـ {user.nickname}:
                </span>
                <button
                  onClick={() => setShowGiftSelector(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  إلغاء
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {INITIAL_GIFTS.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleQuickGift(gift)}
                    className="p-2 rounded-xl bg-[#140826] hover:bg-[#200D3D] border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col items-center group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">{gift.icon}</span>
                    <span className="text-[10px] text-zinc-200 mt-1 truncate w-full text-center">{gift.nameAr}</span>
                    <span className="text-[9px] font-bold text-yellow-400">{gift.coins} 🪙</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons for Visiting other users */}
          {!isSelf && (
            <>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={handleFollow}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    isFollowing
                      ? 'bg-[#161616] hover:bg-[#202020] text-zinc-300 border border-zinc-700'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-extrabold shadow-amber-500/10'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      متابَع
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      متابعة
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowGiftSelector(!showGiftSelector)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 text-white flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  <GiftIcon className="w-4 h-4" />
                  إهداء هدية
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenDirectChat?.(user);
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-[#140826] hover:bg-[#200D3D] text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  مراسلة
                </button>
              </div>

              {/* If inspecting the Platform Owner, provide a direct channel button */}
              {(user.role === 'owner' || user.id === 'user_owner') && onOpenOwnerContact && (
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOwnerContact();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Crown className="w-4 h-4 text-black" />
                    <span>معلومات التواصل الرسمية مع المالك (واتساب / بريد / تيليجرام)</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Action Buttons for Own Account (isSelf) */}
          {isSelf && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenEditProfile?.(user)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>تعديل الملف واسم المستخدم</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenVipStore?.();
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 text-purple-200 border border-purple-500/40 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>متجر VIP الملكي</span>
                </button>
              </div>

              {isOwner && onEditContactInfo && (
                <button
                  onClick={() => {
                    onClose();
                    onEditContactInfo();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Edit3 className="w-4 h-4 text-black" />
                  <span>تعديل معلومات التواصل الرسمية للمنصة 📱</span>
                </button>
              )}

              {onOpenOwnerContact && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenOwnerContact();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>التواصل مع المالك لطلب ترقية VIP أو استفسار</span>
                </button>
              )}

              {/* Distinct Logout Button for User Profile */}
              {onLogout && (
                <div>
                  {showLogoutConfirm ? (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-center space-y-2 animate-fadeIn">
                      <p className="text-xs text-red-200 font-bold">هل أنت متأكد من رغبتك في تسجيل الخروج من الحساب؟</p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setShowLogoutConfirm(false);
                            onClose();
                            onLogout();
                          }}
                          className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black"
                        >
                          تأكيد الخروج
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>تسجيل الخروج من الحساب</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* End of Profile Content */}
        </div>
      </div>
    </div>
  );
};
