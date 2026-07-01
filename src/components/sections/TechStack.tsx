'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import SectionHeader from '@/components/shared/SectionHeader';
import type { TechStackItem } from '@/lib/portfolio-data';

interface TechStackProps {
  initialData?: TechStackItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/** Maps tech names to their display category */
const categoryMap: Record<string, string> = {
  HTML5: 'Frontend',
  CSS3: 'Frontend',
  JavaScript: 'Frontend',
  TypeScript: 'Frontend',
  React: 'Frontend',
  'Next.js': 'Frontend',
  Tailwind: 'Frontend',
  'Tailwind CSS': 'Frontend',
  'Node.js': 'Backend & Tools',
  Python: 'Backend & Tools',
  Git: 'Backend & Tools',
  GitHub: 'Backend & Tools',
  Docker: 'Backend & Tools',
  Supabase: 'Backend & Tools',
  PostgreSQL: 'Backend & Tools',
  'Godot Engine': 'Game Engines',
  Unity: 'Game Engines',
  'Unity Engine': 'Game Engines',
  'C#': 'Game Engines',
  'C++': 'Game Engines',
  'Unreal Engine': 'Game Engines',
};

const defaultCategory = 'Lainnya';

/** Category display order */
const categoryOrder = ['Frontend', 'Backend & Tools', 'Game Engines', defaultCategory];

/** Group an array of tech stack items by category */
function groupByCategory(items: TechStackItem[]): Record<string, TechStackItem[]> {
  const groups: Record<string, TechStackItem[]> = {};

  for (const item of items) {
    const category = categoryMap[item.name] ?? defaultCategory;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
  }

  return groups;
}

const TechStack: React.FC<TechStackProps> = ({ initialData = [] }) => {
  const { data, error } = useSWR('/api/content/tech-stack', fetcher, {
    fallbackData: initialData && initialData.length > 0 ? { data: initialData } : undefined,
    revalidateOnFocus: false,
  });

  const techStack: TechStackItem[] = data?.data || [];

  const groupedItems = useMemo(() => groupByCategory(techStack), [techStack]);

  /** Return categories in display order, skipping empty ones */
  const orderedCategories = useMemo(
    () => categoryOrder.filter((cat) => groupedItems[cat]?.length),
    [groupedItems],
  );

  return (
    <section id="tech" className="py-20 md:py-32 relative overflow-hidden">
      {/* Geo-ring subtle */}
      <div className="geo-ring" style={{width: '40vw', height: '40vw', right: '-15%', top: '5%', opacity: 0.1}} />

      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
        <SectionHeader title="Tech Stack" subtitle="Teknologi" sectionNumber="02" />

        {techStack.length === 0 ? (
          <div className="text-center py-12">
            <p style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>No tech stack items available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {orderedCategories.map((category) => (
              <div key={category}>
                {/* Category micro-label head */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="micro-label">{category}</span>
                  <div className="flex-1 h-px bg-line" />
                </div>

                {/* Items as agenda-style rows (like Cartesian agenda) */}
                <div>
                  {groupedItems[category].map((item: TechStackItem, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 md:gap-6 py-3 md:py-4 border-b border-line"
                    >
                      {/* Playfair numeral in taupe */}
                      <span
                        className="text-base md:text-lg w-8 md:w-10 shrink-0"
                        style={{fontFamily: "var(--font-display)", color: 'var(--accent)'}}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Icon */}
                      {item.icon ? (
                        <div className="w-8 h-8 border border-line rounded-full flex items-center justify-center shrink-0">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={16}
                            height={16}
                            className={`object-contain ${item.name === 'Next.js' ? 'dark:invert' : ''}`}
                          />
                        </div>
                      ) : (
                        <div className="card-icon shrink-0">
                          <span>{item.name[0]}</span>
                        </div>
                      )}

                      {/* Name in Playfair ink */}
                      <span
                        className="text-sm md:text-base"
                        style={{fontFamily: "var(--font-display)", color: 'var(--ink)'}}
                      >
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TechStack;
