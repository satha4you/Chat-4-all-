import React from 'react';
import { VIPTier } from '../../types';

interface VIPAvatarFrameSVGProps {
  tier: VIPTier;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  showTopCrown?: boolean;
  mythicFrameId?: string;
}

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
          primaryGold: '#EF4444',
          secondaryGold: '#FDE047',
          deepGold: '#991B1B',
          purpleVelvet: '#450A0A',
          accentGem: '#F59E0B',
          gemGlow: 'rgba(239, 68, 68, 0.95)',
          gemCore: '#DC2626',
          leafWingStart: '#FEE2E2',
          leafWingEnd: '#7F1D1D',
          wingScale: 1.22,
          wreathStroke: 3.8,
        };
      case 'mythic_cosmic_nebula':
        return {
          label: 'VIP 5',
          subTitle: 'COSMIC NEBULA',
          primaryGold: '#06B6D4',
          secondaryGold: '#E0F2FE',
          deepGold: '#312E81',
          purpleVelvet: '#0F172A',
          accentGem: '#8B5CF6',
          gemGlow: 'rgba(6, 182, 212, 0.95)',
          gemCore: '#6366F1',
          leafWingStart: '#E0E7FF',
          leafWingEnd: '#3730A3',
          wingScale: 1.18,
          wreathStroke: 3.6,
        };
      case 'mythic_golden_falcon':
        return {
          label: 'VIP 5',
          subTitle: 'GOLDEN FALCON',
          primaryGold: '#F59E0B',
          secondaryGold: '#FEF9C3',
          deepGold: '#78350F',
          purpleVelvet: '#451A03',
          accentGem: '#FBBF24',
          gemGlow: 'rgba(245, 158, 11, 0.98)',
          gemCore: '#B45309',
          leafWingStart: '#FEF08A',
          leafWingEnd: '#92400E',
          wingScale: 1.24,
          wreathStroke: 4.0,
        };
      case 'mythic_ruby_ottoman':
        return {
          label: 'VIP 5',
          subTitle: 'IMPERIAL RUBY',
          primaryGold: '#DC2626',
          secondaryGold: '#FDE68A',
          deepGold: '#450A0A',
          purpleVelvet: '#1F040C',
          accentGem: '#EF4444',
          gemGlow: 'rgba(220, 38, 38, 0.95)',
          gemCore: '#991B1B',
          leafWingStart: '#FECDD3',
          leafWingEnd: '#881337',
          wingScale: 1.16,
          wreathStroke: 3.8,
        };
      case 'mythic_cyber_glory':
        return {
          label: 'VIP 5',
          subTitle: 'CYBER AURORA',
          primaryGold: '#10B981',
          secondaryGold: '#A7F3D0',
          deepGold: '#064E3B',
          purpleVelvet: '#022C22',
          accentGem: '#34D399',
          gemGlow: 'rgba(16, 185, 129, 0.95)',
          gemCore: '#047857',
          leafWingStart: '#D1FAE5',
          leafWingEnd: '#065F46',
          wingScale: 1.18,
          wreathStroke: 3.6,
        };
      case 'mythic_sovereign_wings':
      default:
        return {
          label: 'VIP 5',
          subTitle: 'MYTHIC SULTAN',
          primaryGold: '#FDE047',
          secondaryGold: '#FFFFFF',
          deepGold: '#3B0764',
          purpleVelvet: '#1B042F',
          accentGem: '#C084FC',
          gemGlow: 'rgba(216, 180, 254, 0.98)',
          gemCore: '#7E22CE',
          leafWingStart: '#F3E8FF',
          leafWingEnd: '#2E0854',
          wingScale: 1.18,
          wreathStroke: 3.6,
        };
    }
  };

  // Royal Golden Purple Color & Aesthetic Configuration for each VIP Tier
  const tierConfig = tier === 'mythic' ? getMythicConfig(mythicFrameId) : {
    bronze: {
      label: 'VIP 1',
      subTitle: 'BRONZE ROYAL',
      primaryGold: '#E59B2A',
      secondaryGold: '#FEF3C7',
      deepGold: '#78350F',
      purpleVelvet: '#2E0854',
      accentGem: '#A855F7',
      gemGlow: 'rgba(168, 85, 247, 0.75)',
      gemCore: '#581C87',
      leafWingStart: '#C084FC',
      leafWingEnd: '#3B0764',
      wingScale: 0.88,
      wreathStroke: 2.8,
    },
    silver: {
      label: 'VIP 2',
      subTitle: 'SILVER ROYAL',
      primaryGold: '#F59E0B',
      secondaryGold: '#FFFBEB',
      deepGold: '#6B21A8',
      purpleVelvet: '#350B61',
      accentGem: '#C084FC',
      gemGlow: 'rgba(192, 132, 252, 0.8)',
      gemCore: '#6B21A8',
      leafWingStart: '#E9D5FF',
      leafWingEnd: '#581C87',
      wingScale: 0.94,
      wreathStroke: 3.0,
    },
    gold: {
      label: 'VIP 3',
      subTitle: 'GOLDEN ROYAL',
      primaryGold: '#FBBF24',
      secondaryGold: '#FEF08A',
      deepGold: '#854D0E',
      purpleVelvet: '#3B0764',
      accentGem: '#9333EA',
      gemGlow: 'rgba(147, 51, 234, 0.85)',
      gemCore: '#4C1D95',
      leafWingStart: '#D8B4FE',
      leafWingEnd: '#581C87',
      wingScale: 1.0,
      wreathStroke: 3.2,
    },
    royal: {
      label: 'VIP 4',
      subTitle: 'ROYAL LION',
      primaryGold: '#F59E0B',
      secondaryGold: '#FFFDF0',
      deepGold: '#581C87',
      purpleVelvet: '#260447',
      accentGem: '#A855F7',
      gemGlow: 'rgba(168, 85, 247, 0.92)',
      gemCore: '#4C1D95',
      leafWingStart: '#E9D5FF',
      leafWingEnd: '#3B0764',
      wingScale: 1.08,
      wreathStroke: 3.4,
    },
  }[tier];

  if (!tierConfig) return null;

  const isCompact = size === 'xs' || size === 'sm';
  const isLarge = size === 'xl' || size === '2xl' || size === 'hero';

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 flex items-center justify-center ${className}`}
      style={{
        transform: isCompact ? 'scale(1.44)' : isLarge ? 'scale(1.40)' : 'scale(1.35)',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Master Royal Imperial Gold Gradient */}
          <linearGradient id={`royalGold_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="15%" stopColor={tierConfig.secondaryGold} />
            <stop offset="42%" stopColor={tierConfig.primaryGold} />
            <stop offset="78%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#581C87" />
          </linearGradient>

          {/* Royal Purple Velvet to Amethyst Gradient */}
          <linearGradient id={`royalPurple_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierConfig.leafWingStart} />
            <stop offset="35%" stopColor={tierConfig.accentGem} />
            <stop offset="75%" stopColor={tierConfig.leafWingEnd} />
            <stop offset="100%" stopColor={tierConfig.purpleVelvet} />
          </linearGradient>

          {/* Gold to Purple Dual Metallic Shimmer */}
          <linearGradient id={`goldPurpleDuo_${tier}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tierConfig.primaryGold} />
            <stop offset="28%" stopColor={tierConfig.secondaryGold} />
            <stop offset="55%" stopColor={tierConfig.accentGem} />
            <stop offset="85%" stopColor={tierConfig.leafWingEnd} />
            <stop offset="100%" stopColor={tierConfig.purpleVelvet} />
          </linearGradient>

          {/* Faceted Amethyst Diamond Radial Core */}
          <radialGradient id={`gemRadial_${tier}`} cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor={tierConfig.accentGem} stopOpacity="0.9" />
            <stop offset="70%" stopColor={tierConfig.gemCore} stopOpacity="0.98" />
            <stop offset="100%" stopColor={tierConfig.purpleVelvet} stopOpacity="1" />
          </radialGradient>

          {/* Atmospheric Aura Filter for Royal Golden Purple Glow */}
          <filter id={`royalGlow_${tier}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation={isLarge ? "3.8" : "2.2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. LAYER 1: BACK ROYAL GOLDEN PURPLE SPREADING WINGS */}
        <g 
          id="royalGoldenPurpleWings" 
          opacity="0.98"
          transform={`translate(100, 100) scale(${tierConfig.wingScale}) translate(-100, -100)`}
        >
          {/* Left Wing - Upper Major Primary Feather */}
          <path
            d="M 40 88 C 12 70, -12 46, -4 24 C 10 38, 28 54, 46 72 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.4"
            className={tier === 'mythic' || tier === 'royal' ? 'animate-pulse' : ''}
          />
          {/* Left Wing - Middle Secondary Feather */}
          <path
            d="M 36 102 C 6 92, -18 78, -12 56 C 6 68, 24 80, 42 90 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.2"
          />
          {/* Left Wing - Lower Tertiary Feather */}
          <path
            d="M 40 118 C 12 120, -14 112, -8 92 C 8 98, 26 106, 44 108 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />

          {/* Right Wing (Mirrored) - Upper Major Primary Feather */}
          <path
            d="M 160 88 C 188 70, 212 46, 204 24 C 190 38, 172 54, 154 72 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.4"
            className={tier === 'mythic' || tier === 'royal' ? 'animate-pulse' : ''}
          />
          {/* Right Wing - Middle Secondary Feather */}
          <path
            d="M 164 102 C 194 92, 218 78, 212 56 C 194 68, 176 80, 158 90 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.2"
          />
          {/* Right Wing - Lower Tertiary Feather */}
          <path
            d="M 160 118 C 188 120, 214 112, 208 92 C 192 98, 174 106, 156 108 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
        </g>

        {/* 2. LAYER 2: CIRCULAR METALLIC GOLD & AMETHYST BEVELED RINGS */}
        {/* Outer Radiant Glow Circle */}
        <circle
          cx="100"
          cy="100"
          r="69.5"
          fill="none"
          stroke={tierConfig.gemGlow}
          strokeWidth="6"
          opacity="0.5"
          filter={`url(#royalGlow_${tier})`}
        />

        {/* Outer Heavy Embossed Gold Ring */}
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke={`url(#royalGold_${tier})`}
          strokeWidth={isLarge ? "4.5" : "3.8"}
          filter={`url(#royalGlow_${tier})`}
        />

        {/* Purple Velvet Deep Trench Channel */}
        <circle
          cx="100"
          cy="100"
          r="65.2"
          fill="none"
          stroke={tierConfig.purpleVelvet}
          strokeWidth="2.2"
        />

        {/* Inner Beaded Royal Amethyst & Gold Filigree Circle */}
        <circle
          cx="100"
          cy="100"
          r="63.5"
          fill="none"
          stroke={`url(#royalGold_${tier})`}
          strokeWidth="1.6"
          strokeDasharray="4 2.8"
          opacity="0.95"
        />

        {/* 3. LAYER 3: SCULPTED GOLDEN LAUREL WREATH WITH AMETHYST LEAF INLAYS */}
        <g id="royalGoldenLaurelWreath" filter={`url(#royalGlow_${tier})`}>
          {/* Left Laurel Branch Stem */}
          <path
            d="M 100 166 C 58 166, 36 136, 38 88 C 39 66, 52 46, 70 34"
            fill="none"
            stroke={`url(#royalGold_${tier})`}
            strokeWidth={tierConfig.wreathStroke}
            strokeLinecap="round"
          />
          {/* Left Leaves - alternating Gold and Violet Amethyst with Gold Edge */}
          {/* Leaf 1 */}
          <path
            d="M 86 163 C 74 167, 65 158, 74 150 C 82 144, 88 153, 86 163 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 2 */}
          <path
            d="M 68 150 C 53 152, 47 140, 58 132 C 67 127, 72 138, 68 150 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 3 */}
          <path
            d="M 52 132 C 37 130, 34 116, 46 110 C 56 106, 60 118, 52 132 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 4 */}
          <path
            d="M 44 110 C 29 104, 30 90, 43 86 C 53 84, 54 98, 44 110 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 5 */}
          <path
            d="M 43 86 C 30 76, 34 62, 47 62 C 57 62, 55 76, 43 86 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 6 */}
          <path
            d="M 49 64 C 39 52, 47 40, 59 42 C 67 45, 62 57, 49 64 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 7 */}
          <path
            d="M 61 46 C 54 34, 66 25, 76 30 C 83 35, 75 44, 61 46 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />

          {/* Right Laurel Branch Stem (Mirrored) */}
          <path
            d="M 100 166 C 142 166, 164 136, 162 88 C 161 66, 148 46, 130 34"
            fill="none"
            stroke={`url(#royalGold_${tier})`}
            strokeWidth={tierConfig.wreathStroke}
            strokeLinecap="round"
          />
          {/* Right Leaves */}
          {/* Leaf 1 */}
          <path
            d="M 114 163 C 126 167, 135 158, 126 150 C 118 144, 112 153, 114 163 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 2 */}
          <path
            d="M 132 150 C 147 152, 153 140, 142 132 C 133 127, 128 138, 132 150 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 3 */}
          <path
            d="M 148 132 C 163 130, 166 116, 154 110 C 144 106, 140 118, 148 132 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 4 */}
          <path
            d="M 156 110 C 171 104, 170 90, 157 86 C 147 84, 146 98, 156 110 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 5 */}
          <path
            d="M 157 86 C 170 76, 166 62, 153 62 C 143 62, 145 76, 157 86 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
          {/* Leaf 6 */}
          <path
            d="M 151 64 C 161 52, 153 40, 141 42 C 133 45, 138 57, 151 64 Z"
            fill={`url(#royalGold_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="1"
          />
          {/* Leaf 7 */}
          <path
            d="M 139 46 C 146 34, 134 25, 124 30 C 117 35, 125 44, 139 46 Z"
            fill={`url(#royalPurple_${tier})`}
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.1"
          />
        </g>

        {/* 4. LAYER 4: TOP ROYAL GOLDEN PURPLE IMPERIAL CROWN & VIP BADGE (Rendered when showTopCrown is true) */}
        {showTopCrown && (
          <g id="topImperialCrown" transform="translate(0, -6)">
            {/* Radiant back halo */}
            <circle cx="100" cy="24" r="22" fill={tierConfig.gemGlow} opacity="0.4" filter={`url(#royalGlow_${tier})`} />

            {/* Velvet Violet Cap inside Crown */}
            <path
              d="M 82 32 C 84 20, 100 16, 100 16 C 100 16, 116 20, 118 32 Z"
              fill={`url(#royalPurple_${tier})`}
              stroke={tierConfig.primaryGold}
              strokeWidth="0.8"
            />

            {/* Crown Base Arc Plaque */}
            <path
              d="M 78 34 C 92 37, 108 37, 122 34 L 120 30 C 108 32, 92 32, 80 30 Z"
              fill={`url(#royalGold_${tier})`}
              stroke="#FFFFFF"
              strokeWidth="0.6"
            />

            {/* Crown Filigree Body with 5 Royal Golden Spires */}
            <path
              d="M 78 32 
                 L 75 16 
                 L 87 24 
                 L 100 7 
                 L 113 24 
                 L 125 16 
                 L 122 32 
                 C 112 34, 88 34, 78 32 Z"
              fill={`url(#royalGold_${tier})`}
              stroke="#FFFFFF"
              strokeWidth="0.9"
              filter={`url(#royalGlow_${tier})`}
            />

            {/* Purple Amethyst Jewels on Crown Spire Tips */}
            {/* Center Highest Diamond Peak */}
            <circle cx="100" cy="7" r="3.4" fill={tierConfig.accentGem} stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="100" cy="6" r="1.3" fill="#FFFFFF" />

            {/* Left & Right Spire Jewels */}
            <circle cx="75" cy="16" r="2.4" fill={tierConfig.accentGem} stroke="#FFFFFF" strokeWidth="0.6" />
            <circle cx="125" cy="16" r="2.4" fill={tierConfig.accentGem} stroke="#FFFFFF" strokeWidth="0.6" />

            {/* Intermediate Valley Jewels */}
            <circle cx="87" cy="24" r="1.8" fill={tierConfig.secondaryGold} />
            <circle cx="113" cy="24" r="1.8" fill={tierConfig.secondaryGold} />

            {/* Crown Center Amethyst Oval Gem */}
            <ellipse
              cx="100"
              cy="27"
              rx="4.5"
              ry="3.2"
              fill={tierConfig.accentGem}
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />

            {/* Royal Cartouche Plaque: Deep Purple Velvet Bordered in 24k Gold */}
            <rect
              x="76"
              y="35"
              width="48"
              height="13"
              rx="6.5"
              fill={tierConfig.purpleVelvet}
              stroke={`url(#royalGold_${tier})`}
              strokeWidth="1.6"
              filter={`url(#royalGlow_${tier})`}
            />
            {/* 3 Golden Imperial Diamond Stars (Pure Visual, zero text) */}
            <g transform="translate(100, 41.5)">
              {/* Center Diamond Star */}
              <polygon points="0,-4 2.5,-1 5,0 2.5,1 0,4 -2.5,1 -5,0 -2.5,-1" fill={`url(#royalGold_${tier})`} stroke="#FFFFFF" strokeWidth="0.4" />
              {/* Left Star */}
              <polygon points="-12,-3 -10,-0.8 -8,0 -10,0.8 -12,3 -14,0.8 -16,0 -14,-0.8" fill={tierConfig.secondaryGold} />
              {/* Right Star */}
              <polygon points="12,-3 14,-0.8 16,0 14,0.8 12,3 10,0.8 8,0 10,-0.8" fill={tierConfig.secondaryGold} />
            </g>
          </g>
        )}

        {/* 5. LAYER 5: BOTTOM FACETED ROYAL AMETHYST DIAMOND GEMSTONE WITH GOLD PRONGS */}
        <g id="bottomFacetedAmethystGem" transform="translate(0, 2)">
          {/* Glowing Gem Violet Aura */}
          <circle
            cx="100"
            cy="168"
            r="18"
            fill={tierConfig.gemGlow}
            opacity="0.8"
            filter={`url(#royalGlow_${tier})`}
          />

          {/* Gold Filigree Ribbon Swirls under gem */}
          <path
            d="M 74 166 C 84 175, 93 177, 100 177 C 107 177, 116 175, 126 166"
            fill="none"
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M 66 160 C 75 173, 87 183, 100 183 C 113 183, 125 173, 134 160"
            fill="none"
            stroke={`url(#royalGold_${tier})`}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Outer Gold Bezel Setting */}
          <polygon
            points="100,150 116,164 100,183 84,164"
            fill={`url(#royalGold_${tier})`}
            stroke="#FFFFFF"
            strokeWidth="1"
          />

          {/* Faceted Amethyst Diamond Gem Core */}
          <polygon
            points="100,152 114,164 100,181 86,164"
            fill={`url(#gemRadial_${tier})`}
            stroke={tierConfig.secondaryGold}
            strokeWidth="0.8"
          />

          {/* Faceted Diamond Table & Sparkle Pavilion facets */}
          <polygon
            points="100,152 108,163 100,166 92,163"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <polygon
            points="92,163 100,166 100,181 86,164"
            fill={tierConfig.leafWingEnd}
            opacity="0.85"
          />
          <polygon
            points="108,163 100,166 100,181 114,164"
            fill={tierConfig.accentGem}
            opacity="0.92"
          />

          {/* Brilliant Star Glint on Gemstone */}
          <circle cx="98" cy="159" r="1.8" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2.4s' }} />
          <circle cx="102" cy="160" r="1.1" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
