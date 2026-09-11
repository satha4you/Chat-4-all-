import React, { useState, useEffect } from 'react';
import { UserProfile, VIPTier, VIPThemeColorKey } from '../../types';
import { VIP_CONFIGS } from '../../data/initialData';
import { RealisticCrown } from '../common/RealisticCrown';
import { RealisticTierEmblem } from '../common/RealisticTierEmblem';
import { VIPAvatarFrameSVG } from '../common/VIPAvatarFrameSVG';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { Floating3DCrownAnimation } from './Floating3DCrownAnimation';
import { getVIPTheme, ALL_VIP_THEMES, VIPThemeConfig } from '../../data/vipThemes';
import { playSoundEffect } from '../../utils/soundEffects';
import { 
  Crown, 
  Sparkles, 
  Shield, 
  Flame, 
  Zap, 
  Star, 
  Gem, 
  Award, 
  Check, 
  Camera, 
  ChevronRight, 
  ShieldCheck,
  Volume2,
  Edit3,
  Palette,
  Lock
} from 'lucide-react';

interface LuxuryGamingProfileProps {
  user: UserProfile;
  tier?: VIPTier;
  isSelf?: boolean;
  isAdmin?: boolean;
  onOpenEditProfile?: (user: UserProfile) => void;
  onSelectTier?: (tier: VIPTier) => void;
  onUpgradeClick?: (tier: VIPTier) => void;
  onUpdateThemeColor?: (themeColor: VIPThemeColorKey) => void;
  className?: string;
}

