'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';

const NAV_ITEMS = [
  { label: "Beranda", href: "#hero" },
  { label: "Perjalanan", href: "#journey" },
  { label: "Tech Stack", href: "#tech" },
  { label: "Proyek", href: "#projects" },
  { label: "Sertifikat", href: "#certificates" },
  { label: "Kontak", href: "#contacts" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const isMobileMenuOpen = isOpen; // Capture current state
    setIsOpen(false); // Close menu immediately

    const performScroll = () => {
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    if (isMobileMenuOpen) {
      // Delay scroll to allow mobile menu exit animation to complete
      setTimeout(performScroll, 300); // 300ms matches AnimatePresence exit duration
    } else {
      performScroll();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background">
      {/* Hairline bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />
      
      <div className="container mx-auto px-6 h-16 flex items-center justify-between relative z-10" style={{maxWidth: '1280px'}}>
        {/* Logo in Playfair */}
        <Link href="/" className="text-lg md:text-xl" style={{fontFamily: "monospace", color: 'var(--ink)', fontWeight: 600}}>
          <Terminal className="w-5 h-5 md:w-6 md:h-6 inline-block mr-2" style={{color: 'var(--accent)'}} />
          codenamezaxx
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="micro-label transition-opacity"
                style={{opacity: isActive ? 1 : 0.5}}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = isActive ? '1' : '0.5'}
              >
                {item.label}
              </a>
            );
          })}
          <ThemeToggleButton />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggleButton />
          <button
            className="text-ink p-2 relative z-[60]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-line overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="py-2 text-sm"
                  style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
