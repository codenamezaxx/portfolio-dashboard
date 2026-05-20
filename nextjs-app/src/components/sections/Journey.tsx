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

const Journey: React.FC<JourneyProps> = ({ items = null }) => {
  // Default journey items for fallback
  const defaultJourneyItems: JourneyItem[] = [
    {
      year: '2020',
      title: 'Memulai Perjalanan',
      description: 'Memulai belajar web development dan menjadi passionate tentang teknologi.',
      display_order: 1
    },
    {
      year: '2021',
      title: 'Pertama Kali Berbicara',
      description: 'Memberikan talk pertama saya tentang web development di komunitas lokal.',
      display_order: 2
    },
    {
      year: '2022',
      title: 'Pengalaman Profesional',
      description: 'Memulai karir profesional sebagai Front-End Developer di perusahaan teknologi.',
      display_order: 3
    },
    {
      year: '2024',
      title: 'Terus Berkembang',
      description: 'Terus belajar teknologi baru dan berbagi pengetahuan dengan komunitas.',
      display_order: 4
    }
  ];

  const journeyItems = items && items.length > 0 ? items : defaultJourneyItems;

  return (
    <section id="journey" className="py-20 relative bg-canvas dark:bg-canvas">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader
            title="Tentang & Timeline"
            subtitle="Perjalanan pembelajaran saya"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeyItems.map((item, index) => (
              <motion.div key={item.id || index} variants={fadeInUp} className="h-full">
                <GlassCard className="p-6 h-full flex flex-col bg-surface-card dark:bg-surface-card border-hairline dark:border-hairline hover:border-primary/30 dark:hover:border-primary/30 transition-colors">
                  <span className="text-xl font-bold text-primary dark:text-primary mb-4 block">
                    {item.year}
                  </span>
                  <div className="relative">
                    {/* Decorative line for timeline feel */}
                    <div className="absolute -left-6 top-1 w-1 h-8 bg-primary/50 dark:bg-primary/50 rounded-r-full" />
                    <h3 className="text-display-lg font-bold text-ink dark:text-ink mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-body/70 dark:text-body/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
