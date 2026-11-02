import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Globe2, Sparkles, ChevronDown } from 'lucide-react';
import { HeroVideoBackground } from '../components/background/HeroVideoBackground';
import { ParticleFieldCanvas } from '../components/background/ParticleFieldCanvas';
import { InteractiveGlobe } from '../components/3d/InteractiveGlobe';
import { GlowBadge } from '../components/common/GlowBadge';
import { Button } from '../components/common/Button';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-12 sm:pb-16"
    >
      {/* 1. Cinematic Background Video Layer (User Uploaded) */}
      <HeroVideoBackground
        videoSrc="/assets/videos/pgot-hero-background.mp4"
        posterSrc="/assets/images/pgot-logo.png"
      />

      {/* 2. Interactive Ambient Particle System */}
      <ParticleFieldCanvas particleCount={40} className="z-10" />

      {/* 3. Main Hero Content Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left 45% (col 7): Clean, High-Contrast Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left max-w-2xl"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-5"
            >
              <GlowBadge variant="gold" pulse>
                <span className="font-tech tracking-widest text-[#F0D98A]">
                  THINK BEYOND. BUILD BEYOND.
                </span>
              </GlowBadge>
            </motion.div>

            {/* Main Cinematic Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-6xl tracking-tight text-white leading-[1.08] drop-shadow-md"
            >
              Beyond Technology.{' '}
              <span className="block mt-1 sm:mt-2 gold-gradient-text text-glow-gold">
                Into Tomorrow.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-xl drop-shadow-sm"
            >
              Engineering intelligent solutions. Building connected possibilities. Empowering a smarter digital future.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Button
                variant="gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => scrollTo('services')}
                className="w-full sm:w-auto"
              >
                Explore Our Solutions
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                onClick={() => scrollTo('about')}
                className="w-full sm:w-auto"
              >
                Discover PGOT
              </Button>
            </motion.div>

            {/* Technology Assurance Micro-Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Enterprise Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#168BFF]" />
                <span>Cognitive AI Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Planetary Mesh</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right 55% (col 5): Interactive 3D Digital Earth & Holographic Node Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient Back Glow */}
            <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] bg-gradient-to-tr from-[#168BFF]/25 via-[#D4AF37]/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

            {/* 3D Interactive Rotating Globe */}
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
              <InteractiveGlobe />

              {/* Floating Holographic Telemetry Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-4 glass-card px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                <div>
                  <div className="text-[10px] uppercase font-tech text-[#D4AF37] tracking-wider">
                    Planetary Mesh Telemetry
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Synchronous Multi-Region Active
                  </div>
                </div>
              </motion.div>

              {/* Top Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-2 -right-2 sm:top-4 sm:right-4 glass-card px-3.5 py-2 rounded-xl border border-[#168BFF]/40 shadow-lg backdrop-blur-md hidden sm:flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs text-gray-200 font-tech">PGOT Core v4.8</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 4. Bottom Scroll Indicator */}
      <div className="relative z-20 flex justify-center mt-4">
        <button
          onClick={() => scrollTo('about')}
          className="flex flex-col items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors group focus:outline-none"
          aria-label="Scroll to About section"
        >
          <span className="font-tech tracking-wider uppercase text-[11px]">Explore Below</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D4AF37]" />
        </button>
      </div>
    </section>
  );
};
