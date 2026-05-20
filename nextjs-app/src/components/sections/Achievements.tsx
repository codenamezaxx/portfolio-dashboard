'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import PDFPreviewCard from '../ui/PDFPreviewCard';
import SectionHeader from '../shared/SectionHeader';
import Button from '../ui/Button';
import type { Achievement } from '@/types';

interface AchievementsProps {
  items?: Achievement[];
  onViewAll?: () => void;
}

const defaultAchievements: Achievement[] = [
  { 
    id: 1, 
    title: "Memulai Pemrograman dengan Python", 
    category: "Kursus Online", 
    issuer: "Dicoding Indonesia",
    year: "2025", 
    pdfPath: "/certificates/cert-1.pdf",
    link: "https://www.dicoding.com/certificates/98XWOL0DLZM3"
  },
  { 
    id: 2, 
    title: "Belajar Dasar AI", 
    category: "Kursus Online", 
    issuer: "Dicoding Indonesia",
    year: "2025", 
    pdfPath: "/certificates/cert-2.pdf",
    link: "https://www.dicoding.com/certificates/98XWOL0DLZM3"
  },
  { 
    id: 3, 
    title: "Participant of Mercu Buana Yogyakarta International Youth Forum (MIYF) 2024", 
    category: "International Forum", 
    issuer: "Mercu Buana University Yogyakarta",
    year: "2024", 
    pdfPath: "/certificates/cert-3.pdf"
  },
  { 
    id: 4, 
    title: "Public Speaking With Trainer", 
    category: "Webinar Online", 
    issuer: "KT&G SangSang University",
    year: "2024", 
    pdfPath: "/certificates/cert-4.pdf",
  },
  { 
    id: 5, 
    title: "Building Persona and Image", 
    category: "Webinar Online", 
    issuer: "KT&G SangSang University",
    year: "2024", 
    pdfPath: "/certificates/cert-5.pdf"
  },
  { 
    id: 6, 
    title: "Youth Leadership Camps", 
    category: "Webinar Online", 
    issuer: "PT. Seasia Intelektual Akademis",
    year: "2024", 
    pdfPath: "/certificates/cert-6.pdf",
  },
];

const Achievements: React.FC<AchievementsProps> = ({ items = defaultAchievements, onViewAll }) => {
  const router = useRouter();

  return (
    <section id="achievements" className="py-20 relative bg-canvas dark:bg-canvas">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader 
            title="Pelatihan & Penghargaan" 
            subtitle="Sertifikat & highlights" 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {items.slice(0, 6).map((item) => (
              <motion.div key={item.id} variants={fadeInUp}>
                <PDFPreviewCard 
                  title={item.title}
                  category={item.category}
                  year={String(item.year)}
                  pdfPath={item.pdfPath || item.pdfUrl}
                />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center">
             <Button 
               variant="outline" 
               className="text-sm cursor-pointer relative z-10"
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 onViewAll ? onViewAll() : router.push('/certificates');
               }}
             >
                Lihat Semua Sertifikat
             </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
