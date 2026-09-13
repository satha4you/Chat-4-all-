import React from 'react';
import { VIPTier } from '../../types';

interface VIPAvatarFrameSVGProps {
  tier: VIPTier;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  showTopCrown?: boolean;
  mythicFrameId?: string;
}

/**
 * ULTRA-LUXURY 3D ROYAL BADGE AVATAR FRAME (8K VIP GAMING BADGE)
 * Built entirely from scratch:
 * - Grand 3D layered golden wings with dual-tier plumage & metallic bevels
 * - Triple-beveled multi-tier gold/amethyst rings with radial diamond highlights
 * - Imperial 3D Laurel Wreaths with faceted gemstones
 * - Sovereign Crowned Winged Golden Lion Crest with radiant halo
 * - Dynamic royal aura, light flares, and celestial sparkles
 * - Completely custom colorways, geometry, and gem configurations across VIP 1 to VIP 5
 */
export const VIPAvatarFrameSVG: React.FC<VIPAvatarFrameSVGProps> = ({
  tier,
  size,
  className = '',
  showTopCrown = true,
  mythicFrameId,
}) => {
  if (tier === 'none') return null;

  const getMythicConfig = (frameId?: string) => {
    switch (frameId) {
      case 'mythic_fire_dragon':
        return {
          label: 'VIP 5',
          subTitle: 'FIRE DRAGON',
          goldPure: '#FFF7ED',
          goldLight: '#FDE047',
          goldMid: '#F59E0B',
          goldDeep: '#DC2626',
          goldShadow: '#7F1D1D',
          coreDark: '#450A0A',
          gemHighlight: '#FEF08A',
          gemPrimary: '#EF4444',
          gemDark: '#991B1B',
          gemGlow: 'rgba(239, 68, 68, 0.95)',
          auraColor: 'rgba(245, 158, 11, 0.85)',
          wingScale: 1.18,
          wreathStroke: 3.6,
        };
      case 'mythic_cosmic_nebula':
        return {
          label: 'VIP 5',
          subTitle: 'COSMIC NEBULA',
          goldPure: '#F0FDF4',
          goldLight: '#A7F3D0',
          goldMid: '#06B6D4',
          goldDeep: '#3B82F6',
          goldShadow: '#1E1B4B',
          coreDark: '#0B0F19',
          gemHighlight: '#E0F2FE',
          gemPrimary: '#8B5CF6',
          gemDark: '#4C1D95',
          gemGlow: 'rgba(6, 182, 212, 0.95)',
          auraColor: 'rgba(139, 92, 246, 0.85)',
          wingScale: 1.16,
          wreathStroke: 3.6,
        };
      case 'mythic_golden_falcon':
        return {
          label: 'VIP 5',
          subTitle: 'GOLDEN FALCON',
          goldPure: '#FFFFFF',
          goldLight: '#FEF08A',
          goldMid: '#F59E0B',
          goldDeep: '#B45309',
          goldShadow: '#451A03',
          coreDark: '#260E01',
          gemHighlight: '#FFFFFF',
          gemPrimary: '#FBBF24',
          gemDark: '#78350F',
          gemGlow: 'rgba(245, 158, 11, 0.98)',
          auraColor: 'rgba(250, 204, 21, 0.9)',
          wingScale: 1.20,
          wreathStroke: 3.8,
        };
      case 'mythic_ruby_ottoman':
        return {
          label: 'VIP 5',
          subTitle: 'IMPERIAL RUBY',
          goldPure: '#FFF1F2',
          goldLight: '#FECDD3',
          goldMid: '#E11D48',
          goldDeep: '#9F1239',
          goldShadow: '#4C0519',
          coreDark: '#26020C',
          gemHighlight: '#FFE4E6',
          gemPrimary: '#F43F5E',
          gemDark: '#881337',
          gemGlow: 'rgba(244, 63, 94, 0.95)',
          auraColor: 'rgba(225, 29, 72, 0.85)',
          wingScale: 1.16,
          wreathStroke: 3.6,
        };
      case 'mythic_cyber_glory':
        return {
          label: 'VIP 5',
          subTitle: 'CYBER AURORA',
          goldPure: '#ECFDF5',
          goldLight: '#6EE7B7',
          goldMid: '#10B981',
          goldDeep: '#047857',
          goldShadow: '#064E3B',
          coreDark: '#022C22',
          gemHighlight: '#D1FAE5',
          gemPrimary: '#34D399',
          gemDark: '#065F46',
          gemGlow: 'rgba(16, 185, 129, 0.95)',
          auraColor: 'rgba(52, 211, 153, 0.85)',
          wingScale: 1.16,
          wreathStroke: 3.6,
        };
      case 'mythic_sovereign_wings':
      default:
        return {
          label: 'VIP 5',
          subTitle: 'MYTHIC SULTAN',
          goldPure: '#FFFFFF',
          goldLight: '#FEF08A',
          goldMid: '#F59E0B',
          goldDeep: '#B45309',
          goldShadow: '#2E0854',
          coreDark: '#170329',
          gemHighlight: '#F3E8FF',
          gemPrimary: '#C084FC',
          gemDark: '#6B21A8',
          gemGlow: 'rgba(192, 132, 252, 0.98)',
          auraColor: 'rgba(234, 179, 8, 0.9)',
          wingScale: 1.18,
          wreathStroke: 3.8,
        };
    }
  };

  const tierConfig = tier === 'mythic' ? getMythicConfig(mythicFrameId) : {
    bronze: {
      label: 'VIP 1',
      subTitle: 'BRONZE ROYAL',
      goldPure: '#FFF7ED',
      goldLight: '#FED7AA',
      goldMid: '#D97706',
      goldDeep: '#9A3412',
      goldShadow: '#431407',
      coreDark: '#2A1205',
      gemHighlight: '#FFEDD5',
      gemPrimary: '#EA580C',
      gemDark: '#7C2D12',
      gemGlow: 'rgba(234, 88, 12, 0.8)',
      auraColor: 'rgba(217, 119, 6, 0.75)',
      wingScale: 0.96,
      wreathStroke: 2.8,
    },
    silver: {
      label: 'VIP 2',
      subTitle: 'SILVER LUNAR',
      goldPure: '#FFFFFF',
      goldLight: '#F1F5F9',
      goldMid: '#94A3B8',
      goldDeep: '#475569',
      goldShadow: '#0F172A',
      coreDark: '#0B132B',
      gemHighlight: '#E0F2FE',
      gemPrimary: '#38BDF8',
      gemDark: '#0284C7',
      gemGlow: 'rgba(56, 189, 248, 0.85)',
      auraColor: 'rgba(148, 163, 184, 0.8)',
      wingScale: 1.02,
      wreathStroke: 3.0,
    },
    gold: {
      label: 'VIP 3',
      subTitle: 'GOLDEN ROYAL',
      goldPure: '#FFFFFF',
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDeep: '#92400E',
      goldShadow: '#451A03',
      coreDark: '#2E0A0A',
      gemHighlight: '#FEE2E2',
      gemPrimary: '#DC2626',
      gemDark: '#991B1B',
      gemGlow: 'rgba(220, 38, 38, 0.85)',
      auraColor: 'rgba(234, 179, 8, 0.85)',
      wingScale: 1.08,
      wreathStroke: 3.2,
    },
    royal: {
      label: 'VIP 4',
      subTitle: 'IMPERIAL SOVEREIGN',
      goldPure: '#FFFFFF',
      goldLight: '#FEF9C3',
      goldMid: '#F59E0B',
      goldDeep: '#B45309',
      goldShadow: '#1E1B4B',
      coreDark: '#120428',
      gemHighlight: '#DBEAFE',
      gemPrimary: '#2563EB',
      gemDark: '#1E3A8A',
      gemGlow: 'rgba(37, 99, 235, 0.9)',
      auraColor: 'rgba(245, 158, 11, 0.9)',
      wingScale: 1.14,
      wreathStroke: 3.5,
    },
  }[tier];

  if (!tierConfig) return null;

  const isCompact = size === 'xs' || size === 'sm';
  const isLarge = size === 'xl' || size === '2xl' || size === 'hero';
  const uniqueId = `frame_${tier}_${mythicFrameId || 'std'}_${size}`;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 flex items-center justify-center ${className}`}
      style={{
        transform: isCompact ? 'scale(1.48)' : isLarge ? 'scale(1.44)' : 'scale(1.38)',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible select-none drop-shadow-[0_6px_22px_rgba(0,0,0,0.92)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Master 3D Metallic Gold Gradient (High Specular 8K Shimmer) */}
          <linearGradient id={`gold3D_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierConfig.goldPure} />
            <stop offset="18%" stopColor={tierConfig.goldLight} />
            <stop offset="45%" stopColor={tierConfig.goldMid} />
            <stop offset="78%" stopColor={tierConfig.goldDeep} />
            <stop offset="100%" stopColor={tierConfig.goldShadow} />
          </linearGradient>

          {/* Reverse Metallic Specular for Bevel Chamfering */}
          <linearGradient id={`goldBevel_${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={tierConfig.goldLight} stopOpacity="0.95" />
            <stop offset="35%" stopColor={tierConfig.goldPure} stopOpacity="1" />
            <stop offset="70%" stopColor={tierConfig.goldDeep} stopOpacity="0.8" />
            <stop offset="100%" stopColor={tierConfig.goldShadow} stopOpacity="0.95" />
          </linearGradient>

          {/* Core Velvet / Dark Metallic Base */}
          <linearGradient id={`velvetBase_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierConfig.gemPrimary} stopOpacity="0.85" />
            <stop offset="40%" stopColor={tierConfig.gemDark} stopOpacity="0.9" />
            <stop offset="85%" stopColor={tierConfig.goldShadow} stopOpacity="0.95" />
            <stop offset="100%" stopColor={tierConfig.coreDark} stopOpacity="1" />
          </linearGradient>

          {/* Multi-Faceted Gemstone Radial Shimmer */}
          <radialGradient id={`gemRadial_${uniqueId}`} cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor={tierConfig.gemHighlight} stopOpacity="1" />
            <stop offset="28%" stopColor={tierConfig.gemPrimary} stopOpacity="0.95" />
            <stop offset="72%" stopColor={tierConfig.gemDark} stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>

          {/* 3D Celestial Diamond Flare Radial */}
          <radialGradient id={`flareRadial_${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor={tierConfig.goldLight} stopOpacity="0.8" />
            <stop offset="70%" stopColor={tierConfig.gemGlow} stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Intense Royal Aura Atmosphere Filter */}
          <filter id={`auraGlow_${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={isLarge ? "4.2" : "2.6"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Diamond Gleam Flare Filter */}
          <filter id={`diamondGleam_${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 0: RADIANT CELESTIAL BACKGROUND HALO & LIGHT BEAMS
            ═══════════════════════════════════════════════════════════════════ */}
        <g id="celestial_aura" opacity="0.88">
          {/* Pulsing Light Aura */}
          <circle
            cx="100"
            cy="100"
            r="84"
            fill="none"
            stroke={tierConfig.auraColor}
            strokeWidth="3.5"
            opacity="0.55"
            filter={`url(#auraGlow_${uniqueId})`}
          />
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke={tierConfig.gemGlow}
            strokeWidth="2.5"
            opacity="0.45"
            filter={`url(#auraGlow_${uniqueId})`}
          />
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 1: 3D GRAND GOLDEN WINGS (LEFT & RIGHT FLANKING)
            Sculpted with layered primary, secondary, and tertiary feathers,
            ribbed spine lines, and metallic 3D chamfers.
            ═══════════════════════════════════════════════════════════════════ */}
        <g
          id="grand_3d_wings"
          transform={`translate(100, 100) scale(${tierConfig.wingScale}) translate(-100, -100)`}
        >
          {/* ── LEFT WING FEATHERS ── */}
          {/* Feather 1: Upper Major Tip Feather (Primary) */}
          <path
            d="M 38 82 C 14 62, -14 38, -6 18 C 10 32, 28 50, 46 68 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          {/* Feather 1 Spine Highlight */}
          <path
            d="M -4 20 C 12 36, 28 52, 44 68"
            stroke={tierConfig.goldPure}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Feather 2: Upper Velvet Lining Feather */}
          <path
            d="M 34 94 C 8 78, -18 58, -12 40 C 4 52, 22 68, 40 82 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.9"
          />

          {/* Feather 3: Middle Feather */}
          <path
            d="M 32 106 C 4 94, -20 80, -14 62 C 4 72, 22 84, 38 94 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke={tierConfig.goldLight}
            strokeWidth="0.8"
          />

          {/* Feather 4: Lower-Middle Feather */}
          <path
            d="M 34 118 C 8 112, -16 102, -10 84 C 6 92, 22 100, 38 106 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.8"
          />

          {/* Feather 5: Bottom Sweeping Plume */}
          <path
            d="M 38 130 C 14 130, -10 122, -4 104 C 10 110, 26 116, 42 118 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />

          {/* ── RIGHT WING FEATHERS (MIRRORED) ── */}
          {/* Feather 1: Upper Major Tip Feather */}
          <path
            d="M 162 82 C 186 62, 214 38, 206 18 C 190 32, 172 50, 154 68 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          {/* Feather 1 Spine Highlight */}
          <path
            d="M 204 20 C 188 36, 172 52, 156 68"
            stroke={tierConfig.goldPure}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Feather 2: Upper Velvet Lining */}
          <path
            d="M 166 94 C 192 78, 218 58, 212 40 C 196 52, 178 68, 160 82 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.9"
          />

          {/* Feather 3: Middle Feather */}
          <path
            d="M 168 106 C 196 94, 220 80, 214 62 C 196 72, 178 84, 162 94 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke={tierConfig.goldLight}
            strokeWidth="0.8"
          />

          {/* Feather 4: Lower-Middle Feather */}
          <path
            d="M 166 118 C 192 112, 216 102, 210 84 C 194 92, 178 100, 162 106 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.8"
          />

          {/* Feather 5: Bottom Sweeping Plume */}
          <path
            d="M 162 130 C 186 130, 210 122, 204 104 C 190 110, 174 116, 158 118 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 2: TRIPLE-BEVELED METALLIC 3D RINGS & DIAMOND STUDS
            ═══════════════════════════════════════════════════════════════════ */}
        <g id="portal_rings">
          {/* Outer Heavy 24K Gold Beveled Band */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth={isLarge ? "5.5" : "4.4"}
            strokeLinecap="round"
          />

          {/* Specular Inner Highlight Lip */}
          <circle
            cx="100"
            cy="100"
            r="67.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            opacity="0.85"
          />

          {/* Velvet/Amethyst Inlaid Trench Ring */}
          <circle
            cx="100"
            cy="100"
            r="64.5"
            fill="none"
            stroke={`url(#velvetBase_${uniqueId})`}
            strokeWidth="3.2"
          />

          {/* Inner Golden Rim Facing Avatar */}
          <circle
            cx="100"
            cy="100"
            r="62"
            fill="none"
            stroke={`url(#goldBevel_${uniqueId})`}
            strokeWidth="1.8"
          />

          {/* Micro Diamond Studs around the Ring perimeter (8 Cardinal Points) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 100 + 64.5 * Math.cos(rad);
            const cy = 100 + 64.5 * Math.sin(rad);
            return (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="2.2" fill={`url(#gemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
                <circle cx={cx - 0.5} cy={cy - 0.5} r="0.8" fill="#FFFFFF" />
              </g>
            );
          })}
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 3: IMPERIAL GOLDEN LAUREL WREATH (LEFT & RIGHT ARCHES)
            ═══════════════════════════════════════════════════════════════════ */}
        <g id="imperial_laurel_wreath">
          {/* Left Laurel Branch Arch */}
          <path
            d="M 100 166 C 58 166, 34 136, 36 88 C 37 66, 50 46, 70 34"
            fill="none"
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth={tierConfig.wreathStroke}
            strokeLinecap="round"
          />

          {/* Left Leaves with 3D Center Ribs */}
          <path d="M 86 163 C 74 167, 65 158, 74 150 C 82 144, 88 153, 86 163 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 68 150 C 53 152, 47 140, 58 132 C 67 127, 72 138, 68 150 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 52 132 C 37 130, 34 116, 46 110 C 56 106, 60 118, 52 132 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 44 110 C 29 104, 30 90, 43 86 C 53 84, 54 98, 44 110 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 43 86 C 30 76, 34 62, 47 62 C 57 62, 55 76, 43 86 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 49 64 C 39 52, 47 40, 59 42 C 67 45, 62 57, 49 64 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 61 46 C 54 34, 66 25, 76 30 C 83 35, 75 44, 61 46 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />

          {/* Right Laurel Branch Arch (Mirrored) */}
          <path
            d="M 100 166 C 142 166, 166 136, 164 88 C 163 66, 150 46, 130 34"
            fill="none"
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth={tierConfig.wreathStroke}
            strokeLinecap="round"
          />

          {/* Right Leaves */}
          <path d="M 114 163 C 126 167, 135 158, 126 150 C 118 144, 112 153, 114 163 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 132 150 C 147 152, 153 140, 142 132 C 133 127, 128 138, 132 150 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 148 132 C 163 130, 166 116, 154 110 C 144 106, 140 118, 148 132 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 156 110 C 171 104, 170 90, 157 86 C 147 84, 146 98, 156 110 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 157 86 C 170 76, 166 62, 153 62 C 143 62, 145 76, 157 86 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M 151 64 C 161 52, 153 40, 141 42 C 133 45, 138 57, 151 64 Z" fill={`url(#velvetBase_${uniqueId})`} stroke={tierConfig.goldLight} strokeWidth="0.7" />
          <path d="M 139 46 C 146 34, 134 25, 124 30 C 117 35, 125 44, 139 46 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
        </g>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 4: TOP ROYAL IMPERIAL CROWN (IF ENABLED IN COMPONENT)
            ═══════════════════════════════════════════════════════════════════ */}
        {showTopCrown && (
          <g id="top_crown_banner" transform="translate(0, -6)">
            {/* Halo behind crown */}
            <circle cx="100" cy="24" r="26" fill={tierConfig.gemGlow} opacity="0.45" filter={`url(#auraGlow_${uniqueId})`} />
            {/* Crown Base Band */}
            <path d="M 76 28 C 84 26, 116 26, 124 28 L 122 34 C 114 32, 86 32, 78 34 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
            {/* 3 Crown Peaks */}
            <path d="M 76 28 L 74 16 L 86 22 L 100 10 L 114 22 L 126 16 L 124 28 Z" fill={`url(#gold3D_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.8" />
            {/* Crown Gems */}
            <circle cx="100" cy="10" r="2.8" fill={`url(#gemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.6" />
            <circle cx="74" cy="16" r="2" fill={`url(#gemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.5" />
            <circle cx="126" cy="16" r="2" fill={`url(#gemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.5" />
          </g>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 5: BOTTOM SOVEREIGN CROWNED WINGED GOLDEN LION CREST (8K 3D)
            ═══════════════════════════════════════════════════════════════════ */}
        <g id="bottom_sovereign_lion_crest" transform="translate(0, 8)">
          {/* Luminous Celestial Halo Behind Lion */}
          <circle
            cx="100"
            cy="158"
            r="28"
            fill={tierConfig.gemGlow}
            opacity="0.8"
            filter={`url(#auraGlow_${uniqueId})`}
          />

          {/* Left Lion Wings */}
          <path
            d="M 90 156 C 72 144, 52 136, 44 126 C 56 134, 70 144, 86 152 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="1"
          />
          <path
            d="M 88 162 C 68 156, 50 150, 42 140 C 56 146, 70 152, 84 158 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke={tierConfig.goldLight}
            strokeWidth="0.8"
          />
          <path
            d="M 88 168 C 70 168, 54 162, 48 152 C 60 158, 72 162, 84 166 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.8"
          />

          {/* Right Lion Wings (Mirrored) */}
          <path
            d="M 110 156 C 128 144, 148 136, 156 126 C 144 134, 130 144, 114 152 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="1"
          />
          <path
            d="M 112 162 C 132 156, 150 150, 158 140 C 144 146, 130 152, 116 158 Z"
            fill={`url(#gold3D_${uniqueId})`}
            stroke={tierConfig.goldLight}
            strokeWidth="0.8"
          />
          <path
            d="M 112 168 C 130 168, 146 162, 152 152 C 140 158, 128 162, 116 166 Z"
            fill={`url(#velvetBase_${uniqueId})`}
            stroke={`url(#gold3D_${uniqueId})`}
            strokeWidth="0.8"
          />

          {/* Crown on Lion's Head */}
          <g transform="translate(0, 116)">
            <path
              d="M 94 28 L 91 20 L 96 23 L 100 16 L 104 23 L 109 20 L 106 28 Z"
              fill={`url(#gold3D_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="0.7"
            />
            {/* Cross on Lion Crown */}
            <path d="M 100 13 L 100 16 M 98.5 14.5 L 101.5 14.5" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="100" cy="21" r="1.6" fill={`url(#gemRadial_${uniqueId})`} stroke="#FFFFFF" strokeWidth="0.4" />
          </g>

          {/* 3D Sculpted Golden Lion Face & Fluffy Royal Mane */}
          <g transform="translate(0, 116)">
            {/* Fluffy Golden Mane */}
            <path
              d="M 87 34 C 84 30, 89 27, 92 27 C 93 25, 97 23, 100 23 C 103 23, 107 25, 108 27 C 111 27, 116 30, 113 34 C 118 38, 118 45, 114 50 C 115 55, 110 61, 105 62 C 103 65, 97 65, 95 62 C 90 61, 85 55, 86 50 C 82 45, 82 38, 87 34 Z"
              fill={`url(#gold3D_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="0.9"
            />

            {/* Inner Mane Deep Velvet Shadow */}
            <path
              d="M 90 35 C 90 30, 96 27, 100 27 C 104 27, 110 30, 110 35 C 113 41, 110 49, 106 53 C 103 56, 97 56, 94 53 C 90 49, 87 41, 90 35 Z"
              fill={`url(#velvetBase_${uniqueId})`}
              stroke={`url(#gold3D_${uniqueId})`}
              strokeWidth="0.7"
            />

            {/* Lion Ears */}
            <circle cx="90" cy="27" r="3" fill={`url(#gold3D_${uniqueId})`} />
            <circle cx="110" cy="27" r="3" fill={`url(#gold3D_${uniqueId})`} />

            {/* Brow & Nose Bridge */}
            <path
              d="M 93 32 C 96 30, 104 30, 107 32 L 105 38 C 102 37, 98 37, 95 38 Z"
              fill={`url(#gold3D_${uniqueId})`}
            />

            {/* Glowing Golden Eyes */}
            <ellipse cx="95" cy="36" rx="2.2" ry="1.4" fill="#FFFFFF" />
            <circle cx="95" cy="36" r="1.1" fill={`url(#gemRadial_${uniqueId})`} />
            <ellipse cx="105" cy="36" rx="2.2" ry="1.4" fill="#FFFFFF" />
            <circle cx="105" cy="36" r="1.1" fill={`url(#gemRadial_${uniqueId})`} />

            {/* Golden Muzzle */}
            <path
              d="M 97 40 C 95 40, 94 43, 96 46 C 98 47, 100 44, 100 42 C 100 44, 102 47, 104 46 C 106 43, 105 40, 103 40 Z"
              fill={`url(#gold3D_${uniqueId})`}
              stroke={tierConfig.goldDeep}
              strokeWidth="0.5"
            />

            {/* Nose */}
            <polygon points="100,40 98,37 102,37" fill="#000000" stroke={`url(#gold3D_${uniqueId})`} strokeWidth="0.4" />

            {/* Roaring Chin / Beard */}
            <path
              d="M 96 47 C 98 52, 102 52, 104 47 L 102 54 C 101 55, 99 55, 98 54 Z"
              fill={`url(#gold3D_${uniqueId})`}
              stroke="#FFFFFF"
              strokeWidth="0.6"
            />
          </g>

          {/* Cartouche VIP Badge Plaque Under Lion */}
          <g transform="translate(0, 156)">
            <rect
              x="76"
              y="16"
              width="48"
              height="14"
              rx="7"
              fill={`url(#velvetBase_${uniqueId})`}
              stroke={`url(#gold3D_${uniqueId})`}
              strokeWidth="1.2"
              filter={`url(#auraGlow_${uniqueId})`}
            />
            <text
              x="100"
              y="26.5"
              textAnchor="middle"
              fill="#FFFFFF"
              stroke={tierConfig.goldLight}
              strokeWidth="0.4"
              fontSize="9"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.8"
              className="select-none"
            >
              {tierConfig.label}
            </text>
          </g>

          {/* Diamond Gleams on Crest */}
          <g filter={`url(#diamondGleam_${uniqueId})`}>
            <circle cx="68" cy="144" r="1.6" fill="#FFFFFF" />
            <circle cx="132" cy="144" r="1.6" fill="#FFFFFF" />
            <circle cx="100" cy="190" r="1.8" fill={tierConfig.goldLight} />
          </g>
        </g>
      </svg>
    </div>
  );
};
