'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mail, Send } from 'lucide-react';
import { LinkedinIcon, InstagramIcon, GithubIcon } from '@/components/ui/Icons';
import type { Profile } from '@/types';
import type { ContactInfo } from '@/lib/portfolio-data'

interface FooterProps {
  profile?: Profile | null;
  contactInfo?: ContactInfo | null;
}

const Footer: React.FC<FooterProps> = ({ profile, contactInfo }) => {
  const contact = contactInfo || {};
  const currentYear = new Date().getFullYear();
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  const quickLinks = [
    { label: tNav('home'), href: '/#hero' },
    { label: tNav('journey'), href: '/#journey' },
    { label: tNav('projects'), href: '/#projects' },
    { label: tNav('certificates'), href: '/#certificates' },
    { label: tNav('contacts'), href: '/#contacts' },
  ];

  const socialLinks = [
    { 
      label: 'GitHub', 
      href: contact.github_url || '#', 
      icon: GithubIcon 
    },
    { 
      label: 'LinkedIn', 
      href: contact.linkedin_url || '#', 
      icon: LinkedinIcon 
    },
    { 
      label: 'Instagram', 
      href: contact.instagram_url || '#', 
      icon: InstagramIcon 
    },
    { 
      label: 'Telegram', 
      href: contact.telegram_url || '#', 
      icon: Send 
    },
  ];

  return (
    <footer className="relative bg-surface-card pt-20 pb-12 overflow-hidden border-t border-line">
      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '1100px'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl leading-tight" style={{fontFamily: "serif", fontWeight: 400, color: 'var(--ink)'}}>
              {profile?.name}
            </h2>
            <p className="text-sm leading-relaxed" style={{fontFamily: "monospace", color: 'var(--body)', lineHeight: 1.6}}>
              {profile?.role?.replace(/\s*\|\s*/g, '\n')}
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>{tFooter('quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:opacity-60 transition-opacity" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div className="space-y-4">
            <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>{tFooter('connect')}</h3>
            <ul className="space-y-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-60 transition-opacity flex items-center gap-3" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                      <Icon className="w-4 h-4" style={{color: 'var(--accent)'}} />
                      {social.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a href={`mailto:${contactInfo?.email || ''}`} className="text-sm hover:opacity-60 transition-opacity flex items-center gap-3" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                  <Mail className="w-4 h-4" style={{color: 'var(--accent)'}} />
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Tech stack */}
          <div className="space-y-4">
            <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>{tFooter('builtWith')}</h3>
            <div className="uppercase flex flex-wrap gap-3" style={{fontFamily: "monospace", color: 'var(--body)'}}>
              <span className="bg-surface-card border border-line px-2 py-1">Next.js</span>
              <span className="bg-surface-card border border-line px-2 py-1">Tailwind CSS</span>
              <span className="bg-surface-card border border-line px-2 py-1">Framer Motion</span>
              <span className="bg-surface-card border border-line px-2 py-1">Supabase</span>
              <span className="bg-surface-card border border-line px-2 py-1">Vercel</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{borderColor: 'var(--accent)'}}>
          <p className="micro-label">&copy; {currentYear} codenamezaxx</p>
          <p className="micro-label">All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
