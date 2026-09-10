import React from 'react';
import { UserProfile, VIPTier } from '../../types';
import { VIP_CONFIGS } from '../../data/initialData';
import { Crown, Sparkles } from 'lucide-react';

interface VIPProfileMasterCardProps {
  user: UserProfile;
  tier?: VIPTier;
  onAvatarClick?: () => void;
  className?: string;
  showTierSwitcher?: boolean;
  onSelectTier?: (tier: VIPTier) => void;
}

/**
 * VIPProfileMasterCard:
 * Exact 1:1 reproduction of the user's reference image (804142BF-3827-467A-81A8-77A48CFB773D.png).
 * Features:
 * - Ornate sculpted 3D golden frame with purple velvet dark canvas
 * - Top imperial golden lion head crowned with amethyst-studded royal crown and spreading amethyst crystal wings
 * - Left & right inward-facing sculpted golden lion guardians with flowing purple & gold ribbons
 * - Circular avatar framed by golden laurel wreath, top royal crown, and bottom faceted amethyst diamond
 * - Pointed chevron dark plaque for user nickname & @username
 * - Beveled stepped golden plaque for the VIP Tier (e.g. VIP 5) with crown & sparkles
 * - Top-right royal hanging velvet heraldic banner with swallowtail and hanging purple diamond
 * - Luminous golden horizontal divider with central diamond glint
 * - The 4 golden heraldic badges: PREMIUM, EXCLUSIVE, ELITE, TRUSTED
 * - Bottom baroque golden filigree with multifaceted glowing amethyst diamond
 */