export const LuxuryGamingProfile: React.FC<LuxuryGamingProfileProps> = ({
  user,
  tier,
  isSelf = false,
  isAdmin = false,
  onOpenEditProfile,
  onSelectTier,
  onUpgradeClick,
  onUpdateThemeColor,
  className = '',
}) => {
  const currentTier: VIPTier = tier || user.vipTier || 'mythic';
  const effectiveTier = currentTier === 'none' ? 'bronze' : currentTier;

  // Local theme state for instantaneous responsiveness
  const [activeThemeKey, setActiveThemeKey] = useState<VIPThemeColorKey | undefined>(user.themeColor);

  useEffect(() => {
    if (user.themeColor) {
      setActiveThemeKey(user.themeColor);
    }
  }, [user.themeColor]);

  // Determine VIP eligibility for theme color feature
  const isVipUser = user.vipTier !== 'none' || (tier !== undefined && tier !== 'none');

  // Compute active theme palette
  const activeTheme: VIPThemeConfig = getVIPTheme(activeThemeKey || user.themeColor, effectiveTier);

  const handleSelectTheme = (themeKey: VIPThemeColorKey) => {
    if (!isVipUser) return;
    setActiveThemeKey(themeKey);
    playSoundEffect('bell');
    onUpdateThemeColor?.(themeKey);
  };

  // 5 Master VIP Gaming Tiers Definition
  const gamingTiers: {
    id: VIPTier;
    nameAr: string;
    englishTitle: string;
    subNameAr: string;
    rankLevel: number;
    creatureIcon: string;
    primaryColor: string;
    accentColor: string;
    glowRgba: string;
    bgGradient: string;
    borderStyle: string;
    crownStyle: string;
    xpMultiplier: string;
    perkHighlight: string;
  }[] = [
    {
      id: 'bronze',
      nameAr: 'VIP 1',
      englishTitle: 'BRONZE FALCON',
      subNameAr: 'صقر البرونز',
      rankLevel: 1,
      creatureIcon: '🦅',
      primaryColor: '#F59E0B',
      accentColor: '#D97706',
      glowRgba: 'rgba(217, 119, 6, 0.45)',
      bgGradient: 'from-[#1A0C06] via-[#2A1308] to-[#0D0502]',
      borderStyle: 'border-amber-600/70 hover:border-amber-400',
      crownStyle: 'text-amber-500',
      xpMultiplier: '+15% XP',
      perkHighlight: 'إطار برونزي متوهج ودخول غرف الأعضاء',
    },
    {
      id: 'silver',
      nameAr: 'VIP 2',
      englishTitle: 'SILVER WOLF',
      subNameAr: 'ذئب الفضة',
      rankLevel: 2,
      creatureIcon: '🐺',
      primaryColor: '#38BDF8',
      accentColor: '#94A3B8',
      glowRgba: 'rgba(56, 189, 248, 0.5)',
      bgGradient: 'from-[#07131F] via-[#0C2238] to-[#040A12]',
      borderStyle: 'border-cyan-400/70 hover:border-cyan-300',
      crownStyle: 'text-cyan-300',
      xpMultiplier: '+30% XP',
      perkHighlight: 'إطار بلاتيني مشع وتأثيرات صوتية خاصة',
    },
    {
      id: 'gold',
      nameAr: 'VIP 3',
      englishTitle: 'GOLD EAGLE',
      subNameAr: 'نسر الذهب',
      rankLevel: 3,
      creatureIcon: '👑',
      primaryColor: '#FACC15',
      accentColor: '#CA8A04',
      glowRgba: 'rgba(250, 204, 21, 0.55)',
      bgGradient: 'from-[#1F1805] via-[#382806] to-[#0D0A02]',
      borderStyle: 'border-yellow-400/80 hover:border-yellow-300',
      crownStyle: 'text-yellow-400',
      xpMultiplier: '+50% XP',
      perkHighlight: 'اسم ذهبي مشع وتصدر المقاعد الصوتية',
    },
    {
      id: 'royal',
      nameAr: 'VIP 4',
      englishTitle: 'ROYAL LION',
      subNameAr: 'أسد رويال',
      rankLevel: 4,
      creatureIcon: '🦁',
      primaryColor: '#C084FC',
      accentColor: '#9333EA',
      glowRgba: 'rgba(168, 85, 247, 0.65)',
      bgGradient: 'from-[#1B0A2E] via-[#300E54] to-[#0E031A]',
      borderStyle: 'border-purple-400/90 hover:border-purple-300',
      crownStyle: 'text-purple-300',
      xpMultiplier: '+100% XP',
      perkHighlight: 'تاج ملكي ذهبي ودخول الغرف الخاصة المحمية',
    },
    {
      id: 'mythic',
      nameAr: 'VIP 5',
      englishTitle: 'MYTHIC SULTAN',
      subNameAr: 'سلطان أسطوري',
      rankLevel: 5,
      creatureIcon: '👑🔥',
      primaryColor: '#FDE047',
      accentColor: '#E879F9',
      glowRgba: 'rgba(232, 121, 249, 0.8)',
      bgGradient: 'from-[#220326] via-[#3D0A3B] to-[#0F0112]',
      borderStyle: 'border-gradient-to-r from-amber-400 via-fuchsia-400 to-amber-300',
      crownStyle: 'text-amber-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]',
      xpMultiplier: '+200% XP',
      perkHighlight: 'التاج الإمبراطوري الأسمى وأجنحة الجمشت وحصانة تامة',
    },
  ];

  const activeTierConfig = gamingTiers.find((t) => t.id === effectiveTier) || gamingTiers[4];
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const userLevel = user.level || 99;
  const currentXP = user.xp || 88400;
  const nextLevelXP = 100000;
  const progressPercent = Math.min(Math.round((currentXP / nextLevelXP) * 100), 100);

  return (
    <div
      dir="rtl"
      className={`relative w-full overflow-hidden rounded-3xl bg-[#07020E] text-zinc-100 select-none border-2 transition-all duration-500 shadow-2xl ${className}`}
      style={{
        borderColor: activeTheme.primary,
        boxShadow: `0 0 45px ${activeTheme.glowRgba}, inset 0 0 60px rgba(10, 3, 20, 0.9)`,
      }}
    >
      {/* 1. TOP 3D GAMING HEADER CORNICE WITH DYNAMIC THEME BRACKETS */}
      <div 
        className="relative px-4 sm:px-6 py-3.5 border-b flex items-center justify-between transition-colors duration-500"
        style={{
          borderColor: `${activeTheme.primary}60`,
          background: `linear-gradient(to right, ${activeTheme.dark}80, #0E0419, ${activeTheme.dark}80)`
        }}
      >
        {/* Decorative corner metallic filigrees */}
        <div 
          className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 pointer-events-none transition-colors duration-500" 
          style={{ borderColor: activeTheme.light }}
        />
        <div 
          className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 pointer-events-none transition-colors duration-500" 
          style={{ borderColor: activeTheme.light }}
        />

        {/* Left Side: Tier Identification Badge */}
        <div className="flex items-center gap-2.5">
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border shadow-inner transition-colors duration-500"
            style={{ borderColor: `${activeTheme.primary}70` }}
          >
            <Crown className="w-4 h-4" style={{ color: activeTheme.light }} />
            <span className="text-xs font-black tracking-wider font-mono" style={{ color: activeTheme.light }}>
              {activeTierConfig.nameAr}
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-zinc-300">
            {activeTierConfig.subNameAr}
          </span>
        </div>

        {/* Center: Imperial 3D Emblem Title */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" style={{ color: activeTheme.light }} />
          <span 
            className="text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-500"
            style={{
              background: `linear-gradient(to right, ${activeTheme.light}, #FFFFFF, ${activeTheme.primary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 8px ${activeTheme.glowRgba})`
            }}
          >
            الملف الملكي الأسطوري
          </span>
          <Sparkles className="w-4 h-4 animate-pulse" style={{ color: activeTheme.light }} />
        </div>

        {/* Right Side: VIP Tier Status & XP Multiplier */}
        <div className="flex items-center gap-2">
          <span 
            className="px-2.5 py-0.5 rounded-full border text-[11px] font-black font-mono transition-colors duration-500"
            style={{
              background: `${activeTheme.primary}25`,
              borderColor: `${activeTheme.primary}60`,
              color: activeTheme.light
            }}
          >
            {activeTierConfig.xpMultiplier}
          </span>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION: 3D AVATAR SPHERE + NAME + LEVEL + PROGRESS */}
      <div className="relative p-5 sm:p-7 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#240A3F]/80 via-[#10031E]/90 to-[#07020E] overflow-hidden">
        
        {/* Ambient Light Beams */}
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700"
          style={{ background: activeTheme.glowRgba }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-5 sm:pt-6">
          
          {/* Avatar Area with 3D Levitating Crown and Luxury Portal Frame */}
          <div className="flex flex-col items-center shrink-0">
            <div 
              className="relative group w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mt-3 sm:mt-4 cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
            >
              
              {/* 3D Levitating Golden Crown */}
              <div className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                <Floating3DCrownAnimation
                  tier={effectiveTier}
                  size="lg"
                  showAmbientLight={true}
                  showRays={true}
                  showSparkles={true}
                  isHovered={isAvatarHovered}
                />
              </div>

              {/* Ornate Royal VIP Profile Frame */}
              {effectiveTier && (
                <VIPAvatarFrameSVG tier={effectiveTier} size="xl" showTopCrown={false} />
              )}

              {/* Pulsing Light Ring with Dynamic Theme Glow */}
              <div 
                className="absolute inset-2 rounded-full blur-md opacity-70 animate-pulse pointer-events-none transition-colors duration-500"
                style={{ background: activeTheme.glowRgba }}
              />

              {/* 3D Circular Beveled Frame */}
              <div 
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 flex items-center justify-center z-20 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${activeTheme.light}, ${activeTheme.primary}, #3B0764, ${activeTheme.dark})`,
                  boxShadow: `0 0 25px ${activeTheme.glowRgba}`
                }}
              >
                
                {/* Inner Amethyst Crystal Bevel */}
                <div 
                  className="w-full h-full rounded-full p-1 bg-gradient-to-b from-[#3B0764] via-[#1E0836] to-[#0A0214] border shadow-inner flex items-center justify-center overflow-hidden transition-colors duration-500"
                  style={{ borderColor: `${activeTheme.light}90` }}
                >
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Edit Photo Overlay Button */}
                {(isSelf || isAdmin) && onOpenEditProfile && (
                  <button
                    type="button"
                    onClick={() => onOpenEditProfile(user)}
                    className="absolute bottom-0 left-0 p-1.5 rounded-full text-black shadow-lg border-2 border-[#120324] hover:scale-110 transition-transform cursor-pointer z-30"
                    style={{
                      background: `linear-gradient(to right, ${activeTheme.light}, ${activeTheme.primary})`
                    }}
                    title="تعديل الصورة الشخصية"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Realistic Tier Crest Badge */}
                <div 
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0D0519] border-2 flex items-center justify-center shadow-lg z-30 p-0.5 transition-colors duration-500"
                  style={{ borderColor: activeTheme.light }}
                >
                  <RealisticTierEmblem tier={effectiveTier} size="xs" animated={true} />
                </div>
              </div>
            </div>

            {/* Level Tag */}
            <div 
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-black font-black text-xs shadow-lg border transition-all duration-500"
              style={{
                background: `linear-gradient(to right, ${activeTheme.light}, ${activeTheme.primary})`,
                borderColor: activeTheme.light
              }}
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>LEVEL {userLevel}</span>
            </div>
          </div>

          {/* User Details & Identity */}
          <div className="flex-1 text-center md:text-right space-y-3.5 w-full">
            
            {/* Nickname and Country Header */}
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                <h1 
                  className="text-2xl sm:text-3xl font-black drop-shadow-md transition-all duration-500"
                  style={{
                    background: `linear-gradient(to left, #FFFFFF, ${activeTheme.light}, ${activeTheme.primary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {user.nickname}
                </h1>

                {/* Verified Account Badge (Gold or Blue) */}
                {user.verified && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <VerifiedBadge
                      type={user.verificationType || (user.role === 'owner' ? 'gold' : 'blue')}
                      size="md"
                    />
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border shadow-sm flex items-center gap-1 ${
                        (user.verificationType || (user.role === 'owner' ? 'gold' : 'blue')) === 'gold'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/20'
                      }`}
                    >
                      {(user.verificationType || (user.role === 'owner' ? 'gold' : 'blue')) === 'gold'
                        ? 'توثيق ذهبي ملكي ⭐'
                        : 'توثيق أزرق معتمد 🛡️'}
                    </span>
                  </div>
                )}
                
                {/* 3D VIP Plaque with Dynamic Theme */}
                <span 
                  className="px-3 py-1 rounded-xl border font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors duration-500"
                  style={{
                    background: `${activeTheme.primary}20`,
                    borderColor: `${activeTheme.primary}80`,
                    color: activeTheme.light
                  }}
                >
                  <RealisticCrown tier={effectiveTier} size="xs" animated={true} />
                  <span>{activeTierConfig.nameAr}</span>
                </span>

                {user.role === 'owner' && (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-300 font-bold text-xs flex items-center gap-1">
                    <RealisticCrown tier="mythic" size="xs" animated={false} />
                    <span>المالك العام</span>
                  </span>
                )}

                {/* Prominent Edit Profile Button */}
                {(isSelf || isAdmin) && onOpenEditProfile && (
                  <button
                    type="button"
                    onClick={() => onOpenEditProfile(user)}
                    className="px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
                    style={{
                      background: `${activeTheme.primary}20`,
                      borderColor: `${activeTheme.primary}60`,
                      color: activeTheme.light
                    }}
                  >
                    <Edit3 className="w-3.5 h-3.5" style={{ color: activeTheme.light }} />
                    <span>تعديل الملف الشخصي</span>
                  </button>
                )}
              </div>

              {/* Username and Country */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-zinc-400 font-mono">
                <span className="font-bold dir-ltr" style={{ color: activeTheme.light }}>@{user.username}</span>
                <span>•</span>
                <span className="text-zinc-300 font-sans">
                  {user.country.flag} {user.country.nameAr}
                </span>
                <span>•</span>
                <span className="text-zinc-500">ID: {user.id.slice(0, 10)}</span>
              </div>
            </div>

            {/* User Bio / Royal Quote with Theme Border */}
            {user.bio && (
              <div 
                className="p-2.5 sm:p-3 rounded-2xl bg-black/40 border text-xs text-zinc-300 leading-relaxed max-w-xl text-right transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}45` }}
              >
                <span className="font-bold ml-1.5 text-sm" style={{ color: activeTheme.light }}>"</span>
                {user.bio}
                <span className="font-bold mr-1.5 text-sm" style={{ color: activeTheme.light }}>"</span>
              </div>
            )}

            {/* 3D GOLD & CRYSTAL PROGRESS BAR (Level & XP Progress with Theme Glow) */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1 transition-colors duration-500" style={{ color: activeTheme.light }}>
                  <Flame className="w-3.5 h-3.5" style={{ color: activeTheme.primary }} />
                  <span>مستوى التميز الملكي: Level {userLevel}</span>
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP ({progressPercent}%)
                </span>
              </div>

              {/* The 3D Crystal Progress Track */}
              <div 
                className="relative w-full h-3.5 rounded-full bg-[#120324] border p-0.5 shadow-inner overflow-hidden transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}70` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 relative"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(to left, ${activeTheme.light}, ${activeTheme.primary}, ${activeTheme.dark})`,
                    boxShadow: `0 0 14px ${activeTheme.glowRgba}`
                  }}
                >
                  {/* Sheen sparkle on the bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Quick 4 Stats Counters with Dynamic Borders */}
            <div className="grid grid-cols-4 gap-2 pt-1 max-w-xl text-center">
              <div 
                className="p-2 rounded-xl bg-black/50 border transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}45` }}
              >
                <div className="text-sm sm:text-base font-black font-mono transition-colors duration-500" style={{ color: activeTheme.light }}>
                  {user.coins.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold">🪙 الذهب</div>
              </div>
              <div 
                className="p-2 rounded-xl bg-black/50 border transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}45` }}
              >
                <div className="text-sm sm:text-base font-black text-zinc-100 font-mono">
                  {user.followersCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold">المتابعون</div>
              </div>
              <div 
                className="p-2 rounded-xl bg-black/50 border transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}45` }}
              >
                <div className="text-sm sm:text-base font-black font-mono transition-colors duration-500" style={{ color: activeTheme.light }}>
                  {user.receivedGiftsCount}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold">🎁 الهدايا</div>
              </div>
              <div 
                className="p-2 rounded-xl bg-black/50 border transition-colors duration-500"
                style={{ borderColor: `${activeTheme.primary}45` }}
              >
                <div className="text-sm sm:text-base font-black font-mono text-emerald-400">
                  {user.followingCount}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold">يتابعهم</div>
              </div>
            </div>

            {/* VIP THEME COLOR SELECTOR (Interactive Toolbar for VIP Users) */}
            <div 
              className="mt-4 p-3 sm:p-4 rounded-2xl border transition-all duration-500 text-right"
              style={{
                borderColor: `${activeTheme.primary}50`,
                background: `linear-gradient(to bottom, ${activeTheme.primary}12, #07020E)`
              }}
            >
              {isVipUser ? (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-xl border flex items-center justify-center text-sm shadow-sm"
                        style={{
                          borderColor: activeTheme.primary,
                          background: `${activeTheme.primary}25`,
                          color: activeTheme.light
                        }}
                      >
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">لون السمة الملكية (Theme Color)</span>
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px] font-black border"
                            style={{
                              borderColor: `${activeTheme.primary}80`,
                              background: `${activeTheme.primary}20`,
                              color: activeTheme.light
                            }}
                          >
                            ميزة VIP مفعلة
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          تخصيص لون الحدود والخطوط المتوهجة لملفك: <strong style={{ color: activeTheme.light }}>{activeTheme.nameAr}</strong> {activeTheme.icon}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 hidden sm:block">
                      اختر أي لون لتغيير الحدود والخطوط فوراً
                    </div>
                  </div>

                  {/* 8 VIP Theme Swatches Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {ALL_VIP_THEMES.map((themeOption) => {
                      const isSelected = activeTheme.id === themeOption.id;
                      return (
                        <button
                          key={themeOption.id}
                          type="button"
                          onClick={() => handleSelectTheme(themeOption.id)}
                          className={`group/theme relative p-2 rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer text-center ${
                            isSelected
                              ? 'scale-105 shadow-lg ring-1'
                              : 'opacity-70 hover:opacity-100 hover:scale-102'
                          }`}
                          style={{
                            borderColor: isSelected ? themeOption.light : `${themeOption.primary}40`,
                            background: isSelected 
                              ? `linear-gradient(to bottom, ${themeOption.primary}35, #080312)`
                              : 'rgba(5, 2, 10, 0.7)',
                            boxShadow: isSelected ? `0 0 16px ${themeOption.glowRgba}` : 'none',
                          }}
                          title={themeOption.descAr}
                        >
                          {/* Color Dot Sphere */}
                          <div 
                            className="relative w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border"
                            style={{
                              background: `radial-gradient(circle at 35% 35%, ${themeOption.light}, ${themeOption.primary}, ${themeOption.dark})`,
                              borderColor: isSelected ? '#FFFFFF' : themeOption.light,
                              boxShadow: `0 0 8px ${themeOption.primary}`
                            }}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-black font-black stroke-[3]" />
                            )}
                          </div>

                          <div className="w-full">
                            <div 
                              className="text-[10px] font-black truncate"
                              style={{ color: isSelected ? themeOption.light : '#E4E4E7' }}
                            >
                              {themeOption.nameAr}
                            </div>
                          </div>

                          {/* Mini bottom line preview */}
                          <div 
                            className="w-full h-1 rounded-full transition-all"
                            style={{
                              background: isSelected 
                                ? `linear-gradient(to right, ${themeOption.light}, ${themeOption.primary})`
                                : `${themeOption.primary}30`
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Locked Banner for Non-VIP Users */
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1 text-center sm:text-right">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-black text-white">خاصية ألوان السمة والحدود (Theme Color)</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          ميزة VIP حصرية
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        غيّر ألوان الحدود والهالات والخطوط المتوهجة لملفك الشخصي بالاختيار من 8 سمات ملكية أسطورية.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpgradeClick?.('bronze')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black flex items-center gap-1.5 shadow-md hover:from-amber-400 transition-all cursor-pointer shrink-0"
                  >
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>ترقية لفتح ألوان السمة</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 3. 5 HORIZONTAL 3D VIP TIERS SYSTEM (Click to preview and select) */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#090214] via-[#0E031A] to-[#06010D] border-t border-amber-500/30">
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white">
              رتب نظام العضويات الملكية VIP (اختر للمعاينة الفورية):
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">
            الرتبة المحددة: <strong className="text-amber-300">{activeTierConfig.subNameAr} ({activeTierConfig.nameAr})</strong>
          </span>
        </div>

        {/* 5 Horizontal 3D Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {gamingTiers.map((t) => {
            const isSelected = effectiveTier === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTier?.(t.id)}
                className={`relative rounded-2xl p-3 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden bg-gradient-to-b ${t.bgGradient} ${
                  isSelected
                    ? 'scale-[1.03] ring-2 ring-amber-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] border-amber-300'
                    : `${t.borderStyle} opacity-85 hover:opacity-100 hover:scale-101`
                }`}
              >
                {/* Top glow indicator */}
                {isSelected && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />
                )}

                <div>
                  {/* Card Header: Icon & Rank */}
                  <div className="flex items-center justify-between mb-2">
                    <RealisticTierEmblem tier={t.id} size="sm" animated={isSelected} />
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-white">
                      {t.nameAr}
                    </span>
                  </div>

                  {/* Creature Arabic Name */}
                  <div className="text-right">
                    <h4 className="text-xs font-black text-white">{t.subNameAr}</h4>
                    <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider">
                      {t.englishTitle}
                    </p>
                  </div>

                  {/* Perk Preview */}
                  <div className="mt-2.5 p-1.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-zinc-300 leading-tight">
                    {t.perkHighlight}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-300">
                    {t.xpMultiplier}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                    {isSelected ? (
                      <span className="text-amber-400 flex items-center gap-0.5 font-black">
                        <Check className="w-3 h-3" /> محدد
                      </span>
                    ) : (
                      <span>معاينة</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade / Subscribe Action Button */}
        {onUpgradeClick && (
          <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-zinc-300 text-center sm:text-right">
              هل ترغب في ترقية حسابك وتفعيل <strong className="text-amber-300">{activeTierConfig.subNameAr} ({activeTierConfig.nameAr})</strong> رسميًا؟
            </div>

            <button
              onClick={() => onUpgradeClick(effectiveTier)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>تفعيل رتبة {activeTierConfig.subNameAr} الآن</span>
            </button>
          </div>
        )}

      </div>

      {/* 4. FOUR ROYAL STATUS BADGES FOOTER */}
      <div 
        className="px-4 sm:px-6 py-3 bg-[#05010B] border-t flex flex-wrap items-center justify-around gap-2 text-center text-[10px] font-bold transition-colors duration-500"
        style={{
          borderColor: `${activeTheme.primary}40`,
          color: activeTheme.light
        }}
      >
        <div className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" style={{ color: activeTheme.light }} />
          <span>PREMIUM: صدارة المايكات</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.light }} />
          <span>EXCLUSIVE: الغرف المغلقة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Gem className="w-3.5 h-3.5" style={{ color: activeTheme.light }} />
          <span>ELITE: الإطار الكريستالي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: activeTheme.light }} />
          <span>TRUSTED: التوثيق والحصانة</span>
        </div>
      </div>

    </div>
  );
};
