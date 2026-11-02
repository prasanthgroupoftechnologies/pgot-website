import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Factory,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Landmark,
  Building2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { industriesData } from '../data/industries';
import { IndustryItem } from '../types';

export const IndustriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(industriesData[0].id);

  const activeIndustry =
    industriesData.find((ind) => ind.id === activeTab) || industriesData[0];

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'manufacturing':
        return <Factory className="w-5 h-5" />;
      case 'textile-retail':
        return <ShoppingBag className="w-5 h-5" />;
      case 'healthcare':
        return <HeartPulse className="w-5 h-5" />;
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'finance':
        return <Landmark className="w-5 h-5" />;
      case 'enterprise':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <section id="industries" className="relative py-24 sm:py-32 bg-[#0A1B33]/50 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#168BFF]/5 via-[#D4AF37]/5 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Domain Solutions"
          badgeVariant="gold"
          title="Transforming Key"
          highlightedTitle="Global Industries"
          description="Applying high-velocity engineering, data synchronization, and cognitive models across complex economic sectors."
          align="center"
        />

        {/* Industry Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2.5 sm:gap-3 no-scrollbar mt-10">
          {industriesData.map((ind) => {
            const isCurrent = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#061426] border-[#F0D98A] shadow-gold-glow scale-105'
                    : 'bg-[#061426]/70 text-gray-300 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                <span>{getIndustryIcon(ind.id)}</span>
                <span>{ind.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <motion.div
          key={activeIndustry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl bg-[#061426]/85 border border-[#D4AF37]/30 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Backing Glow */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
            style={{ backgroundColor: activeIndustry.accentColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#0A1B33] border border-[#D4AF37]/40 text-[#D4AF37]">
                  {getIndustryIcon(activeIndustry.id)}
                </div>
                <div>
                  <span className="font-tech text-xs uppercase tracking-widest text-[#D4AF37]">
                    Industry Sector
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {activeIndustry.name}
                  </h3>
                </div>
              </div>

              <div className="text-base sm:text-lg font-medium text-[#F0D98A] font-display">
                {activeIndustry.tagline}
              </div>

              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                {activeIndustry.description}
              </p>

              {/* Impact / Capabilities Checklist */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-tech uppercase tracking-wider text-gray-400 block">
                  Core Solution Impact:
                </span>
                {activeIndustry.impactMetrics.map((metric) => (
                  <div key={metric} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Abstract Visual & Technology Matrix */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A1B33]/80 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase font-tech tracking-widest text-[#168BFF] font-semibold block mb-3">
                  Applied Tech Architecture
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeIndustry.techFocus.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-[#061426] border border-[#D4AF37]/25 text-xs font-tech text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-tech text-gray-400">
                  <span>DEPLOYMENT READINESS</span>
                  <span className="text-[#60A5FA]">ENTERPRISE READY</span>
                </div>
                <div className="w-full bg-[#061426] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#168BFF] via-[#D4AF37] to-[#F0D98A] rounded-full transition-all duration-1000"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#061426]/60 border border-white/5 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span className="text-xs text-gray-300 font-light">
                  Tailored integration patterns adhering to global regulatory and data governance standards.
                </span>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
