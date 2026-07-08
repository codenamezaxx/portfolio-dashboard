'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileCheck } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion';
import PDFPreviewCard from '../ui/PDFPreviewCard';
import { PDFPreview } from '../ui/PDFPreview';
import SectionHeader from '../shared/SectionHeader';
import { useTranslations } from 'next-intl';
import type { Achievement } from '@/types';

interface AchievementsProps {
  items?: Achievement[];
  onViewAll?: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ items = [], onViewAll }) => {
  const router = useRouter();
  const tSection = useTranslations('section');
  const tAchieve = useTranslations('achievements');
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);

  // Sort by displayOrder and take top 6 for landing page
  const featuredAchievements = [...items]
    .sort((a, b) => {
      const orderA = a.displayOrder ?? (a as any).display_order ?? 0;
      const orderB = b.displayOrder ?? (b as any).display_order ?? 0;
      return orderA - orderB;
    })
    .slice(0, 6);

  return (
    <section id="certificates" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader 
            title={tSection('achievements')} 
            subtitle={tSection('achievementsSubtitle')}
            sectionNumber="04"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredAchievements.map((item) => (
              <motion.div 
                key={item.id} 
                variants={fadeInUp}
                className="border border-line bg-surface-card cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => setSelectedAchievement(item)}
              >
                <PDFPreviewCard 
                  title={item.title}
                  category={item.category}
                  year={item.year ? String(item.year) : ''}
                  pdfPath={item.pdfPath || item.pdfUrl || (item as any).pdf_url}
                  issuer={item.issuer}
                  link={item.link || (item as any).external_link || (item as any).link}
                  onView={() => setSelectedAchievement(item)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewAll ? onViewAll() : router.push('/certificates');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-line text-ink bg-surface-card hover:bg-surface-card/80 transition-colors cursor-pointer text-sm"
              style={{fontFamily: "'Inter', sans-serif", fontWeight: 500}}
            >
              <FileCheck className='w-4 h-4' /> {tAchieve('viewAll')}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Global PDF Preview Modal */}
      {selectedAchievement && (
        <AchievementModal 
          achievement={selectedAchievement} 
          onClose={() => setSelectedAchievement(null)} 
        />
      )}
    </section>
  );
};

// Internal Modal Component for clean hierarchy
const AchievementModal: React.FC<{ achievement: Achievement, onClose: () => void }> = ({ achievement, onClose }) => {
  const tAchieve = useTranslations('achievements');
  const pdfPath = achievement.pdfPath || achievement.pdfUrl || (achievement as any).pdf_url;
  
  return (
     <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-background max-w-5xl w-full max-h-[90vh] overflow-hidden border border-line flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-background border-b border-line p-5 flex items-center justify-between">
          <div className="flex-1">
            <span className="label">{achievement.category}</span>
            <h3 className="display-serif text-heading-md line-clamp-1">{achievement.title}</h3>
            {achievement.issuer && <p className="text-xs text-zinc-400">{achievement.issuer}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border border-line flex items-center justify-center hover:bg-white/10 transition-colors text-ink"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Modal Content - PDF Viewer Area */}
        <div className="flex-1 overflow-auto bg-background relative p-2 md:p-4">
          {pdfPath ? (
            <div className="w-full h-full min-h-[500px]">
              <PDFPreview
                url={pdfPath}
                filename={`${achievement.title}.pdf`}
                maxHeight="100%"
                className="w-full h-full bg-background"
                showDownload={false}
                showPageInfo={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-zinc-500">
              <span className="text-4xl mb-4">📄</span>
              <p>{tAchieve('previewUnavailable')}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-background border-t border-line flex flex-wrap justify-between items-center gap-4">
           <div className="text-xs text-zinc-500">
             {tAchieve('year')}: {achievement.year}
           </div>
           <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-line text-xs text-ink hover:bg-white/10 transition-colors cursor-pointer"
              >
                {tAchieve('close')}
              </button>
              {achievement.link && (
                <button
                  onClick={() => window.open(achievement.link, '_blank')}
                  className="px-4 py-2 border border-line text-xs text-ink hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {tAchieve('viewOriginal')}
                </button>
              )}
              {pdfPath && (
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = pdfPath;
                    a.download = `${achievement.title}.pdf`;
                    a.click();
                  }}
                  className="px-4 py-2 border border-line text-xs text-ink hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {tAchieve('downloadPdf')}
                </button>
              )}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
