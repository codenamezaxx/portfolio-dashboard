'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  center?: boolean;
  sectionNumber?: string;
  hideLine?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, subtitle, center = false, sectionNumber, hideLine = false }) => {
  return (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
      {/* Section header with number + title + spacer + label (Cartesian style) */}
      <div className="flex items-baseline gap-6 mb-6">
        {sectionNumber && (
          <span className="display-serif text-xl md:text-2xl" style={{color: 'var(--accent-red)'}}>
            {sectionNumber}
          </span>
        )}
        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-5xl"
          style={{fontFamily: "serif", fontWeight: 400, color: "var(--ink)"}}
        >
          {title}
        </motion.h2>
        {!center && !hideLine && <div className="flex-1 mt-5 h-px self-center" style={{opacity: 0.7, backgroundColor: 'var(--accent)'}} />}
        <motion.span
          variants={fadeInUp}
          className="label hidden md:block"
          style={{color: 'var(--accent-red)'}}
        >
          {subtitle}
        </motion.span>
      </div>
      {description && (
        <motion.p
          variants={fadeInUp}
          className="mt-4 text-base leading-relaxed max-w-2xl"
          style={{color: 'var(--body)'}}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;
