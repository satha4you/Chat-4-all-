import React from 'react';
import { VIPTier } from '../../types';
import { VIP_CONFIGS } from '../../data/initialData';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { RealisticCrown } from './RealisticCrown';

interface VIPBadgeProps {
  tier: VIPTier;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showCrownOnly?: boolean;
  showText?: boolean;
  className?: string;
}

export const VIPBadge: React.FC<VIPBadgeProps> = ({
  tier,
  size = 'sm',
  showCrownOnly = false,
  showText = true,
  className = '',
}) => {
  if (tier === 'none') return null;

  const config = VIP_CONFIGS[tier];
  if (!config) return null;

  if (showCrownOnly) {
    const crownSize = size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'xs';
    return (
      <span className={`inline-flex items-center justify-center font-bold select-none ${className}`}>
        <RealisticCrown tier={tier} size={crownSize} animated={true} />
      </span>
    );
  }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap shadow-sm select-none transition-transform hover:scale-105 ${config.badgeBg} ${sizeClasses} ${className}`}
    >
      <RealisticCrown tier={tier} size="xs" animated={true} />
      {showText && <span>{config.nameAr}</span>}
    </span>
  );
};
