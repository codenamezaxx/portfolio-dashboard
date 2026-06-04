'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import Button from '../ui/Button';
import SectionHeader from '../shared/SectionHeader';
import ProjectCard from '../ui/ProjectCard';
import type { Project } from '@/types';

interface ProjectsProps {
  items?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ items = [] }) => {
  const router = useRouter();

  // Sort by displayOrder and take top 4 for landing page
  const featuredProjects = [...items]
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 4);

  return (
    <section id="projects" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader
            title="Projek Pilihan"
            subtitle="Portfolio"
            center={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="group relative transition-all duration-300 h-full"
            >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <Button 
              variant="primary" 
              className='py-6 px-7 text-md font-medium dark:shadow-primary/20 shadow-xl hover:scale-[1.05] transition-transform duration-300 cursor-pointer'
              onClick={() => router.push('/projects')}
              >
              <Code2 className="w-4 h-4 mr-2" /> Lihat Semua Proyek
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
