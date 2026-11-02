import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconPosition = 'right',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg overflow-hidden group select-none active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] border border-blue-400/30',
    secondary:
      'bg-[#0A1B33]/80 hover:bg-[#0E2445] text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-gold-glow backdrop-blur-md',
    gold:
      'bg-gradient-to-r from-[#D4AF37] via-[#F0D98A] to-[#D4AF37] text-[#061426] font-bold shadow-lg shadow-[#D4AF37]/30 hover:shadow-gold-glow-lg hover:scale-[1.02] border border-[#F0D98A]',
    outline:
      'bg-transparent hover:bg-white/5 text-gray-200 hover:text-white border border-white/20 hover:border-white/50 backdrop-blur-sm',
    ghost:
      'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {/* Subtle shine sweep on hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
};
