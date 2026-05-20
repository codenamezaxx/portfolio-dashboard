'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

interface FooterProps {
  year?: number;
}

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="py-8 border-t border-hairline dark:border-hairline text-center text-body dark:text-body text-body-sm bg-canvas dark:bg-canvas">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        © {year} | Made by codenamezaxx.
      </motion.p>
    </footer>
  );
};

export default Footer;
