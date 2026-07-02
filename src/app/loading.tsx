'use client';

import { useEffect } from 'react';
import "@aejkatappaja/phantom-ui";

/**
 * Loading UI for Next.js App Router
 * Uses phantom-ui: renders the actual page structure with placeholder content.
 * The Web Component measures the DOM and overlays shimmer blocks automatically.
 * No separate skeleton components to maintain.
 */
export default function Loading() {
  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  return (
    <phantom-ui
      loading
      animation="shimmer"
      background-color="rgba(128,128,128,0.06)"
      shimmer-color="rgba(200,200,200,0.10)"
      reveal={0.3}
    >
      <div className="min-h-screen flex flex-col">

        {/* ============ NAVBAR ============ */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-24 bg-transparent">
          <div className="flex items-center gap-8 lg:gap-12">
            <span className="text-lg" style={{fontFamily: 'monospace', color: 'var(--ink)'}}>
              {'>'} codenamezaxx
            </span>
            <div className="hidden md:flex items-center gap-6">
              {['Beranda', 'Perjalanan', 'Tech Stack', 'Proyek', 'Sertifikat', 'Kontak'].map((item) => (
                <span key={item} className="text-xs uppercase tracking-[0.15em]" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme toggle placeholder */}
            <div className="w-9 h-9 border border-line" />
            {/* Hamburger placeholder */}
            <div className="md:hidden w-9 h-9 border border-line flex items-center justify-center">
              <div className="w-4 h-0.5 bg-line" />
            </div>
          </div>
        </nav>

        <main className="flex flex-1 flex-col">
          {/* ============ HERO ============ */}
          <section className="relative min-h-screen flex items-center justify-center pt-16 pb-12 overflow-hidden">
            {/* Vertical line & geo-ring — match real Hero */}
            <div className="vline" style={{right: '5vw', backgroundColor: 'var(--accent-blue)'}} />
            <div className="geo-ring" style={{width: '46vw', height: '46vw', left: '-2vw', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, borderColor: 'var(--accent-blue)'}} />

            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '1280px'}}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center">

                {/* Left Column: Image + Meta (order-1 — matches real Hero) */}
                <div className="order-1 flex flex-col items-center lg:items-start mb-4 lg:mb-0 lg:ml-32">
                  <div className="relative w-full max-w-70 lg:max-w-sm mx-auto lg:ml-0 lg:mr-auto">
                    <div className="relative aspect-3/4 border-b-5 border-line bg-surface-card/40" />
                  </div>

                  {/* Meta row */}
                  <div className="flex gap-8 md:gap-16 mt-8">
                    <div>
                      <div className="text-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>
                        Jawa Timur, Indonesia
                      </div>
                      <div className="micro-label mt-1" style={{color: 'var(--accent-red)'}}>
                        Lokasi
                      </div>
                    </div>
                    <div>
                      <div className="text-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>
                        1+ Tahun
                      </div>
                      <div className="micro-label mt-1" style={{color: 'var(--accent-red)'}}>
                        Pengalaman
                      </div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-6 mt-8">
                    <span className="micro-label">GitHub</span>
                    <span className="micro-label">LinkedIn</span>
                    <span className="micro-label">Instagram</span>
                  </div>
                </div>

                {/* Right Column: Text content (order-2 — matches real Hero) */}
                <div className="order-2 flex flex-col items-start text-left w-full space-y-6 max-w-2xl">
                  <span className="label" style={{color: 'var(--accent-red)'}}>
                    Status Label
                  </span>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.06] max-w-xl" style={{fontFamily: 'serif', fontWeight: 400, color: 'var(--ink)'}}>
                    Hi, I&apos;m <em style={{fontStyle: 'italic'}}>Zakky Ahmad</em>
                  </h1>

                  <p className="text-lg md:text-2xl" style={{fontFamily: 'monospace', color: 'var(--accent-red)'}}>
                    Role description
                  </p>

                  <p className="text-sm md:text-md leading-relaxed max-w-lg" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                    Tagline description content. Some brief text about skills and expertise goes here for measurement.
                  </p>

                  <div className="haccent my-4" />

                  <div className="flex flex-wrap gap-4 pt-2">
                    <span className="px-6 py-3 border border-line text-sm">Lihat Proyek</span>
                    <span className="px-6 py-3 border border-line text-sm">Lihat CV</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ============ JOURNEY (01) ============ */}
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="geo-ring" style={{width: '50vw', height: '50vw', left: '-20%', bottom: '-10%', opacity: 0.12}} />
            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
              <div className="text-center mb-12">
                <p className="label mb-2" style={{color: 'var(--accent)'}}>01</p>
                <h2 className="display-serif text-heading-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>Perjalanan</h2>
                <p className="micro-label mt-2">Timeline</p>
              </div>
              <div className="border-t border-line">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-b border-line py-6 md:py-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
                      <span className="text-xs uppercase tracking-[2px] font-medium shrink-0 pt-0.5" style={{fontFamily: "'Inter', sans-serif", color: 'var(--accent)'}}>
                        202{i}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl leading-snug" style={{fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--ink)'}}>
                          Position Title at Company Name
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed mt-2" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                          Description of role and responsibilities during this period of the career timeline.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ TECH STACK (02) ============ */}
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="geo-ring" style={{width: '40vw', height: '40vw', right: '-15%', top: '5%', opacity: 0.1}} />
            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
              <div className="text-center mb-12">
                <p className="label mb-2" style={{color: 'var(--accent)'}}>02</p>
                <h2 className="display-serif text-heading-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>Tech Stack</h2>
                <p className="micro-label mt-2">Teknologi</p>
              </div>
              {/* Category group — Frontend */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="micro-label">Frontend</span>
                  <div className="flex-1 h-px bg-line" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 md:gap-6 py-3 md:py-4 border-b border-line">
                    <span className="text-base md:text-lg w-8 md:w-10 shrink-0" style={{fontFamily: 'var(--font-display)', color: 'var(--accent)'}}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-8 h-8 border border-line flex items-center justify-center shrink-0" />
                    <span className="text-sm md:text-base" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>
                      Technology Name
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ PROJECTS (03) ============ */}
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="geo-ring" style={{width: '35vw', height: '35vw', left: '-10%', bottom: '5%', opacity: 0.1}} />
            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
              <div className="text-center mb-12">
                <p className="label mb-2" style={{color: 'var(--accent)'}}>03</p>
                <h2 className="display-serif text-heading-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>Projek Pilihan</h2>
                <p className="micro-label mt-2">Portfolio</p>
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 mb-8 md:mb-16 items-stretch border border-line bg-surface-card/20`}>
                  {/* Image */}
                  <div className="w-full md:w-1/2 md:p-8">
                    <div className="relative aspect-video w-full border border-line" />
                  </div>
                  {/* Info */}
                  <div className="w-full md:w-1/2 space-y-5 p-4 md:p-8 self-center">
                    <h3 className="text-2xl md:text-3xl leading-tight" style={{fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink)'}}>
                      Project Title Here
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                      Detailed project description showcasing the scope, technologies, and outcomes achieved.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-3">
                      <span className="px-4 py-2 border border-line text-sm">GitHub</span>
                      <span className="px-4 py-2 border border-line bg-foreground text-sm" style={{color: 'var(--background)'}}>Live Demo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ ACHIEVEMENTS (04) ============ */}
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
              <div className="text-center mb-12">
                <p className="label mb-2" style={{color: 'var(--accent)'}}>04</p>
                <h2 className="display-serif text-heading-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>Pelatihan & Penghargaan</h2>
                <p className="micro-label mt-2">Sertifikat & highlights</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-line bg-surface-card cursor-pointer">
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="micro-label">Category</div>
                        <h3 className="display-serif text-heading-md" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>
                          Certificate Title
                        </h3>
                        <p className="text-xs" style={{color: 'var(--body)'}}>Issuer Organization</p>
                      </div>
                      <div className="text-xs" style={{color: 'var(--accent)'}}>2024</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ CONTACTS (05) ============ */}
          <section className="py-20 md:py-32 relative overflow-hidden border-t border-line">
            <div className="geo-ring" style={{width: '35vw', height: '35vw', right: '-10%', top: '-5%', opacity: 0.08}} />
            <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '960px'}}>
              <div className="text-center mb-12">
                <p className="label mb-2" style={{color: 'var(--accent)'}}>05</p>
                <h2 className="display-serif text-heading-lg" style={{fontFamily: 'var(--font-display)', color: 'var(--ink)'}}>Hubungi Saya</h2>
                <p className="micro-label mt-2">Kontak</p>
              </div>
              <p className="text-center max-w-lg mx-auto mb-16 text-sm md:text-base leading-relaxed" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                Tertarik untuk berkolaborasi? Hubungi saya melalui platform berikut.
              </p>
              <div className="max-w-2xl mx-auto mb-16">
                {['Email', 'LinkedIn', 'Instagram', 'Telegram'].map((label, i) => (
                  <div key={i} className={`flex items-center gap-4 py-5 border-t border-line px-4 ${i === 3 ? 'border-b border-line' : ''}`}>
                    <div className="w-5 h-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="micro-label text-xs">{label}</span>
                      <span className="block text-sm mt-0.5 truncate" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                        @username
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* ============ FLOATING CHAT BUTTON ============ */}
        <div className="fixed bottom-8 right-8 z-[999] w-14 h-14 border border-line bg-surface-card" />

        {/* ============ FOOTER ============ */}
        <footer className="relative bg-surface-card pt-20 pb-12 overflow-hidden border-t border-line">
          <div className="container mx-auto px-6 relative z-10" style={{maxWidth: '1100px'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
              {/* Column 1: Brand */}
              <div className="space-y-4">
                <h2 className="text-2xl leading-tight" style={{fontFamily: 'serif', fontWeight: 400, color: 'var(--ink)'}}>
                  Portfolio Name
                </h2>
                <p className="text-sm leading-relaxed" style={{fontFamily: 'monospace', color: 'var(--body)'}}>
                  Role description
                </p>
              </div>
              {/* Column 2: Links */}
              <div className="space-y-4">
                <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>Pintasan</h3>
                <ul className="space-y-2">
                  {['Beranda', 'Perjalanan', 'Proyek', 'Sertifikat', 'Kontak'].map((link) => (
                    <li key={link}>
                      <span className="text-sm" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>{link}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Column 3: Social */}
              <div className="space-y-4">
                <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>Sosial</h3>
                <div className="space-y-2">
                  {['GitHub', 'LinkedIn', 'Instagram'].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-line" />
                      <span className="text-sm" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Column 4: Contact */}
              <div className="space-y-4">
                <h3 className="label text-xs" style={{color: 'var(--accent-red)'}}>Kontak</h3>
                <p className="text-sm" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>email@example.com</p>
                <p className="text-sm" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>Indonesia</p>
              </div>
            </div>
            {/* Copyright */}
            <div className="border-t border-line pt-8 text-center">
              <p className="text-xs" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
                © {new Date().getFullYear()} Portfolio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </phantom-ui>
  );
}
