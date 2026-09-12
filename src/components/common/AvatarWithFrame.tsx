import React, { useState } from 'react';
import { UserProfile, VIPTier } from '../../types';
import { VIPAvatarFrameSVG } from './VIPAvatarFrameSVG';
import { RealisticCrown } from './RealisticCrown';

interface AvatarWithFrameProps {
  user?: UserProfile | null;
  avatarUrl?: string;
  vipTier?: VIPTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  isSpeaking?: boolean;
  audioLevel?: number; // 0 to 100
  showCrown?: boolean;
  showLevel?: boolean;
  level?: number;
  className?: string;
  onClick?: () => void;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  user,
  avatarUrl,
  vipTier,
  size = 'md',
  isSpeaking = false,
  audioLevel = 0,
  showCrown = true,
  showLevel = false,
  level,
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const tier: VIPTier = user?.vipTier || vipTier || 'none';
  const avatar = user?.avatar || avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  const userLevel = level ?? user?.level ?? 1;

  const sizeMap = {
    xs: {
      container: 'w-8 h-8',
      img: 'w-7 h-7',
      crownSize: 'xs' as const,
      crownOffset: '-top-3',
      framePad: 'p-0.5',
    },
    sm: {
      container: 'w-11 h-11',
      img: 'w-9 h-9',
      crownSize: 'xs' as const,
      crownOffset: '-top-4',
      framePad: 'p-0.5',
    },
    md: {
      container: 'w-16 h-16',
      img: 'w-13 h-13',
      crownSize: 'sm' as const,
      crownOffset: '-top-5',
      framePad: 'p-1',
    },
    lg: {
      container: 'w-22 h-22',
      img: 'w-18 h-18',
      crownSize: 'md' as const,
      crownOffset: '-top-6',
      framePad: 'p-1.5',
    },
    xl: {
      container: 'w-28 h-28',
      img: 'w-22 h-22',
      crownSize: 'lg' as const,
      crownOffset: '-top-8',
      framePad: 'p-2',
    },
    '2xl': {
      container: 'w-36 h-36',
      img: 'w-28 h-28',
      crownSize: 'xl' as const,
      crownOffset: '-top-10',
      framePad: 'p-2.5',
    },
    hero: {
      container: 'w-44 h-44',
      img: 'w-34 h-34',
      crownSize: '2xl' as const,
      crownOffset: '-top-12',
      framePad: 'p-3',
    },
  }[size];

  // Frame styling based on VIP tier with radiant golden aura
  const getFrameStyles = () => {
    switch (tier) {
      case 'mythic':
        return {
          wrapper: 'p-1.5 bg-gradient-to-tr from-[#FFE58F] via-[#A855F7] via-[#FBBF24] to-[#4C1D95] rounded-full shadow-[0_0_36px_rgba(245,158,11,0.95),0_0_18px_rgba(234,179,8,0.8)] ring-2 ring-[#FFDF73]',
          border: 'border-2 border-[#FFFBEB]',
          glowColor: '#F59E0B',
        };
      case 'royal':
        return {
          wrapper: 'p-1.5 bg-gradient-to-tr from-[#9333EA] via-[#F59E0B] via-[#C084FC] to-[#3B0764] rounded-full shadow-[0_0_30px_rgba(245,158,11,0.9),0_0_16px_rgba(234,179,8,0.7)] ring-2 ring-amber-300',
          border: 'border-2 border-amber-200',
          glowColor: '#EAB308',
        };
      case 'gold':
        return {
          wrapper: 'p-1 bg-gradient-to-tr from-[#EAB308] via-[#F59E0B] via-[#FDE047] to-[#78350F] rounded-full shadow-[0_0_26px_rgba(245,158,11,0.85),0_0_14px_rgba(234,179,8,0.7)] ring-2 ring-yellow-300',
          border: 'border-2 border-yellow-100',
          glowColor: '#F59E0B',
        };
      case 'silver':
        return {
          wrapper: 'p-1 bg-gradient-to-tr from-[#E2E8F0] via-[#FBBF24] to-[#64748B] rounded-full shadow-[0_0_22px_rgba(245,158,11,0.75),0_0_12px_rgba(234,179,8,0.6)] ring-1.5 ring-amber-300',
          border: 'border-2 border-slate-100',
          glowColor: '#F59E0B',
        };
      case 'bronze':
        return {
          wrapper: 'p-1 bg-gradient-to-tr from-[#B45309] via-[#F59E0B] to-[#78350F] rounded-full shadow-[0_0_20px_rgba(245,158,11,0.7),0_0_10px_rgba(217,119,6,0.6)] ring-1.5 ring-amber-400',
          border: 'border-2 border-amber-300',
          glowColor: '#D97706',
        };
      default:
        return {
          wrapper: 'p-0.5 bg-zinc-800 rounded-full border border-zinc-700',
          border: '',
          glowColor: '#22c55e',
        };
    }
  };

  const frame = getFrameStyles();

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap.container} ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Floating Royal Crown with Slow Rotation & Hover Glow Pulse */}
      {showCrown && tier !== 'none' && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-transform duration-300 ${sizeMap.crownOffset} ${
            isHovered ? 'scale-110' : ''
          }`}
        >
          <RealisticCrown
            tier={tier}
            size={sizeMap.crownSize}
            animated={true}
            isHovered={isHovered}
          />
        </div>
      )}

      {/* Ornate Royal Golden Purple VIP Profile Frame */}
      {tier !== 'none' && (
        <VIPAvatarFrameSVG tier={tier} size={size} showTopCrown={false} />
      )}

      {/* Radiant Golden Glow Aura for VIP Subscribers */}
      {tier !== 'none' && (
        <div
          className="absolute -inset-1 rounded-full pointer-events-none transition-opacity duration-300 z-0 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)',
            boxShadow: '0 0 16px 4px rgba(245, 158, 11, 0.7), 0 0 28px 8px rgba(234, 179, 8, 0.35)',
            filter: 'drop-shadow(0 0 8px #F59E0B)',
          }}
        />
      )}

      {/* Speaking Active Audio Wave Ring */}
      {isSpeaking && (
        <span
          className="absolute -inset-2 rounded-full border-2 border-emerald-400 opacity-80 pointer-events-none speaking-pulse"
          style={{
            borderColor: tier !== 'none' ? frame.glowColor : '#10B981',
            boxShadow: `0 0 ${14 + (audioLevel / 10)}px ${tier !== 'none' ? frame.glowColor : '#10B981'}`,
            transform: `scale(${1 + (audioLevel / 300)})`,
          }}
        />
      )}

      {/* Outer Luxury VIP Frame & User Photo */}
      <div className={`relative transition-transform duration-300 group-hover:scale-105 flex items-center justify-center ${frame.wrapper}`}>
        <img
          src={avatar}
          alt={user?.nickname || 'User avatar'}
          className={`rounded-full object-cover bg-zinc-900 ${sizeMap.img} ${frame.border}`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
          }}
        />

        {/* Level Tag */}
        {showLevel && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 text-black border border-yellow-200 shadow-md whitespace-nowrap z-20">
            Lv.{userLevel}
          </div>
        )}
      </div>
    </div>
  );
};
