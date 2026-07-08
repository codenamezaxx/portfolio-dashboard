'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Terminal, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { useLocale } from '@/hooks/useLocale';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { locale, toggleLocale } = useLocale();
  const t = useTranslations('nav');
  const tLocale = useTranslations('locale');

  const NAV_ITEMS = [
    { label: t('home'), href: "#hero" },
    { label: t('journey'), href: "#journey" },
    { label: t('tech'), href: "#tech" },
    { label: t('projects'), href: "#projects" },
    { label: t('certificates'), href: "#certificates" },
    { label: t('contacts'), href: "#contacts" },
  ];

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
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{backgroundColor: 'var(--hairline)'}} />
      
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
                className="micro-label transition-opacity hover:opacity-80"
                style={{opacity: isActive ? 1 : 0.7, color: isActive ? 'var(--accent-red)' : 'var(--body)'}}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive ? 'var(--accent-red)' : 'var(--body)'}
              >
                {item.label}
              </a>
            );
          })}
          <ThemeToggleButton />
          <button
            onClick={toggleLocale}
            className="micro-label px-3 py-2 border border-line hover:border-primary/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            style={{color: 'var(--body)'}}
            title={tLocale('switchTo')}
          >
            <Globe className="w-3.5 h-3.5" />
            {locale === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggleButton />
          <button
            onClick={toggleLocale}
            className="px-2 py-1 border border-line hover:border-primary/40 transition-colors"
            title={tLocale('switchTo')}
          >
            <span className="text-sm">{locale === 'id' ? 'EN' : 'ID'}</span>
          </button>
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
