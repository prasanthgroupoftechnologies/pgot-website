import React from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { AiRoboticsSection } from './sections/AiRoboticsSection';
import { IndustriesSection } from './sections/IndustriesSection';
import { InnovationShowcaseSection } from './sections/InnovationShowcaseSection';
import { WhyPgotSection } from './sections/WhyPgotSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/common/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#061426] text-white selection:bg-[#D4AF37] selection:text-[#061426] font-sans relative">
      {/* Fixed Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <AiRoboticsSection />
        <IndustriesSection />
        <InnovationShowcaseSection />
        <WhyPgotSection />
        <ContactSection />
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};

export default App;
