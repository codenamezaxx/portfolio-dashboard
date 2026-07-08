/**
 * Project Detail Page
 * Displays detailed information about a specific project
 */

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getProjects } from '@/lib/portfolio-data';
import { ArrowLeft, ExternalLink, Gamepad2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      id: project.id?.toString() || ''
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata(
  { params }: ProjectDetailPageProps
): Promise<Metadata> {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return {
        title: 'Proyek Tidak Ditemukan',
        description: 'Proyek yang Anda cari tidak ada.'
      };
    }
    return {
      title: `${project.title} | Zakky Ahmad El-Kholily`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        type: 'website',
        images: project.image_url ? [{ url: project.image_url }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: project.image_url ? [project.image_url] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Proyek', description: 'Detail proyek' };
  }
}

export const revalidate = 3600;

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  
  const { id } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value === 'en' ? 'en' : 'id';
  const project = await getProjectById(id, locale);
  if (!project) notFound();

  const allProjects = await getProjects(locale);
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
      <main className="relative min-h-screen bg-background pb-20 overflow-hidden">
        {/* <BackgroundGrid /> */}

        {/* Hero Section */}
        {project.image_url && (
          <div className="relative h-[60vh] flex items-end">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-mute hover:text-primary text-sm border border-line px-3 py-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Proyek
                </Link>
                <ThemeToggleButton />
              </div>
              <span className="bg-primary/10 text-primary border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] mb-3 inline-block">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-body text-lg max-w-2xl leading-relaxed opacity-90">
                {project.description}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8 p-6 border border-line bg-surface-card">
              <h2 className="text-base font-medium text-ink mb-4">Teknologi yang Digunakan</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="mb-8 p-6 border border-line bg-surface-card">
            <h2 className="text-base font-medium text-ink mb-4">Tautan Proyek</h2>
            <div className="flex flex-wrap gap-3">
              {project.github_link && (
                <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 border border-line text-sm text-accent hover:bg-white/20">
                    <GithubIcon className="w-4 h-4 inline-block mr-1.5" /> GitHub
                  </button>
                </a>
              )}
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 border border-line bg-primary/10 text-ink text-sm hover:bg-primary/20">
                    <ExternalLink className="w-4 h-4 inline-block mr-1.5" /> Live Demo
                  </button>
                </a>
              )}
              {project.demo_link && (
                <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 border border-line text-sm text-accent hover:bg-white/20">
                    <Gamepad2 className="w-4 h-4 inline-block mr-1.5" /> Main Game
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-6 border-t border-line">
            {previousProject ? (
              <Link href={`/projects/${previousProject.id}`} className="px-4 py-3 border border-line text-sm text-accent hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 inline-block mr-1.5" />
                <span className="truncate">Prev: {previousProject.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link href={`/projects/${nextProject.id}`} className="px-4 py-3 border border-line text-sm text-accent hover:bg-white/20 text-right">
                <span className="truncate">Next: {nextProject.title}</span>
                <ArrowLeft className="w-4 h-4 inline-block ml-1.5 rotate-180" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    );
}