export const VIPProfileMasterCard: React.FC<VIPProfileMasterCardProps> = ({
  user,
  tier,
  onAvatarClick,
  className = '',
  showTierSwitcher = false,
  onSelectTier,
}) => {
  const currentTier: VIPTier = tier || user.vipTier || 'mythic';
  const effectiveTier = currentTier === 'none' ? 'bronze' : currentTier;

  // Tier configuration mappings
  const tierConfig = {
    bronze: {
      label: 'VIP 1',
      titleAr: 'صقر البرونز',
      primaryGold: '#D97706',
      secondaryGold: '#FDE68A',
      wingStart: '#F59E0B',
      wingEnd: '#78350F',
      gemColor: '#D97706',
      gemGlow: 'rgba(217, 119, 6, 0.7)',
      gemCore: '#78350F',
    },
    silver: {
      label: 'VIP 2',
      titleAr: 'ذئب الفضة',
      primaryGold: '#CBD5E1',
      secondaryGold: '#F8FAFC',
      wingStart: '#E2E8F0',
      wingEnd: '#0284C7',
      gemColor: '#38BDF8',
      gemGlow: 'rgba(56, 189, 248, 0.75)',
      gemCore: '#0369A1',
    },
    gold: {
      label: 'VIP 3',
      titleAr: 'نسر الذهب',
      primaryGold: '#EAB308',
      secondaryGold: '#FEF08A',
      wingStart: '#FDE047',
      wingEnd: '#854D0E',
      gemColor: '#EAB308',
      gemGlow: 'rgba(234, 179, 8, 0.8)',
      gemCore: '#854D0E',
    },
    royal: {
      label: 'VIP 4',
      titleAr: 'الأسد الملكي',
      primaryGold: '#F59E0B',
      secondaryGold: '#FFFDF0',
      wingStart: '#C084FC',
      wingEnd: '#581C87',
      gemColor: '#A855F7',
      gemGlow: 'rgba(168, 85, 247, 0.85)',
      gemCore: '#6B21A8',
    },
    mythic: {
      label: 'VIP 5',
      titleAr: 'الأسد الإمبراطوري الأسمى',
      primaryGold: '#FDE047',
      secondaryGold: '#FFFFFF',
      wingStart: '#E9D5FF',
      wingEnd: '#4A044E',
      gemColor: '#C084FC',
      gemGlow: 'rgba(192, 132, 252, 0.95)',
      gemCore: '#7E22CE',
    },
  }[effectiveTier];

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* Outer Glow & Canvas Frame Container */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[360px] md:min-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#130324] via-[#0E021B] to-[#06010D] border-2 border-amber-400/80 shadow-[0_0_50px_rgba(147,51,234,0.4)]">
        
        {/* SVG Master Artwork */}
        <svg
          viewBox="0 0 1000 562"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Imperial Gold Gradient */}
            <linearGradient id={`masterGold_${effectiveTier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#FFF4D0" />
              <stop offset="35%" stopColor="#F5DF88" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#AA7C11" />
              <stop offset="100%" stopColor="#664603" />
            </linearGradient>

            {/* Wing Plumage Violet/Purple Crystal Gradient */}
            <linearGradient id={`masterWing_${effectiveTier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor={tierConfig.wingStart} />
              <stop offset="60%" stopColor={tierConfig.gemColor} />
              <stop offset="100%" stopColor={tierConfig.wingEnd} />
            </linearGradient>

            {/* Faceted Amethyst Gem Radial Gradient */}
            <radialGradient id={`masterGem_${effectiveTier}`} cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="30%" stopColor={tierConfig.gemColor} stopOpacity="0.9" />
              <stop offset="75%" stopColor={tierConfig.gemCore} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#140226" stopOpacity="1" />
            </radialGradient>

            {/* Beveled Golden Border Linear Gradient */}
            <linearGradient id="bevelGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF6D6" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#8A5A00" />
              <stop offset="100%" stopColor="#FFE082" />
            </linearGradient>

            {/* Deep Velvet Radial Background */}
            <radialGradient id="velvetBg" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#2A0B4A" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#16042A" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#0A0214" stopOpacity="1" />
              <stop offset="100%" stopColor="#040008" stopOpacity="1" />
            </radialGradient>

            {/* Glow Aura Filter */}
            <filter id={`masterGlow_${effectiveTier}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Avatar Clip Circle */}
            <clipPath id="avatarMasterClip">
              <circle cx="250" cy="270" r="88" />
            </clipPath>
          </defs>

          {/* 1. VELVET CANVAS BACKGROUND */}
          <rect x="0" y="0" width="1000" height="562" fill="url(#velvetBg)" />

          {/* Cosmic Nebula Particles & Star Sparkles */}
          <g opacity="0.6">
            <circle cx="200" cy="120" r="1.5" fill="#FFFFFF" />
            <circle cx="380" cy="90" r="1" fill="#FFFFFF" />
            <circle cx="650" cy="110" r="1.2" fill="#FFFFFF" />
            <circle cx="820" cy="130" r="1.8" fill="#FFFFFF" />
            <circle cx="150" cy="420" r="1.2" fill="#FFFFFF" />
            <circle cx="850" cy="450" r="1.5" fill="#FFFFFF" />
            <circle cx="500" cy="380" r="2" fill={tierConfig.gemColor} filter={`url(#masterGlow_${effectiveTier})`} />
          </g>

          {/* 2. OUTER HEAVY GILDED BEVELED FRAME BORDER */}
          <rect
            x="24"
            y="24"
            width="952"
            height="514"
            rx="28"
            fill="none"
            stroke="url(#bevelGold)"
            strokeWidth="5"
            filter={`url(#masterGlow_${effectiveTier})`}
          />
          <rect
            x="32"
            y="32"
            width="936"
            height="498"
            rx="22"
            fill="none"
            stroke={tierConfig.gemColor}
            strokeWidth="1.2"
            opacity="0.6"
          />

          {/* 3. FOUR CORNER SWEEPING GOLD & VIOLET RIBBON FLOURISHES */}
          {/* Top-Left Corner Ribbon */}
          <path
            d="M 24 120 C 30 60, 60 30, 120 24 C 95 45, 65 75, 50 115 Z"
            fill={`url(#masterWing_${effectiveTier})`}
            stroke={`url(#masterGold_${effectiveTier})`}
            strokeWidth="1.5"
          />
          {/* Top-Right Corner Ribbon */}
          <path
            d="M 976 120 C 970 60, 940 30, 880 24 C 905 45, 935 75, 950 115 Z"
            fill={`url(#masterWing_${effectiveTier})`}
            stroke={`url(#masterGold_${effectiveTier})`}
            strokeWidth="1.5"
          />
          {/* Bottom-Left Corner Ribbon */}
          <path
            d="M 24 442 C 30 502, 60 532, 120 538 C 95 517, 65 487, 50 447 Z"
            fill={`url(#masterWing_${effectiveTier})`}
            stroke={`url(#masterGold_${effectiveTier})`}
            strokeWidth="1.5"
          />
          {/* Bottom-Right Corner Ribbon */}
          <path
            d="M 976 442 C 970 502, 940 532, 880 538 C 905 517, 935 487, 950 447 Z"
            fill={`url(#masterWing_${effectiveTier})`}
            stroke={`url(#masterGold_${effectiveTier})`}
            strokeWidth="1.5"
          />

          {/* 4. LEFT SCULPTED GOLDEN LION GUARDIAN (Inward Facing) */}
          <g id="leftLionGuardian" transform="translate(62, 230)">
            {/* Ambient Eye Glow */}
            <circle cx="10" cy="0" r="18" fill={tierConfig.gemGlow} opacity="0.3" filter={`url(#masterGlow_${effectiveTier})`} />
            {/* Flowing Mane & Ribbons descending along border */}
            <path
              d="M -15 -45 C 5 -35, 25 -10, 20 20 C 15 50, -5 85, -18 120 C -12 75, -5 45, -15 -45 Z"
              fill={`url(#masterWing_${effectiveTier})`}
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="1.2"
            />
            {/* Sculpted 3D Lion Head Profile facing right */}
            <path
              d="M -20 -35 C 0 -40, 25 -25, 32 -5 C 38 12, 30 35, 12 42 C -5 48, -25 35, -28 15 Z"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="1"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Lion Mane Curls */}
            <path d="M 0 -30 C 15 -25, 25 -10, 18 5" fill="none" stroke="#78350F" strokeWidth="1.5" />
            <path d="M -5 -15 C 10 -10, 20 5, 12 20" fill="none" stroke="#78350F" strokeWidth="1.5" />
            <path d="M -10 5 C 5 12, 12 25, 5 35" fill="none" stroke="#78350F" strokeWidth="1.5" />
            {/* Glowing Amethyst Eye */}
            <ellipse cx="14" cy="-2" rx="4" ry="2.2" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.8" />
            <circle cx="14" cy="-2" r="1" fill="#FFFFFF" />
          </g>

          {/* 5. RIGHT SCULPTED GOLDEN LION GUARDIAN (Inward Facing - Symmetrical) */}
          <g id="rightLionGuardian" transform="translate(938, 230) scale(-1, 1)">
            {/* Ambient Eye Glow */}
            <circle cx="10" cy="0" r="18" fill={tierConfig.gemGlow} opacity="0.3" filter={`url(#masterGlow_${effectiveTier})`} />
            {/* Flowing Mane & Ribbons descending along border */}
            <path
              d="M -15 -45 C 5 -35, 25 -10, 20 20 C 15 50, -5 85, -18 120 C -12 75, -5 45, -15 -45 Z"
              fill={`url(#masterWing_${effectiveTier})`}
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="1.2"
            />
            {/* Sculpted 3D Lion Head Profile facing left (via scaleX -1) */}
            <path
              d="M -20 -35 C 0 -40, 25 -25, 32 -5 C 38 12, 30 35, 12 42 C -5 48, -25 35, -28 15 Z"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="1"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Lion Mane Curls */}
            <path d="M 0 -30 C 15 -25, 25 -10, 18 5" fill="none" stroke="#78350F" strokeWidth="1.5" />
            <path d="M -5 -15 C 10 -10, 20 5, 12 20" fill="none" stroke="#78350F" strokeWidth="1.5" />
            <path d="M -10 5 C 5 12, 12 25, 5 35" fill="none" stroke="#78350F" strokeWidth="1.5" />
            {/* Glowing Amethyst Eye */}
            <ellipse cx="14" cy="-2" rx="4" ry="2.2" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.8" />
            <circle cx="14" cy="-2" r="1" fill="#FFFFFF" />
          </g>

          {/* 6. TOP IMPERIAL ARCH: SCULPTED GOLDEN LION WITH AMETHYST CRYSTAL WINGS */}
          <g id="topImperialLionArch">
            {/* Left Outstretched Wings (Gold & Amethyst Layered Feathers) */}
            <g id="leftWingsMaster">
              {/* Primary Top Flight Feather */}
              <path
                d="M 470 65 C 390 15, 260 -10, 150 18 C 210 38, 290 60, 390 85 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="2"
                filter={`url(#masterGlow_${effectiveTier})`}
              />
              {/* Mid Layer Feathers */}
              <path
                d="M 450 80 C 370 35, 240 20, 130 50 C 200 68, 280 88, 380 102 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="1.8"
              />
              <path
                d="M 430 95 C 350 55, 230 50, 120 85 C 190 98, 270 112, 365 118 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="1.6"
              />
              {/* Lower Golden Wing Base */}
              <path
                d="M 410 108 C 330 80, 220 90, 115 125 C 185 128, 260 128, 350 125 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFE082"
                strokeWidth="1.2"
              />
            </g>

            {/* Right Outstretched Wings (Mirrored Plumage) */}
            <g id="rightWingsMaster">
              {/* Primary Top Flight Feather */}
              <path
                d="M 530 65 C 610 15, 740 -10, 850 18 C 790 38, 710 60, 610 85 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="2"
                filter={`url(#masterGlow_${effectiveTier})`}
              />
              {/* Mid Layer Feathers */}
              <path
                d="M 550 80 C 630 35, 760 20, 870 50 C 800 68, 720 88, 620 102 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="1.8"
              />
              <path
                d="M 570 95 C 650 55, 770 50, 880 85 C 810 98, 730 112, 635 118 Z"
                fill={`url(#masterWing_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="1.6"
              />
              {/* Lower Golden Wing Base */}
              <path
                d="M 590 108 C 670 80, 780 90, 885 125 C 815 128, 740 128, 650 125 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFE082"
                strokeWidth="1.2"
              />
            </g>

            {/* Center Golden Lion Head & Imperial Crown */}
            <g id="centerLionHeadGroup" transform="translate(500, 75)">
              {/* Ambient Radiant Glow behind Lion */}
              <circle cx="0" cy="0" r="60" fill={tierConfig.gemGlow} opacity="0.4" filter={`url(#masterGlow_${effectiveTier})`} />

              {/* Lion's Mane Golden Flourishes */}
              <path
                d="M -45 -20 C -60 -5, -45 35, -25 55 C 0 70, 25 55, 45 35 C 60 -5, 45 -20, 30 -35 C 10 -45, -10 -45, -30 -35 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFFFFF"
                strokeWidth="1.6"
                filter={`url(#masterGlow_${effectiveTier})`}
              />

              {/* Sculpted Lion Face */}
              <polygon points="-16,-18 -26,-28 -10,-24" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
              <polygon points="16,-18 26,-28 10,-24" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />

              {/* Forehead & Muzzle */}
              <path d="M -22 -14 C 0 -22, 22 -14, 18 10 C 14 26, -14 26, -18 10 Z" fill="#92400E" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1" />
              
              {/* Lion Eyes (Glowing Amethyst Jewels) */}
              <ellipse cx="-11" cy="-4" rx="4.5" ry="2.8" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.9" />
              <ellipse cx="11" cy="-4" rx="4.5" ry="2.8" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.9" />
              <circle cx="-11" cy="-4" r="1.3" fill="#FFF" />
              <circle cx="11" cy="-4" r="1.3" fill="#FFF" />

              {/* Lion Nose & Whiskers */}
              <polygon points="-5,8 5,8 0,15" fill="#451A03" />
              <path d="M -8 16 C -3 21, 3 21, 8 16" fill="none" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.8" strokeLinecap="round" />

              {/* Top Golden Imperial Crown on Lion's Head */}
              <g id="crownOnLion" transform="translate(0, -42)">
                <rect x="-24" y="0" width="48" height="7" rx="3.5" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
                {/* 5 Spires */}
                <path
                  d="M -24 0 L -22 -18 L -10 -9 L 0 -26 L 10 -9 L 22 -18 L 24 0 Z"
                  fill={`url(#masterGold_${effectiveTier})`}
                  stroke="#FFF"
                  strokeWidth="1.2"
                  filter={`url(#masterGlow_${effectiveTier})`}
                />
                {/* Crown Purple Jewels on Spires */}
                <circle cx="0" cy="-26" r="3.5" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="1" />
                <circle cx="-22" cy="-18" r="2.5" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.8" />
                <circle cx="22" cy="-18" r="2.5" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.8" />
                <circle cx="0" cy="-26" r="1.2" fill="#FFF" />
              </g>

              {/* Faceted Teardrop Amethyst Crystal suspended below Chin */}
              <g id="chinTeardropGem" transform="translate(0, 52)">
                <circle cx="0" cy="0" r="3" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
                <path
                  d="M 0 2 C -10 12, -8 24, 0 32 C 8 24, 10 12, 0 2 Z"
                  fill={`url(#masterGem_${effectiveTier})`}
                  stroke={`url(#masterGold_${effectiveTier})`}
                  strokeWidth="1.4"
                  filter={`url(#masterGlow_${effectiveTier})`}
                />
                {/* Facet Light Reflections */}
                <polygon points="0,5 -4,20 0,28 4,20" fill="#FFF" opacity="0.6" />
                <circle cx="-2" cy="16" r="1.6" fill="#FFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
              </g>
            </g>
          </g>

          {/* 7. INNER LEFT: CIRCULAR AVATAR IN GOLDEN LAUREL WREATH FRAME */}
          <g id="avatarFrameWreathGroup">
            {/* Glowing Aura */}
            <circle cx="250" cy="270" r="105" fill={tierConfig.gemGlow} opacity="0.25" filter={`url(#masterGlow_${effectiveTier})`} />

            {/* Double Gold Ring Border with Purple Inlay */}
            <circle
              cx="250"
              cy="270"
              r="94"
              fill="#100320"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="6"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            <circle
              cx="250"
              cy="270"
              r="89"
              fill="none"
              stroke={tierConfig.gemColor}
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />

            {/* Clipped User Avatar Image */}
            <g clipPath="url(#avatarMasterClip)">
              <image
                href={user.avatar}
                x="162"
                y="182"
                width="176"
                height="176"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>

            {/* Sculpted Golden Laurel Wreath Branches Embracing Avatar */}
            {/* Left Branch */}
            <path
              d="M 250 360 C 190 360, 155 315, 160 250 C 162 220, 180 190, 210 175"
              fill="none"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Left Leaves */}
            <path d="M 230 355 C 215 362, 205 350, 216 338 C 228 330, 235 342, 230 355 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 205 340 C 185 342, 178 325, 192 314 C 205 306, 212 322, 205 340 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 182 315 C 160 312, 158 292, 175 284 C 190 278, 196 295, 182 315 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 168 285 C 148 276, 150 255, 168 250 C 182 248, 184 268, 168 285 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 168 250 C 150 236, 156 216, 175 216 C 188 218, 186 238, 168 250 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 180 218 C 165 200, 178 182, 195 186 C 206 190, 200 208, 180 218 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />

            {/* Right Branch (Mirrored) */}
            <path
              d="M 250 360 C 310 360, 345 315, 340 250 C 338 220, 320 190, 290 175"
              fill="none"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Right Leaves */}
            <path d="M 270 355 C 285 362, 295 350, 284 338 C 272 330, 265 342, 270 355 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 295 340 C 315 342, 322 325, 308 314 C 295 306, 288 322, 295 340 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 318 315 C 340 312, 342 292, 325 284 C 310 278, 304 295, 318 315 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 332 285 C 352 276, 350 255, 332 250 C 318 248, 316 268, 332 285 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 332 250 C 350 236, 344 216, 325 216 C 312 218, 314 238, 332 250 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />
            <path d="M 320 218 C 335 200, 322 182, 305 186 C 294 190, 300 208, 320 218 Z" fill={`url(#masterWing_${effectiveTier})`} stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.2" />

            {/* Top Royal Crown on Avatar Wreath */}
            <g id="avatarTopCrown" transform="translate(250, 168)">
              <path
                d="M -24 0 L -22 -16 L -11 -7 L 0 -22 L 11 -7 L 22 -16 L 24 0 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFF"
                strokeWidth="1"
                filter={`url(#masterGlow_${effectiveTier})`}
              />
              <circle cx="0" cy="-22" r="3" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.8" />
              <circle cx="-22" cy="-16" r="2.2" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.6" />
              <circle cx="22" cy="-16" r="2.2" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.6" />
              <circle cx="0" cy="-22" r="1.2" fill="#FFF" />
            </g>

            {/* Bottom Faceted Royal Amethyst Diamond Gemstone */}
            <g id="avatarBottomGem" transform="translate(250, 362)">
              {/* Outer Golden Bezel Setting */}
              <polygon
                points="0,-16 20,0 0,22 -20,0"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFF"
                strokeWidth="1.5"
                filter={`url(#masterGlow_${effectiveTier})`}
              />
              {/* Faceted Core */}
              <polygon
                points="0,-13 16,0 0,18 -16,0"
                fill={`url(#masterGem_${effectiveTier})`}
                stroke={tierConfig.secondaryGold}
                strokeWidth="1"
              />
              {/* Sparkle Facet Highlights */}
              <polygon points="0,-13 9,0 0,4 -9,0" fill="#FFF" opacity="0.75" />
              <circle cx="-2" cy="-3" r="2" fill="#FFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            </g>
          </g>

          {/* 8. INNER RIGHT - TOP ROW: POINTED CHEVRON NAME PLAQUE BAR */}
          <g id="pointedNamePlaque">
            {/* The Arrow Plaque Body (Pointed Right Chevron) */}
            <path
              d="M 370 200 L 710 200 L 736 226 L 710 252 L 370 252 Z"
              fill="#0F041C"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2.5"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Inset Gold Filigree line */}
            <path
              d="M 376 206 L 706 206 L 728 226 L 706 246 L 376 246 Z"
              fill="none"
              stroke={tierConfig.gemColor}
              strokeWidth="1"
              opacity="0.7"
            />
            {/* Nickname and Username Text rendered cleanly */}
            <text
              x="390"
              y="233"
              fill={`url(#masterGold_${effectiveTier})`}
              fontSize="22"
              fontWeight="900"
              fontFamily="Arial, sans-serif"
            >
              {user.nickname}
            </text>
            <text
              x="620"
              y="232"
              fill="#D4AF37"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
              opacity="0.9"
            >
              @{user.username}
            </text>
          </g>

          {/* 9. INNER RIGHT - MIDDLE ROW: BEVELED GOLDEN VIP CARTUCHE PLAQUE */}
          <g id="beveledVipPlaque" transform="translate(540, 290)">
            {/* Stepped Cut-Corner Octagonal Outer Beveled Gold Plaque */}
            <polygon
              points="-130,-28 -110,-32 110,-32 130,-28 145,-12 145,12 130,28 110,32 -110,32 -130,28 -145,12 -145,-12"
              fill="#18052E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="4"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Inner Gold Inset Rim */}
            <polygon
              points="-125,-24 -108,-27 108,-27 125,-24 138,-10 138,10 125,24 108,27 -108,27 -125,24 -138,10 -138,-10"
              fill="#240742"
              stroke="#FFE082"
              strokeWidth="1.2"
            />

            {/* Small Crown Icon on Left */}
            <g id="plaqueCrown" transform="translate(-85, -2)">
              <path
                d="M -14 7 L -12 -5 L -5 0 L 0 -11 L 5 0 L 12 -5 L 14 7 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFF"
                strokeWidth="0.8"
              />
              <circle cx="0" cy="-11" r="1.8" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.5" />
            </g>

            {/* Bold Roman Gilded Lettering: VIP 5 */}
            <text
              x="15"
              y="10"
              textAnchor="middle"
              fill={`url(#masterGold_${effectiveTier})`}
              fontSize="34"
              fontWeight="900"
              fontFamily="Georgia, serif"
              letterSpacing="2.5"
              filter={`url(#masterGlow_${effectiveTier})`}
            >
              {tierConfig.label}
            </text>

            {/* Corner Sparkle Glints */}
            <polygon points="-110,-32 -106,-28 -110,-24 -114,-28" fill="#FFF" className="animate-ping" style={{ animationDuration: '3s' }} />
            <polygon points="110,32 114,28 110,24 106,28" fill="#FFF" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
          </g>

          {/* 10. TOP RIGHT: ROYAL VELVET HANGING HERALDIC BANNER (Swallowtail Cut with Crystal) */}
          <g id="royalHangingBanner" transform="translate(790, 160)">
            {/* Top Brass Hanging Rod with Round Finials */}
            <rect x="-48" y="0" width="96" height="6" rx="3" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
            <circle cx="-48" cy="3" r="5" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
            <circle cx="48" cy="3" r="5" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />

            {/* Hanging Cord Loops */}
            <path d="M -30 0 L -30 -10 M 30 0 L 30 -10" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="1.5" />

            {/* Velvet Purple Banner Body with Gold Border */}
            <path
              d="M -40 6 L 40 6 L 40 120 L 0 95 L -40 120 Z"
              fill="#24063E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2.5"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Inner Gold Fringe Inset */}
            <path
              d="M -34 12 L 34 12 L 34 110 L 0 88 L -34 110 Z"
              fill="none"
              stroke={tierConfig.gemColor}
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Royal Crown on Banner */}
            <g transform="translate(0, 32)">
              <path
                d="M -18 7 L -16 -8 L -7 -2 L 0 -15 L 7 -2 L 16 -8 L 18 7 Z"
                fill={`url(#masterGold_${effectiveTier})`}
                stroke="#FFF"
                strokeWidth="0.8"
              />
              <circle cx="0" cy="-15" r="2.5" fill={tierConfig.gemColor} stroke="#FFF" strokeWidth="0.6" />
            </g>

            {/* Bold Text: VIP 5 */}
            <text
              x="0"
              y="68"
              textAnchor="middle"
              fill={`url(#masterGold_${effectiveTier})`}
              fontSize="18"
              fontWeight="900"
              fontFamily="Georgia, serif"
              letterSpacing="1.2"
            >
              {tierConfig.label}
            </text>

            {/* Filigree Divider underneath text */}
            <path
              d="M -22 76 C -10 73, 10 73, 22 76"
              fill="none"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="1.2"
            />

            {/* Hanging Amethyst Jewel at the Swallowtail Tip */}
            <g transform="translate(0, 102)">
              <circle cx="0" cy="0" r="2.5" fill={`url(#masterGold_${effectiveTier})`} />
              <polygon
                points="0,3 7,12 0,22 -7,12"
                fill={`url(#masterGem_${effectiveTier})`}
                stroke={`url(#masterGold_${effectiveTier})`}
                strokeWidth="1"
                filter={`url(#masterGlow_${effectiveTier})`}
              />
              <polygon points="0,5 4,12 0,16 -4,12" fill="#FFF" opacity="0.7" />
            </g>
          </g>

          {/* 11. HORIZONTAL GOLDEN DIVIDER LINE WITH CENTRAL DIAMOND FLARE */}
          <g id="horizontalDividerLine" transform="translate(500, 375)">
            {/* Luminous Gold Line with Tapered Ends */}
            <line x1="-390" y1="0" x2="390" y2="0" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="2.2" />
            <line x1="-250" y1="0" x2="250" y2="0" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

            {/* Central Diamond Flare */}
            <polygon points="0,-7 7,0 0,7 -7,0" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2s' }} />
          </g>

          {/* 12. LOWER ROW: THE 4 HERALDIC STATUS BADGES */}
          {/* Badge 1: PREMIUM (Crown) */}
          <g id="badgePremium" transform="translate(365, 435)">
            {/* Gold Hexagon */}
            <polygon
              points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12"
              fill="#1A072E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Crown Icon */}
            <g transform="translate(0, -2)">
              <path d="M -11 6 L -9 -6 L -4 -1 L 0 -10 L 4 -1 L 9 -6 L 11 6 Z" fill={`url(#masterGold_${effectiveTier})`} stroke="#FFF" strokeWidth="0.6" />
              <circle cx="0" cy="-10" r="1.5" fill={tierConfig.gemColor} />
            </g>
            {/* Uppercase Gold Roman Label */}
            <text x="0" y="44" textAnchor="middle" fill={`url(#masterGold_${effectiveTier})`} fontSize="13" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1.2">
              PREMIUM
            </text>
          </g>

          {/* Vertical Fine Divider between Badge 1 & 2 */}
          <line x1="435" y1="415" x2="435" y2="475" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="0.8" opacity="0.4" />

          {/* Badge 2: EXCLUSIVE (Star) */}
          <g id="badgeExclusive" transform="translate(490, 435)">
            {/* Gold Hexagon */}
            <polygon
              points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12"
              fill="#1A072E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* 5-Point Star Icon */}
            <polygon
              points="0,-12 3.5,-3 12,-3 5,2.5 7.5,11 0,6 -7.5,11 -5,2.5 -12,-3 -3.5,-3"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="0.6"
            />
            {/* Uppercase Gold Roman Label */}
            <text x="0" y="44" textAnchor="middle" fill={`url(#masterGold_${effectiveTier})`} fontSize="13" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1.2">
              EXCLUSIVE
            </text>
          </g>

          {/* Vertical Fine Divider between Badge 2 & 3 */}
          <line x1="560" y1="415" x2="560" y2="475" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="0.8" opacity="0.4" />

          {/* Badge 3: ELITE (Faceted Diamond/Gem) */}
          <g id="badgeElite" transform="translate(615, 435)">
            {/* Gold Hexagon */}
            <polygon
              points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12"
              fill="#1A072E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Faceted Gem Icon */}
            <polygon
              points="-9,-6 0,-12 9,-6 11,0 0,11 -11,0"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="0.6"
            />
            <polygon points="-5,-4 0,-8 5,-4 0,7" fill={tierConfig.gemColor} />
            {/* Uppercase Gold Roman Label */}
            <text x="0" y="44" textAnchor="middle" fill={`url(#masterGold_${effectiveTier})`} fontSize="13" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1.2">
              ELITE
            </text>
          </g>

          {/* Vertical Fine Divider between Badge 3 & 4 */}
          <line x1="685" y1="415" x2="685" y2="475" stroke={`url(#masterGold_${effectiveTier})`} strokeWidth="0.8" opacity="0.4" />

          {/* Badge 4: TRUSTED (Shield) */}
          <g id="badgeTrusted" transform="translate(740, 435)">
            {/* Gold Hexagon */}
            <polygon
              points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12"
              fill="#1A072E"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="2"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Shield Icon */}
            <path
              d="M 0 -11 L 8 -7 C 8 4, 4 9, 0 12 C -4 9, -8 4, -8 -7 Z"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="0.6"
            />
            {/* Uppercase Gold Roman Label */}
            <text x="0" y="44" textAnchor="middle" fill={`url(#masterGold_${effectiveTier})`} fontSize="13" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1.2">
              TRUSTED
            </text>
          </g>

          {/* 13. BOTTOM BAROQUE GOLDEN CREST WITH FACETED AMETHYST DIAMOND */}
          <g id="bottomBaroqueCrest" transform="translate(500, 508)">
            {/* Sweeping Golden Ribbon Scrollwork Left & Right */}
            <path
              d="M -180 5 C -120 -12, -60 14, -20 -2"
              fill="none"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 180 5 C 120 -12, 60 14, 20 -2"
              fill="none"
              stroke={`url(#masterGold_${effectiveTier})`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Central Ornate Gold Bezel Prong Setting */}
            <polygon
              points="0,-18 18,0 0,18 -18,0"
              fill={`url(#masterGold_${effectiveTier})`}
              stroke="#FFF"
              strokeWidth="1.2"
              filter={`url(#masterGlow_${effectiveTier})`}
            />
            {/* Glowing Faceted Amethyst Diamond */}
            <polygon
              points="0,-15 15,0 0,15 -15,0"
              fill={`url(#masterGem_${effectiveTier})`}
              stroke={tierConfig.secondaryGold}
              strokeWidth="0.8"
            />
            {/* Sparkle Glint */}
            <polygon points="0,-15 8,0 0,4 -8,0" fill="#FFF" opacity="0.8" />
            <circle cx="-2" cy="-2" r="1.8" fill="#FFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          </g>
        </svg>

        {/* Optional Interactive Click for Avatar */}
        {onAvatarClick && (
          <button
            type="button"
            onClick={onAvatarClick}
            className="absolute left-[16%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[24%] aspect-square rounded-full cursor-pointer z-30 opacity-0 hover:opacity-100 focus:opacity-100 bg-black/40 backdrop-blur-xs flex items-center justify-center text-amber-300 text-xs font-bold transition-opacity border-2 border-amber-400"
            title="تغيير الصورة الشخصية"
          >
            تغيير الصورة
          </button>
        )}
      </div>

      {/* Optional Interactive VIP Tier Switcher below the card */}
      {showTierSwitcher && onSelectTier && (
        <div className="mt-3 p-3 rounded-2xl bg-[#120822] border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>اختر الرتبة لمعاينة شكل الإطار والبطاقة الملكية:</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              الرتبة الحالية: {tierConfig.label}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'bronze', label: 'صقر البرونز', rank: 'VIP 1', color: 'from-amber-900 to-amber-700' },
              { id: 'silver', label: 'ذئب الفضة', rank: 'VIP 2', color: 'from-slate-800 to-sky-950' },
              { id: 'gold', label: 'نسر الذهب', rank: 'VIP 3', color: 'from-yellow-950 to-amber-800' },
              { id: 'royal', label: 'أسد رويال', rank: 'VIP 4', color: 'from-purple-950 to-indigo-950' },
              { id: 'mythic', label: 'سلطاني أسطوري', rank: 'VIP 5', color: 'from-purple-900 to-amber-900' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTier(t.id as VIPTier)}
                className={`py-1.5 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                  effectiveTier === t.id
                    ? `bg-gradient-to-b ${t.color} border-yellow-400 shadow-md ring-2 ring-yellow-400 scale-105`
                    : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span className="text-[11px] font-black text-white">{t.rank}</span>
                <span className="text-[9px] text-zinc-300 truncate w-full mt-0.5">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
