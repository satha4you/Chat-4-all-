import React from 'react';

export type RoomVerificationType = 'gold' | 'blue';

interface RoomVerifiedBadgeProps {
  type?: RoomVerificationType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RoomVerifiedBadge: React.FC<RoomVerifiedBadgeProps> = ({
  type = 'gold',
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const isGold = type === 'gold';

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const tooltipText = isGold
    ? 'غرفة موثقة رسميًا (النجمة الذهبية الملكية ⭐)'
    : 'غرفة موثقة رسميًا (النجمة الزرقاء المعتمدة ⭐)';

  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 align-middle select-none ${className}`}
      title={tooltipText}
    >
      {/* Visual Seal with Embedded Star */}
      <span className="relative inline-flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} shrink-0 transition-transform duration-200 hover:scale-110 ${
            isGold
              ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.85)]'
              : 'drop-shadow-[0_0_8px_rgba(56,189,248,0.85)]'
          }`}
        >
          <defs>
            <linearGradient id={`room-badge-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {isGold ? (
                <>
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="25%" stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="25%" stopColor="#38BDF8" />
                  <stop offset="65%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0369A1" />
                </>
              )}
            </linearGradient>

            <linearGradient id={`room-star-grad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor={isGold ? '#FEF08A' : '#BAE6FD'} />
            </linearGradient>

            <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="1.5"
                floodColor={isGold ? '#F59E0B' : '#0284C7'}
                floodOpacity="0.6"
              />
            </filter>
          </defs>

          {/* 12-point scalloped seal outer boundary */}
          <path
            d="M12 1.5L14.4 3.7L17.6 3.1L18.8 6.1L21.9 7.2L21.5 10.4L23.5 12.8L21.5 15.2L21.9 18.4L18.8 19.5L17.6 22.5L14.4 21.9L12 24.1L9.6 21.9L6.4 22.5L5.2 19.5L2.1 18.4L2.5 15.2L0.5 12.8L2.5 10.4L2.1 7.2L5.2 6.1L6.4 3.1L9.6 3.7L12 1.5Z"
            fill={`url(#room-badge-grad-${type})`}
            filter={`url(#glow-${type})`}
          />

          {/* Golden or Blue Center 5-Point Star */}
          <path
            d="M12 5.5L14.06 9.68L18.66 10.35L15.33 13.59L16.12 18.17L12 16L7.88 18.17L8.67 13.59L5.34 10.35L9.94 9.68L12 5.5Z"
            fill={`url(#room-star-grad-${type})`}
            stroke={isGold ? '#78350F' : '#075985'}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {showLabel && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[9px] font-black border leading-none shrink-0 ${
            isGold
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
          }`}
        >
          {isGold ? 'موثقة ذهبياً ⭐' : 'موثقة زرقاء ⭐'}
        </span>
      )}
    </span>
  );
};
