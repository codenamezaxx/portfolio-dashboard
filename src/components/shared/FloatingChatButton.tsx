'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, MessageCircleMore } from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '@/components/ui/Icons';


interface ContactOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  url: string;
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('floatingButton');

  // Hide on admin routes and login page
  if (pathname?.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      icon: <Mail className="w-4 h-4" style={{color: 'var(--accent)'}} />,
      label: 'Email',
      url: 'mailto:zakky.ahmad@protonmail.com',
    },
    {
      id: 'linkedin',
      icon: <LinkedinIcon className="w-4 h-4" style={{color: 'var(--accent)'}} />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/zakky-el',
    },
    {
      id: 'instagram',
      icon: <InstagramIcon className="w-4 h-4" style={{color: 'var(--accent)'}} />,
      label: 'Instagram',
      url: 'https://instagram.com/codenamezaxx',
    },
    {
      id: 'telegram',
      icon: <Send className="w-4 h-4" style={{color: 'var(--accent)'}} />,
      label: 'Telegram',
      url: 'https://t.me/codenamezaxx',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, ease: 'linear' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'linear' },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, ease: 'linear' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'linear' },
    },
  } as const;

  return (
    <div className="fixed bottom-8 right-6 md:right-10 z-40">
      {/* Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col gap-4">
              {contactOptions.map((option) => (
                <motion.a
                  key={option.id}
                  href={option.url}
                  target={option.id !== 'email' ? '_blank' : undefined}
                  rel={option.id !== 'email' ? 'noopener noreferrer' : undefined}
                  variants={itemVariants}
                  className="flex items-center gap-2 px-4 py-2 border border-line bg-background hover:bg-white/20 text-ink"
                >
                  {option.icon}
                  <span className="text-sm" style={{fontFamily: "'Inter', sans-serif"}}>{option.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 border border-line bg-foreground/75 text-background hover:bg-foreground/90 cursor-pointer"
      >
        <MessageCircleMore className="w-4 h-4" />
        <span className="text-sm" style={{fontFamily: "'Inter', sans-serif"}}>{t('contact')}</span>
      </motion.button>
    </div>
  );
}
