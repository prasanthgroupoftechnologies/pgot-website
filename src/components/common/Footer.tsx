import React from 'react';
import { ArrowUp, Sparkles, Shield, Cpu, Terminal, Mail, Phone, MapPin } from 'lucide-react';
import { servicesData } from '../../data/services';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Industries', href: '#industries' },
    { label: 'Innovation', href: '#innovation' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040D1A] border-t border-[#D4AF37]/20 pt-16 pb-12 overflow-hidden">
      {/* Subtle Ambient Backing Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Brand & Link Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column (col 5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-[#D4AF37] via-[#168BFF] to-[#F0D98A] shadow-gold-glow">
                <img
                  src="/assets/images/pgot-logo.png"
                  alt="Prasanth Group of Technologies Logo"
                  className="w-full h-full object-cover rounded-full bg-[#061426]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-white leading-none tracking-wider">
                  PRASANTH
                </span>
                <span className="text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase leading-tight mt-1">
                  GROUP OF TECHNOLOGIES
                </span>
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-[#0A1B33] border border-[#D4AF37]/30 text-xs font-tech text-[#F0D98A] tracking-widest">
              THINK BEYOND. BUILD BEYOND.
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm leading-relaxed">
              Engineering intelligent solutions, cognitive architectures, and connected digital possibilities for forward-thinking enterprises.
            </p>

            <div className="pt-3 space-y-2.5 text-xs">
              <a
                href="mailto:prasanthgroupoftechnologies@gmail.com"
                className="flex items-center gap-2 text-gray-300 hover:text-[#F0D98A] transition-colors break-all"
                title="Email Prasanth Group of Technologies"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>prasanthgroupoftechnologies@gmail.com</span>
              </a>
              <a
                href="tel:6369727736"
                className="flex items-center gap-2 text-gray-300 hover:text-[#F0D98A] transition-colors font-tech tracking-wide"
                title="Call Prasanth Group of Technologies"
              >
                <Phone className="w-3.5 h-3.5 text-[#168BFF] shrink-0" />
                <span>6369727736</span>
              </a>
              <a
                href="https://maps.google.com/?q=Coimbatore,+TamilNadu,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-[#F0D98A] transition-colors"
                title="View Coimbatore, TamilNadu, India on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Coimbatore, TamilNadu, India.</span>
              </a>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-tech text-gray-400">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Shield className="w-3.5 h-3.5" />
                <span>ENTERPRISE INTEGRITY</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#168BFF]">
                <Cpu className="w-3.5 h-3.5" />
                <span>COGNITIVE CORE</span>
              </span>
            </div>
          </div>

          {/* Navigation Links Column (col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-tech uppercase tracking-widest text-[#D4AF37] font-semibold">
              Site Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="hover:text-[#F0D98A] hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions & Capabilities Column (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-tech uppercase tracking-widest text-[#168BFF] font-semibold">
              Enterprise Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {servicesData.map((svc) => (
                <li key={svc.id}>
                  <a
                    href="#services"
                    onClick={(e) => handleLinkClick(e, '#services')}
                    className="hover:text-[#F0D98A] hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-tech">
          <div>
            &copy; {new Date().getFullYear()} Prasanth Group of Technologies. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>THINK BEYOND. BUILD BEYOND.</span>
            <span className="h-3 w-[1px] bg-white/10" />
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#D4AF37] transition-colors focus:outline-none"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
