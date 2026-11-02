import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Network,
  Compass,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { principlesData } from '../data/principles';

export const WhyPgotSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'Network':
        return <Network className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="why-pgot" className="relative py-24 sm:py-32 bg-[#0A1B33]/60 overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#168BFF]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Guiding Philosophies"
          badgeVariant="gold"
          title="Architectural Principles"
          highlightedTitle="Behind PGOT"
          description="The core tenets that guide our engineering decisions, architecture paradigms, and commitment to technological craftsmanship."
          align="center"
        />

        {/* 5 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {principlesData.map((principle, index) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl bg-[#061426]/80 border border-[#D4AF37]/20 p-7 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(6,20,38,0.8),0_0_25px_rgba(212,175,55,0.18)] group flex flex-col justify-between ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0A1B33] border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#061426] transition-all duration-300 mb-6 shadow-md">
                  {getIcon(principle.icon)}
                </div>

                <span className="font-tech text-xs tracking-widest text-[#D4AF37]/80 uppercase font-semibold">
                  Principle 0{index + 1}
                </span>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-[#F0D98A] transition-colors mt-2 leading-snug">
                  {principle.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-200 leading-relaxed border-l-2 border-[#D4AF37]/40 pl-3">
                  "{principle.statement}"
                </p>

                <p className="mt-4 text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                  {principle.details}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-tech text-gray-400">
                <span>FOUNDATIONAL PILLAR</span>
                <span className="text-[#D4AF37]">CORE STANDARD</span>
              </div>
            </motion.div>
          ))}

          {/* Call to Action Feature Tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-[#0A1B33] via-[#0D2545] to-[#061426] border border-[#168BFF]/40 p-7 sm:p-8 backdrop-blur-md flex flex-col justify-between shadow-blue-glow group hover:border-cyan-400/50 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#168BFF]/20 border border-[#168BFF]/50 flex items-center justify-center text-cyan-300 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <span className="font-tech text-xs tracking-widest text-cyan-300 uppercase font-semibold">
                Strategic Alliance
              </span>

              <h3 className="font-display font-bold text-xl text-white mt-2 leading-snug">
                Engineering Tomorrow's Possibilities Together
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Connect with our technical architects to explore how our principles translate into resilient systems for your enterprise.
              </p>
            </div>

            <div className="mt-6 pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#061426] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow transition-all"
              >
                <span>Initiate Dialogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
