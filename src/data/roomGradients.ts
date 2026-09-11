export interface RoomCardGradient {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  gradientClass: string;   // Tailwind background gradient classes
  borderClass: string;     // Tailwind border classes
  glowClass: string;       // Ambient box shadow
  accentColor: string;     // Hex color for glowing particles and accents
  previewGradient: string; // Gradient swatch for UI picker
  topStripClass: string;   // Top accent strip line
}

export const ROOM_CARD_GRADIENTS: RoomCardGradient[] = [
  {
    id: 'royal_gold',
    nameAr: 'الذهب الملكي الخالص',
    nameEn: 'Royal Gold',
    icon: '👑',
    gradientClass: 'from-amber-950/70 via-[#181206] to-[#0A0A0A]',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    glowClass: 'shadow-[0_4px_25px_rgba(245,158,11,0.18)]',
    accentColor: '#F59E0B',
    previewGradient: 'from-amber-500 via-yellow-400 to-amber-700',
    topStripClass: 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600',
  },
  {
    id: 'crimson_ruby',
    nameAr: 'الياقوت القرمزي الفاخر',
    nameEn: 'Crimson Ruby',
    icon: '💎',
    gradientClass: 'from-rose-950/70 via-[#19070c] to-[#0A0A0A]',
    borderClass: 'border-rose-500/40 hover:border-rose-400',
    glowClass: 'shadow-[0_4px_25px_rgba(244,63,94,0.18)]',
    accentColor: '#F43F5E',
    previewGradient: 'from-rose-500 via-red-400 to-rose-700',
    topStripClass: 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-600',
  },
  {
    id: 'emerald_sovereign',
    nameAr: 'الزمرد الأخضر السيادي',
    nameEn: 'Sovereign Emerald',
    icon: '🌿',
    gradientClass: 'from-emerald-950/70 via-[#061810] to-[#0A0A0A]',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    glowClass: 'shadow-[0_4px_25px_rgba(16,185,129,0.18)]',
    accentColor: '#10B981',
    previewGradient: 'from-emerald-500 via-teal-400 to-emerald-700',
    topStripClass: 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-600',
  },
  {
    id: 'sapphire_ocean',
    nameAr: 'الياقوت الأزرق الملكي',
    nameEn: 'Royal Sapphire',
    icon: '🌊',
    gradientClass: 'from-blue-950/70 via-[#071325] to-[#0A0A0A]',
    borderClass: 'border-blue-500/40 hover:border-blue-400',
    glowClass: 'shadow-[0_4px_25px_rgba(59,130,246,0.18)]',
    accentColor: '#3B82F6',
    previewGradient: 'from-blue-500 via-cyan-400 to-blue-700',
    topStripClass: 'bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-600',
  },
  {
    id: 'amethyst_purple',
    nameAr: 'الأميثيست الأرجواني',
    nameEn: 'Cosmic Amethyst',
    icon: '🔮',
    gradientClass: 'from-purple-950/70 via-[#150724] to-[#0A0A0A]',
    borderClass: 'border-purple-500/40 hover:border-purple-400',
    glowClass: 'shadow-[0_4px_25px_rgba(168,85,247,0.18)]',
    accentColor: '#A855F7',
    previewGradient: 'from-purple-500 via-fuchsia-400 to-purple-700',
    topStripClass: 'bg-gradient-to-r from-purple-500 via-fuchsia-300 to-purple-600',
  },
  {
    id: 'sunset_amber',
    nameAr: 'الشفق الغروبي المذهب',
    nameEn: 'Sunset Amber',
    icon: '🌅',
    gradientClass: 'from-orange-950/70 via-[#1f0d05] to-[#0A0A0A]',
    borderClass: 'border-orange-500/40 hover:border-orange-400',
    glowClass: 'shadow-[0_4px_25px_rgba(249,115,22,0.18)]',
    accentColor: '#F97316',
    previewGradient: 'from-orange-500 via-amber-400 to-orange-700',
    topStripClass: 'bg-gradient-to-r from-orange-500 via-amber-300 to-orange-600',
  },
  {
    id: 'midnight_obsidian',
    nameAr: 'البلاتين الأسود الأسطوري',
    nameEn: 'Midnight Obsidian',
    icon: '⚔️',
    gradientClass: 'from-zinc-900/80 via-[#111114] to-[#0A0A0A]',
    borderClass: 'border-zinc-600/40 hover:border-zinc-400',
    glowClass: 'shadow-[0_4px_25px_rgba(161,161,170,0.15)]',
    accentColor: '#E4E4E7',
    previewGradient: 'from-zinc-400 via-slate-300 to-zinc-700',
    topStripClass: 'bg-gradient-to-r from-zinc-300 via-slate-200 to-zinc-500',
  },
  {
    id: 'cyber_cyan',
    nameAr: 'النيون الفيروزي المشع',
    nameEn: 'Cyber Neon Cyan',
    icon: '⚡',
    gradientClass: 'from-cyan-950/70 via-[#05171f] to-[#0A0A0A]',
    borderClass: 'border-cyan-500/40 hover:border-cyan-400',
    glowClass: 'shadow-[0_4px_25px_rgba(6,182,212,0.18)]',
    accentColor: '#06B6D4',
    previewGradient: 'from-cyan-500 via-teal-400 to-blue-700',
    topStripClass: 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-600',
  },
];

export const DEFAULT_ROOM_GRADIENT = ROOM_CARD_GRADIENTS[0];
