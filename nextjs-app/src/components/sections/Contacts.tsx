'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowUpRight } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '@/components/ui/Icons';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import SectionHeader from '../shared/SectionHeader';
import type { ContactInfo } from '@/lib/portfolio-data';

interface ContactsProps {
  contactInfo?: ContactInfo | null;
}

/**
 * Contacts Component (Footer)
 * Displays contact methods with custom colored cards, icon circles, and handles matching design specifications
 */
const Contacts: React.FC<ContactsProps> = ({ contactInfo }) => {
  const defaultContactInfo: ContactInfo = {
    email: 'zakky.ahmad@protonmail.com',
    github_url: 'https://github.com/codenamezaxx',
    linkedin_url: 'https://linkedin.com/in/zakky-el',
    instagram_url: 'https://instagram.com/codenamezaxx',
    telegram_url: 'https://t.me/codenamezaxx'
  };

  const contact = contactInfo || defaultContactInfo;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getHandleFromUrl = (url: string | undefined, defaultValue: string) => {
    if (!url) return defaultValue;
    try {
      const cleanUrl = url.split('?')[0].replace(/\/$/, '');
      const parts = cleanUrl.split('/');
      const lastPart = parts[parts.length - 1];
      return lastPart ? `@${lastPart}` : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const contactMethods = [
    {
      id: 1,
      label: 'Email',
      value: contact.email || 'zakky.ahmad@protonmail.com',
      icon: Mail,
      link: `mailto:${contact.email || 'zakky.ahmad@protonmail.com'}`,
      descriptionId: 'email',
      colors: {
        bg: 'rgba(30, 58, 138, 0.15)',
        bgHover: 'rgba(30, 58, 138, 0.3)',
        border: 'rgba(59, 130, 246, 0.2)',
        borderHover: 'rgba(59, 130, 246, 0.5)',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        text: '#60a5fa',
      }
    },
    {
      id: 2,
      label: 'LinkedIn',
      value: getHandleFromUrl(contact.linkedin_url, '@zakky-el'),
      icon: LinkedinIcon,
      link: contact.linkedin_url || 'https://linkedin.com/in/zakky-el',
      descriptionId: 'linkedin',
      colors: {
        bg: 'rgba(17, 47, 54, 0.2)',
        bgHover: 'rgba(17, 47, 54, 0.35)',
        border: 'rgba(20, 184, 166, 0.2)',
        borderHover: 'rgba(20, 184, 166, 0.5)',
        iconBg: 'rgba(20, 184, 166, 0.15)',
        text: '#2dd4bf',
      }
    },
    {
      id: 3,
      label: 'Instagram',
      value: getHandleFromUrl(contact.instagram_url, '@codenamezaxx'),
      icon: InstagramIcon,
      link: contact.instagram_url || 'https://instagram.com/codenamezaxx',
      descriptionId: 'instagram',
      colors: {
        bg: 'rgba(54, 30, 54, 0.2)',
        bgHover: 'rgba(54, 30, 54, 0.35)',
        border: 'rgba(236, 72, 153, 0.2)',
        borderHover: 'rgba(236, 72, 153, 0.5)',
        iconBg: 'rgba(236, 72, 153, 0.15)',
        text: '#f472b6',
      }
    },
    {
      id: 4,
      label: 'Telegram',
      value: getHandleFromUrl(contact.telegram_url, '@codenamezaxx'),
      icon: Send,
      link: contact.telegram_url || 'https://t.me/codenamezaxx',
      descriptionId: 'telegram',
      colors: {
        bg: 'rgba(16, 42, 54, 0.2)',
        bgHover: 'rgba(16, 42, 54, 0.35)',
        border: 'rgba(6, 182, 212, 0.2)',
        borderHover: 'rgba(6, 182, 212, 0.5)',
        iconBg: 'rgba(6, 182, 212, 0.15)',
        text: '#22d3ee',
      }
    },
  ];

  return (
    <section id="contacts" className="py-20 md:py-32 relative bg-canvas dark:bg-canvas border-t border-hairline dark:border-hairline">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader
            title="Hubungi Saya"
            subtitle="Kontak"
          />

          {/* Intro Text */}
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-body-md text-body dark:text-body leading-relaxed">
              Tertarik untuk berkolaborasi atau memiliki pertanyaan? Jangan ragu untuk menghubungi saya melalui salah satu platform di bawah ini.
            </p>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              const isHovered = hoveredId === method.id;
              
              return (
                <motion.a
                  key={method.id}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  onMouseEnter={() => setHoveredId(method.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    backgroundColor: isHovered ? method.colors.bgHover : method.colors.bg,
                    borderColor: isHovered ? method.colors.borderHover : method.colors.border,
                  }}
                  className="group relative rounded-lg border p-6 overflow-hidden transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  aria-label={`Contact via ${method.label}`}
                  aria-describedby={method.descriptionId}
                >
                  {/* Background Accent Glow */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-2xl -mr-16 -mt-16" 
                    style={{ backgroundColor: method.colors.text }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Circle Icon Container */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: method.colors.iconBg, 
                        color: method.colors.text 
                      }}
                    >
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>

                    {/* Text Content */}
                    <div>
                      <h3 className="text-heading-md font-bold text-ink dark:text-ink mb-1">
                        {method.label}
                      </h3>
                      <p 
                        className="text-body-sm mb-4 transition-colors duration-300" 
                        style={{ color: method.colors.text }}
                        id={method.descriptionId}
                      >
                        {method.value}
                      </p>
                    </div>

                    {/* Arrow Icon & Button Text */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[10px] uppercase font-bold tracking-wider transition-colors duration-300"
                        style={{ color: method.colors.text }}
                      >
                        Hubungi
                      </span>
                      <ArrowUpRight 
                        className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                        style={{ color: method.colors.text }}
                        aria-hidden="true" 
                      />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Footer Note */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-body-sm text-body dark:text-body mt-12"
          >
            Terima kasih atas kunjungan Anda! Saya menantikan kesempatan untuk terhubung dan bekerja sama dengan Anda.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contacts;
