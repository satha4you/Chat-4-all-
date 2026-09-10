import React from 'react';
import { VIPTier } from '../../types';
import { Crown, Star, Gem, ShieldCheck, Sparkles } from 'lucide-react';

interface VIPProfileHeaderArchProps {
  tier: VIPTier;
  className?: string;
}

/**
 * Top Arch: Majestic Sculpted Imperial Golden Lion with Royal Crown and Amethyst Feathered Wings
 * Directly matching the uploaded reference image!
 */
export const VIPProfileHeaderArch: React.FC<VIPProfileHeaderArchProps> = ({
  tier,
  className = '',
}) => {
  if (tier === 'none') return null;

  // Configurations for each tier's royal arch
  const archConfig = {
    bronze: {
      wingStart: '#D97706',
      wingEnd: '#78350F',
      goldGrad1: '#FDE68A',
      goldGrad2: '#B45309',
      gemColor: '#D97706',
      gemGlow: 'rgba(217, 119, 6, 0.5)',
      title: 'صقر البرونز الإمبراطوري',
    },
    silver: {
      wingStart: '#CBD5E1',
      wingEnd: '#0284C7',
      goldGrad1: '#F8FAFC',
      goldGrad2: '#64748B',
      gemColor: '#38BDF8',
      gemGlow: 'rgba(56, 189, 248, 0.5)',
      title: 'ذئب الفضة السماوي',
    },
    gold: {
      wingStart: '#FDE047',
      wingEnd: '#854D0E',
      goldGrad1: '#FFFBEB',
      goldGrad2: '#CA8A04',
      gemColor: '#EAB308',
      gemGlow: 'rgba(234, 179, 8, 0.65)',
      title: 'نسر الذهب الملكي',
    },
    royal: {
      wingStart: '#C084FC',
      wingEnd: '#4C1D95',
      goldGrad1: '#FFFDF0',
      goldGrad2: '#B45309',
      gemColor: '#A855F7',
      gemGlow: 'rgba(168, 85, 247, 0.8)',
      title: 'الأسد الملكي المجنح',
    },
    mythic: {
      // Supreme Imperial Sovereign Lion with Amethyst Crystal Wings (Photo match)
      wingStart: '#E9D5FF',
      wingEnd: '#581C87',
      goldGrad1: '#FFFFFF',
      goldGrad2: '#78350F',
      gemColor: '#C084FC',
      gemGlow: 'rgba(192, 132, 252, 0.95)',
      title: 'الأسد الإمبراطوري الأسطوري الأسمى',
    },
  }[tier];

  if (!archConfig) return null;

  return (
    <div className={`relative w-full overflow-visible pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 500 130"
        className="w-full h-auto overflow-visible drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Imperial Metallic Gold Gradient */}
          <linearGradient id={`archGold_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#FFF7D6" />
            <stop offset="45%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="90%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Amethyst Violet Wing Plumage Gradient */}
          <linearGradient id={`archWing_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor={archConfig.wingStart} />
            <stop offset="65%" stopColor={archConfig.gemColor} />
            <stop offset="100%" stopColor={archConfig.wingEnd} />
          </linearGradient>

          {/* Amethyst Gem Radial Gradient */}
          <radialGradient id={`archGem_${tier}`} cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor={archConfig.gemColor} stopOpacity="0.9" />
            <stop offset="75%" stopColor="#6B21A8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1E0B36" stopOpacity="1" />
          </radialGradient>

          {/* Ambient Glow */}
          <filter id={`archGlow_${tier}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Center Aura behind Lion & Wings */}
        <ellipse
          cx="250"
          cy="48"
          rx="65"
          ry="38"
          fill={archConfig.gemGlow}
          opacity="0.4"
          filter={`url(#archGlow_${tier})`}
        />

        {/* 1. OUTER GOLDEN ARCH FRAMEWORK BAR WITH BEVELED EDGES */}
        <path
          d="M 20 85 L 180 85 C 205 85, 222 72, 250 72 C 278 72, 295 85, 320 85 L 480 85"
          fill="none"
          stroke={`url(#archGold_${tier})`}
          strokeWidth="3.8"
          filter={`url(#archGlow_${tier})`}
        />
        <path
          d="M 30 89 L 175 89 M 325 89 L 470 89"
          fill="none"
          stroke={archConfig.gemColor}
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />

        {/* 2. LEFT SPREADING WINGS (Amethyst Feather Plumage with Gold Borders) */}
        <g id="archLeftWings">
          {/* Top Primary Wing Feather */}
          <path
            d="M 235 46 C 195 20, 125 -6, 45 8 C 80 24, 120 38, 185 54 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.8"
            className={tier === 'mythic' ? 'animate-pulse' : ''}
          />
          {/* Middle Tier Feathers */}
          <path
            d="M 225 56 C 180 36, 100 16, 28 38 C 72 48, 120 60, 175 68 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.5"
          />
          {/* Lower Tier Feathers */}
          <path
            d="M 215 66 C 160 54, 85 45, 12 66 C 62 72, 110 78, 175 80 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.3"
          />
          {/* Gold Base Wing Plume */}
          <path
            d="M 198 76 C 140 70, 75 74, 10 84 C 60 84, 105 84, 170 84 Z"
            fill={`url(#archGold_${tier})`}
          />
        </g>

        {/* 3. RIGHT SPREADING WINGS (Mirrored Symmetrical Plumage) */}
        <g id="archRightWings">
          {/* Top Primary Wing Feather */}
          <path
            d="M 265 46 C 305 20, 375 -6, 455 8 C 420 24, 380 38, 315 54 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.8"
            className={tier === 'mythic' ? 'animate-pulse' : ''}
          />
          {/* Middle Tier Feathers */}
          <path
            d="M 275 56 C 320 36, 400 16, 472 38 C 428 48, 380 60, 325 68 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.5"
          />
          {/* Lower Tier Feathers */}
          <path
            d="M 285 66 C 340 54, 415 45, 488 66 C 438 72, 390 78, 325 80 Z"
            fill={`url(#archWing_${tier})`}
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.3"
          />
          {/* Gold Base Wing Plume */}
          <path
            d="M 302 76 C 360 70, 425 74, 490 84 C 440 84, 395 84, 330 84 Z"
            fill={`url(#archGold_${tier})`}
          />
        </g>

        {/* 4. CENTERPIECE: MAJESTIC SCULPTED GOLDEN IMPERIAL LION WITH ROYAL CROWN */}
        <g id="centerLionCrest">
          {/* Lion's Mane Golden Flourishes */}
          <path
            d="M 224 45 C 215 32, 235 15, 250 15 C 265 15, 285 32, 276 45 C 285 52, 282 66, 272 74 C 262 82, 238 82, 228 74 C 218 66, 215 52, 224 45 Z"
            fill={`url(#archGold_${tier})`}
            stroke="#FFFFFF"
            strokeWidth="1.2"
            filter={`url(#archGlow_${tier})`}
          />

          {/* Sculpted Golden Lion Face Features */}
          {/* Lion Ears */}
          <polygon points="230,22 225,12 238,18" fill={`url(#archGold_${tier})`} stroke="#FFFFFF" strokeWidth="0.8" />
          <polygon points="270,22 275,12 262,18" fill={`url(#archGold_${tier})`} stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Lion Forehead & Brow */}
          <path
            d="M 236 28 C 242 24, 258 24, 264 28 L 260 40 C 255 36, 245 36, 240 40 Z"
            fill="#B45309"
            stroke={`url(#archGold_${tier})`}
            strokeWidth="0.8"
          />

          {/* Lion Eyes (Glowing Amethyst Jewels) */}
          <ellipse cx="242" cy="35" rx="3" ry="1.8" fill={archConfig.gemColor} stroke="#FFFFFF" strokeWidth="0.6" />
          <ellipse cx="258" cy="35" rx="3" ry="1.8" fill={archConfig.gemColor} stroke="#FFFFFF" strokeWidth="0.6" />
          <circle cx="242" cy="35" r="0.8" fill="#FFFFFF" />
          <circle cx="258" cy="35" r="0.8" fill="#FFFFFF" />

          {/* Lion Muzzle & Nose */}
          <polygon points="248,42 252,42 250,47" fill="#78350F" />
          <path
            d="M 244 47 C 247 51, 253 51, 256 47"
            fill="none"
            stroke={`url(#archGold_${tier})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* 5. TOP GOLDEN ROYAL IMPERIAL CROWN (Studded with Purple Gems) */}
          <g id="archLionCrown" transform="translate(0, -6)">
            {/* Crown Base */}
            <rect x="234" y="16" width="32" height="5" rx="2.5" fill={`url(#archGold_${tier})`} stroke="#FFFFFF" strokeWidth="0.6" />
            {/* Crown Spires */}
            <path
              d="M 234 16 L 232 4 L 241 10 L 250 -2 L 259 10 L 268 4 L 266 16 Z"
              fill={`url(#archGold_${tier})`}
              stroke="#FFFFFF"
              strokeWidth="1"
              filter={`url(#archGlow_${tier})`}
            />
            {/* Crown Purple Jewels */}
            <circle cx="250" cy="-2" r="2.8" fill={archConfig.gemColor} stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="232" cy="4" r="2" fill={archConfig.gemColor} stroke="#FFFFFF" strokeWidth="0.6" />
            <circle cx="268" cy="4" r="2" fill={archConfig.gemColor} stroke="#FFFFFF" strokeWidth="0.6" />
            <circle cx="250" cy="-2" r="1" fill="#FFFFFF" />
          </g>

          {/* 6. HANGING AMETHYST TEARDROP CRYSTAL BELOW LION'S CHIN */}
          <g id="hangingTeardropGem">
            {/* Golden Mounting Prong */}
            <circle cx="250" cy="74" r="2.5" fill={`url(#archGold_${tier})`} stroke="#FFFFFF" strokeWidth="0.6" />
            {/* Faceted Teardrop Jewel */}
            <path
              d="M 250 75 C 243 83, 240 92, 245 98 C 248 102, 252 102, 255 98 C 260 92, 257 83, 250 75 Z"
              fill={`url(#archGem_${tier})`}
              stroke={`url(#archGold_${tier})`}
              strokeWidth="1"
              filter={`url(#archGlow_${tier})`}
            />
            {/* Internal Facet Highlights */}
            <polygon points="250,78 247,90 250,96 253,90" fill="#FFFFFF" opacity="0.65" />
            <circle cx="248" cy="88" r="1.4" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Left & Right Flanking Sculpted Golden Lion Guardians
 * Flanking the sides of the profile card with purple velvet ribbons!
 */
export const VIPSideLionGuardians: React.FC<{ tier: VIPTier }> = ({ tier }) => {
  if (tier === 'none') return null;

  return (
    <>
      {/* Left Guardian Lion */}
      <div className="absolute top-28 -left-3 z-20 pointer-events-none select-none hidden sm:flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#997316] via-[#D4AF37] to-[#F5DF88] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.6)] border border-yellow-200 flex items-center justify-center">
          <span className="text-base" role="img" aria-label="lion">🦁</span>
        </div>
        {/* Flowing Purple Velvet Ribbon */}
        <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 via-purple-600 to-transparent rounded-full opacity-85 shadow-sm" />
      </div>

      {/* Right Guardian Lion */}
      <div className="absolute top-28 -right-3 z-20 pointer-events-none select-none hidden sm:flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#997316] via-[#D4AF37] to-[#F5DF88] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.6)] border border-yellow-200 flex items-center justify-center">
          <span className="text-base" role="img" aria-label="lion">🦁</span>
        </div>
        {/* Flowing Purple Velvet Ribbon */}
        <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 via-purple-600 to-transparent rounded-full opacity-85 shadow-sm" />
      </div>
    </>
  );
};

/**
 * Right Side Royal Hanging Banner Ribbon (الراية الملكية المتدلية)
 * Matching the velvet heraldic banner on the right side of the user's reference picture!
 */
export const VIPHangingBannerRibbon: React.FC<{ tier: VIPTier }> = ({ tier }) => {
  if (tier === 'none') return null;

  const label = {
    bronze: 'VIP 1',
    silver: 'VIP 2',
    gold: 'VIP 3',
    royal: 'VIP 4',
    mythic: 'VIP 5',
  }[tier] || 'VIP';

  return (
    <div className="absolute top-12 left-4 z-20 pointer-events-none select-none flex flex-col items-center drop-shadow-xl">
      {/* Top Golden Brass Bar */}
      <div className="w-14 h-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-yellow-100 shadow-md flex items-center justify-between px-1">
        <span className="w-1 h-1 rounded-full bg-amber-800" />
        <span className="w-1 h-1 rounded-full bg-amber-800" />
      </div>

      {/* Velvet Purple Banner Body with Golden Trim */}
      <div className="relative w-12 bg-gradient-to-b from-[#3B0764] via-[#2E1065] to-[#1E0B36] border-x border-b border-amber-400/80 px-1 pt-1.5 pb-3 text-center shadow-lg">
        {/* Golden Fringe Stitching */}
        <div className="absolute inset-x-1 top-0.5 h-0.5 bg-amber-400/60" />
        <Crown className="w-3.5 h-3.5 text-amber-300 mx-auto" />
        <span className="block text-[9px] font-black text-amber-300 tracking-wider mt-0.5 font-mono">
          {label}
        </span>
        <span className="block text-[7px] font-bold text-zinc-300 uppercase tracking-tight">
          ROYAL
        </span>

        {/* Banner Swallowtail / V-Cut Bottom */}
        <div className="absolute -bottom-2 left-0 right-0 h-2 flex justify-center">
          <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[8px] border-t-[#1E0B36]" />
        </div>
      </div>

      {/* Hanging Amethyst Jewel at Banner Tip */}
      <div className="mt-2.5 w-3 h-4 bg-gradient-to-b from-purple-400 to-purple-800 rotate-45 border border-amber-300 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
    </div>
  );
};

/**
 * Four Golden Hexagon / Shield Status Badges (Matching the bottom 4 badges in the reference picture)
 * 👑 PREMIUM | ⭐ EXCLUSIVE | 💎 ELITE | 🛡️ TRUSTED
 */
export const VIPRoyalBadgesBar: React.FC<{ tier: VIPTier }> = ({ tier }) => {
  const isMythicOrRoyal = tier === 'mythic' || tier === 'royal';

  const badges = [
    { id: 'premium', label: 'PREMIUM', icon: <Crown className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'exclusive', label: 'EXCLUSIVE', icon: <Star className="w-3.5 h-3.5 text-yellow-300" /> },
    { id: 'elite', label: 'ELITE', icon: <Gem className="w-3.5 h-3.5 text-purple-300" /> },
    { id: 'trusted', label: 'TRUSTED', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> },
  ];

  return (
    <div className="my-3 py-2 px-3 rounded-2xl bg-gradient-to-r from-[#120822]/90 via-[#1A0B2E]/90 to-[#120822]/90 border border-amber-500/40 shadow-inner">
      <div className="grid grid-cols-4 gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all ${
              isMythicOrRoyal
                ? 'bg-gradient-to-b from-[#25103E] to-[#120822] border-amber-400/50 shadow-sm'
                : 'bg-black/40 border-zinc-800'
            }`}
          >
            <div className="p-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              {b.icon}
            </div>
            <span className="text-[8px] font-black text-amber-300 mt-1 tracking-wider uppercase">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Bottom Baroque Filigree with Faceted Amethyst Jewel
 * Forms the bottom majestic frame border of the profile card
 */
export const VIPBottomBaroqueFlourish: React.FC<{ tier: VIPTier }> = ({ tier }) => {
  if (tier === 'none') return null;

  return (
    <div className="w-full flex items-center justify-center py-2 select-none pointer-events-none">
      <svg viewBox="0 0 400 36" className="w-full max-w-sm h-7 overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="baroqueGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Left Scrollwork Vine */}
        <path
          d="M 30 18 C 80 18, 120 8, 180 18"
          fill="none"
          stroke="url(#baroqueGold)"
          strokeWidth="2"
        />
        {/* Right Scrollwork Vine */}
        <path
          d="M 370 18 C 320 18, 280 8, 220 18"
          fill="none"
          stroke="url(#baroqueGold)"
          strokeWidth="2"
        />

        {/* Center Faceted Amethyst Diamond with Gold Setting */}
        <polygon points="200,6 212,18 200,30 188,18" fill="#FDE047" stroke="#FFFFFF" strokeWidth="0.8" />
        <polygon points="200,8 210,18 200,28 190,18" fill="#9333EA" stroke="#C084FC" strokeWidth="0.6" />
        <circle cx="200" cy="18" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

/**
 * Custom Name Banner Plate with Royal Velvet Purple & Gold Beveled Edges
 */
export const VIPNameBannerPlate: React.FC<{
  tier: VIPTier;
  children: React.ReactNode;
}> = ({ tier, children }) => {
  if (tier === 'none') {
    return <div className="inline-block">{children}</div>;
  }

  return (
    <div className="relative inline-flex items-center justify-center px-6 py-2 rounded-2xl bg-gradient-to-r from-[#1F0A38] via-[#320D58] to-[#1F0A38] border-2 border-amber-400/80 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
      {/* Left & Right Gold Chevron Accents */}
      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rotate-45 border border-yellow-100 shadow-sm" />
      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rotate-45 border border-yellow-100 shadow-sm" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * User Bio / Status Quote Plate Framed in Royal Velvet & Gold
 */
export const VIPQuotePlate: React.FC<{
  tier: VIPTier;
  statusText?: string;
  bioText?: string;
}> = ({ tier, statusText, bioText }) => {
  const isVip = tier !== 'none';

  return (
    <div
      className={`relative p-3.5 rounded-2xl border transition-all ${
        isVip
          ? 'bg-gradient-to-br from-[#120822] to-[#0A0414] border-amber-500/40 shadow-md'
          : 'bg-[#080808] border-zinc-800'
      }`}
    >
      {/* Corner Gold Leaf Pin */}
      {isVip && (
        <span className="absolute top-2 left-2 text-amber-400 text-xs">👑</span>
      )}

      {statusText && (
        <div className="text-xs font-semibold text-amber-200/90 leading-relaxed mb-1">
          "{statusText}"
        </div>
      )}

      {bioText && (
        <div className="text-[11px] text-zinc-400 leading-normal">
          {bioText}
        </div>
      )}
    </div>
  );
};
