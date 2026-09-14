import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, VIPTier, VIPThemeColorKey } from '../../types';
import { X, Check, Camera, Sparkles, Upload, Image as ImageIcon, RotateCcw, Crown, Palette, Lock, AlertCircle, ShieldAlert, Phone } from 'lucide-react';
import { VIPName } from '../common/VIPName';
import { AvatarWithFrame } from '../common/AvatarWithFrame';
import { RealisticCrown } from '../common/RealisticCrown';
import { RealisticTierEmblem } from '../common/RealisticTierEmblem';
import { playSoundEffect } from '../../utils/soundEffects';
import { getVIPTheme, ALL_VIP_THEMES } from '../../data/vipThemes';
import { MYTHIC_FRAMES, DEFAULT_MYTHIC_FRAME_ID, getMythicFrameById } from '../../data/mythicFrames';
import { compressImage } from '../../utils/storage';
import { VIP_CONFIGS, ARAB_COUNTRIES } from '../../data/initialData';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<UserProfile>) => void;
  onOpenOwnerContact?: () => void;
  onOpenVipStore?: () => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  onOpenOwnerContact,
  onOpenVipStore,
}) => {
  const isOwner = user.role === 'owner' || user.id === 'user_owner';
  const isVipActive = user.vipTier !== 'none' && (user.isVipActive ?? true);
  const hasApprovedVip = isOwner || isVipActive;

  const [username, setUsername] = useState(user.username || '');
  const [nickname, setNickname] = useState(user.nickname || '');
  const [bio, setBio] = useState(user.bio || '');
  const [status, setStatus] = useState(user.status || '');
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(user.country.code);
  const [vipTier, setVipTier] = useState<VIPTier>(user.vipTier || 'none');
  const [themeColor, setThemeColor] = useState<VIPThemeColorKey>(user.themeColor || 'royal_gold');
  const [mythicFrameId, setMythicFrameId] = useState<string>(user.mythicFrameId || DEFAULT_MYTHIC_FRAME_ID);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [vipNotice, setVipNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || '');
      setNickname(user.nickname || '');
      setBio(user.bio || '');
      setStatus(user.status || '');
      setCurrentAvatar(user.avatar);
      setCustomAvatarUrl('');
      setSelectedCountryCode(user.country.code);
      setVipTier(user.vipTier || 'none');
      setThemeColor(user.themeColor || 'royal_gold');
      setMythicFrameId(user.mythicFrameId || DEFAULT_MYTHIC_FRAME_ID);
      setUploadError(null);
      setVipNotice(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جدًا. الحد الأقصى 12 ميجابايت');
      return;
    }

    try {
      // Compress to lightweight 180x180 JPEG (~15KB) to guarantee smooth, permanent localStorage persistence
      const compressed = await compressImage(file, 200, 0.75);
      setCurrentAvatar(compressed);
      setCustomAvatarUrl('');
      playSoundEffect('bell');
    } catch (err) {
      console.error('Image compression error:', err);
      setUploadError('حدث خطأ أثناء معالجة وضغط الصورة');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const countryObj = ARAB_COUNTRIES.find((c) => c.code === selectedCountryCode) || user.country;
    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase() || user.username;
    const finalNickname = nickname.trim() || user.nickname || user.username;

    // Trigger celebratory sound effect
    playSoundEffect('gift_sparkle');

    // Strict VIP security:
    // New / unapproved users cannot self-grant VIP tiers or mythic frames.
    // Only the owner can change VIP tier, or users keep their approved tier.
    const effectiveVipTier: VIPTier = isOwner ? vipTier : (user.vipTier || 'none');
    const effectiveThemeColor = (isOwner || hasApprovedVip) && effectiveVipTier !== 'none' ? themeColor : undefined;
    const effectiveMythicFrameId = (isOwner || (hasApprovedVip && effectiveVipTier === 'mythic')) ? mythicFrameId : undefined;

    onSave({
      username: cleanUsername,
      nickname: finalNickname,
      bio: bio.trim(),
      status: status.trim() || 'متواجد دائمًا في الغرف الصوتية ✨',
      avatar: customAvatarUrl.trim() || currentAvatar,
      vipTier: effectiveVipTier,
      themeColor: effectiveThemeColor,
      mythicFrameId: effectiveMythicFrameId,
      country: {
        code: countryObj.code,
        nameAr: countryObj.nameAr,
        nameEn: countryObj.nameAr,
        flag: countryObj.flag,
      },
    });
    onClose();
  };

  const effectiveAvatar = customAvatarUrl.trim() || currentAvatar;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#11121B] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-100">تعديل الملف والصورة الشخصية</h3>
              <p className="text-[11px] text-zinc-400">تحديث صورتك، اسمك، وبياناتك الملكية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Avatar Preview & Direct Device Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-102'
                : 'border-zinc-800 bg-[#0A0B10]'
            }`}
          >
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarWithFrame
                avatarUrl={effectiveAvatar}
                vipTier={vipTier}
                size="xl"
                showCrown={true}
                className="mb-1"
              />
              
              {/* Overlay camera button on hover/touch */}
              <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                <Camera className="w-6 h-6 text-amber-300 mb-0.5" />
                <span className="text-[10px] text-white font-bold">تغيير الصورة</span>
              </div>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {/* Quick Upload Buttons */}
            <div className="flex items-center gap-2 mt-2 w-full justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black shadow flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة من جهازك</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentAvatar(user.avatar);
                  setCustomAvatarUrl('');
                  setUploadError(null);
                }}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-zinc-700"
                title="استعادة الصورة الأصلية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {uploadError && (
              <div className="text-[11px] text-rose-400 font-bold mt-2 text-center">
                {uploadError}
              </div>
            )}

            {/* Direct Image URL input */}
            <div className="w-full mt-3">
              <label className="block text-[11px] text-zinc-400 mb-1">أو ضع رابط صورة خارجي (URL):</label>
              <div className="relative">
                <ImageIcon className="w-3.5 h-3.5 text-zinc-500 absolute top-2.5 right-3" />
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    setUploadError(null);
                  }}
                  className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Preset Avatars Gallery */}
            <div className="w-full mt-3">
              <div className="text-[11px] text-zinc-400 mb-1.5 font-bold">أو اختر من المعرض الملكي:</div>
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                {SAMPLE_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentAvatar(av);
                      setCustomAvatarUrl('');
                      setUploadError(null);
                    }}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                      effectiveAvatar === av
                        ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/50'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Username (@handle) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
              <span>اسم المستخدم الفريد (Username)</span>
              <span className="text-[10px] text-amber-400 font-mono">بدون مسافات</span>
            </label>
            <div className="relative">
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">@</span>
              <input
                type="text"
                required
                value={username.replace(/^@/, '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                  setUsername(val);
                }}
                placeholder="username"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-8 pl-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-500 text-left dir-ltr"
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              المعرف الرسمي للحساب: <span className="text-amber-400/90 font-mono">@{username.replace(/^@/, '') || 'user'}</span>
            </p>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              الاسم المميز (Nickname)
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="مثال: أمير النغم 🎵"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>معاينة الاسم:</span>
              <VIPName nickname={nickname || 'الاسم'} vipTier={vipTier} size="sm" />
            </div>
          </div>

          {/* VIP Notice Toast/Alert if user tries to click locked tiers */}
          {vipNotice && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2 text-xs text-amber-200 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{vipNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setVipNotice(null)}
                className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Locked VIP Notice for New / Regular Users */}
          {!hasApprovedVip && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1206] via-[#140C04] to-[#0A0502] border border-amber-500/40 space-y-3 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    باقات VIP والإطارات الملكية مغلقة للمستخدمين الجدد 🔒
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed mt-1">
                    خصائص وتيجان وإطارات VIP مغلقة ومحمية للمستخدمين الجدد. لا يمكن تفعيل العضوية تلقائيًا، بل تتطلب موافقة وتفعيل يدوي من قبل المالك. يرجى التواصل مع المالك لاعتماد اشتراكك.
                  </p>
                </div>
              </div>

              {(onOpenOwnerContact || onOpenVipStore) && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenOwnerContact) onOpenOwnerContact();
                    else if (onOpenVipStore) onOpenVipStore();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-98"
                >
                  <Crown className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>تواصل مع المالك لتفعيل رتبة VIP والإطارات 👑</span>
                </button>
              )}
            </div>
          )}

          {/* Approved VIP Badge Indicator for activated users */}
          {hasApprovedVip && !isOwner && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>رتبتك المعتمدة حاليًا: {VIP_CONFIGS[user.vipTier]?.nameAr || 'VIP'} ✓</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                مفعلة رسميًا من المالك
              </span>
            </div>
          )}

          {/* VIP Rank / Crown Tier Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-400">
                <Crown className="w-3.5 h-3.5" />
                <span>رتبة العضوية والتاج الملكي</span>
              </span>
              <span className="text-[10px] text-zinc-400">
                {isOwner ? 'لوحة تحكم المالك الكاملة' : !hasApprovedVip ? 'مغلقة للمستخدمين الجدد 🔒' : 'رتبتك مفعلة'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'none', label: 'عادي', desc: 'بدون تاج' },
                  { id: 'bronze', label: 'برونزي', desc: 'صقر البرونز' },
                  { id: 'silver', label: 'فضي', desc: 'ذئب الفضة' },
                  { id: 'gold', label: 'ذهبي', desc: 'نسر الذهب' },
                  { id: 'royal', label: 'رويال', desc: 'أسد رويال' },
                  { id: 'mythic', label: 'ميثيك', desc: 'سلطان أسطوري' },
                ] as const
              ).map((t) => {
                const isSelected = vipTier === t.id;
                const isTierLocked = !isOwner && t.id !== 'none' && (!hasApprovedVip || user.vipTier !== t.id);

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (isTierLocked) {
                        playSoundEffect('bell');
                        setVipNotice(
                          !hasApprovedVip
                            ? `رتبة ${t.label} مغلقة للمستخدمين الجدد. يرجى التواصل مع المالك لتفعيلها.`
                            : `الترقية إلى رتبة ${t.label} تتطلب تواصل مع المالك.`
                        );
                        return;
                      }
                      setVipTier(t.id as VIPTier);
                      setVipNotice(null);
                    }}
                    className={`relative p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isTierLocked
                        ? 'border-zinc-800/80 bg-[#090A0E] opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/20 scale-102 ring-1 ring-amber-400 cursor-pointer'
                        : 'border-zinc-800 bg-[#0B0C12] hover:border-zinc-700 opacity-75 hover:opacity-100 cursor-pointer'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      {t.id === 'none' ? (
                        <span className="text-[10px] text-zinc-500 font-bold">بدون</span>
                      ) : (
                        <RealisticCrown tier={t.id as VIPTier} size="xs" animated={isSelected} />
                      )}
                    </div>
                    <span className="text-[11px] font-black text-zinc-200">{t.label}</span>
                    <span className="text-[9px] text-zinc-400 font-medium">{t.desc}</span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[9px] font-black shadow">
                        ✓
                      </div>
                    )}
                    {isTierLocked && (
                      <div className="absolute top-1 left-1 p-0.5 rounded-full bg-black/70 text-amber-400 border border-amber-500/30">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIP Theme Color Selection */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-[#090A10] border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>لون السمة للحدود والخطوط (Theme Color)</span>
              </label>
              {(isOwner || hasApprovedVip) && vipTier !== 'none' ? (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  ميزة VIP مفعلة
                </span>
              ) : (
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  مغلقة للمستخدمين الجدد
                </span>
              )}
            </div>

            {(isOwner || hasApprovedVip) && vipTier !== 'none' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_VIP_THEMES.map((themeOption) => {
                    const isSelected = themeColor === themeOption.id;
                    return (
                      <button
                        key={themeOption.id}
                        type="button"
                        onClick={() => {
                          setThemeColor(themeOption.id);
                          playSoundEffect('bell');
                        }}
                        className={`relative p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'scale-102 shadow-lg ring-1'
                            : 'hover:scale-101 opacity-75 hover:opacity-100'
                        }`}
                        style={{
                          borderColor: isSelected ? themeOption.light : `${themeOption.primary}30`,
                          background: isSelected
                            ? `linear-gradient(to bottom, ${themeOption.primary}25, #080312)`
                            : '#0E1017',
                          boxShadow: isSelected ? `0 0 14px ${themeOption.glowRgba}` : 'none',
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, ${themeOption.light}, ${themeOption.primary}, ${themeOption.dark})`,
                            borderColor: isSelected ? '#FFFFFF' : themeOption.light,
                            boxShadow: `0 0 8px ${themeOption.primary}`,
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-black font-black stroke-[3]" />}
                        </div>
                        <span
                          className="text-[11px] font-black"
                          style={{ color: isSelected ? themeOption.light : '#D4D4D8' }}
                        >
                          {themeOption.nameAr}
                        </span>
                        <span className="text-[9px] text-zinc-400 line-clamp-1">{themeOption.descAr}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Border & Glow Preview Box */}
                {(() => {
                  const previewTheme = getVIPTheme(themeColor, vipTier);
                  return (
                    <div
                      className="p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition-all duration-300"
                      style={{
                        borderColor: previewTheme.borderHex,
                        background: `linear-gradient(to right, ${previewTheme.dark}50, #0B0414, ${previewTheme.dark}50)`,
                        boxShadow: `0 0 20px ${previewTheme.glowRgba}`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{previewTheme.icon}</span>
                        <div>
                          <div className="text-xs font-black" style={{ color: previewTheme.light }}>
                            معاينة مظهر السمة: {previewTheme.nameAr}
                          </div>
                          <div className="text-[10px] text-zinc-300">
                            بهذا اللون ستظهر كافة حدود الملف الشخصي، الإكليل، الخطوط المتوهجة، وأشرطة التقدم.
                          </div>
                        </div>
                      </div>
                      <div
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border shrink-0"
                        style={{
                          borderColor: previewTheme.borderHex,
                          color: previewTheme.light,
                          background: `${previewTheme.primary}20`,
                        }}
                      >
                        {previewTheme.borderHex}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-center space-y-1.5">
                <div className="text-xs text-zinc-400">
                  خاصية تغيير لون السمة والحدود متاحة حصرياً لرتب VIP المفعلة من قبل المالك.
                </div>
                <div className="text-[11px] text-amber-400 font-bold">
                  🔒 يرجى التواصل مع المالك لتفعيل رتبة VIP والحصول على سمات الإضاءة والحدود الملكية.
                </div>
              </div>
            )}
          </div>

          {/* Exclusive Mythic Frame Selector (Only for highest VIP tier and verified/owner) */}
          {(isOwner || (hasApprovedVip && vipTier === 'mythic')) && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1C051B] to-[#0E0312] border-2 border-amber-400/50 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>تخصيص إطار VIP الأسطوري (ميزة حصرية لأعلى فئة)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                  VIP 5
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed">
                بصفتك مشتركاً في أعلى فئة، اختر شكل ونوع الإطار الذي يحيط بصورتك في المنصة:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MYTHIC_FRAMES.map((f) => {
                  const isSelected = mythicFrameId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setMythicFrameId(f.id);
                        playSoundEffect('vip_fanfare');
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/70 shadow-lg'
                          : 'bg-[#100416] border-purple-900/40 hover:border-amber-400/40 text-zinc-300'
                      }`}
                    >
                      <div className="relative my-1">
                        <AvatarWithFrame
                          avatarUrl={effectiveAvatar}
                          vipTier="mythic"
                          mythicFrameId={f.id}
                          size="sm"
                          showCrown={false}
                        />
                      </div>
                      <span className="text-base">{f.icon}</span>
                      <span className="text-[11px] font-black text-amber-200 line-clamp-1">
                        {f.nameAr}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-black">
                          المختار حالياً
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status (Bio message) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              الحالة / الاقتباس (Status)
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="مثال: متواجد دائمًا في غرف الموسيقى 🎵 | أحب التعارف والنقاش"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              الدولة
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            >
              {ARAB_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Bio (Description) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              نبذة تعريفية (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة قصيرة عن اهتماماتك..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
