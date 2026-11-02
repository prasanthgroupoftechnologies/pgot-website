import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Cloud,
  Code2,
  Boxes,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Modal } from '../components/common/Modal';
import { servicesData } from '../data/services';
import { ServiceItem } from '../types';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Icon map lookup
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6" />;
      case 'Code2':
        return <Code2 className="w-6 h-6" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6" />;
      case 'Workflow':
        return <Workflow className="w-6 h-6" />;
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#0A1B33]/60 overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#168BFF]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Core Capabilities"
          badgeVariant="gold"
          title="Enterprise Engineering"
          highlightedTitle="& Digital Solutions"
          description="Engineered for high-assurance, scale, and mission-critical reliability. We build the digital backbone that propels forward-thinking enterprises."
          align="center"
        />

        {/* 6 Premium Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group rounded-2xl bg-[#061426]/75 border border-[#D4AF37]/15 hover:border-[#D4AF37]/60 p-7 sm:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(6,20,38,0.9),0_0_30px_rgba(212,175,55,0.22)] flex flex-col justify-between overflow-hidden"
            >
              {/* Gold Accent Corner Shimmer */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none group-hover:from-[#D4AF37]/35 transition-all duration-500" />
              
              <div>
                {/* Header: Service Number and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A1B33] to-[#061426] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:text-[#061426] group-hover:bg-[#D4AF37] group-hover:border-[#F0D98A] transition-all duration-300 shadow-md">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="font-tech text-xs tracking-widest text-[#D4AF37]/70 group-hover:text-[#F0D98A] font-bold">
                    {service.number} // 06
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-[#F0D98A] transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="mt-3 text-sm text-gray-300 font-light leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Key Features Preview */}
                <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                  {service.features.slice(0, 3).map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] group-hover:text-white transition-colors duration-200"
                >
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Detail Modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title || ''}
        subtitle={`Capability Reference: ${selectedService?.number}`}
      >
        {selectedService && (
          <div className="space-y-6 text-sm">
            <div>
              <h4 className="text-xs uppercase font-tech tracking-wider text-[#D4AF37] font-semibold">
                Overview
              </h4>
              <p className="mt-1.5 text-gray-200 leading-relaxed font-light">
                {selectedService.shortDesc}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-tech tracking-wider text-[#D4AF37] font-semibold mb-3">
                Key Architectural Pillars
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-[#061426] border border-white/5 text-gray-200 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-tech tracking-wider text-[#168BFF] font-semibold mb-3">
                Enterprise Engineering Specifications
              </h4>
              <div className="space-y-2">
                {selectedService.capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
