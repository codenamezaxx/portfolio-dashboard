'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Eye, Gamepad2 } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectCardProps {
  project: {
    id: string | number;
    title: string;
    description: string;
    category: string;
    image?: string;
    image_url?: string;
    imageUrl?: string;
    tech?: string[];
    technologies?: string[];
    links?: {
      github?: string;
      live?: string;
      demo?: string;
      itchio?: string;
    };
    github_link?: string;
    live_link?: string;
    demo_link?: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const imageUrl = project.image || project.image_url || project.imageUrl || '/images/placeholder.jpg';
  const technologies = project.tech || project.technologies || [];
  const githubLink = project.links?.github || project.github_link;
  const liveLink = project.links?.live || project.live_link;
  const itchioLink = project.links?.itchio ||
    (project.links?.demo?.includes('itch.io') ? project.links.demo : undefined) ||
    (project.demo_link?.includes('itch.io') ? project.demo_link : undefined);
  const demoLink = project.links?.demo || project.demo_link || project.links?.itchio;
  const finalDemoLink = liveLink || demoLink;

  return (
    <div className="group border border-line bg-surface-card hover:bg-white/30 transition-colors duration-200 flex flex-col h-full">
      <div className="relative aspect-video w-full border-b border-line">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={90}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line">
            {project.category}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <h3 className="text-base font-medium text-ink line-clamp-1">{project.title}</h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line">
              {tech}
            </span>
          ))}
          {technologies.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line">+{technologies.length - 5}</span>
          )}
        </div>
        <div className="flex items-center gap-2 pt-3 mt-auto border-t border-line">
          {githubLink && (
            <button onClick={(e: React.MouseEvent) => { e.preventDefault(); window.open(githubLink, '_blank'); }} className="p-1.5 h-8 w-8 border border-line text-accent hover:bg-white/20" title="GitHub"><GithubIcon className="w-4 h-4" /></button>
          )}
          {itchioLink && (
            <button onClick={(e: React.MouseEvent) => { e.preventDefault(); window.open(itchioLink, '_blank'); }} className="p-1.5 h-8 w-8 border border-line text-accent hover:bg-white/20" title="itch.io"><Gamepad2 className="w-4 h-4" /></button>
          )}
          <div className="flex-1" />
          <Link href={`/projects/${project.id}`}>
            <button className="px-3 py-1 text-xs font-medium border border-line bg-surface-soft hover:bg-white/20 cursor-pointer">
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Detail
            </button>
          </Link>
          {finalDemoLink && (
            <button onClick={(e: React.MouseEvent) => { e.preventDefault(); window.open(finalDemoLink, '_blank'); }} className="px-3 py-1 text-xs font-medium border border-line bg-primary/10 text-ink hover:bg-primary/20 cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
