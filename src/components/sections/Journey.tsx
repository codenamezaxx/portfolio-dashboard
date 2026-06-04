'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../shared/SectionHeader';
import type { JourneyItem } from '@/lib/portfolio-data';

interface JourneyProps {
  items?: JourneyItem[] | null;
}

const Journey: React.FC<JourneyProps> = ({ items = [] }) => {
  const constraintsRef = React.useRef<HTMLDivElement>(null);

  const journeyItems = items || [];

  return (
    <section id="journey" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <SectionHeader
            title="Tentang & Timeline"
            subtitle="Perjalanan pembelajaran saya"
          />

          <div ref={constraintsRef} className="relative overflow-hidden">
            {/* Carousel Inner Track */}
            <motion.div 
              className="flex gap-6 pb-8 pt-4 cursor-grab active:cursor-grabbing w-max"
              drag="x"
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={true}
              whileTap={{ cursor: 'grabbing' }}
            >
              {journeyItems.map((item, index) => (
                <motion.div 
                  key={item.id || index} 
                  variants={fadeInUp} 
                  whileHover={{ y: -10}}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 w-[300px] md:w-[380px]"
                >
                  <GlassCard className="py-6 px-8 h-[290px] flex flex-col border-white/5 shadow-soft-light dark:shadow-primary/10 shadow-xl backdrop-blur-md rounded-3xl transition-all duration-300">
                    <span className="text-2xl font-black text-primary mb-6 block tracking-tight">
                      {item.year}
                    </span>
                    <div className="relative">
                      {/* Decorative line for timeline feel - Refined */}
                      <div className="absolute -left-8 top-1.5 w-1.5 h-8 bg-primary/30 rounded-r-full" />
                      <h3 className="text-2xl font-extrabold text-ink mb-3 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-body-sm text-body/80 leading-relaxed line-clamp-4 font-medium">
                        {item.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Hint for scrolling */}
            <div className="mt-4 flex justify-center md:justify-start">
              <div className="flex items-center gap-2 text-xs text-mute/50 uppercase tracking-widest">
                <span>Geser untuk melihat lebih banyak</span>
                <div className="w-12 h-px bg-mute/30" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
