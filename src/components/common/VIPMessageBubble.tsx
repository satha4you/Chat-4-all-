import React from 'react';
import { VIPTier, UserProfile } from '../../types';
import { VIPName } from './VIPName';
import { AvatarWithFrame } from './AvatarWithFrame';

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
 * Winged Lion Crest SVG tailored specifically for each VIP stage,
 * directly modeled from the luxury golden-purple royal crest in IMG_3783.jpeg
 */
export const WingedLionCrest: React.FC<{ tier: VIPTier; size?: number; className?: string }> = ({
  tier,
  size = 34,
  className = '',
}) => {
  if (tier === 'none') return null;

  const uniqueId = React.useId().replace(/:/g, '_');

  // Colors per VIP Tier
  const tierColors = {
    bronze: {
      goldLight: '#FED7AA',
      goldMid: '#D97706',
      goldDark: '#78350F',
      wingPurple: '#3E1C0A',
      wingPurpleLight: '#EA580C',
      gem: '#F97316',
      label: 'VIP 1',
    },
    silver: {
      goldLight: '#FFFFFF',
      goldMid: '#94A3B8',
      goldDark: '#334155',
      wingPurple: '#1E293B',
      wingPurpleLight: '#38BDF8',
      gem: '#06B6D4',
      label: 'VIP 2',
    },
    gold: {
      goldLight: '#FEF08A',
      goldMid: '#EAB308',
      goldDark: '#713F12',
      wingPurple: '#422006',
      wingPurpleLight: '#F59E0B',
      gem: '#DC2626',
      label: 'VIP 3',
    },
    royal: {
      goldLight: '#FEF9C3',
      goldMid: '#F59E0B',
      goldDark: '#581C87',
      wingPurple: '#3B0764',
      wingPurpleLight: '#C084FC',
      gem: '#9333EA',
      label: 'VIP 4',
    },
    mythic: {
      goldLight: '#FFFBEB',
      goldMid: '#FBBF24',
      goldDark: '#78350F',
      wingPurple: '#2E0854',
      wingPurpleLight: '#C084FC',
      gem: '#F43F5E',
      label: 'VIP 5',
    },
  }[tier];

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

  // Styling properties per tier
  const bubbleStyles = {
    mythic: {
      containerBg: 'bg-gradient-to-r from-[#17064D] via-[#10033E] to-[#17064D]',
      borderColor: 'border-2 border-amber-400',
      borderGlow: 'shadow-[0_0_18px_rgba(250,204,21,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)]',
      textColor: 'text-amber-50',
      pillBg: 'bg-[#0B0224] border border-amber-400 text-amber-300',
      tierLabel: 'VIP 5',
      crestTier: 'mythic' as VIPTier,
    },
    royal: {
      containerBg: 'bg-gradient-to-r from-[#24063D] via-[#170329] to-[#24063D]',
      borderColor: 'border-2 border-purple-400/90',
      borderGlow: 'shadow-[0_0_14px_rgba(192,132,252,0.45),inset_0_1px_2px_rgba(255,255,255,0.2)]',
      textColor: 'text-purple-50',
      pillBg: 'bg-[#150226] border border-purple-400 text-purple-200',
      tierLabel: 'VIP 4',
      crestTier: 'royal' as VIPTier,
    },
    gold: {
      containerBg: 'bg-gradient-to-r from-[#2E1C05] via-[#1B1002] to-[#2E1C05]',
      borderColor: 'border-2 border-yellow-500',
      borderGlow: 'shadow-[0_0_12px_rgba(234,179,8,0.4)]',
      textColor: 'text-yellow-50',
      pillBg: 'bg-[#170D02] border border-yellow-400 text-yellow-300',
      tierLabel: 'VIP 3',
      crestTier: 'gold' as VIPTier,
    },
    silver: {
      containerBg: 'bg-gradient-to-r from-[#111827] via-[#0B0F19] to-[#111827]',
      borderColor: 'border-2 border-slate-300/80',
      borderGlow: 'shadow-[0_0_10px_rgba(203,213,225,0.3)]',
      textColor: 'text-slate-100',
      pillBg: 'bg-[#0B1120] border border-slate-300 text-slate-200',
      tierLabel: 'VIP 2',
      crestTier: 'silver' as VIPTier,
    },
    bronze: {
      containerBg: 'bg-gradient-to-r from-[#291507] via-[#170B04] to-[#291507]',
      borderColor: 'border-2 border-amber-600/80',
      borderGlow: 'shadow-[0_0_8px_rgba(217,119,6,0.3)]',
      textColor: 'text-amber-100',
      pillBg: 'bg-[#150903] border border-amber-500 text-amber-300',
      tierLabel: 'VIP 1',
      crestTier: 'bronze' as VIPTier,
    },
    none: {
      containerBg: isMe ? 'bg-[#241A0B]' : 'bg-[#161826]',
      borderColor: isMe ? 'border border-amber-500/60' : 'border border-zinc-700/80',
      borderGlow: 'shadow-sm',
      textColor: isMe ? 'text-amber-50' : 'text-zinc-100',
      pillBg: '',
      tierLabel: '',
      crestTier: 'none' as VIPTier,
    },
  }[vipTier];

  // If user is not VIP, render clean modern bubble
  if (!isVip) {
    return (
      <div className={`flex items-start gap-2.5 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="relative shrink-0">
          <AvatarWithFrame
            user={sender}
            size="xs"
            showCrown={false}
            onClick={() => onUserClick?.(sender)}
          />
        </div>

        <div className={`flex-1 min-w-0 rounded-2xl p-3 border transition-colors ${bubbleStyles.containerBg} ${bubbleStyles.borderColor} ${isMe ? 'text-right' : ''}`}>
          <div className={`flex items-center justify-between gap-1 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1.5 truncate">
              <VIPName user={sender} size="xs" showRoleTag={false} />
              {additionalRoleBadge}
              {isMe && <span className="text-[10px] text-amber-300/80 font-bold">(أنت)</span>}
            </div>
            <span className={`text-[10px] font-mono shrink-0 ${isMe ? 'text-amber-200/80' : 'text-zinc-400'}`}>
              {timestamp}
            </span>
          </div>
          <p className="text-[13px] text-zinc-100 font-medium break-words leading-relaxed select-text whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    );
  }

  // ROYAL LUXURY VIP CAPSULE MESSAGE BUBBLE (Exact match to IMG_3783.jpeg)
  return (
    <div
      className={`flex items-start gap-2.5 group my-1.5 relative ${
        isMe ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* 1. Avatar with Master Royal Frame */}
      <div
        className="relative shrink-0 cursor-pointer transition-transform hover:scale-105 duration-200"
        onClick={() => onUserClick?.(sender)}
      >
        <AvatarWithFrame
          user={sender}
          size="xs"
          showCrown={true}
        />
      </div>

      {/* 2. Master Luxury Message Bubble Container */}
      <div
        className={`flex-1 min-w-0 relative rounded-2xl sm:rounded-full p-2.5 sm:px-4 sm:py-2.5 transition-all duration-300 ${
          bubbleStyles.containerBg
        } ${bubbleStyles.borderColor} ${bubbleStyles.borderGlow} ${
          isMe ? 'text-right' : 'text-left'
        }`}
      >
        {/* Subtle Decorative Golden Corner Crown Filigree for High Tiers */}
        {(vipTier === 'mythic' || vipTier === 'royal') && (
          <div
            className={`absolute -top-2 ${
              isMe ? 'left-4' : 'right-4'
            } pointer-events-none text-xs select-none filter drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]`}
          >
            👑
          </div>
        )}

        {/* Header Row: Winged Crest + Name + VIP Pill + Time */}
        <div
          className={`flex items-center justify-between gap-2 mb-1.5 ${
            isMe ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Left/Right Leading Winged Lion Crest & Name Group */}
          <div className="flex items-center gap-2 truncate">
            {/* Winged Lion Crest directly attached to the bubble as in IMG_3783.jpeg */}
            <div className="relative shrink-0 -my-1">
              <WingedLionCrest tier={bubbleStyles.crestTier} size={28} />
            </div>

            {/* Sender Name with VIP styling */}
            <VIPName user={sender} size="xs" showRoleTag={false} />

            {/* The Distinct "VIP 5" / "VIP X" Luxury Pill Badge from IMG_3783.jpeg */}
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm flex items-center gap-1 shrink-0 ${bubbleStyles.pillBg}`}
            >
              <span className="text-[9px]">👑</span>
              <span>{bubbleStyles.tierLabel}</span>
            </div>

            {/* Additional Host/Owner/Mod Badge if applicable */}
            {additionalRoleBadge}

            {isMe && (
              <span className="text-[10px] text-amber-300/80 font-bold shrink-0">
                (أنت)
              </span>
            )}
          </div>

          {/* Message Timestamp */}
          <span className="text-[10px] font-mono shrink-0 text-amber-200/70 font-semibold px-1.5 py-0.5 rounded-md bg-black/30">
            {timestamp}
          </span>
        </div>

        {/* Message Content Text */}
        <div className="relative z-10 px-1">
          <p
            className={`text-[13px] sm:text-[14px] font-semibold break-words leading-relaxed select-text tracking-wide whitespace-pre-wrap ${
              bubbleStyles.textColor
            } drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
