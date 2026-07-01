'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import SectionHeader from '../shared/SectionHeader';
import type { Project } from '@/types';
import { GithubIcon } from '../ui/Icons';

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
    <section id="projects" className="py-20 md:py-32 relative overflow-hidden">
      {/* Geo-ring */}
      <div className="geo-ring" style={{width: '35vw', height: '35vw', left: '-10%', bottom: '5%', opacity: 0.1}} />

      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '1100px'}}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader title="Projek Pilihan" subtitle="Portfolio" sectionNumber="03" center />

          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 mb-8 md:mb-16 items-stretch border border-line bg-surface-card/20`}
            >
              {/* Image — flat rectangle, taupe border, no rounding */}
              <div className="w-full md:p-8 md:w-1/2">
                <div className="relative aspect-video w-full">
                  <Image
                    src={project.image || project.imageUrl || '/images/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 space-y-5 p-4 md:p-8 self-center">
                <h3
                  className="text-2xl md:text-3xl leading-tight"
                  style={{fontFamily: "var(--font-display)", fontWeight: 600, color: 'var(--ink)'}}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)', lineHeight: 1.6}}
                >
                  {project.description}
                </p>

                {/* Tech tags — micro-label style */}
                {(project.tech || project.technologies) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(project.tech || project.technologies || []).map(tech => (
                      <span
                        key={tech}
                        className="micro-label px-3 py-1 border border-line"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action links — taupe hairline boxes */}
                <div className="flex flex-wrap gap-3 pt-3">
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-line text-sm hover:bg-white/20 transition-colors" style={{fontFamily: "'Inter', sans-serif", color: 'var(--ink)'}}>
                      <GithubIcon className="w-4 h-4 inline-block mr-2" style={{color: 'var(--ink)'}} />
                      GitHub
                    </a>
                  )}
                  {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-line bg-foreground text-sm hover:bg-foreground/80 transition-colors" style={{fontFamily: "'Inter', sans-serif", color: 'var(--background)'}}>
                      <ExternalLink className="w-4 h-4 inline-block mr-2" style={{color: 'var(--background)'}} />
                      Live Demo
                    </a>
                  )}
                  {project.links?.demo && !project.links?.live && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-line text-sm hover:bg-white/20 transition-colors" style={{fontFamily: "'Inter', sans-serif", color: 'var(--accent)'}}>
                      Demo
                    </a>
                  )}
                  {project.links?.itchio && (
                    <a href={project.links.itchio} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-line text-sm hover:bg-white/20 transition-colors" style={{fontFamily: "'Inter', sans-serif", color: 'var(--accent)'}}>
                      itch.io
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* View all button */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <button
              onClick={() => router.push('/projects')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-line text-ink bg-surface-card hover:bg-surface-card/80 transition-colors text-sm cursor-pointer"
              style={{fontFamily: "'Inter', sans-serif", fontWeight: 500}}
            >
              <Code2 className="w-4 h-4" /> Lihat Semua Proyek
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
