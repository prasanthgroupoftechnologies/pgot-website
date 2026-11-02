import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Cpu, Network, Shield, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { GlowBadge } from '../components/common/GlowBadge';
import { Button } from '../components/common/Button';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Frontier Intelligence',
      desc: 'Developing adaptive machine learning architectures and autonomous workflows that streamline modern enterprise operations.',
    },
    {
      icon: Network,
      title: 'Distributed Scalability',
      desc: 'Designing cloud topologies and event streams capable of frictionless horizontal scale across global data centers.',
    },
    {
      icon: Compass,
      title: 'Strategic Architecture',
      desc: 'Aligning deep engineering principles with clear operational roadmaps that unlock tangible technological value.',
    },
    {
      icon: Shield,
      title: 'Zero-Trust Resilience',
      desc: 'Embedding cryptographic defense matrices and fault-tolerant mechanisms into the structural foundation of every system.',
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#061426] overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] rounded-full border border-[#D4AF37]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] rounded-full border border-dashed border-[#168BFF]/10 pointer-events-none animate-spin-slow" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-[#168BFF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="About PGOT"
          badgeVariant="gold"
          title="Technology"
          highlightedTitle="Without Boundaries."
          description="Prasanth Group of Technologies is focused on exploring innovative technology and building digital solutions that help businesses move forward."
          align="center"
        />

        {/* Central Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12">
          
          {/* Left Visual: Official Insignia Showcase with Holographic Framing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Outer Golden Glow & Orbital border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] via-[#168BFF] to-[#F0D98A] rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-700" />
              
              <div className="relative rounded-2xl bg-[#0A1B33]/90 border border-[#D4AF37]/35 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center overflow-hidden">
                {/* Tech grid background */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Official Logo / Insignia */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#168BFF] to-[#F0D98A] shadow-gold-glow-lg transition-transform duration-500 group-hover:scale-105">
                  <img
                    src="/assets/images/pgot-logo.png"
                    alt="Prasanth Group of Technologies Official Emblem"
                    className="w-full h-full object-cover rounded-full bg-[#061426]"
                  />
                  {/* Subtle spinning ring */}
                  <div className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF37]/30 animate-spin-slow pointer-events-none" />
                </div>

                <div className="mt-6 relative z-10">
                  <h3 className="font-display font-extrabold text-xl text-white tracking-wide">
                    PRASANTH GROUP OF TECHNOLOGIES
                  </h3>
                  <p className="font-tech text-xs tracking-widest text-[#D4AF37] mt-1.5 uppercase font-semibold">
                    THINK BEYOND. BUILD BEYOND.
                  </p>
                </div>

                <div className="w-full mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300 font-tech">
                  <span className="text-[#60A5FA]">ARCHITECTURAL CORE</span>
                  <span className="text-[#F0D98A]">VERIFIED IDENTITY</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission statement and Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0A1B33]/60 border border-white/10 backdrop-blur-md">
              <span className="text-xs uppercase font-tech tracking-widest text-[#D4AF37] font-semibold">
                Strategic Foundation
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-2 leading-snug">
                Pioneering Intelligent Digital Horizons for Global Enterprise
              </h3>
              <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
                At Prasanth Group of Technologies, we are committed to architecting software, AI systems, and cloud infrastructure that empower organizations to transcend traditional operational constraints. Our vision synthesizes rigorous technical depth with creative technological courage.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-5 rounded-xl bg-[#0A1B33]/40 border border-white/5 hover:border-[#D4AF37]/35 transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#061426] transition-all duration-300 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-base text-white group-hover:text-[#F0D98A] transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discover Our Capabilities
              </Button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
