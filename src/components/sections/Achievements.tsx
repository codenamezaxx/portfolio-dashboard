'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileCheck } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion';
import PDFPreviewCard from '../ui/PDFPreviewCard';
import { PDFPreview } from '../ui/PDFPreview';
import SectionHeader from '../shared/SectionHeader';
import Button from '../ui/Button';
import type { Achievement } from '@/types';

interface AchievementsProps {
  items?: Achievement[];
  onViewAll?: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ items = [], onViewAll }) => {
  const router = useRouter();
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);

  // Sort by displayOrder and take top 6 for landing page
  const featuredAchievements = [...items]
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 6);

  return (
    <section id="achievements" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <SectionHeader 
            title="Pelatihan & Penghargaan" 
            subtitle="Sertifikat & highlights" 
          />

          <div ref={constraintsRef} className="relative mb-12 overflow-hidden">
            {/* Carousel Inner Track */}
            <motion.div 
              className="flex gap-6 pb-8 pt-4 cursor-grab active:cursor-grabbing mask-fade-sides w-max"
              drag="x"
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={true}
              whileTap={{ cursor: 'grabbing' }}
            >
              {featuredAchievements.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 w-[300px] md:w-[350px] rounded-2xl dark:shadow-primary/10 shadow-xl backdrop-blur-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAchievement(item)}
                >
                  <PDFPreviewCard 
                    title={item.title}
                    category={item.category}
                    year={String(item.year)}
                    pdfPath={item.pdfPath || item.pdfUrl}
                    issuer={item.issuer}
                    link={item.link}
                    // onView prop is handled by the onClick on the motion.div parent
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Hint for scrolling */}
            <div className="mt-2 flex justify-center md:justify-start">
              <div className="flex items-center gap-2 text-xs text-mute/50 uppercase tracking-widest">
                <span>Geser untuk melihat sertifikat</span>
                <div className="w-12 h-px bg-mute/30" />
              </div>
            </div>
          </div>

          <motion.div variants={fadeInUp} className="text-center">
             <Button 
               variant="primary" 
               className="py-6 px-7 text-md font-medium shadow-xl dark:shadow-primary/20 cursor-pointer relative z-10 hover:scale-[1.05]" 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 onViewAll ? onViewAll() : router.push('/certificates');
               }}
             >
              <FileCheck className='w-4 h-4 mr-2' /> Lihat Semua Sertifikat
             </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Global PDF Preview Modal - Rendered outside the draggable container */}
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
  const pdfPath = achievement.pdfPath || achievement.pdfUrl;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-background rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-background/50 backdrop-blur-md border-b border-white/10 p-5 flex items-center justify-between">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{achievement.category}</span>
            <h3 className="text-heading-md text-foreground font-bold line-clamp-1">{achievement.title}</h3>
            {achievement.issuer && <p className="text-xs text-zinc-400">{achievement.issuer}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
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
              <p>Pratinjau sertifikat tidak tersedia.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
           <div className="text-xs text-zinc-500">
             Tahun: {achievement.year}
           </div>
           <div className="flex gap-3">
             <Button variant="secondary" onClick={onClose} className="bg-surface-card/50 !text-foreground !border-surface-soft hover:!bg-surface-soft cursor-pointer">Tutup</Button>
             {achievement.link && (
              <Button 
               onClick={
                () => window.open(achievement.link, '_blank')
                } 
               className="cursor-pointer">
                Lihat Asli
              </Button>
             )}
             {pdfPath && (
               <Button 
                 onClick={() => {
                   const a = document.createElement('a');
                   a.href = pdfPath;
                   a.download = `${achievement.title}.pdf`;
                   a.click();
                 }}
                  className="cursor-pointer"
               >
                 Unduh PDF
               </Button>
             )}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
