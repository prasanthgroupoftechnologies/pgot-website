import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Globe2,
  Workflow,
  Radio,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { GlowBadge } from '../components/common/GlowBadge';
import { innovationData } from '../data/innovation';

export const InnovationShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = innovationData[activeTab];

  const getTabIcon = (tag: string) => {
    switch (tag) {
      case 'Artificial Intelligence':
        return <Cpu className="w-4 h-4" />;
      case 'Cloud Infrastructure':
        return <Globe2 className="w-4 h-4" />;
      case 'Robotics & Hardware':
        return <Workflow className="w-4 h-4" />;
      case 'Data Architecture':
        return <Radio className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <section id="innovation" className="relative py-24 sm:py-32 bg-[#061426] overflow-hidden">
      {/* Background Lighting Elements */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[550px] h-[550px] bg-[#168BFF]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="R&D & Engineering"
          badgeVariant="gold"
          title="Futuristic"
          highlightedTitle="Innovation Showcase"
          description="Pioneering new standards in machine cognition, distributed mesh networking, and deterministic automated robotics."
          align="center"
        />

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 sm:gap-3 no-scrollbar mt-10">
          {innovationData.map((item, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#061426] border-[#F0D98A] shadow-gold-glow scale-105'
                    : 'bg-[#0A1B33]/70 text-gray-300 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                <span>{getTabIcon(item.tag)}</span>
                <span>{item.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Active Innovation Module Showcase */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 rounded-3xl bg-[#0A1B33]/85 border border-[#D4AF37]/30 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Animated Stream Line across top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-laser-sweep" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <GlowBadge variant="gold" pulse>
                  {current.tag}
                </GlowBadge>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-3 leading-snug">
                  {current.title}
                </h3>
                <p className="text-[#F0D98A] text-sm sm:text-base font-medium mt-2">
                  {current.subtitle}
                </p>
                <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed mt-4">
                  {current.description}
                </p>
              </div>

              {/* Highlights checklist */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <span className="text-xs uppercase font-tech tracking-wider text-gray-400 block">
                  Architectural Breakthroughs:
                </span>
                {current.highlights.map((hl) => (
                  <div key={hl} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Telemetry Metrics */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#061426]/90 border border-white/10 flex flex-col justify-between space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-tech text-xs tracking-wider text-gray-200 uppercase">
                    LIVE PERFORMANCE METRICS
                  </span>
                </div>
                <span className="text-[10px] font-tech text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  REAL-TIME
                </span>
              </div>

              {/* 4 Performance Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                {current.stats.map((st) => (
                  <div
                    key={st.label}
                    className="p-3.5 rounded-xl bg-[#0A1B33] border border-white/5"
                  >
                    <div className="text-[11px] font-tech text-gray-400 uppercase">
                      {st.label}
                    </div>
                    <div className="text-base sm:text-lg font-tech font-bold text-[#F0D98A] mt-1">
                      {st.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Stream Simulation Bar */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-tech text-gray-400">
                  <span>TELEMETRY STREAM INTEGRITY</span>
                  <span className="text-cyan-400">99.98% COHERENT</span>
                </div>
                <div className="w-full bg-[#0A1B33] h-2 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-gradient-to-r from-[#168BFF] via-[#D4AF37] to-cyan-400 rounded-full animate-pulse" />
                </div>
              </div>

              <div className="text-[11px] font-tech text-gray-400 text-center">
                ENGINEERED & MAINTAINED UNDER PGOT ARCHITECTURAL PROTOCOL
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
