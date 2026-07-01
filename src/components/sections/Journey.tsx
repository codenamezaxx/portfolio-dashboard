'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';

import SectionHeader from '../shared/SectionHeader';
import type { JourneyItem } from '@/lib/portfolio-data';

interface JourneyProps {
  items?: JourneyItem[] | null;
}

const Journey: React.FC<JourneyProps> = ({ items = [] }) => {
  const journeyItems = items || [];

  return (
    <section id="journey" className="py-20 md:py-32 relative overflow-hidden">
      {/* Geo-ring subtle atmosphere */}
      <div className="geo-ring" style={{width: '50vw', height: '50vw', left: '-20%', bottom: '-10%', opacity: 0.12}} />

      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <SectionHeader
            title="Perjalanan"
            subtitle="Timeline"
            sectionNumber="01"
          />

          {/* Timeline — 1px taupe top rule, no nodes, no cards */}
          <div className="border-t border-line">
            {journeyItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                variants={fadeInUp}
                className="border-b border-line py-6 md:py-8"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
                  {/* Year in accent/taupe */}
                  <span
                    className="text-xs uppercase tracking-[2px] font-medium shrink-0 pt-0.5"
                    style={{fontFamily: "'Inter', sans-serif", color: 'var(--accent)'}}
                  >
                    {item.year}
                  </span>
                  <div className="flex-1">
                    {/* Title in Playfair Display */}
                    <h3
                      className="text-lg md:text-xl leading-snug"
                      style={{fontFamily: "var(--font-display)", fontWeight: 400, color: 'var(--ink)'}}
                    >
                      {item.title}
                    </h3>
                    {/* Description in Inter gray */}
                    {item.description && (
                      <p
                        className="text-sm md:text-base leading-relaxed mt-2"
                        style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)', lineHeight: 1.6}}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
