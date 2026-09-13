import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VIPTier } from '../../types';

interface RealisticCrownProps {
  tier?: VIPTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  disableBobbing?: boolean;
  isHovered?: boolean;
  className?: string;
}

/**
 * 3D ROYAL MASTER CROWN (8K ULTRA-LUXURY GAMING CROWN)
 * Redesigned from scratch with:
 * - Massive 3D volume, levitation dynamics, perspective tilting
 * - Distinct structural architectures for VIP 1 (Bronze), VIP 2 (Silver), VIP 3 (Gold), VIP 4 (Royal), and VIP 5 (Mythic)
 * - Layered gold plumage wings flanking VIP 4 & VIP 5
 * - Multi-faceted diamond & gemstone mounts with realistic specular refractions
 * - Heavy ribbed 3D imperial arches, Latin orb-cross finials, and sculpted royal lion crest
 * - Concentric celestial aura, ray pulses, and shimmering star sparkles
 */
export const RealisticCrown: React.FC<RealisticCrownProps> = ({
  tier = 'mythic',
  size = 'md',
  animated = true,
  disableBobbing = false,
  isHovered: externalHovered,
  className = '',
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = externalHovered !== undefined ? externalHovered : internalHover;

  // Dimensions based on size preset
  const sizeMap = {
    xs: { width: 26, height: 21 },
    sm: { width: 34, height: 28 },
    md: { width: 52, height: 42 },
    lg: { width: 78, height: 62 },
    xl: { width: 104, height: 82 },
    '2xl': { width: 132, height: 104 },
  }[size];

  // Distinct color palettes for every single VIP tier
  const palette = {
    bronze: {
      goldLight: '#FFF7ED',
      goldMid: '#F59E0B',
      goldDeep: '#D97706',
      goldShadow: '#431407',
      capBg: '#2A1205',
      gemPrimary: '#EA580C',
      gemSecondary: '#F97316',
      glow: 'rgba(234, 88, 12, 0.85)',
      sparkle: '#FFEDD5',
      label: 'VIP 1',
    },
    silver: {
      goldLight: '#FFFFFF',
      goldMid: '#CBD5E1',
      goldDeep: '#64748B',
      goldShadow: '#0F172A',
      capBg: '#091528',
      gemPrimary: '#06B6D4',
      gemSecondary: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.9)',
      sparkle: '#E0F2FE',
      label: 'VIP 2',
    },
    gold: {
      goldLight: '#FFFFFF',
      goldMid: '#FACC15',
      goldDeep: '#D97706',
      goldShadow: '#451A03',
      capBg: '#3B0909',
      gemPrimary: '#DC2626',
      gemSecondary: '#EF4444',
      glow: 'rgba(250, 204, 21, 0.9)',
      sparkle: '#FEF9C3',
      label: 'VIP 3',
    },
    royal: {
      goldLight: '#FFFFFF',
      goldMid: '#F59E0B',
      goldDeep: '#2563EB',
      goldShadow: '#1E3A8A',
      capBg: '#170938',
      gemPrimary: '#2563EB',
      gemSecondary: '#9333EA',
      glow: 'rgba(37, 99, 235, 0.95)',
      sparkle: '#DBEAFE',
      label: 'VIP 4',
    },
    mythic: {
      goldLight: '#FFFFFF',
      goldMid: '#F59E0B',
      goldDeep: '#B45309',
      goldShadow: '#1E0436',
      capBg: '#2A0647',
      gemPrimary: '#C084FC',
      gemSecondary: '#F43F5E',
      glow: 'rgba(216, 180, 254, 0.98)',
      sparkle: '#FDE047',
      label: 'VIP 5',
    },
    none: {
      goldLight: '#FFFFFF',
      goldMid: '#F59E0B',
      goldDeep: '#B45309',
      goldShadow: '#1E0436',
      capBg: '#2A0647',
      gemPrimary: '#C084FC',
      gemSecondary: '#F43F5E',
      glow: 'rgba(250, 204, 21, 0.6)',
      sparkle: '#FFFFFF',
      label: 'VIP 5',
    },
  }[tier || 'mythic'];

  const uniqueId = `crown_${tier || 'mythic'}_${size}`;

  return (
    <motion.div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={
        animated
          ? {
              rotateY: isHovered ? [-16, 16, -16] : [-10, 10, -10],
              rotateX: isHovered ? [6, -6, 6] : [3, -3, 3],
              rotateZ: [-1.5, 1.5, -1.5],
              ...(disableBobbing ? { y: 0 } : { y: isHovered ? [-6, 6, -6] : [-3, 3, -3] }),
              scale: isHovered ? 1.16 : 1,
            }
          : undefined
      }
      transition={
        animated
          ? {
              rotateY: { repeat: Infinity, duration: 4.6, ease: 'easeInOut' },
              rotateX: { repeat: Infinity, duration: 4.6, ease: 'easeInOut' },
              rotateZ: { repeat: Infinity, duration: 4.6, ease: 'easeInOut' },
              ...(disableBobbing ? {} : { y: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' } }),
              scale: { duration: 0.35, ease: 'easeOut' },
            }
          : undefined
      }
    >
      {/* 1. Intensive Multi-Ring Royal Ambient Glow & Halo */}
      <motion.div
        animate={
          isHovered
            ? {
                scale: [1, 1.35, 1.2],
                opacity: [0.75, 1, 0.8],
                filter: ['blur(6px)', 'blur(14px)', 'blur(8px)'],
              }
            : animated
            ? {
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
                filter: ['blur(4px)', 'blur(8px)', 'blur(4px)'],
              }
            : undefined
        }
        transition={{
          repeat: Infinity,
          duration: isHovered ? 1.4 : 2.8,
          ease: 'easeInOut',
        }}
        className="absolute -inset-3 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, rgba(245, 158, 11, 0.35) 45%, transparent 75%)`,
        }}
      />

      {/* 2. Shimmering Star Sparkles */}
      {isHovered && (
        <>
          <span className="absolute -top-3 -right-3 text-[11px] pointer-events-none animate-ping text-amber-300 select-none">
            ✨
          </span>
          <span className="absolute -bottom-2 -left-3 text-[10px] pointer-events-none animate-pulse text-yellow-200 select-none">
            🌟
          </span>
          <span className="absolute -top-2 -left-2 text-[9px] pointer-events-none animate-bounce text-amber-200 select-none">
            ⭐
          </span>
        </>
      )}

      {/* 3. 3D SVG Massive Imperial Crown */}
      <svg
        width={sizeMap.width}
        height={sizeMap.height}
        viewBox="0 0 130 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{
          filter: isHovered
            ? `drop-shadow(0 0 14px ${palette.glow}) drop-shadow(0 0 24px rgba(250, 204, 21, 0.8))`
            : animated
            ? `drop-shadow(0 4px 10px ${palette.glow}) drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))`
            : undefined,
        }}
      >
        <defs>
          {/* Master 24K Gold Gradient */}
          <linearGradient id={`tierGold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor={palette.goldLight} />
            <stop offset="48%" stopColor={palette.goldMid} />
            <stop offset="78%" stopColor={palette.goldDeep} />
            <stop offset="100%" stopColor={palette.goldShadow} />
          </linearGradient>

          {/* Reverse Bevel Gradient */}
          <linearGradient id={`tierGoldBevel_${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor={palette.goldLight} stopOpacity="0.85" />
            <stop offset="80%" stopColor={palette.goldDeep} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.goldShadow} stopOpacity="1" />
          </linearGradient>

          {/* Faceted Gem Radial */}
          <radialGradient id={`crownGem_${uniqueId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor={palette.gemSecondary} />
            <stop offset="75%" stopColor={palette.gemPrimary} />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Sparkle filter */}
          <filter id={`crownSparkle_${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════════
            CROWN ARCHITECTURES PER VIP TIER
            ═══════════════════════════════════════════════════════════════════ */}

        {/* ── 1. BRONZE (VIP 1 Falcon Warrior Wings Diadem) ── */}
        {tier === 'bronze' && (
          <g id="crown_bronze">
            {/* Dark Leather Cap Dome */}
            <path d="M 32 70 C 34 44, 48 34, 65 32 C 82 34, 96 44, 98 70 Z" fill={palette.capBg} />

            {/* Left Wing Spires */}
            <polygon points="18,72 10,36 30,50 32,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="30,72 26,28 42,46 44,72" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldLight} strokeWidth="0.8" />

            {/* Center Falcon Peak Spear */}
            <polygon points="50,72 65,12 80,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.2" />
            <circle cx="65" cy="16" r="3.6" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Right Wing Spires */}
            <polygon points="100,72 104,28 88,46 86,72" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldLight} strokeWidth="0.8" />
            <polygon points="112,72 120,36 100,50 98,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Diadem Band with VIP 1 Cartouche */}
            <path d="M 14 72 C 40 78, 90 78, 116 72 L 116 86 C 90 92, 40 92, 14 86 Z" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldShadow} strokeWidth="1.2" />
            <rect x="42" y="74" width="46" height="14" rx="7" fill={palette.capBg} stroke="#FFFFFF" strokeWidth="0.9" />
            <text x="65" y="84.5" textAnchor="middle" fill="#FFFFFF" stroke={palette.goldLight} strokeWidth="0.4" fontSize="9" fontWeight="900" letterSpacing="0.8">VIP 1</text>
            <polygon points="65,48 74,58 65,68 56,58" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* ── 2. SILVER (VIP 2 Lunar Gothic Tiara with Ice Crystals) ── */}
        {tier === 'silver' && (
          <g id="crown_silver">
            {/* Velvet Icy Cap */}
            <path d="M 34 70 C 36 40, 48 28, 65 26 C 82 28, 94 40, 96 70 Z" fill={palette.capBg} />

            {/* Gothic Needle Arches */}
            <path
              d="M 20 72 C 18 52, 20 36, 26 24 C 30 36, 36 46, 40 58 C 46 42, 52 26, 56 16 C 60 28, 62 42, 65 52 C 68 42, 70 28, 74 16 C 78 26, 84 42, 90 58 C 94 46, 100 36, 104 24 C 110 36, 112 52, 110 72 Z"
              fill={`url(#tierGold_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />

            {/* Center Crescent Moon & Ice Diamond */}
            <g transform="translate(65, 22)">
              <path d="M -11 -7 C -11 7, 11 7, 11 -7 C 8 1, -8 1, -11 -7 Z" fill="#FFFFFF" />
              <circle cx="0" cy="-7" r="3.8" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.9" />
            </g>

            {/* Peaks tip stars */}
            <circle cx="26" cy="24" r="2.8" fill="#FFFFFF" />
            <circle cx="56" cy="16" r="3" fill="#FFFFFF" />
            <circle cx="74" cy="16" r="3" fill="#FFFFFF" />
            <circle cx="104" cy="24" r="2.8" fill="#FFFFFF" />

            {/* Headband with VIP 2 Cartouche */}
            <path d="M 16 72 C 40 78, 90 78, 114 72 L 114 86 C 90 92, 40 92, 16 86 Z" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.2" />
            <rect x="42" y="74" width="46" height="14" rx="7" fill={palette.capBg} stroke="#FFFFFF" strokeWidth="0.9" />
            <text x="65" y="84.5" textAnchor="middle" fill="#FFFFFF" stroke={palette.goldLight} strokeWidth="0.4" fontSize="9" fontWeight="900" letterSpacing="0.8">VIP 2</text>
            <ellipse cx="65,58" rx="8" ry="10" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* ── 3. GOLD (VIP 3 Radiant Solar Sunburst Crown) ── */}
        {tier === 'gold' && (
          <g id="crown_gold">
            {/* Crimson Cap Dome */}
            <path d="M 32 70 C 34 44, 48 34, 65 32 C 82 34, 96 44, 98 70 Z" fill={palette.capBg} />

            {/* 7 Radiant Sunburst Flares */}
            <polygon points="16,72 6,38 26,50 28,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="28,72 22,26 40,44 42,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="40,72 44,16 56,46 58,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Highest Center Flare with Sun Finial */}
            <polygon points="56,72 65,6 74,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1.4" />
            <circle cx="65" cy="8" r="4.6" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />

            <polygon points="72,72 74,46 86,16 90,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="88,72 90,44 108,26 102,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            <polygon points="102,72 104,50 124,38 114,72" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Rim Band with VIP 3 Cartouche */}
            <path d="M 12 72 C 40 78, 90 78, 118 72 L 118 86 C 90 92, 40 92, 12 86 Z" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldShadow} strokeWidth="1.2" />
            <rect x="42" y="74" width="46" height="14" rx="7" fill={palette.capBg} stroke="#FFFFFF" strokeWidth="0.9" />
            <text x="65" y="84.5" textAnchor="middle" fill="#FFFFFF" stroke={palette.goldLight} strokeWidth="0.4" fontSize="9" fontWeight="900" letterSpacing="0.8">VIP 3</text>
            <circle cx="65" cy="56" r="9" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* ── 4. ROYAL (VIP 4 Imperial Sovereign British Arch Crown) ── */}
        {tier === 'royal' && (
          <g id="crown_royal">
            {/* Deep Royal Velvet Cap Dome */}
            <path d="M 28 70 C 28 38, 44 22, 65 20 C 86 22, 102 38, 102 70 Z" fill={palette.capBg} stroke={palette.goldShadow} strokeWidth="1" />

            {/* Ribbed Golden Crossing Arches */}
            <path d="M 32 70 C 40 34, 52 20, 65 14 C 78 20, 90 34, 98 70" fill="none" stroke={`url(#tierGold_${uniqueId})`} strokeWidth="5" strokeLinecap="round" />
            <path d="M 32 70 C 40 34, 52 20, 65 14 C 78 20, 90 34, 98 70" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Summit Orb & Latin Cross */}
            <g transform="translate(65, 11)">
              <circle cx="0" cy="0" r="4.6" fill="#FFFFFF" stroke={palette.goldShadow} strokeWidth="0.8" />
              <path d="M 0 -9 L 0 -2 M -3.5 -5.5 L 3.5 -5.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="square" />
              <circle cx="0" cy="-5.5" r="1.4" fill={palette.gemPrimary} />
            </g>

            {/* Fleur-de-lis Spires */}
            <circle cx="38" cy="26" r="3" fill={palette.gemPrimary} stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="92" cy="26" r="3" fill={palette.gemPrimary} stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Sovereign Rim Band with VIP 4 Cartouche */}
            <path d="M 16 72 C 40 78, 90 78, 114 72 L 114 87 C 90 93, 40 93, 16 87 Z" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldShadow} strokeWidth="1.4" />
            <rect x="40" y="74" width="50" height="15" rx="7.5" fill={palette.capBg} stroke="#FFFFFF" strokeWidth="1" />
            <text x="65" y="85" textAnchor="middle" fill="#FFFFFF" stroke={palette.goldLight} strokeWidth="0.4" fontSize="9.5" fontWeight="900" letterSpacing="0.8">VIP 4</text>
            <rect x="58" y="47" width="14" height="16" rx="3" fill={`url(#crownGem_${uniqueId})`} stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* ── 5. MYTHIC (VIP 5 Grand Winged Lion Supreme Imperial Crown - 8K Masterpiece) ── */}
        {(tier === 'mythic' || tier === 'none') && (
          <g id="crown_mythic">
            {/* Grand Golden Wings Flanking Crown Apex (Left & Right) */}
            {/* Left Wings */}
            <path
              d="M 32 66 C 14 48, -2 28, -8 8 C 8 20, 24 34, 38 52 Z"
              fill={`url(#tierGold_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            <path
              d="M 28 68 C 8 56, -10 44, -12 28 C 4 38, 20 50, 34 60 Z"
              fill={palette.capBg}
              stroke={`url(#tierGold_${uniqueId})`}
              strokeWidth="0.9"
            />
            <path
              d="M 30 74 C 12 72, -4 64, -8 48 C 8 56, 24 64, 34 70 Z"
              fill={`url(#tierGold_${uniqueId})`}
              stroke={palette.goldLight}
              strokeWidth="0.8"
            />

            {/* Right Wings (Mirrored) */}
            <path
              d="M 98 66 C 116 48, 132 28, 138 8 C 122 20, 106 34, 92 52 Z"
              fill={`url(#tierGold_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            <path
              d="M 102 68 C 122 56, 140 44, 142 28 C 126 38, 110 50, 96 60 Z"
              fill={palette.capBg}
              stroke={`url(#tierGold_${uniqueId})`}
              strokeWidth="0.9"
            />
            <path
              d="M 100 74 C 118 72, 134 64, 138 48 C 122 56, 106 64, 96 70 Z"
              fill={`url(#tierGold_${uniqueId})`}
              stroke={palette.goldLight}
              strokeWidth="0.8"
            />

            {/* Royal Purple Velvet Cap Dome */}
            <path d="M 34 68 C 34 34, 48 20, 65 18 C 82 20, 96 34, 96 68 Z" fill={palette.capBg} stroke={`url(#tierGold_${uniqueId})`} strokeWidth="1.2" />

            {/* Massive 3D Heavy Golden Ribbed Arches */}
            <path d="M 36 68 C 42 34, 52 20, 65 13 C 78 20, 88 34, 94 68" fill="none" stroke={`url(#tierGold_${uniqueId})`} strokeWidth="5" strokeLinecap="round" />
            <path d="M 36 68 C 42 34, 52 20, 65 13 C 78 20, 88 34, 94 68" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Summit Orb & Latin Cross */}
            <g transform="translate(65, 10)">
              <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke={palette.goldShadow} strokeWidth="0.9" />
              <path d="M 0 -10 L 0 -2 M -4 -6 L 4 -6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="square" />
              <circle cx="0" cy="-6" r="1.5" fill={palette.gemPrimary} />
            </g>

            {/* Rim Gem Spires */}
            <circle cx="38" cy="26" r="3.2" fill={palette.gemPrimary} stroke="#FFFFFF" strokeWidth="0.9" />
            <circle cx="92" cy="26" r="3.2" fill={palette.gemPrimary} stroke="#FFFFFF" strokeWidth="0.9" />
            <circle cx="52" cy="20" r="2.5" fill="#FFFFFF" />
            <circle cx="78" cy="20" r="2.5" fill="#FFFFFF" />

            {/* 3D Sculpted Golden Lion Face at the Center */}
            <g transform="translate(65, 46)">
              {/* Mane */}
              <circle cx="0" cy="0" r="15" fill={`url(#tierGold_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.9" />
              <circle cx="0" cy="0" r="12" fill={palette.capBg} />
              {/* Ears */}
              <circle cx="-9" cy="-8" r="3.2" fill={`url(#tierGold_${uniqueId})`} />
              <circle cx="9" cy="-8" r="3.2" fill={`url(#tierGold_${uniqueId})`} />
              {/* Face mask */}
              <path d="M -7 -4 C -5 -8, 5 -8, 7 -4 L 6 5 C 4 7, -4 7, -6 5 Z" fill={`url(#tierGold_${uniqueId})`} />
              {/* Eyes */}
              <circle cx="-3.5" cy="-1" r="1.3" fill="#FFFFFF" />
              <circle cx="-3.5" cy="-1" r="0.7" fill={palette.gemPrimary} />
              <circle cx="3.5" cy="-1" r="1.3" fill="#FFFFFF" />
              <circle cx="3.5" cy="-1" r="0.7" fill={palette.gemPrimary} />
              {/* Nose & Chin */}
              <polygon points="0,2 -1.6,0 1.6,0" fill="#000000" />
              <path d="M -2.5 4 C 0 7, 0 7, 2.5 4" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
            </g>

            {/* Sovereign Rim Base Band with VIP 5 Cartouche Banner */}
            <path d="M 18 70 C 40 76, 90 76, 112 70 L 114 86 C 90 92, 40 92, 16 86 Z" fill={`url(#tierGold_${uniqueId})`} stroke={palette.goldShadow} strokeWidth="1.5" />
            <rect x="38" y="73" width="54" height="16" rx="8" fill={palette.capBg} stroke="#FFFFFF" strokeWidth="1.1" filter={`url(#crownSparkle_${uniqueId})`} />
            <text
              x="65"
              y="84.5"
              textAnchor="middle"
              fill="#FFFFFF"
              stroke={palette.goldLight}
              strokeWidth="0.5"
              fontSize="10.5"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.8"
            >
              VIP 5
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
