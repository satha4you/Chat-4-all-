import React from 'react';
import { UserProfile, VIPTier } from '../../types';
import { RealisticCrown } from './RealisticCrown';
import { VerifiedBadge, VerificationType } from './VerifiedBadge';

interface VIPNameProps {
  user?: UserProfile | null;
  nickname?: string;
  vipTier?: VIPTier;
  role?: string;
  verified?: boolean;
  verificationType?: VerificationType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCrown?: boolean;
  showBadgeIcon?: boolean;
  showRoleTag?: boolean;
  className?: string;
}

export const VIPName: React.FC<VIPNameProps> = ({
  user,
  nickname,
  vipTier,
  role,
  verified,
  verificationType,
  size = 'md',
  showCrown = true,
  showBadgeIcon = false,
  showRoleTag = true,
  className = '',
}) => {
  const name = nickname || user?.nickname || user?.username || 'عضو';
  const tier: VIPTier = vipTier || user?.vipTier || 'none';
  const isVerified = verified ?? user?.verified ?? false;
  const userRole = role || user?.role;
  const effectiveVerificationType: VerificationType =
    verificationType || user?.verificationType || (userRole === 'owner' ? 'gold' : 'blue');

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
    xl: 'text-xl font-black',
  }[size];

  const getTierColor = () => {
    switch (tier) {
      case 'mythic':
        return 'mythic-gradient-text font-black tracking-wide drop-shadow-[0_2px_12px_rgba(244,63,94,0.6)]';
      case 'royal':
        return 'royal-diamond-text font-black drop-shadow-[0_2px_10px_rgba(192,132,252,0.5)]';
      case 'gold':
        return 'gold-gradient-text font-extrabold drop-shadow-[0_1px_4px_rgba(229,184,66,0.3)]';
      case 'silver':
        return 'silver-gradient-text font-bold';
      case 'bronze':
        return 'bronze-gradient-text font-bold';
      default:
        return 'text-zinc-100 font-medium';
    }
  };

  const getCrownIcon = () => {
    if (tier === 'none') return null;
    const crownSize = size === 'xl' || size === 'lg' ? 'sm' : 'xs';
    return (
      <span className="inline-flex items-center ml-1 shrink-0" title={`تاج ${tier}`}>
        <RealisticCrown tier={tier} size={crownSize} animated={true} />
      </span>
    );
  };

  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      <span className={`tracking-tight truncate ${sizeClasses} ${getTierColor()}`}>
        {name}
      </span>

      {showCrown && getCrownIcon()}

      {/* Verified Account Badge (Gold or Blue) */}
      {isVerified && (
        <VerifiedBadge
          type={effectiveVerificationType}
          size={size === 'xl' || size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'xs'}
        />
      )}

      {/* Role Tag (Owner / Admin) */}
      {showRoleTag && userRole === 'owner' && (
        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
          المالك
        </span>
      )}
      {showRoleTag && userRole === 'moderator' && (
        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
          مشرف
        </span>
      )}
    </div>
  );
};
