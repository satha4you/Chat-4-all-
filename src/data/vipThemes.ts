import { VIPThemeColorKey, VIPTier } from '../types';

export interface VIPThemeConfig {
  id: VIPThemeColorKey;
  nameAr: string;
  nameEn: string;
  descAr: string;
  icon: string;
  primary: string;
  light: string;
  dark: string;
  glowRgba: string;
  lineGlow: string;
  borderHex: string;
  textHex: string;
  tailwindBorder: string;
  tailwindText: string;
  tailwindRing: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  bgGradient: string;
  corniceBorder: string;
  accentBadgeBg: string;
}

export const VIP_THEME_PALETTES: Record<VIPThemeColorKey, VIPThemeConfig> = {
  royal_gold: {
    id: 'royal_gold',
    nameAr: 'الذهب الإمبراطوري',
    nameEn: 'Imperial Gold',
    descAr: 'بريق الذهب الخالص عيار 24 مع هالات شمسية مهيبة',
    icon: '👑',
    primary: '#F59E0B',
    light: '#FDE047',
    dark: '#B45309',
    glowRgba: 'rgba(245, 158, 11, 0.65)',
    lineGlow: 'rgba(253, 224, 71, 0.85)',
    borderHex: '#F59E0B',
    textHex: '#FDE047',
    tailwindBorder: 'border-amber-400',
    tailwindText: 'text-amber-300',
    tailwindRing: 'ring-amber-400',
    gradientFrom: 'from-amber-500',
    gradientVia: 'via-yellow-400',
    gradientTo: 'to-amber-600',
    bgGradient: 'from-[#1A1205] via-[#2A1D08] to-[#0A0702]',
    corniceBorder: 'border-amber-500/50',
    accentBadgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
  },
  crimson_ruby: {
    id: 'crimson_ruby',
    nameAr: 'الياقوت القرمزي',
    nameEn: 'Crimson Ruby',
    descAr: 'احمرار مشع من حجر الياقوت الإمبراطوري الناري',
    icon: '💎',
    primary: '#F43F5E',
    light: '#FDA4AF',
    dark: '#9F1239',
    glowRgba: 'rgba(244, 63, 94, 0.65)',
    lineGlow: 'rgba(251, 113, 133, 0.85)',
    borderHex: '#F43F5E',
    textHex: '#FDA4AF',
    tailwindBorder: 'border-rose-500',
    tailwindText: 'text-rose-400',
    tailwindRing: 'ring-rose-400',
    gradientFrom: 'from-rose-500',
    gradientVia: 'via-red-400',
    gradientTo: 'to-rose-700',
    bgGradient: 'from-[#1E040B] via-[#2F0814] to-[#0A0104]',
    corniceBorder: 'border-rose-500/50',
    accentBadgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
  },
  emerald_sovereign: {
    id: 'emerald_sovereign',
    nameAr: 'الزمرد السيادي',
    nameEn: 'Royal Emerald',
    descAr: 'أخضر ملكي زمردي فخم يرمز للهيبة والازدهار',
    icon: '🌿',
    primary: '#10B981',
    light: '#6EE7B7',
    dark: '#047857',
    glowRgba: 'rgba(16, 185, 129, 0.65)',
    lineGlow: 'rgba(110, 231, 183, 0.85)',
    borderHex: '#10B981',
    textHex: '#6EE7B7',
    tailwindBorder: 'border-emerald-400',
    tailwindText: 'text-emerald-300',
    tailwindRing: 'ring-emerald-400',
    gradientFrom: 'from-emerald-500',
    gradientVia: 'via-teal-400',
    gradientTo: 'to-emerald-700',
    bgGradient: 'from-[#03180F] via-[#07291B] to-[#010B07]',
    corniceBorder: 'border-emerald-500/50',
    accentBadgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
  },
  sapphire_ocean: {
    id: 'sapphire_ocean',
    nameAr: 'الزفير الملكي',
    nameEn: 'Ocean Sapphire',
    descAr: 'زرقة عميقة متلألئة بنقاء أمواج الزفير والياقوت الأزرق',
    icon: '🔷',
    primary: '#3B82F6',
    light: '#93C5FD',
    dark: '#1D4ED8',
    glowRgba: 'rgba(59, 130, 246, 0.65)',
    lineGlow: 'rgba(147, 197, 253, 0.85)',
    borderHex: '#3B82F6',
    textHex: '#93C5FD',
    tailwindBorder: 'border-blue-400',
    tailwindText: 'text-blue-300',
    tailwindRing: 'ring-blue-400',
    gradientFrom: 'from-blue-500',
    gradientVia: 'via-sky-400',
    gradientTo: 'to-blue-700',
    bgGradient: 'from-[#041026] via-[#081B40] to-[#020713]',
    corniceBorder: 'border-blue-500/50',
    accentBadgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
  },
  amethyst_cosmic: {
    id: 'amethyst_cosmic',
    nameAr: 'الجمشت الكوني',
    nameEn: 'Cosmic Amethyst',
    descAr: 'أرجواني ملكي ساحر بهالة سحرية تجمع الفخامة بالغموض',
    icon: '🔮',
    primary: '#C084FC',
    light: '#F0ABFC',
    dark: '#7E22CE',
    glowRgba: 'rgba(192, 132, 252, 0.65)',
    lineGlow: 'rgba(232, 121, 249, 0.85)',
    borderHex: '#C084FC',
    textHex: '#F0ABFC',
    tailwindBorder: 'border-purple-400',
    tailwindText: 'text-purple-300',
    tailwindRing: 'ring-purple-400',
    gradientFrom: 'from-purple-500',
    gradientVia: 'via-fuchsia-400',
    gradientTo: 'to-purple-700',
    bgGradient: 'from-[#170526] via-[#280942] to-[#0A0212]',
    corniceBorder: 'border-purple-500/50',
    accentBadgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
  },
  neon_cyber_cyan: {
    id: 'neon_cyber_cyan',
    nameAr: 'السايان النيوني',
    nameEn: 'Neon Cyber Cyan',
    descAr: 'فيروزي جليدي سيبراني فائق التوهج والوضوح للرتب الفضية',
    icon: '⚡',
    primary: '#06B6D4',
    light: '#67E8F9',
    dark: '#0E7490',
    glowRgba: 'rgba(6, 182, 212, 0.65)',
    lineGlow: 'rgba(103, 232, 249, 0.85)',
    borderHex: '#06B6D4',
    textHex: '#67E8F9',
    tailwindBorder: 'border-cyan-400',
    tailwindText: 'text-cyan-300',
    tailwindRing: 'ring-cyan-400',
    gradientFrom: 'from-cyan-500',
    gradientVia: 'via-teal-400',
    gradientTo: 'to-cyan-700',
    bgGradient: 'from-[#03151D] via-[#072432] to-[#010B0E]',
    corniceBorder: 'border-cyan-500/50',
    accentBadgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
  },
  sunset_amber: {
    id: 'sunset_amber',
    nameAr: 'الكهرمان الناري',
    nameEn: 'Fiery Amber',
    descAr: 'وهج برتقالي دافئ من الكهرمان العتيق يعكس شجاعة الصقور',
    icon: '🔥',
    primary: '#F97316',
    light: '#FDBA74',
    dark: '#C2410C',
    glowRgba: 'rgba(249, 115, 22, 0.65)',
    lineGlow: 'rgba(253, 186, 116, 0.85)',
    borderHex: '#F97316',
    textHex: '#FDBA74',
    tailwindBorder: 'border-orange-500',
    tailwindText: 'text-orange-400',
    tailwindRing: 'ring-orange-400',
    gradientFrom: 'from-orange-500',
    gradientVia: 'via-amber-400',
    gradientTo: 'to-orange-700',
    bgGradient: 'from-[#1A0A03] via-[#2A1206] to-[#0C0401]',
    corniceBorder: 'border-orange-500/50',
    accentBadgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/50',
  },
  platinum_silver: {
    id: 'platinum_silver',
    nameAr: 'البلاتين الفضي',
    nameEn: 'Pure Platinum',
    descAr: 'فضي بلاتيني ناصع يرمز للسيادة الصافية والنقاء الأرستقراطي',
    icon: '✨',
    primary: '#E2E8F0',
    light: '#FFFFFF',
    dark: '#64748B',
    glowRgba: 'rgba(226, 232, 240, 0.55)',
    lineGlow: 'rgba(255, 255, 255, 0.85)',
    borderHex: '#E2E8F0',
    textHex: '#F8FAFC',
    tailwindBorder: 'border-slate-300',
    tailwindText: 'text-slate-200',
    tailwindRing: 'ring-slate-300',
    gradientFrom: 'from-slate-200',
    gradientVia: 'via-white',
    gradientTo: 'to-slate-400',
    bgGradient: 'from-[#0F141E] via-[#1A2130] to-[#080B10]',
    corniceBorder: 'border-slate-400/50',
    accentBadgeBg: 'bg-slate-500/20 text-slate-200 border-slate-400/50',
  },
};

export const ALL_VIP_THEMES: VIPThemeConfig[] = Object.values(VIP_THEME_PALETTES);

/**
 * Returns the VIP theme configuration.
 * If user has explicitly selected a themeColor, it is used.
 * Otherwise, falls back to the tier's iconic default theme.
 */
export function getVIPTheme(themeKey?: string | null, tier?: VIPTier): VIPThemeConfig {
  if (themeKey && themeKey in VIP_THEME_PALETTES) {
    return VIP_THEME_PALETTES[themeKey as VIPThemeColorKey];
  }

  // Tier-based smart defaults
  switch (tier) {
    case 'mythic':
      return VIP_THEME_PALETTES.amethyst_cosmic;
    case 'royal':
      return VIP_THEME_PALETTES.amethyst_cosmic;
    case 'gold':
      return VIP_THEME_PALETTES.royal_gold;
    case 'silver':
      return VIP_THEME_PALETTES.neon_cyber_cyan;
    case 'bronze':
      return VIP_THEME_PALETTES.sunset_amber;
    default:
      return VIP_THEME_PALETTES.royal_gold;
  }
}
