import React from 'react';
import { VIPTier, UserProfile } from '../../types';
import { VIPName } from './VIPName';
import { AvatarWithFrame } from './AvatarWithFrame';
import { getMythicFrameById, DEFAULT_MYTHIC_FRAME_ID } from '../../data/mythicFrames';

interface VIPMessageBubbleProps {
  sender: UserProfile;
  content: string;
  timestamp: string;
  isMe?: boolean;
  onUserClick?: (user: UserProfile) => void;
  additionalRoleBadge?: React.ReactNode;
  variant?: 'room' | 'direct';
}

/**
 * Winged Lion Crest SVG tailored specifically for each VIP stage and chosen mythic frame
 */
export const WingedLionCrest: React.FC<{
  tier: VIPTier;
  size?: number;
  className?: string;
  frameId?: string;
}> = ({
  tier,
  size = 30,
  className = '',
  frameId,
}) => {
  if (tier === 'none') return null;

  const uniqueId = React.useId().replace(/:/g, '_');

  let tierColors = {
    goldLight: '#FFFBEB',
    goldMid: '#FBBF24',
    goldDark: '#78350F',
    wingPurple: '#2E0854',
    wingPurpleLight: '#C084FC',
    gem: '#F43F5E',
    label: 'VIP 5',
  };

  if (tier === 'mythic') {
    const mythicOpt = getMythicFrameById(frameId || DEFAULT_MYTHIC_FRAME_ID);
    if (mythicOpt.id === 'mythic_golden_falcon') {
      tierColors = {
        goldLight: '#FFFBEB',
        goldMid: '#F59E0B',
        goldDark: '#78350F',
        wingPurple: '#2E1906',
        wingPurpleLight: '#FBBF24',
        gem: '#FEF08A',
        label: 'VIP 5',
      };
    } else if (mythicOpt.id === 'mythic_fire_dragon') {
      tierColors = {
        goldLight: '#FFF1F2',
        goldMid: '#EF4444',
        goldDark: '#7F1D1D',
        wingPurple: '#2C0606',
        wingPurpleLight: '#F59E0B',
        gem: '#FCD34D',
        label: 'VIP 5',
      };
    } else if (mythicOpt.id === 'mythic_cosmic_nebula') {
      tierColors = {
        goldLight: '#F0FDFA',
        goldMid: '#06B6D4',
        goldDark: '#164E63',
        wingPurple: '#170D38',
        wingPurpleLight: '#A855F7',
        gem: '#38BDF8',
        label: 'VIP 5',
      };
    } else if (mythicOpt.id === 'mythic_ruby_ottoman') {
      tierColors = {
        goldLight: '#FFF1F2',
        goldMid: '#E11D48',
        goldDark: '#881337',
        wingPurple: '#29050C',
        wingPurpleLight: '#F59E0B',
        gem: '#FCD34D',
        label: 'VIP 5',
      };
    } else if (mythicOpt.id === 'mythic_cyber_glory') {
      tierColors = {
        goldLight: '#ECFDF5',
        goldMid: '#10B981',
        goldDark: '#064E3B',
        wingPurple: '#042217',
        wingPurpleLight: '#34D399',
        gem: '#F59E0B',
        label: 'VIP 5',
      };
    } else {
      // mythic_sovereign_wings
      tierColors = {
        goldLight: '#FFFBEB',
        goldMid: '#FBBF24',
        goldDark: '#78350F',
        wingPurple: '#2E0854',
        wingPurpleLight: '#C084FC',
        gem: '#F43F5E',
        label: 'VIP 5',
      };
    }
  } else if (tier === 'royal') {
    tierColors = {
      goldLight: '#FEF9C3',
      goldMid: '#F59E0B',
      goldDark: '#581C87',
      wingPurple: '#3B0764',
      wingPurpleLight: '#C084FC',
      gem: '#9333EA',
      label: 'VIP 4',
    };
  } else if (tier === 'gold') {
    tierColors = {
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDark: '#713F12',
      wingPurple: '#422006',
      wingPurpleLight: '#F59E0B',
      gem: '#DC2626',
      label: 'VIP 3',
    };
  } else if (tier === 'silver') {
    tierColors = {
      goldLight: '#FFFFFF',
      goldMid: '#94A3B8',
      goldDark: '#334155',
      wingPurple: '#1E293B',
      wingPurpleLight: '#38BDF8',
      gem: '#06B6D4',
      label: 'VIP 2',
    };
  } else if (tier === 'bronze') {
    tierColors = {
      goldLight: '#FED7AA',
      goldMid: '#D97706',
      goldDark: '#78350F',
      wingPurple: '#3E1C0A',
      wingPurpleLight: '#EA580C',
      gem: '#F97316',
      label: 'VIP 1',
    };
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={`lionGold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor={tierColors.goldLight} />
            <stop offset="60%" stopColor={tierColors.goldMid} />
            <stop offset="100%" stopColor={tierColors.goldDark} />
          </linearGradient>

          <linearGradient id={`wingViolet_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tierColors.wingPurpleLight} />
            <stop offset="50%" stopColor={tierColors.wingPurple} />
            <stop offset="100%" stopColor="#0B0118" />
          </linearGradient>

          <filter id={`crestGlow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Aura Ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#lionGold_${uniqueId})`} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill={tierColors.wingPurple} fillOpacity="0.85" />

        {/* 1. Spreading Plumage Wings (Left & Right) */}
        {/* Left Wings */}
        <path
          d="M 40 45 C 24 35, 10 25, 4 14 C 14 22, 26 32, 36 42 Z"
          fill={`url(#wingViolet_${uniqueId})`}
          stroke={`url(#lionGold_${uniqueId})`}
          strokeWidth="1"
        />
        <path
          d="M 38 52 C 20 46, 8 40, 2 30 C 14 36, 26 44, 35 50 Z"
          fill={`url(#lionGold_${uniqueId})`}
        />
        <path
          d="M 38 60 C 22 60, 10 54, 6 46 C 16 50, 28 54, 36 58 Z"
          fill={`url(#wingViolet_${uniqueId})`}
          stroke={`url(#lionGold_${uniqueId})`}
          strokeWidth="0.8"
        />

        {/* Right Wings (Mirrored) */}
        <path
          d="M 60 45 C 76 35, 90 25, 96 14 C 86 22, 74 32, 64 42 Z"
          fill={`url(#wingViolet_${uniqueId})`}
          stroke={`url(#lionGold_${uniqueId})`}
          strokeWidth="1"
        />
        <path
          d="M 62 52 C 80 46, 92 40, 98 30 C 86 36, 74 44, 65 50 Z"
          fill={`url(#lionGold_${uniqueId})`}
        />
        <path
          d="M 62 60 C 78 60, 90 54, 94 46 C 84 50, 72 54, 64 58 Z"
          fill={`url(#wingViolet_${uniqueId})`}
          stroke={`url(#lionGold_${uniqueId})`}
          strokeWidth="0.8"
        />

        {/* 2. Imperial Royal Crown on Head with Cross */}
        <g id="crown_crest" transform="translate(0, 4)">
          <path
            d="M 41 26 L 37 14 L 44 19 L 50 8 L 56 19 L 63 14 L 59 26 Z"
            fill={`url(#lionGold_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
            filter={`url(#crestGlow_${uniqueId})`}
          />
          {/* Imperial Cross at Apex */}
          <path d="M 50 4 L 50 9 M 48 6 L 52 6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          {/* Crown Jewels */}
          <circle cx="50" cy="17" r="2.2" fill={tierColors.gem} stroke="#FFFFFF" strokeWidth="0.6" />
          <circle cx="37" cy="14" r="1.4" fill="#FFFFFF" />
          <circle cx="63" cy="14" r="1.4" fill="#FFFFFF" />
          <circle cx="44" cy="19" r="1.2" fill={tierColors.goldLight} />
          <circle cx="56" cy="19" r="1.2" fill={tierColors.goldLight} />
        </g>

        {/* 3. Sculpted Royal Golden Lion Head */}
        <g id="lion_face" transform="translate(0, 4)">
          {/* Fluffy Royal Golden Mane Behind Head */}
          <path
            d="M 33 42 C 30 36, 36 32, 40 32 C 40 30, 46 28, 50 28 C 54 28, 60 30, 60 32 C 64 32, 70 36, 67 42 C 72 46, 73 54, 68 60 C 70 66, 64 74, 57 76 C 54 80, 46 80, 43 76 C 36 74, 30 66, 32 60 C 27 54, 28 46, 33 42 Z"
            fill={`url(#lionGold_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />

          {/* Inner Mane Shadow */}
          <path
            d="M 36 44 C 36 38, 44 34, 50 34 C 56 34, 64 38, 64 44 C 67 52, 64 62, 58 66 C 54 70, 46 70, 42 66 C 36 62, 33 52, 36 44 Z"
            fill={tierColors.wingPurple}
            stroke={`url(#lionGold_${uniqueId})`}
            strokeWidth="0.7"
          />

          {/* Lion Ears */}
          <circle cx="36" cy="34" r="3.5" fill={`url(#lionGold_${uniqueId})`} />
          <circle cx="36" cy="34" r="1.8" fill={tierColors.goldDark} />
          <circle cx="64" cy="34" r="3.5" fill={`url(#lionGold_${uniqueId})`} />
          <circle cx="64" cy="34" r="1.8" fill={tierColors.goldDark} />

          {/* Lion Brow & Forehead */}
          <path
            d="M 40 40 C 44 38, 56 38, 60 40 L 58 48 C 54 46, 46 46, 42 48 Z"
            fill={`url(#lionGold_${uniqueId})`}
          />

          {/* Glowing Eyes */}
          <ellipse cx="43" cy="46" rx="2.5" ry="1.6" fill="#FFFFFF" />
          <circle cx="43" cy="46" r="1.2" fill={tierColors.gem} />
          <ellipse cx="57" cy="46" rx="2.5" ry="1.6" fill="#FFFFFF" />
          <circle cx="57" cy="46" r="1.2" fill={tierColors.gem} />

          {/* Golden Muzzle & Whisker Pads */}
          <path
            d="M 46 51 C 44 51, 42 55, 45 58 C 48 60, 50 56, 50 53 C 50 56, 52 60, 55 58 C 58 55, 56 51, 54 51 Z"
            fill={`url(#lionGold_${uniqueId})`}
            stroke={tierColors.goldDark}
            strokeWidth="0.5"
          />

          {/* Nose */}
          <polygon points="50,50 47,46 53,46" fill="#000000" stroke={`url(#lionGold_${uniqueId})`} strokeWidth="0.4" />

          {/* Royal Roaring Chin & Beard */}
          <path
            d="M 45 59 C 48 64, 52 64, 55 59 L 52 67 C 51 68, 49 68, 48 67 Z"
            fill={`url(#lionGold_${uniqueId})`}
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * High-End VIP Message Bubble:
 * Directly reproduces the luxury gold-outlined capsule and rounded luxury bubble
 * from IMG_3783.jpeg, with distinct visual hierarchies for each VIP level.
 */
export const VIPMessageBubble: React.FC<VIPMessageBubbleProps> = ({
  sender,
  content,
  timestamp,
  isMe = false,
  onUserClick,
  additionalRoleBadge,
  variant = 'room',
}) => {
  const vipTier = sender.vipTier || 'none';
  const isVip = vipTier !== 'none' && sender.isVipActive !== false;

  const mythicFrame = getMythicFrameById(sender.mythicFrameId || DEFAULT_MYTHIC_FRAME_ID);

  // Compute exact styles that match the user's selected frame
  const getBubbleStyle = () => {
    if (vipTier === 'mythic') {
      switch (mythicFrame.id) {
        case 'mythic_golden_falcon':
          return {
            containerBg: 'bg-gradient-to-r from-[#241505]/95 via-[#180E03]/95 to-[#241505]/95',
            borderColor: 'border-2 border-amber-400/90',
            borderGlow: 'shadow-[0_0_18px_rgba(245,158,11,0.4),inset_0_1px_2px_rgba(254,240,138,0.25)]',
            textColor: 'text-amber-50',
            pillBg: 'bg-[#1C0F02] border border-amber-400/80 text-amber-300',
            tierLabel: 'VIP 5',
            frameIcon: '🦅',
            frameName: 'صقر الذهب',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_golden_falcon',
          };
        case 'mythic_fire_dragon':
          return {
            containerBg: 'bg-gradient-to-r from-[#2B0808]/95 via-[#190303]/95 to-[#2B0808]/95',
            borderColor: 'border-2 border-red-500/90',
            borderGlow: 'shadow-[0_0_18px_rgba(239,68,68,0.4),inset_0_1px_2px_rgba(251,191,36,0.25)]',
            textColor: 'text-red-50',
            pillBg: 'bg-[#200404] border border-red-400/80 text-red-200',
            tierLabel: 'VIP 5',
            frameIcon: '🐉',
            frameName: 'تنين اللهب',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_fire_dragon',
          };
        case 'mythic_cosmic_nebula':
          return {
            containerBg: 'bg-gradient-to-r from-[#140C2E]/95 via-[#0A0E21]/95 to-[#140C2E]/95',
            borderColor: 'border-2 border-cyan-400/90',
            borderGlow: 'shadow-[0_0_18px_rgba(6,182,212,0.4),inset_0_1px_2px_rgba(139,92,246,0.25)]',
            textColor: 'text-cyan-50',
            pillBg: 'bg-[#0B0A20] border border-cyan-400/80 text-cyan-200',
            tierLabel: 'VIP 5',
            frameIcon: '🌌',
            frameName: 'سديم النجوم',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_cosmic_nebula',
          };
        case 'mythic_ruby_ottoman':
          return {
            containerBg: 'bg-gradient-to-r from-[#2A060C]/95 via-[#170205]/95 to-[#2A060C]/95',
            borderColor: 'border-2 border-rose-500/90',
            borderGlow: 'shadow-[0_0_18px_rgba(225,29,72,0.4),inset_0_1px_2px_rgba(252,211,77,0.25)]',
            textColor: 'text-rose-50',
            pillBg: 'bg-[#1D0308] border border-rose-400/80 text-rose-200',
            tierLabel: 'VIP 5',
            frameIcon: '💎',
            frameName: 'ياقوت السلطان',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_ruby_ottoman',
          };
        case 'mythic_cyber_glory':
          return {
            containerBg: 'bg-gradient-to-r from-[#042016]/95 via-[#02130D]/95 to-[#042016]/95',
            borderColor: 'border-2 border-emerald-400/90',
            borderGlow: 'shadow-[0_0_18px_rgba(16,185,129,0.4),inset_0_1px_2px_rgba(245,158,11,0.25)]',
            textColor: 'text-emerald-50',
            pillBg: 'bg-[#02150E] border border-emerald-400/80 text-emerald-200',
            tierLabel: 'VIP 5',
            frameIcon: '⚡',
            frameName: 'شفق النيون',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_cyber_glory',
          };
        case 'mythic_sovereign_wings':
        default:
          return {
            containerBg: 'bg-gradient-to-r from-[#210B38]/95 via-[#130524]/95 to-[#210B38]/95',
            borderColor: 'border-2 border-amber-400/90',
            borderGlow: 'shadow-[0_0_18px_rgba(251,191,36,0.4),inset_0_1px_2px_rgba(168,85,247,0.25)]',
            textColor: 'text-purple-50',
            pillBg: 'bg-[#130424] border border-amber-400/80 text-amber-200',
            tierLabel: 'VIP 5',
            frameIcon: '👑',
            frameName: 'تاج السلطان',
            crestTier: 'mythic' as VIPTier,
            frameId: 'mythic_sovereign_wings',
          };
      }
    }

    if (vipTier === 'royal') {
      return {
        containerBg: 'bg-gradient-to-r from-[#220B38]/95 via-[#150524]/95 to-[#220B38]/95',
        borderColor: 'border-2 border-purple-400/90',
        borderGlow: 'shadow-[0_0_14px_rgba(192,132,252,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)]',
        textColor: 'text-purple-50',
        pillBg: 'bg-[#150226] border border-purple-400 text-purple-200',
        tierLabel: 'VIP 4',
        frameIcon: '🦁',
        frameName: 'ملكي',
        crestTier: 'royal' as VIPTier,
        frameId: undefined,
      };
    }

    if (vipTier === 'gold') {
      return {
        containerBg: 'bg-gradient-to-r from-[#241505]/95 via-[#160D02]/95 to-[#241505]/95',
        borderColor: 'border-2 border-yellow-400/90',
        borderGlow: 'shadow-[0_0_14px_rgba(234,179,8,0.4)]',
        textColor: 'text-yellow-50',
        pillBg: 'bg-[#170D02] border border-yellow-400 text-yellow-300',
        tierLabel: 'VIP 3',
        frameIcon: '🦅',
        frameName: 'ذهبي',
        crestTier: 'gold' as VIPTier,
        frameId: undefined,
      };
    }

    if (vipTier === 'silver') {
      return {
        containerBg: 'bg-gradient-to-r from-[#111827]/95 via-[#0B0F19]/95 to-[#111827]/95',
        borderColor: 'border-2 border-slate-300/80',
        borderGlow: 'shadow-[0_0_12px_rgba(203,213,225,0.3)]',
        textColor: 'text-slate-100',
        pillBg: 'bg-[#0B1120] border border-slate-300 text-slate-200',
        tierLabel: 'VIP 2',
        frameIcon: '🐺',
        frameName: 'فضي',
        crestTier: 'silver' as VIPTier,
        frameId: undefined,
      };
    }

    if (vipTier === 'bronze') {
      return {
        containerBg: 'bg-gradient-to-r from-[#241306]/95 via-[#160B04]/95 to-[#241306]/95',
        borderColor: 'border-2 border-amber-600/80',
        borderGlow: 'shadow-[0_0_10px_rgba(217,119,6,0.3)]',
        textColor: 'text-amber-100',
        pillBg: 'bg-[#150903] border border-amber-500 text-amber-300',
        tierLabel: 'VIP 1',
        frameIcon: '🦅',
        frameName: 'برونزي',
        crestTier: 'bronze' as VIPTier,
        frameId: undefined,
      };
    }

    // Default / non-vip
    return {
      containerBg: isMe ? 'bg-[#1E1B2E]/90' : 'bg-[#151624]/90',
      borderColor: isMe ? 'border border-amber-500/50' : 'border border-zinc-700/80',
      borderGlow: 'shadow-sm',
      textColor: 'text-zinc-100',
      pillBg: '',
      tierLabel: '',
      frameIcon: '',
      frameName: '',
      crestTier: 'none' as VIPTier,
      frameId: undefined,
    };
  };

  const bubbleStyles = getBubbleStyle();

  // If user is not VIP, render clean modern bubble with natural RTL alignment
  if (!isVip) {
    return (
      <div className={`flex items-start gap-2.5 group my-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="relative shrink-0">
          <AvatarWithFrame
            user={sender}
            size="xs"
            showCrown={false}
            crownAnimated={false}
            onClick={() => onUserClick?.(sender)}
          />
        </div>

        <div className={`flex-1 min-w-0 rounded-2xl p-2 px-3 sm:px-3.5 sm:py-2 border transition-colors ${bubbleStyles.containerBg} ${bubbleStyles.borderColor}`}>
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
              <VIPName user={sender} size="xs" showRoleTag={false} />
              {additionalRoleBadge}
            </div>
            <span className="text-[10px] font-mono shrink-0 text-zinc-400 bg-black/30 px-1.5 py-0.5 rounded">
              {timestamp}
            </span>
          </div>
          <p className="text-[13px] text-zinc-100 font-medium break-words leading-normal select-text whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    );
  }

  // ROYAL LUXURY VIP CAPSULE MESSAGE BUBBLE
  return (
    <div
      className={`flex items-start gap-2.5 group my-1.5 relative ${
        isMe ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* 1. Avatar with Frame - Crown is NOT shown in chat so no bobbing animation occurs */}
      <div
        className="relative shrink-0 cursor-pointer transition-transform hover:scale-105 duration-200"
        onClick={() => onUserClick?.(sender)}
      >
        <AvatarWithFrame
          user={sender}
          size="xs"
          showCrown={false}
          crownAnimated={false}
        />
      </div>

      {/* 2. Master Luxury Message Bubble Container matching chosen frame */}
      <div
        className={`flex-1 min-w-0 relative rounded-2xl p-2 px-3 sm:px-3.5 sm:py-2 transition-all duration-300 ${
          bubbleStyles.containerBg
        } ${bubbleStyles.borderColor} ${bubbleStyles.borderGlow}`}
      >
        {/* Header Row: Always Natural RTL order (Sender Name -> Role Badge -> Time) */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          {/* Right/Leading Group: Name + Verification + Role */}
          <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
            {/* Sender Name with VIP styling & verification */}
            <VIPName user={sender} size="xs" showRoleTag={false} />

            {/* Additional Host/Owner/Mod Badge if applicable */}
            {additionalRoleBadge}
          </div>

          {/* Timestamp - Left side of the bubble */}
          <span className="text-[10px] font-mono shrink-0 text-zinc-300/80 font-medium px-1.5 py-0.5 rounded-md bg-black/40">
            {timestamp}
          </span>
        </div>

        {/* Message Content Text */}
        <div className="relative z-10 px-0.5">
          <p
            className={`text-[13px] sm:text-[13.5px] font-semibold break-words leading-normal select-text tracking-wide whitespace-pre-wrap ${
              bubbleStyles.textColor
            }`}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
