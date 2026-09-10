import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VIPTier } from '../../types';

interface RealisticCrownProps {
  tier?: VIPTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  isHovered?: boolean;
  className?: string;
}

export const RealisticCrown: React.FC<RealisticCrownProps> = ({
  tier = 'mythic',
  size = 'md',
  animated = true,
  isHovered: externalHovered,
  className = '',
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHover;

  // Dimensions based on size preset
  const sizeMap = {
    xs: { width: 22, height: 18 },
    sm: { width: 30, height: 24 },
    md: { width: 46, height: 36 },
    lg: { width: 68, height: 54 },
    xl: { width: 92, height: 72 },
    '2xl': { width: 118, height: 92 },
  }[size];

  // Distinct color palettes for every single VIP tier
  const palette = {
    bronze: {
      metalLight: '#FED7AA',
      metalMid: '#D97706',
      metalDark: '#9A3412',
      metalShadow: '#431407',
      capBg: '#2A1205',
      gemPrimary: '#EA580C',
      gemSecondary: '#F97316',
      glow: 'rgba(234, 88, 12, 0.75)',
      sparkle: '#FFEDD5',
    },
    silver: {
      metalLight: '#FFFFFF',
      metalMid: '#94A3B8',
      metalDark: '#475569',
      metalShadow: '#0F172A',
      capBg: '#081426',
      gemPrimary: '#06B6D4',
      gemSecondary: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.8)',
      sparkle: '#E0F2FE',
    },
    gold: {
      metalLight: '#FEF08A',
      metalMid: '#EAB308',
      metalDark: '#B45309',
      metalShadow: '#451A03',
      capBg: '#4A0505',
      gemPrimary: '#DC2626',
      gemSecondary: '#EF4444',
      glow: 'rgba(234, 179, 8, 0.85)',
      sparkle: '#FEF9C3',
    },
    royal: {
      metalLight: '#FEF9C3',
      metalMid: '#F59E0B',
      metalDark: '#1D4ED8',
      metalShadow: '#1E3A8A',
      capBg: '#1E1B4B',
      gemPrimary: '#2563EB',
      gemSecondary: '#9333EA',
      glow: 'rgba(37, 99, 235, 0.9)',
      sparkle: '#DBEAFE',
    },
    mythic: {
      metalLight: '#FFFFFF',
      metalMid: '#C084FC',
      metalDark: '#7E22CE',
      metalShadow: '#18042B',
      capBg: '#24043D',
      gemPrimary: '#A855F7',
      gemSecondary: '#F43F5E',
      glow: 'rgba(168, 85, 247, 0.95)',
      sparkle: '#FDE047',
    },
    none: {
      metalLight: '#FEF08A',
      metalMid: '#EAB308',
      metalDark: '#B45309',
      metalShadow: '#451A03',
      capBg: '#24043D',
      gemPrimary: '#A855F7',
      gemSecondary: '#DC2626',
      glow: 'rgba(234, 179, 8, 0.5)',
      sparkle: '#FFFFFF',
    },
  }[tier || 'mythic'];

  const uniqueId = React.useId().replace(/:/g, '_');

  return (
    <motion.div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        perspective: 900,
        transformStyle: 'preserve-3d',
      }}
      animate={
        animated
          ? {
              rotateY: isHovered ? [-18, 18, -18] : [-12, 12, -12],
              rotateX: isHovered ? [7, -7, 7] : [4, -4, 4],
              rotateZ: [-2, 2, -2],
              y: isHovered ? [-5, 5, -5] : [-3, 3, -3],
              scale: isHovered ? 1.15 : 1,
            }
          : undefined
      }
      transition={
        animated
          ? {
              rotateY: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
              rotateX: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
              scale: { duration: 0.35, ease: 'easeOut' },
            }
          : undefined
      }
    >
      {/* 1. Intensive Glow Pulse Halo on Hover or Continuous Ambient Glow */}
      <motion.div
        animate={
          isHovered
            ? {
                scale: [1, 1.4, 1.25],
                opacity: [0.75, 1, 0.8],
                filter: ['blur(6px)', 'blur(12px)', 'blur(8px)'],
              }
            : animated
            ? {
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.6, 0.35],
                filter: ['blur(4px)', 'blur(6px)', 'blur(4px)'],
              }
            : undefined
        }
        transition={{
          repeat: Infinity,
          duration: isHovered ? 1.2 : 2.6,
          ease: 'easeInOut',
        }}
        className="absolute -inset-2 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, ${palette.metalMid}33 50%, transparent 80%)`,
        }}
      />

      {/* 2. Sparkle particle when hovered */}
      {isHovered && (
        <>
          <span className="absolute -top-2 -right-2 text-[10px] pointer-events-none animate-ping text-amber-300">
            ✨
          </span>
          <span className="absolute -bottom-1 -left-2 text-[9px] pointer-events-none animate-pulse text-yellow-200">
            🌟
          </span>
        </>
      )}

      {/* 3. 3D SVG Crown Architecture */}
      <svg
        width={sizeMap.width}
        height={sizeMap.height}
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isHovered
            ? `drop-shadow(0 0 12px ${palette.glow}) drop-shadow(0 0 20px ${palette.metalLight}99)`
            : animated
            ? `drop-shadow(0 3px 8px ${palette.glow}) drop-shadow(0 0 8px ${palette.metalMid}55)`
            : undefined,
        }}
      >
        <defs>
          {/* Tier Metallic Primary Gradient */}
          <linearGradient id={`tierMetal_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor={palette.metalLight} />
            <stop offset="60%" stopColor={palette.metalMid} />
            <stop offset="90%" stopColor={palette.metalDark} />
            <stop offset="100%" stopColor={palette.metalShadow} />
          </linearGradient>

          {/* Tier Highlight Gradient */}
          <linearGradient id={`tierSpecular_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.metalLight} stopOpacity="0.4" />
          </linearGradient>

          {/* Gem Primary Radial */}
          <radialGradient id={`gemRad1_${uniqueId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor={palette.gemSecondary} />
            <stop offset="85%" stopColor={palette.gemPrimary} />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Filter for sparkling gleam */}
          <filter id={`sparkleGlow_${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═════════════════════════════════════════════════════════════════
            EACH VIP LEVEL HAS ITS OWN TOTALLY DISTINCT CROWN ARCHITECTURE!
            ═════════════════════════════════════════════════════════════════ */}

        {/* ── 1. BRONZE (VIP 1 Falcon Warrior Wing Coronet) ── */}
        {tier === 'bronze' && (
          <g id="realistic_bronze">
            {/* Warrior Back Leather Cap */}
            <path d="M 28 66 C 30 42, 44 32, 60 30 C 76 32, 90 42, 92 66 Z" fill={palette.capBg} />

            {/* Wing Spires (Left and Right Sweeping Chevron Feathers) */}
            <polygon points="14,68 6,34 26,48 28,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="26,68 22,26 38,44 40,68" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalLight} strokeWidth="0.8" />
            
            {/* Center Falcon Spear Peak */}
            <polygon points="46,68 60,10 74,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.2" />
            <polygon points="55,68 60,18 65,68" fill={`url(#tierSpecular_${uniqueId})`} />
            <circle cx="60" cy="14" r="3.2" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            <polygon points="94,68 98,26 82,44 80,68" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalLight} strokeWidth="0.8" />
            <polygon points="106,68 114,34 94,48 92,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Heavy Riveted Bronze Diadem Rim */}
            <path d="M 10 68 C 35 73, 85 73, 110 68 L 110 80 C 85 86, 35 86, 10 80 Z" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalShadow} strokeWidth="1" />
            {[18, 34, 50, 60, 70, 86, 102].map((cx, i) => (
              <circle key={i} cx={cx} cy="74" r="2.2" fill="#FFFFFF" stroke={palette.metalShadow} strokeWidth="0.6" />
            ))}

            {/* Center Amber Shield Gem */}
            <polygon points="60,46 68,56 60,66 52,56" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* ── 2. SILVER (VIP 2 Lunar Crescent Gothic Tiara) ── */}
        {tier === 'silver' && (
          <g id="realistic_silver">
            {/* Night Icy Cap */}
            <path d="M 30 66 C 32 38, 44 26, 60 24 C 76 26, 88 38, 90 66 Z" fill={palette.capBg} />

            {/* Gothic Needle Arches */}
            <path
              d="M 16 68 C 14 50, 16 34, 22 22 C 26 34, 32 44, 36 56 C 42 40, 48 24, 52 14 C 55 26, 58 40, 60 50 C 62 40, 65 26, 68 14 C 72 24, 78 40, 84 56 C 88 44, 94 34, 98 22 C 104 34, 106 50, 104 68 Z"
              fill={`url(#tierMetal_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />

            {/* Center Shimmering Crescent Moon */}
            <g transform="translate(60, 20)">
              <path d="M -10 -6 C -10 6, 10 6, 10 -6 C 7 1, -7 1, -10 -6 Z" fill="#FFFFFF" />
              {/* Droplet Ice Diamond */}
              <circle cx="0" cy="-6" r="3.5" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            </g>

            {/* Tip Stars on Peaks */}
            <circle cx="22" cy="22" r="2.5" fill="#FFFFFF" />
            <circle cx="52" cy="14" r="2.8" fill="#FFFFFF" />
            <circle cx="68" cy="14" r="2.8" fill="#FFFFFF" />
            <circle cx="98" cy="22" r="2.5" fill="#FFFFFF" />

            {/* Platinum Headband */}
            <path d="M 12 68 C 35 73, 85 73, 108 68 L 108 79 C 85 85, 35 85, 12 79 Z" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
            <path d="M 16 73 C 35 77, 85 77, 104 73" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />

            {/* Center Ice Crystal Teardrop */}
            <g transform="translate(60, 54)">
              <ellipse cx="0" cy="0" rx="7" ry="9" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
              <ellipse cx="-2" cy="-2" rx="2" ry="3" fill="#FFFFFF" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ── 3. GOLD (VIP 3 Radiant Solar Sunburst Crown) ── */}
        {tier === 'gold' && (
          <g id="realistic_gold">
            {/* Crimson Imperial Cap */}
            <path d="M 28 66 C 30 42, 44 32, 60 30 C 76 32, 90 42, 92 66 Z" fill={palette.capBg} />

            {/* 7 Radiant Sunburst Flares */}
            <polygon points="12,68 2,36 22,48 24,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="24,68 18,24 36,42 38,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="36,68 40,14 52,44 54,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Highest Center Solar Flare with Sun Finial */}
            <polygon points="52,68 60,4 68,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.4" />
            <polygon points="57,68 60,10 63,68" fill="#FFFFFF" />
            <circle cx="60" cy="6" r="4.2" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />

            <polygon points="66,68 68,44 80,14 84,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="82,68 84,42 102,24 96,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="96,68 98,48 118,36 108,68" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Roman Laurel Golden Diadem Band */}
            <path d="M 8 68 C 35 74, 85 74, 112 68 L 112 80 C 85 86, 35 86, 8 80 Z" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalDark} strokeWidth="1.2" />
            {[20, 36, 50, 60, 70, 84, 100].map((cx, i) => (
              <ellipse key={i} cx={cx} cy="74" rx="3.5" ry="1.8" fill="#FFFFFF" transform={`rotate(${i % 2 === 0 ? 15 : -15}, ${cx}, 74)`} />
            ))}

            {/* Central Flaming Sun Medallion with Ruby */}
            <g transform="translate(60, 52)">
              <circle cx="0" cy="0" r="9" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="0" cy="0" r="7" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="-2" cy="-2" r="2" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* ── 4. ROYAL (VIP 4 Imperial Sovereign British Arch Crown) ── */}
        {tier === 'royal' && (
          <g id="realistic_royal">
            {/* Deep Imperial Blue Velvet Cap */}
            <path d="M 24 66 C 24 36, 40 20, 60 18 C 80 20, 96 36, 96 66 Z" fill={palette.capBg} stroke={palette.metalShadow} strokeWidth="1" />

            {/* 4 Crossing Heavy Golden Ribbed Arches */}
            <path d="M 28 66 C 36 30, 48 18, 60 12 C 72 18, 84 30, 92 66" fill="none" stroke={`url(#tierMetal_${uniqueId})`} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 28 66 C 36 30, 48 18, 60 12 C 72 18, 84 30, 92 66" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Summit Golden Orb & Royal Cross */}
            <g transform="translate(60, 10)">
              <circle cx="0" cy="0" r="4.2" fill="#FFFFFF" stroke={palette.metalDark} strokeWidth="0.8" />
              <path d="M 0 -8 L 0 -2 M -3 -5 L 3 -5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="square" />
            </g>

            {/* 4 Fleur-de-lis Spires */}
            <g transform="translate(26, 48)">
              <path d="M 0 -12 C -5 -7, -5 -1, 0 3 C 5 -1, 5 -7, 0 -12 Z" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
              <circle cx="0" cy="-12" r="1.8" fill="#FFFFFF" />
            </g>
            <g transform="translate(46, 42)">
              <path d="M 0 -14 C -6 -8, -6 -1, 0 3 C 6 -1, 6 -8, 0 -14 Z" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />
              <circle cx="0" cy="-14" r="2" fill="#FFFFFF" />
            </g>
            <g transform="translate(74, 42)">
              <path d="M 0 -14 C -6 -8, -6 -1, 0 3 C 6 -1, 6 -8, 0 -14 Z" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.7" />
              <circle cx="0" cy="-14" r="2" fill="#FFFFFF" />
            </g>
            <g transform="translate(94, 48)">
              <path d="M 0 -12 C -5 -7, -5 -1, 0 3 C 5 -1, 5 -7, 0 -12 Z" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
              <circle cx="0" cy="-12" r="1.8" fill="#FFFFFF" />
            </g>

            {/* Sovereign Rim Band with Sapphire Cabochons */}
            <path d="M 12 68 C 35 74, 85 74, 108 68 L 108 81 C 85 87, 35 87, 12 81 Z" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalShadow} strokeWidth="1.4" />
            {[20, 36, 50, 60, 70, 84, 100].map((cx, i) => (
              <circle key={i} cx={cx} cy="74.5" r="3" fill={`url(#gemRad1_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            ))}

            {/* Central Cushion-Cut Ceylon Sapphire */}
            <g transform="translate(60, 50)">
              <rect x="-8" y="-9" width="16" height="18" rx="3" fill={`url(#tierMetal_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
              <rect x="-6" y="-7" width="12" height="14" rx="2" fill={`url(#gemRad1_${uniqueId})`} />
              <circle cx="-2" cy="-2" r="1.5" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* ── 5. MYTHIC (VIP 5 Grand Celestial Winged Sovereign Crown) ── */}
        {(tier === 'mythic' || tier === 'none') && (
          <g id="realistic_mythic">
            {/* Celestial Flank Wings */}
            {/* Left Wing */}
            <path
              d="M 26 66 C 14 48, 4 30, -2 14 C 8 22, 18 34, 28 50 C 22 32, 14 16, 8 2 C 20 14, 30 28, 38 46 Z"
              fill={`url(#tierMetal_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            {/* Right Wing */}
            <path
              d="M 94 66 C 106 48, 116 30, 122 14 C 112 22, 102 34, 92 50 C 98 32, 106 16, 112 2 C 100 14, 90 28, 82 46 Z"
              fill={`url(#tierMetal_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />

            {/* Cosmic Violet Void Cap */}
            <path d="M 32 66 C 32 40, 42 24, 60 22 C 78 24, 88 40, 88 66 Z" fill={palette.capBg} />

            {/* 5 Pinnacle Imperial Body */}
            <path
              d="M 28 68 C 28 50, 32 38, 36 28 C 40 38, 44 48, 48 54 C 52 40, 56 24, 60 16 C 64 24, 68 40, 72 54 C 76 48, 80 38, 84 28 C 88 38, 92 50, 92 68 Z"
              fill={`url(#tierMetal_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="1.3"
            />

            {/* Floating 8-Point Cosmic Star Finial at Apex */}
            <g transform="translate(60, 8)">
              <polygon
                points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5"
                fill="#FFFFFF"
                stroke={palette.metalLight}
                strokeWidth="0.8"
                filter={`url(#sparkleGlow_${uniqueId})`}
              />
              <circle cx="0" cy="0" r="3.2" fill={`url(#gemRad1_${uniqueId})`} />
            </g>

            {/* Tip Pearls */}
            <circle cx="36" cy="28" r="2.6" fill="#FFFFFF" />
            <circle cx="84" cy="28" r="2.6" fill="#FFFFFF" />

            {/* Outer Orbital Ring */}
            <ellipse cx="60" cy="56" rx="48" ry="14" fill="none" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.7" />

            {/* Multi-Tiered Pedestal Band */}
            <path d="M 18 68 C 35 74, 85 74, 102 68 L 104 80 C 85 86, 35 86, 16 80 Z" fill={`url(#tierMetal_${uniqueId})`} stroke={palette.metalShadow} strokeWidth="1.2" />
            {[26, 38, 50, 60, 70, 82, 94].map((cx, i) => (
              <circle key={i} cx={cx} cy="74" r="2" fill="#FFFFFF" />
            ))}

            {/* Colossal Prismatic Diamond Heart in Center */}
            <g transform="translate(60, 54)">
              <polygon points="0,-11 9,-1 6,9 0,13 -6,9 -9,-1" fill="#FFFFFF" stroke={palette.metalLight} strokeWidth="0.8" />
              <polygon points="0,-9 7,-1 5,7 0,10 -5,7 -7,-1" fill={`url(#gemRad1_${uniqueId})`} />
              <circle cx="-2" cy="-2" r="1.6" fill="#FFFFFF" />
            </g>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
