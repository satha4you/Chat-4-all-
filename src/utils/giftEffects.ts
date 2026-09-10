import confetti from 'canvas-confetti';
import { Gift } from '../types';
import { playSoundEffect } from './soundEffects';

export interface GiftEffectConfig {
  colors: string[];
  emojis: string[];
  shapes: ('circle' | 'square' | 'star')[];
  sound: 'gift_sparkle' | 'oud_chord' | 'bell' | 'cheer' | 'vip_fanfare' | 'applause';
  secondarySound?: 'gift_sparkle' | 'oud_chord' | 'bell' | 'cheer' | 'vip_fanfare' | 'applause';
  rarityLabelAr: string;
  rarityBadgeBg: string;
  borderGlowColor: string;
  particleCount: number;
}

export const GIFT_EFFECT_CONFIGS: Record<string, GiftEffectConfig> = {
  gift_heart: {
    colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#E11D48', '#FFE4E6'],
    emojis: ['💖', '💕', '💓', '💗', '✨', '❤️'],
    shapes: ['circle', 'star'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'نبض المحبة والوداد',
    rarityBadgeBg: 'from-pink-600 to-rose-500',
    borderGlowColor: 'rgba(244, 63, 94, 0.45)',
    particleCount: 75,
  },
  gift_coffee: {
    colors: ['#D4AF37', '#92400E', '#F59E0B', '#FDE68A', '#78350F'],
    emojis: ['☕', '🫖', '🍂', '💫', '🪙', '✨'],
    shapes: ['circle', 'square'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'هدية كرم وترحيب',
    rarityBadgeBg: 'from-amber-600 to-yellow-500',
    borderGlowColor: 'rgba(245, 158, 11, 0.4)',
    particleCount: 80,
  },
  gift_dates: {
    colors: ['#78350F', '#B45309', '#D97706', '#F59E0B', '#FEF3C7'],
    emojis: ['🌴', '🍯', '🍂', '✨', '🪙'],
    shapes: ['circle', 'square'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'رطب سكري ملكي فاخر',
    rarityBadgeBg: 'from-yellow-700 via-amber-600 to-yellow-500',
    borderGlowColor: 'rgba(217, 119, 6, 0.45)',
    particleCount: 85,
  },
  gift_rose: {
    colors: ['#E11D48', '#F43F5E', '#FDA4AF', '#BE123C', '#FFF1F2'],
    emojis: ['🌹', '🌸', '💖', '🥀', '✨', '❤️'],
    shapes: ['circle', 'square'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'هدية المحبة والتقدير',
    rarityBadgeBg: 'from-rose-600 to-pink-500',
    borderGlowColor: 'rgba(244, 63, 94, 0.45)',
    particleCount: 95,
  },
  gift_shisha: {
    colors: ['#F59E0B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#D4AF37'],
    emojis: ['💨', '🫧', '✨', '🌫️', '💫'],
    shapes: ['circle'],
    sound: 'oud_chord',
    rarityLabelAr: 'جلسة سمر وطرب ديوان',
    rarityBadgeBg: 'from-amber-600 to-slate-500',
    borderGlowColor: 'rgba(245, 158, 11, 0.45)',
    particleCount: 85,
  },
  gift_perfume: {
    colors: ['#C084FC', '#E879F9', '#F472B6', '#FDE047', '#FFFFFF'],
    emojis: ['🧪', '✨', '🌸', '💎', '💫', '🫧'],
    shapes: ['circle', 'star'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'نفحات المسك والعنبر الملكي',
    rarityBadgeBg: 'from-purple-600 via-pink-500 to-yellow-400',
    borderGlowColor: 'rgba(192, 132, 252, 0.5)',
    particleCount: 95,
  },
  gift_oud: {
    colors: ['#D4AF37', '#B45309', '#FBBF24', '#78350F', '#FEF3C7'],
    emojis: ['🪵', '🪔', '👑', '🌟', '✨', '⚜️'],
    shapes: ['circle', 'star'],
    sound: 'oud_chord',
    secondarySound: 'gift_sparkle',
    rarityLabelAr: 'أصالة ملكية فاخرة',
    rarityBadgeBg: 'from-amber-700 via-yellow-600 to-amber-500',
    borderGlowColor: 'rgba(212, 175, 55, 0.5)',
    particleCount: 115,
  },
  gift_dallah: {
    colors: ['#FFD700', '#F59E0B', '#B45309', '#FEF08A', '#FFFFFF'],
    emojis: ['🫖', '☕', '✨', '👑', '🌟', '🪙'],
    shapes: ['star', 'circle'],
    sound: 'bell',
    secondarySound: 'oud_chord',
    rarityLabelAr: 'دلة رسلان التراثية المذهبة',
    rarityBadgeBg: 'from-amber-500 via-yellow-400 to-amber-600',
    borderGlowColor: 'rgba(255, 215, 0, 0.6)',
    particleCount: 125,
  },
  gift_ring: {
    colors: ['#E11D48', '#38BDF8', '#F472B6', '#FFFFFF', '#D4AF37'],
    emojis: ['💍', '💎', '💖', '💫', '✨', '💎'],
    shapes: ['star', 'circle'],
    sound: 'bell',
    secondarySound: 'gift_sparkle',
    rarityLabelAr: 'ياقوت ألماسي نادر',
    rarityBadgeBg: 'from-rose-600 via-fuchsia-600 to-purple-600',
    borderGlowColor: 'rgba(225, 29, 72, 0.55)',
    particleCount: 130,
  },
  gift_sword: {
    colors: ['#38BDF8', '#D4AF37', '#60A5FA', '#FFFFFF', '#1E40AF'],
    emojis: ['⚔️', '🗡️', '⚡', '✨', '🛡️', '💥'],
    shapes: ['star', 'square'],
    sound: 'bell',
    secondarySound: 'cheer',
    rarityLabelAr: 'سيف البطولة والشهامة الأصيل',
    rarityBadgeBg: 'from-blue-600 via-sky-500 to-amber-400',
    borderGlowColor: 'rgba(56, 189, 248, 0.65)',
    particleCount: 145,
  },
  gift_horse: {
    colors: ['#D4AF37', '#92400E', '#F59E0B', '#FEF3C7', '#FFFFFF'],
    emojis: ['🐎', '🏇', '💨', '⚡', '👑', '🌟'],
    shapes: ['star', 'circle'],
    sound: 'cheer',
    secondarySound: 'vip_fanfare',
    rarityLabelAr: 'فرس عربي أصيل مذهب',
    rarityBadgeBg: 'from-amber-600 via-orange-500 to-yellow-400',
    borderGlowColor: 'rgba(245, 158, 11, 0.65)',
    particleCount: 155,
  },
  gift_falcon: {
    colors: ['#D4AF37', '#38BDF8', '#F59E0B', '#FFFFFF', '#0284C7'],
    emojis: ['🦅', '🪶', '⚡', '👑', '🌟', '✨'],
    shapes: ['star', 'square', 'circle'],
    sound: 'cheer',
    secondarySound: 'vip_fanfare',
    rarityLabelAr: 'صقر العز والشموخ',
    rarityBadgeBg: 'from-blue-600 via-cyan-500 to-amber-400',
    borderGlowColor: 'rgba(56, 189, 248, 0.6)',
    particleCount: 170,
  },
  gift_crown_jewel: {
    colors: ['#FFD700', '#F59E0B', '#C084FC', '#FFFFFF', '#E11D48'],
    emojis: ['👑', '💎', '✨', '⚜️', '🌟', '💫'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'تاج الملوك المرصع بالألماس',
    rarityBadgeBg: 'from-amber-500 via-purple-600 to-yellow-300',
    borderGlowColor: 'rgba(255, 215, 0, 0.75)',
    particleCount: 185,
  },
  gift_supercar: {
    colors: ['#F59E0B', '#EF4444', '#D4AF37', '#F97316', '#FFFFFF'],
    emojis: ['🏎️', '💨', '🔥', '⚡', '🪙', '🌟'],
    shapes: ['square', 'star'],
    sound: 'applause',
    secondarySound: 'vip_fanfare',
    rarityLabelAr: 'سوبركار أسطورية فائقة',
    rarityBadgeBg: 'from-orange-600 via-red-600 to-yellow-500',
    borderGlowColor: 'rgba(249, 115, 22, 0.65)',
    particleCount: 200,
  },
  gift_jet: {
    colors: ['#38BDF8', '#818CF8', '#FFFFFF', '#D4AF37', '#1E3A8A'],
    emojis: ['✈️', '🛫', '💨', '✨', '☁️', '⚡'],
    shapes: ['circle', 'star'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'طائرة نفاثة ديوان إكسبريس',
    rarityBadgeBg: 'from-sky-500 via-blue-600 to-indigo-700',
    borderGlowColor: 'rgba(56, 189, 248, 0.7)',
    particleCount: 210,
  },
  gift_castle: {
    colors: ['#FFD700', '#C084FC', '#F472B6', '#38BDF8', '#FFFFFF', '#9333EA'],
    emojis: ['🏰', '👑', '💎', '🌟', '⚜️', '🏛️', '✨'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'قصر الملوك والأساطير',
    rarityBadgeBg: 'from-purple-700 via-pink-600 to-amber-400',
    borderGlowColor: 'rgba(192, 132, 252, 0.75)',
    particleCount: 240,
  },
  gift_yacht: {
    colors: ['#06B6D4', '#0EA5E9', '#38BDF8', '#D4AF37', '#FFFFFF'],
    emojis: ['🛥️', '🌊', '⚓', '👑', '🌟', '✨'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'يخت المليارديرات الذهبي العائم',
    rarityBadgeBg: 'from-cyan-600 via-blue-600 to-amber-400',
    borderGlowColor: 'rgba(6, 182, 212, 0.8)',
    particleCount: 250,
  },
  gift_lion: {
    colors: ['#FFD700', '#F59E0B', '#DC2626', '#FFFFFF', '#B45309'],
    emojis: ['🦁', '👑', '🐾', '🔥', '⚡', '🌟', '✨'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'ملك الصحراء المهيب',
    rarityBadgeBg: 'from-amber-600 via-red-600 to-yellow-400',
    borderGlowColor: 'rgba(245, 158, 11, 0.8)',
    particleCount: 270,
  },
  gift_dragon: {
    colors: ['#EF4444', '#F97316', '#F59E0B', '#DC2626', '#7F1D1D', '#FDE047'],
    emojis: ['🐉', '🔥', '☄️', '⚡', '👑', '💥', '✨'],
    shapes: ['star', 'square', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'تنين اللهب الأسطوري الخالد',
    rarityBadgeBg: 'from-red-700 via-orange-600 to-yellow-400',
    borderGlowColor: 'rgba(239, 68, 68, 0.85)',
    particleCount: 290,
  },
  gift_meteor: {
    colors: ['#F97316', '#A855F7', '#EC4899', '#3B82F6', '#FFFFFF'],
    emojis: ['☄️', '🌌', '💥', '✨', '⚡', '💫'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'نيزك الطاقة الكونية الخارقة',
    rarityBadgeBg: 'from-fuchsia-600 via-orange-500 to-indigo-600',
    borderGlowColor: 'rgba(249, 115, 22, 0.85)',
    particleCount: 300,
  },
  gift_galaxy: {
    colors: ['#A855F7', '#3B82F6', '#EC4899', '#6366F1', '#FDE047', '#FFFFFF'],
    emojis: ['🌌', '✨', '⭐', '🪐', '💫', '👑', '🌟'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'مجرة الأكوان الأبدية العظمى',
    rarityBadgeBg: 'from-purple-900 via-indigo-600 to-pink-500',
    borderGlowColor: 'rgba(168, 85, 247, 0.95)',
    particleCount: 320,
  },
  gift_emerald_bouquet: {
    colors: ['#10B981', '#059669', '#E11D48', '#F59E0B', '#6EE7B7'],
    emojis: ['💐', '💎', '🌹', '✨', '💚', '❤️'],
    shapes: ['circle', 'star'],
    sound: 'gift_sparkle',
    rarityLabelAr: 'باقة الياقوت والزمرد الملكية',
    rarityBadgeBg: 'from-emerald-600 via-rose-600 to-amber-500',
    borderGlowColor: 'rgba(16, 185, 129, 0.6)',
    particleCount: 110,
  },
  gift_diamond_rain: {
    colors: ['#38BDF8', '#67E8F9', '#FFFFFF', '#93C5FD', '#E0F2FE'],
    emojis: ['💎', '✨', '🔷', '💍', '🌟', '❄️'],
    shapes: ['star', 'circle'],
    sound: 'bell',
    secondarySound: 'gift_sparkle',
    rarityLabelAr: 'شلال الألماس الكريستالي',
    rarityBadgeBg: 'from-cyan-600 via-sky-500 to-blue-400',
    borderGlowColor: 'rgba(56, 189, 248, 0.75)',
    particleCount: 170,
  },
  gift_treasure_chest: {
    colors: ['#FFD700', '#F59E0B', '#D97706', '#EF4444', '#FFFFFF'],
    emojis: ['🧰', '🪙', '💎', '👑', '✨', '💍', '💰'],
    shapes: ['square', 'star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'gift_sparkle',
    rarityLabelAr: 'كنز السلطان الملكي المليء بالجواهر',
    rarityBadgeBg: 'from-amber-600 via-yellow-500 to-amber-700',
    borderGlowColor: 'rgba(255, 215, 0, 0.8)',
    particleCount: 220,
  },
  gift_golden_throne: {
    colors: ['#FFD700', '#B45309', '#DC2626', '#FEF08A', '#7F1D1D'],
    emojis: ['🪑', '👑', '⚜️', '🏛️', '🌟', '✨', '🦁'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'cheer',
    rarityLabelAr: 'عرش الملوك والإمبراطورية الأسمى',
    rarityBadgeBg: 'from-amber-600 via-red-600 to-yellow-400',
    borderGlowColor: 'rgba(245, 158, 11, 0.85)',
    particleCount: 260,
  },
  gift_rocket: {
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#FFFFFF'],
    emojis: ['🚀', '🌌', '🔥', '💫', '⭐', '✨', '🪐'],
    shapes: ['star', 'square', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'applause',
    rarityLabelAr: 'صاروخ استكشاف المجرات الفضائي',
    rarityBadgeBg: 'from-blue-600 via-indigo-600 to-orange-500',
    borderGlowColor: 'rgba(59, 130, 246, 0.9)',
    particleCount: 280,
  },
  gift_phoenix: {
    colors: ['#EF4444', '#F97316', '#F59E0B', '#FFD700', '#FFFFFF', '#DC2626'],
    emojis: ['🦚', '🔥', '🦅', '⚡', '✨', '👑', '🌟'],
    shapes: ['star', 'circle'],
    sound: 'vip_fanfare',
    secondarySound: 'cheer',
    rarityLabelAr: 'طائر الفينيق الأسطوري الخالد',
    rarityBadgeBg: 'from-red-600 via-orange-500 to-amber-400',
    borderGlowColor: 'rgba(239, 68, 68, 0.95)',
    particleCount: 310,
  },
};

// Fallback config for any dynamic/unknown gift
export const DEFAULT_GIFT_CONFIG: GiftEffectConfig = {
  colors: ['#D4AF37', '#F59E0B', '#E11D48', '#38BDF8', '#FFFFFF'],
  emojis: ['🎁', '✨', '🌟', '💫', '💖'],
  shapes: ['circle', 'star'],
  sound: 'gift_sparkle',
  rarityLabelAr: 'هدية ديوان VIP',
  rarityBadgeBg: 'from-amber-500 to-yellow-400',
  borderGlowColor: 'rgba(212, 175, 55, 0.5)',
  particleCount: 100,
};

export const getGiftEffectConfig = (giftId: string): GiftEffectConfig => {
  return GIFT_EFFECT_CONFIGS[giftId] || DEFAULT_GIFT_CONFIG;
};

/**
 * Triggers multi-stage colorful confetti bursts tailored to the gift and combo count
 */
export const launchGiftConfetti = (gift: Gift, comboCount: number = 1): void => {
  const config = getGiftEffectConfig(gift.id);
  const baseCount = Math.min(config.particleCount * (comboCount > 1 ? 1.4 : 1), 300);

  // Play audio effects
  playSoundEffect(config.sound);
  if (config.secondarySound && (gift.rarity === 'epic' || gift.rarity === 'legendary' || comboCount >= 5)) {
    setTimeout(() => {
      playSoundEffect(config.secondarySound!);
    }, 280);
  }

  // 1. Initial Center Burst
  confetti({
    particleCount: Math.floor(baseCount * 0.7),
    spread: 90,
    origin: { x: 0.5, y: 0.6 },
    colors: config.colors,
    shapes: config.shapes,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.1,
    zIndex: 9999,
  });

  // 2. Specialized bursts based on gift rarity / animationType
  if (gift.animationType === 'rose_shower') {
    // Cascading soft rose petals & gentle sparkles
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.35),
          angle: 270,
          spread: 140,
          origin: { x: 0.2 + i * 0.2, y: 0.02 },
          colors: config.colors,
          shapes: ['circle', 'star'],
          startVelocity: 12,
          gravity: 0.4,
          scalar: 1.2,
          zIndex: 9999,
        });
      }, i * 220);
    }
  } else if (gift.animationType === 'dallah_pour') {
    // Golden fountain arc pour
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(baseCount * 0.6),
        angle: 45,
        spread: 55,
        origin: { x: 0.35, y: 0.4 },
        colors: config.colors,
        shapes: ['star', 'circle'],
        startVelocity: 28,
        gravity: 0.9,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 150);
  } else if (gift.animationType === 'swords') {
    // Dual clash blast from both sides colliding at center
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(baseCount * 0.5),
        angle: 40,
        spread: 60,
        origin: { x: 0.1, y: 0.5 },
        colors: config.colors,
        shapes: ['star', 'square'],
        startVelocity: 42,
        zIndex: 9999,
      });
      confetti({
        particleCount: Math.floor(baseCount * 0.5),
        angle: 140,
        spread: 60,
        origin: { x: 0.9, y: 0.5 },
        colors: config.colors,
        shapes: ['star', 'square'],
        startVelocity: 42,
        zIndex: 9999,
      });
    }, 120);
  } else if (gift.animationType === 'supercar') {
    // High-speed horizontal trail across the bottom half
    [0.15, 0.45, 0.75].forEach((xPos, idx) => {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.4),
          angle: 90,
          spread: 75,
          origin: { x: xPos, y: 0.75 },
          colors: config.colors,
          shapes: ['square', 'star'],
          startVelocity: 35,
          zIndex: 9999,
        });
      }, idx * 160);
    });
  } else if (gift.animationType === 'falcon' || gift.animationType === 'jet') {
    // High altitude diagonal swoop
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(baseCount * 0.7),
        angle: 225,
        spread: 80,
        origin: { x: 0.9, y: 0.1 },
        colors: config.colors,
        shapes: ['star', 'circle'],
        startVelocity: 48,
        zIndex: 9999,
      });
    }, 150);
  } else if (gift.animationType === 'dragon') {
    // Mythic dragon fiery vortex from bottom left to top right
    const flameColors = config.colors;
    [0, 200, 400, 650].forEach((delay, idx) => {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.35),
          angle: 45 + idx * 15,
          spread: 70,
          origin: { x: 0.15 + idx * 0.2, y: 0.8 - idx * 0.15 },
          colors: flameColors,
          shapes: ['star', 'circle', 'square'],
          startVelocity: 46,
          scalar: 1.3,
          zIndex: 9999,
        });
      }, delay);
    });
  } else if (gift.animationType === 'galaxy') {
    // Cosmic starburst in a spiral ring
    const duration = 2400;
    const end = Date.now() + duration;
    let step = 0;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      step++;
      const angle = (step * 45) % 360;
      confetti({
        particleCount: 24,
        angle: angle,
        spread: 60,
        origin: { x: 0.5, y: 0.45 },
        colors: config.colors,
        shapes: ['star', 'circle'],
        startVelocity: 25,
        scalar: 1.2,
        zIndex: 9999,
      });
    }, 180);
  } else if (gift.animationType === 'diamond_rain') {
    // Cascading crystal waterfall from the sky
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.3),
          angle: 270,
          spread: 110,
          origin: { x: 0.15 + i * 0.18, y: 0.02 },
          colors: config.colors,
          shapes: ['star', 'circle'],
          startVelocity: 18,
          gravity: 0.6,
          scalar: 1.3,
          ticks: 250,
          zIndex: 9999,
        });
      }, i * 140);
    }
  } else if (gift.animationType === 'emerald_burst') {
    // Elegant bouquet blossoming in 4 rhythmic waves
    [0, 150, 300, 450].forEach((delay, idx) => {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.35),
          spread: 80 + idx * 20,
          origin: { x: 0.5, y: 0.55 },
          colors: config.colors,
          shapes: ['circle', 'star'],
          startVelocity: 30 + idx * 5,
          scalar: 1.15,
          zIndex: 9999,
        });
      }, delay);
    });
  } else if (gift.animationType === 'treasure_chest') {
    // Fountain geyser of coins and gems erupting from chest
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        confetti({
          particleCount: Math.floor(baseCount * 0.4),
          angle: 90,
          spread: 75,
          origin: { x: 0.5, y: 0.75 },
          colors: config.colors,
          shapes: ['star', 'circle', 'square'],
          startVelocity: 55,
          gravity: 1.2,
          scalar: 1.35,
          ticks: 280,
          zIndex: 9999,
        });
      }, i * 200);
    }
  } else if (gift.animationType === 'rocket') {
    // Vertical rocket blast with massive smoke and fiery sparks
    const rocketSteps = [0, 100, 200, 300, 400, 500];
    rocketSteps.forEach((delay, idx) => {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 90,
          spread: 45,
          origin: { x: 0.5, y: 0.9 - idx * 0.12 },
          colors: config.colors,
          shapes: ['circle', 'star'],
          startVelocity: 35,
          scalar: 1.2,
          zIndex: 9999,
        });
      }, delay);
    });
  } else if (gift.animationType === 'phoenix') {
    // Fiery majestic wings sweeping across with fire embers
    const phoenixInterval = setInterval(() => {
      confetti({
        particleCount: 40,
        angle: 45 + Math.random() * 90,
        spread: 120,
        origin: { x: 0.2 + Math.random() * 0.6, y: 0.3 + Math.random() * 0.3 },
        colors: config.colors,
        shapes: ['star', 'circle'],
        scalar: 1.4,
        startVelocity: 40,
        zIndex: 9999,
      });
    }, 220);
    setTimeout(() => clearInterval(phoenixInterval), 2200);
  } else if (gift.animationType === 'golden_throne') {
    // Dual regal side cannons and imperial crown shower
    confetti({
      particleCount: 90,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.8 },
      colors: config.colors,
      shapes: ['star', 'circle'],
      startVelocity: 55,
      scalar: 1.3,
      zIndex: 9999,
    });
    confetti({
      particleCount: 90,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.8 },
      colors: config.colors,
      shapes: ['star', 'circle'],
      startVelocity: 55,
      scalar: 1.3,
      zIndex: 9999,
    });
  } else if (gift.animationType === 'rain' || gift.rarity === 'rare') {
    // Shimmering rain from top
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(baseCount * 0.5),
        angle: 270,
        spread: 120,
        origin: { x: 0.5, y: 0.05 },
        colors: config.colors,
        shapes: ['star', 'circle'],
        startVelocity: 15,
        gravity: 0.5,
        scalar: 1.2,
        zIndex: 9999,
      });
    }, 200);
  } else if (gift.animationType === 'fireworks' || gift.rarity === 'epic') {
    // Side cannon blasts
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(baseCount * 0.5),
        angle: 60,
        spread: 70,
        origin: { x: 0.08, y: 0.85 },
        colors: config.colors,
        shapes: config.shapes,
        startVelocity: 45,
        zIndex: 9999,
      });
      confetti({
        particleCount: Math.floor(baseCount * 0.5),
        angle: 120,
        spread: 70,
        origin: { x: 0.92, y: 0.85 },
        colors: config.colors,
        shapes: config.shapes,
        startVelocity: 45,
        zIndex: 9999,
      });
    }, 220);
  } else if (gift.animationType === 'royal_banner' || gift.animationType === 'crown_burst' || gift.rarity === 'legendary' || comboCount >= 10) {
    // Grand royal firework show: left, right, and top bursts staggered across 2 seconds
    const duration = 2200;
    const animationEnd = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleRatio = timeLeft / duration;
      
      // Random bursts across the top/center canvas
      confetti({
        particleCount: Math.floor(35 * particleRatio) + 15,
        spread: 100,
        origin: {
          x: 0.2 + Math.random() * 0.6,
          y: 0.2 + Math.random() * 0.4,
        },
        colors: config.colors,
        shapes: ['star', 'circle'],
        scalar: 1.25,
        zIndex: 9999,
      });
    }, 320);

    // Initial dual cannon launch
    confetti({
      particleCount: 80,
      angle: 65,
      spread: 80,
      origin: { x: 0.05, y: 0.9 },
      colors: config.colors,
      shapes: ['star', 'circle'],
      startVelocity: 52,
      zIndex: 9999,
    });
    confetti({
      particleCount: 80,
      angle: 115,
      spread: 80,
      origin: { x: 0.95, y: 0.9 },
      colors: config.colors,
      shapes: ['star', 'circle'],
      startVelocity: 52,
      zIndex: 9999,
    });
  }
};
