import React from 'react';
import { motion } from 'framer-motion';
import { GlowBadge } from './GlowBadge';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'gold' | 'blue' | 'cyan';
  title: string;
  highlightedTitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = 'gold',
  title,
  highlightedTitle,
  description,
  align = 'center',
  className,
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col mb-12 md:mb-16', alignClass[align], className)}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <GlowBadge variant={badgeVariant} pulse>
            {badge}
          </GlowBadge>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight max-w-4xl"
      >
        {title}{' '}
        {highlightedTitle && (
          <span className="gold-gradient-text block sm:inline mt-1 sm:mt-0">
            {highlightedTitle}
          </span>
        )}
      </motion.h2>

      {/* Futuristic accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={cn(
          'h-[2px] w-24 my-5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent',
          align === 'left' && 'origin-left from-[#D4AF37] via-[#168BFF] to-transparent',
          align === 'right' && 'origin-right from-transparent via-[#168BFF] to-[#D4AF37]',
          align === 'center' && 'origin-center'
        )}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
