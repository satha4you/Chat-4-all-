import React from 'react';
import { VIPTier } from '../../types';

interface RealisticTierEmblemProps {
  tier: VIPTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const RealisticTierEmblem: React.FC<RealisticTierEmblemProps> = ({
  tier,
  size = 'md',
  animated = true,
  className = '',
}) => {
  const sizeMap = {
    xs: 18,
    sm: 26,
    md: 38,
    lg: 52,
    xl: 72,
  }[size];

  const uniqueId = React.useId().replace(/:/g, '_');

  // BRONZE FALCON (صقر البرونز)
  if (tier === 'bronze') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animated ? 'hover:scale-110 transition-transform duration-300' : ''
        } ${className}`}
        style={{ width: sizeMap, height: sizeMap }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_8px_rgba(217,119,6,0.6)]">
          <defs>
            <linearGradient id={`bronzeGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id={`bronzeEye_${uniqueId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="80%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
          </defs>
          {/* Shield Base */}
          <path d="M50 8 L82 22 L76 68 L50 94 L24 68 L18 22 Z" fill="#2A1208" stroke={`url(#bronzeGrad_${uniqueId})`} strokeWidth="3.5" />
          {/* Falcon Wings Outstretched */}
          <path d="M50 32 C35 15 15 25 10 40 C22 45 32 40 44 48 C30 52 20 62 25 72 C35 62 42 56 50 56 C58 56 65 62 75 72 C80 62 70 52 56 48 C68 40 78 45 90 40 C85 25 65 15 50 32 Z" fill={`url(#bronzeGrad_${uniqueId})`} />
          {/* Falcon Head & Beak Profile */}
          <path d="M46 34 C46 25 54 25 58 30 C64 33 66 38 60 41 C54 44 48 41 46 34 Z" fill="#FDE68A" />
          <path d="M60 36 L66 40 L58 43 Z" fill="#78350F" />
          <circle cx="53" cy="33" r="2.5" fill={`url(#bronzeEye_${uniqueId})`} />
          {/* Laurel Accent */}
          <path d="M30 75 C40 85 60 85 70 75" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
        </svg>
      </div>
    );
  }

