'use client';

import React from 'react';
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
 * Cartesian editorial colophon — taupe hairline rows, Inter body, accent icons.
 */
const Contacts: React.FC<ContactsProps> = ({ contactInfo }) => {
  const contact = contactInfo || {};

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
      value: contact.email || '',
      icon: Mail,
      link: `mailto:${contact.email || ''}`,
      descriptionId: 'email',
    },
    {
      id: 2,
      label: 'LinkedIn',
      value: getHandleFromUrl(contact.linkedin_url, ''),
      icon: LinkedinIcon,
      link: contact.linkedin_url || '#',
      descriptionId: 'linkedin',
    },
    {
      id: 3,
      label: 'Instagram',
      value: getHandleFromUrl(contact.instagram_url, ''),
      icon: InstagramIcon,
      link: contact.instagram_url || '#',
      descriptionId: 'instagram',
    },
    {
      id: 4,
      label: 'Telegram',
      value: getHandleFromUrl(contact.telegram_url, ''),
      icon: Send,
      link: contact.telegram_url || '#',
      descriptionId: 'telegram',
    },
  ];

  return (
    <section id="contacts" className="py-20 md:py-32 relative border-t border-line overflow-hidden">
      {/* Geo-ring */}
      <div className="geo-ring" style={{width: '35vw', height: '35vw', right: '-10%', top: '-5%', opacity: 0.08}} />

      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader title="Hubungi Saya" subtitle="Kontak" sectionNumber="05" hideLine />

          {/* Opening */}
          <motion.p
            variants={fadeInUp}
            className="text-center max-w-lg mx-auto mb-16 text-sm md:text-base leading-relaxed"
            style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)', lineHeight: 1.6}}
          >
            Tertarik untuk berkolaborasi? Hubungi saya melalui platform berikut.
          </motion.p>

          {/* Contact list — taupe hairline rows */}
          <div className="max-w-lg mx-auto mb-16">
            {contactMethods.map((method, i) => {
              const IconComponent = method.icon;
              return (
                <motion.a
                  key={method.id}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  className={`flex items-center gap-4 py-5 border-t border-line hover:bg-white/20 transition-colors px-4 ${i === contactMethods.length - 1 ? 'border-b border-line' : ''}`}
                  aria-label={`Contact via ${method.label}`}
                >
                  <IconComponent className="w-5 h-5 shrink-0" style={{color: 'var(--accent)'}} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <span className="block micro-label text-xs">{method.label}</span>
                    <span className="block text-sm mt-0.5 truncate" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                      {method.value}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 shrink-0" style={{color: 'var(--accent)'}} aria-hidden="true" />
                </motion.a>
              );
            })}
          </div>

          {/* Closing */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-sm leading-relaxed"
            style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}
          >
            Terima kasih telah berkunjung.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contacts;
