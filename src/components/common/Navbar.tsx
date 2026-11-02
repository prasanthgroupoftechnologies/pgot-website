import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { NavItem } from '../../types';

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Innovation', href: '#innovation' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['home', 'about', 'services', 'industries', 'innovation', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#061426]/95 backdrop-blur-xl border-b border-[#D4AF37]/35 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)]'
          : 'bg-[#061426]/85 backdrop-blur-md border-b border-[#D4AF37]/25 py-4 shadow-[0_4px_25px_rgba(6,20,38,0.85)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Original PGOT Logo & Typographic Identity */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
            aria-label="Prasanth Group of Technologies Home"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-[#D4AF37] via-[#168BFF] to-[#F0D98A] shadow-gold-glow group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src="/assets/images/pgot-logo.png"
                alt="Prasanth Group of Technologies Official Logo"
                className="w-full h-full object-cover rounded-full bg-[#061426]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold tracking-wider text-base sm:text-lg text-white group-hover:text-[#F0D98A] transition-colors leading-none">
                PRASANTH
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase leading-tight mt-1">
                GROUP OF TECHNOLOGIES
              </span>
            </div>
          </a>

          {/* RIGHT: Desktop Navigation Links (Horizontally on the right) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <nav className="flex items-center gap-1 bg-[#0A1B33]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {navItems.map((item) => {
                const targetId = item.href.replace('#', '');
                const isActive = activeSection === targetId;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37]/25 to-[#168BFF]/25 text-[#F0D98A] border border-[#D4AF37]/50 shadow-gold-glow'
                        : 'text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Quick Action Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F0D98A] to-[#D4AF37] text-[#061426] hover:brightness-110 shadow-gold-glow transition-all duration-300 hover:scale-[1.02]"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* MOBILE / TABLET MENU TOGGLE BUTTON (Visible on < lg) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#061426] shadow-sm"
            >
              Connect
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0A1B33] border border-[#D4AF37]/40 text-gray-200 hover:text-[#D4AF37] hover:border-[#D4AF37] focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER / OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061426]/98 backdrop-blur-2xl border-b border-[#D4AF37]/35 px-6 py-6 transition-all duration-300 shadow-2xl">
          <div className="flex flex-col space-y-2.5 max-w-md mx-auto">
            {navItems.map((item) => {
              const targetId = item.href.replace('#', '');
              const isActive = activeSection === targetId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#0A1B33] text-[#F0D98A] border border-[#D4AF37]/50 shadow-gold-glow'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                </a>
              );
            })}

            <div className="pt-3 border-t border-white/10 mt-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F0D98A] to-[#D4AF37] text-[#061426] font-extrabold text-sm shadow-gold-glow uppercase tracking-wider"
              >
                <span>Initiate Dialogue</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