  // SILVER WOLF (ذئب الفضة)
  if (tier === 'silver') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animated ? 'hover:scale-110 transition-transform duration-300' : ''
        } ${className}`}
        style={{ width: sizeMap, height: sizeMap }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_10px_rgba(56,189,248,0.7)]">
          <defs>
            <linearGradient id={`silverGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id={`iceGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Diamond Ice Crystal Shield */}
          <path d="M50 6 L86 38 L50 94 L14 38 Z" fill="#091422" stroke={`url(#iceGrad_${uniqueId})`} strokeWidth="3.5" />
          {/* Crescent Moon Backdrop */}
          <path d="M50 20 C64 20 75 31 75 45 C75 59 64 70 50 70 C46 70 42 69 39 67 C48 64 54 55 54 45 C54 35 48 26 39 23 C42 21 46 20 50 20 Z" fill={`url(#iceGrad_${uniqueId})`} opacity="0.6" />
          {/* Howling Wolf Head Silhouette */}
          <path d="M36 68 L32 55 L38 46 L34 38 L42 36 L48 42 L56 30 L64 34 L58 45 L66 52 L60 68 Z" fill={`url(#silverGrad_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          {/* Wolf Eye */}
          <circle cx="48" cy="45" r="2" fill="#38BDF8" />
          {/* Frost Sparkle Star */}
          <path d="M50 14 L52 20 L58 22 L52 24 L50 30 L48 24 L42 22 L48 20 Z" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // GOLD EAGLE (نسر الذهب)
  if (tier === 'gold') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animated ? 'hover:scale-110 transition-transform duration-300' : ''
        } ${className}`}
        style={{ width: sizeMap, height: sizeMap }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_12px_rgba(250,204,21,0.8)]">
          <defs>
            <linearGradient id={`goldGradEm_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FACC15" />
              <stop offset="70%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
            <radialGradient id={`sunGrad_${uniqueId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
          </defs>
          {/* Circular Sunburst Border */}
          <circle cx="50" cy="50" r="44" fill="#1C1405" stroke={`url(#goldGradEm_${uniqueId})`} strokeWidth="3.5" />
          {/* Radiant Halo Rays */}
          <path d="M50 10 L50 18 M50 82 L50 90 M10 50 L18 50 M82 50 L90 50 M22 22 L28 28 M72 72 L78 78 M78 22 L72 28 M22 78 L28 72" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          {/* Double-Headed Imperial Gold Eagle */}
          <path d="M50 38 C42 22 24 24 16 38 C28 44 38 42 42 54 C32 58 24 66 28 78 C40 70 45 64 50 64 C55 64 60 70 72 78 C76 66 68 58 58 54 C62 42 72 44 84 38 C76 24 58 22 50 38 Z" fill={`url(#goldGradEm_${uniqueId})`} stroke="#FFFBEB" strokeWidth="1" />
          {/* Eagle Heads */}
          <path d="M43 32 L36 34 L40 38 Z M57 32 L64 34 L60 38 Z" fill="#FEF08A" />
          {/* Central Crown On Top */}
          <path d="M44 26 L42 20 L47 23 L50 18 L53 23 L58 20 L56 26 Z" fill="#FFFBEB" stroke="#854D0E" strokeWidth="0.8" />
          {/* Central Emerald Gem */}
          <circle cx="50" cy="52" r="3.5" fill="#10B981" stroke="#FEF08A" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // ROYAL LION (أسد رويال)
  if (tier === 'royal') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animated ? 'hover:scale-110 transition-transform duration-300' : ''
        } ${className}`}
        style={{ width: sizeMap, height: sizeMap }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_14px_rgba(168,85,247,0.85)]">
          <defs>
            <linearGradient id={`royalGold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF5FF" />
              <stop offset="40%" stopColor="#C084FC" />
              <stop offset="80%" stopColor="#7E22CE" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id={`goldBorder_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
          </defs>
          {/* Baroque Royal Coat of Arms Shield */}
          <path d="M50 6 C74 6 86 16 86 44 C86 70 66 88 50 95 C34 88 14 70 14 44 C14 16 26 6 50 6 Z" fill="#160628" stroke={`url(#goldBorder_${uniqueId})`} strokeWidth="3.5" />
          {/* Heraldic Roaring Lion Rampant Head */}
          <path d="M50 28 C42 28 36 34 35 42 C32 44 30 50 34 54 C32 58 35 64 42 66 C44 72 56 72 58 66 C65 64 68 58 66 54 C70 50 68 44 65 42 C64 34 58 28 50 28 Z" fill={`url(#royalGold_${uniqueId})`} stroke="#FEF08A" strokeWidth="1.2" />
          {/* Lion Mane Strands */}
          <path d="M38 36 C34 32 30 38 28 44 M62 36 C66 32 70 38 72 44 M34 48 C28 50 26 58 30 64 M66 48 C72 50 74 58 70 64" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          {/* Lion Eyes & Nose */}
          <circle cx="45" cy="46" r="2" fill="#FEF08A" />
          <circle cx="55" cy="46" r="2" fill="#FEF08A" />
          <polygon points="50,52 47,49 53,49" fill="#160628" />
          {/* Royal Crown on Lion Head */}
          <path d="M43 28 L40 20 L46 23 L50 17 L54 23 L60 20 L57 28 Z" fill="#FEF08A" stroke="#713F12" strokeWidth="1" />
          {/* Amethyst Heart Jewel at Base */}
          <path d="M50 74 C47 70 43 70 43 74 C43 78 50 82 50 82 C50 82 57 78 57 74 C57 70 53 70 50 74 Z" fill="#C084FC" stroke="#FEF08A" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // MYTHIC SULTAN (سلطان أسطوري)
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animated ? 'hover:scale-110 transition-transform duration-300' : ''
      } ${className}`}
      style={{ width: sizeMap, height: sizeMap }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_16px_rgba(244,63,94,0.95)]">
        <defs>
          <linearGradient id={`mythicGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="30%" stopColor="#FB7185" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#701A75" />
          </linearGradient>
          <linearGradient id={`goldSword_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#713F12" />
          </linearGradient>
          <radialGradient id={`flameGlow_${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="80%" stopColor="#701A75" />
            <stop offset="100%" stopColor="#0B0214" />
          </radialGradient>
        </defs>
        {/* Imperial Octagonal Star Shield */}
        <path d="M50 4 L64 16 L84 16 L88 36 L100 50 L88 64 L84 84 L64 84 L50 96 L36 84 L16 84 L12 64 L0 50 L12 36 L16 16 L36 16 Z" fill="#18041C" stroke={`url(#mythicGrad_${uniqueId})`} strokeWidth="3" />
        {/* Dual Crossed Arabian Scimitars */}
        <path d="M22 26 C36 34 50 48 76 74 L72 78 C46 54 32 40 22 26 Z" fill={`url(#goldSword_${uniqueId})`} />
        <path d="M78 26 C64 34 50 48 24 74 L28 78 C54 54 68 40 78 26 Z" fill={`url(#goldSword_${uniqueId})`} />
        {/* Phoenix Cosmic Wings */}
        <path d="M50 36 C40 20 20 25 15 42 C28 48 38 42 46 52 C35 56 26 66 32 76 C42 66 46 60 50 60 C54 60 58 66 68 76 C74 66 65 56 54 52 C62 42 72 48 85 42 C80 25 60 20 50 36 Z" fill={`url(#mythicGrad_${uniqueId})`} />
        {/* Grand Sultan Imperial Crown */}
        <path d="M40 32 L36 20 L44 24 L50 16 L56 24 L64 20 L60 32 Z" fill="#FEF08A" stroke="#E11D48" strokeWidth="1" />
        {/* Radiant Heart Ruby Diamond */}
        <path d="M50 46 L57 54 L50 64 L43 54 Z" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Top Flame Particle */}
        <circle cx="50" cy="14" r="2.5" fill="#FEF08A" />
      </svg>
    </div>
  );
};
