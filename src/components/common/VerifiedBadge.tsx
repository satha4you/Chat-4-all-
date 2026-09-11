import React from 'react';

export type VerificationType = 'gold' | 'blue';

interface VerifiedBadgeProps {
  type?: VerificationType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = 'gold',
  size = 'sm',
  className = '',
  showTooltip = true,
}) => {
  const isGold = type === 'gold';

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const tooltipText = isGold
    ? 'حساب موثق رسميًا (توثيق ذهبي ملكي ⭐)'
    : 'حساب موثق رسميًا (توثيق أزرق معتمد 🛡️)';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle ${className}`}
      title={showTooltip ? tooltipText : undefined}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} shrink-0 transition-transform duration-200 hover:scale-110 ${
          isGold
            ? 'drop-shadow-[0_0_6px_rgba(245,158,11,0.75)]'
            : 'drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]'
        }`}
      >
        <defs>
          <linearGradient id={`badge-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {isGold ? (
              <>
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#B45309" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="45%" stopColor="#0EA5E9" />
                <stop offset="80%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </>
            )}
          </linearGradient>
          <linearGradient id={`inner-bevel-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 12-point scalloped verified badge seal */}
        <path
          d="M12 1.5L14.4 3.7L17.6 3.1L18.8 6.1L21.9 7.2L21.5 10.4L23.5 12.8L21.5 15.2L21.9 18.4L18.8 19.5L17.6 22.5L14.4 21.9L12 24.1L9.6 21.9L6.4 22.5L5.2 19.5L2.1 18.4L2.5 15.2L0.5 12.8L2.5 10.4L2.1 7.2L5.2 6.1L6.4 3.1L9.6 3.7L12 1.5Z"
          fill={`url(#badge-grad-${type})`}
        />

        {/* Light inner overlay for metallic 3D depth */}
        <path
          d="M12 2.5L14.1 4.4L16.9 3.9L17.9 6.5L20.6 7.5L20.3 10.3L22 12.4L20.3 14.5L20.6 17.3L17.9 18.3L16.9 20.9L14.1 20.4L12 22.3L9.9 20.4L7.1 20.9L6.1 18.3L3.4 17.3L3.7 14.5L2 12.4L3.7 10.3L3.4 7.5L6.1 6.5L7.1 3.9L9.9 4.4L12 2.5Z"
          fill={`url(#inner-bevel-${type})`}
          opacity="0.35"
        />

        {/* White verified checkmark with drop-shadow */}
        <path
          d="M7.5 12.2L10.4 15.1L16.5 9"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
