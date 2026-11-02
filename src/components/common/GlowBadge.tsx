import React from 'react';
import { cn } from '../../utils/cn';

interface GlowBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'gold' | 'blue' | 'cyan' | 'neutral';
  className?: string;
  pulse?: boolean;
}

export const GlowBadge: React.FC<GlowBadgeProps> = ({
  children,
  icon,
  variant = 'gold',
  className,
  pulse = false,
}) => {
  const variantStyles = {
    gold: 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F0D98A] shadow-[0_0_15px_rgba(212,175,55,0.15)]',
    blue: 'border-[#168BFF]/40 bg-[#168BFF]/10 text-[#60A5FA] shadow-[0_0_15px_rgba(22,139,255,0.2)]',
    cyan: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]',
    neutral: 'border-white/20 bg-white/5 text-gray-300 shadow-sm',
  };

  const dotColors = {
    gold: 'bg-[#D4AF37]',
    blue: 'bg-[#168BFF]',
    cyan: 'bg-cyan-400',
    neutral: 'bg-gray-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border backdrop-blur-md transition-all',
        variantStyles[variant],
        className
      )}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])}
          />
        </span>
      ) : (
        icon && <span className="opacity-80">{icon}</span>
      )}
      <span>{children}</span>
    </div>
  );
};
