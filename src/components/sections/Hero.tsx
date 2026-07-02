'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileSearchCorner, ArrowRight } from 'lucide-react';
import { LinkedinIcon, InstagramIcon, GithubIcon } from '@/components/ui/Icons';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { Profile, ContactInfo } from '@/lib/portfolio-data';

interface HeroProps {
  profile?: (Profile & { status_label?: string }) | null;
  contactInfo?: ContactInfo | null;
}

/**
 * Hero Component — Biennale Yellow editorial cover-spread aesthetic.
 * Typography-driven, flat surfaces, single ink color, no rounded corners.
 */
const Hero: React.FC<HeroProps> = ({ profile, contactInfo }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [liveResumeUrl, setLiveResumeUrl] = useState<string | null>(null);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const profileData = profile || {
    name: '',
    role: '',
    tagline: '',
    status_label: '',
    hero_image_url: ''
  };
  const contactData = contactInfo || {};

  // Use prop value initially, but we'll fetch a fresh one to avoid ISR cache issues
  const resumeUrl = liveResumeUrl || profileData.resume_url;

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch(`/api/portfolio/resume?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.resume_url) {
            setLiveResumeUrl(data.resume_url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch live resume URL:', error);
      }
    };

    fetchResumeUrl();
  }, []);

  // Roles array (split by |)
  const roles = React.useMemo(() =>
    (profileData.role || 'Fullstack Developer | Network Engineer').split('|').map(r => r.trim()),
    [profileData.role]
  );

  // Cycling typewriter: type → pause → erase → next role
  useEffect(() => {
    let currentIndex = 0;
    let roleIdx = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      const role = roles[roleIdx];
      if (currentIndex < role.length) {
        setDisplayedRole(role.slice(0, currentIndex + 1));
        currentIndex++;
        setIsPaused(false);
        timer = setTimeout(typeNext, 45 + Math.random() * 35);
      } else {
        // Done typing — pause then erase
        setIsPaused(true);
        timer = setTimeout(erasePrev, 2000);
      }
    };

    const erasePrev = () => {
      const role = roles[roleIdx];
      if (currentIndex > 0) {
        setDisplayedRole(role.slice(0, currentIndex - 1));
        currentIndex--;
        setIsPaused(false);
        timer = setTimeout(erasePrev, 25 + Math.random() * 15);
      } else {
        // Done erasing — move to next role
        setIsPaused(true);
        roleIdx = (roleIdx + 1) % roles.length;
        timer = setTimeout(typeNext, 400);
      }
    };

    // Initial delay before first type
    timer = setTimeout(typeNext, 700);

    return () => clearTimeout(timer);
  }, [roles]);


  const handleViewResume = async () => {
    if (!resumeUrl) {
      alert('Resume tidak tersedia. Silakan hubungi admin.');
      return;
    }

    setIsActionLoading(true);
    try {
      const viewUrl = `/api/portfolio/resume?view=true&t=${Date.now()}`;
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Failed to view resume:', error);
      alert('Gagal menampilkan resume. Silakan coba lagi.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 pb-12 overflow-hidden">
      {/* Vertical line — drafting alignment guide */}
      <div className="vline" style={{right: '5vw', backgroundColor: 'var(--accent-blue)'}} />

      {/* Geo-ring — compass decoration right side */}
      <div className="geo-ring" style={{width: '46vw', height: '46vw', left: '-2vw', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, borderColor: 'var(--accent-blue)'}}>
        <div className="geo-ring dashed" style={{inset: '14%', position: 'absolute', border: '1px dashed var(--line)', borderRadius: '50%', opacity: 0.6, borderColor: 'var(--accent-blue)'}} />
      </div>

      <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '1280px'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center">

          {/* Left Column: Image + Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 flex flex-col items-center lg:items-start mb-4 lg:mb-0 lg:ml-32"
          >
            <div className="relative w-full max-w-70 lg:max-w-sm mx-auto lg:ml-0 lg:mr-auto">
              <div className="relative dark:brightness-90 contrast-120 dark:contrast-130 saturate-90 aspect-3/4 border-b-5 border-line">
                <Image
                  src={profileData.hero_image_url || '/hero.jpg'}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />
              </div>
            </div>

            {/* Meta row (Cartesian cover style) */}
            <div className="flex gap-8 md:gap-16 mt-8">
              <div>
                <div className="text-lg" style={{fontFamily: "var(--font-display)", color: "var(--ink)"}}>
                  Jawa Timur, Indonesia
                </div>
                <div className="micro-label mt-1" style={{color: "var(--accent-red)"}}>
                  Lokasi
                </div>
              </div>
              <div>
                <div className="text-lg" style={{fontFamily: "var(--font-display)", color: "var(--ink)"}}>
                  {new Date().getFullYear() - 2025}+ Tahun
                </div>
                <div className="micro-label mt-1" style={{color: "var(--accent-red)"}}>
                  Pengalaman
                </div>
              </div>
            </div>

            {/* Social links — just taupe text links */}
            <div className="flex items-center gap-6 mt-8">
              {contactData.github_url && (
                <a href={contactData.github_url} target="_blank" rel="noopener noreferrer" className="micro-label hover:opacity-60 transition-opacity">
                  <GithubIcon className="w-4 h-4 inline-block mr-1" style={{color: 'var(--accent)'}} />
                  GitHub
                </a>
              )}
              {contactData.linkedin_url && (
                <a href={contactData.linkedin_url} target="_blank" rel="noopener noreferrer" className="micro-label hover:opacity-60 transition-opacity">
                  <LinkedinIcon className="w-4 h-4 inline-block mr-1" style={{color: 'var(--accent)'}} />
                  LinkedIn
                </a>
              )}
              {contactData.instagram_url && (
                <a href={contactData.instagram_url} target="_blank" rel="noopener noreferrer" className="micro-label hover:opacity-60 transition-opacity">
                  <InstagramIcon className="w-4 h-4 inline-block mr-1" style={{color: 'var(--accent)'}} />
                  Instagram
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="order-2 flex flex-col items-start text-left w-full space-y-6 max-w-2xl"
          >
            {/* Label eyebrow */}
            {profileData.status_label && (
              <motion.span variants={fadeInUp} className="label" style={{color: "var(--accent-red)"}}>
                {profileData.status_label}
              </motion.span>
            )}

            {/* Name as Playfair h1 */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl leading-[1.06] max-w-xl"
              style={{fontFamily: "serif", fontWeight: 400, color: "var(--ink)"}}
            >
              Hi, I&apos;m <em style={{fontStyle: 'italic'}}>{profileData.name}</em>
            </motion.h1>

            {/* Role subtitle — typewriter */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-2xl leading-loose max-w-md min-h-[1.6em]"
              style={{fontFamily: "monospace", color: "var(--accent-red)", lineHeight: 1.6, letterSpacing: '1px'}}
            >
              {displayedRole}
              {!isPaused && <span style={{color: 'var(--accent-red)', animation: 'blink 0.8s step-end infinite'}}>_</span>}
            </motion.p>

            {/* Tagline */}
            {profileData.tagline && (
              <motion.p
                variants={fadeInUp}
                className="text-sm md:text-md leading-relaxed max-w-lg"
                style={{fontFamily: "'Inter', sans-serif", color: "var(--body)", lineHeight: 1.6}}
              >
                {profileData.tagline}
              </motion.p>
            )}

            {/* Horizontal accent — the one ink-black rule */}
            <motion.div variants={fadeInUp} className="haccent my-4" />

            {/* Action links */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-line bg-foreground text-background hover:bg-foreground/70 transition-colors text-sm"
                style={{fontFamily: "'Inter', sans-serif", fontWeight: 500}}
              >
                Lihat Proyek <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleViewResume}
                disabled={isActionLoading || !resumeUrl}
                className="inline-flex items-center gap-2 px-6 py-3 border border-line text-ink hover:bg-white/20 transition-colors text-sm disabled:opacity-30 cursor-pointer"
                style={{fontFamily: "'Inter', sans-serif", fontWeight: 500}}
              >
                {isActionLoading ? 'Memuat...' : 'Lihat CV'} <FileSearchCorner className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
