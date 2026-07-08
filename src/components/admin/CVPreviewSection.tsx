/**
 * CVPreviewSection Component
 * 
 * Displays live previews of both Indonesian and English CV/Resume documents.
 * Fetches each locale's resume URL and renders with PDFPreview.
 * Refreshes when cv-uploaded events are dispatched from ProfileSettings.
 */

'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { RefreshCw, FileText, CloudCheck, AlertCircle, Loader2, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';

// Lazy load PDFPreview to avoid server-side rendering issues
const PDFPreview = lazy(() =>
  import('@/components/ui/PDFPreview').then((mod) => ({ default: mod.PDFPreview }))
);

type CvState = {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  version: number;
};

const initialCvState: CvState = { url: null, isLoading: true, error: null, version: Date.now() };

export function CVPreviewSection() {
  const [idCv, setIdCv] = useState<CvState>({ ...initialCvState });
  const [enCv, setEnCv] = useState<CvState>({ ...initialCvState });

  const fetchCvInfo = async (locale: 'id' | 'en') => {
    const setter = locale === 'en' ? setEnCv : setIdCv;
    setter(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/portfolio/resume?locale=${locale}`);

      if (response.ok) {
        const data = await response.json();
        if (data.resume_url) {
          setter({ url: data.resume_url, isLoading: false, error: null, version: Date.now() });
        } else {
          setter({ url: null, isLoading: false, error: null, version: Date.now() });
        }
      } else {
        if (response.status === 404) {
          setter({ url: null, isLoading: false, error: null, version: Date.now() });
        } else {
          throw new Error('Failed to fetch CV info');
        }
      }
    } catch (err) {
      console.error(`Error fetching ${locale} CV:`, err);
      setter(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An error occurred while loading CV',
      }));
    }
  };

  useEffect(() => {
    fetchCvInfo('id');
    fetchCvInfo('en');

    // Listen for cv-uploaded events — refresh the matching locale or both
    const handleCVUploaded = (e?: CustomEvent<{ locale?: string }>) => {
      const locale = e?.detail?.locale;
      if (!locale || locale === 'id') fetchCvInfo('id');
      if (!locale || locale === 'en') fetchCvInfo('en');
    };

    const handleIdUploaded = () => fetchCvInfo('id');
    const handleEnUploaded = () => fetchCvInfo('en');

    window.addEventListener('cv-uploaded', handleCVUploaded as EventListener);
    window.addEventListener('cv-uploaded-id', handleIdUploaded);
    window.addEventListener('cv-uploaded-en', handleEnUploaded);
    return () => {
      window.removeEventListener('cv-uploaded', handleCVUploaded as EventListener);
      window.removeEventListener('cv-uploaded-id', handleIdUploaded);
      window.removeEventListener('cv-uploaded-en', handleEnUploaded);
    };
  }, []);

  const refreshAll = () => {
    fetchCvInfo('id');
    fetchCvInfo('en');
  };

  const renderCvCard = (locale: 'id' | 'en', state: CvState) => {
    const label = locale === 'en' ? 'English' : 'Indonesia';
    const shortLabel = locale === 'en' ? 'EN' : 'ID';

    return (
      <div className="flex-1 min-w-0">
        {/* Locale header */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            locale === 'en'
              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
              : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
          }`}>
            <Globe size={12} />
            {shortLabel}
          </div>
          <span className="text-xs text-mute">{label}</span>
        </div>

        {state.isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface-doc/30 border border-dashed border-line">
            <Loader2 className="w-8 h-8 text-primary mb-3 animate-spin" />
            <p className="text-mute font-medium text-xs">{label} CV loading...</p>
          </div>
        ) : state.error ? (
          <div className="p-4 bg-accent-red/5 border border-accent-red/20 text-center">
            <div className="w-10 h-10 bg-accent-red/10 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="text-accent-red" size={20} />
            </div>
            <h4 className="text-ink font-semibold mb-1 text-xs">{label} Preview Failed</h4>
            <p className="text-xs text-mute mb-3">{state.error}</p>
            <button
              onClick={() => fetchCvInfo(locale)}
              className="text-xs border-accent-red/30 text-accent-red px-3 py-1"
            >
              Retry
            </button>
          </div>
        ) : !state.url ? (
          <div className="p-8 border-2 border-dashed border-line text-center bg-surface-doc/20">
            <div className="w-12 h-12 bg-surface-card flex items-center justify-center mx-auto mb-4 border border-line">
              <FileText className="text-mute" size={24} />
            </div>
            <h4 className="text-sm font-bold text-ink mb-1">
              No {label} CV
            </h4>
            <p className="text-xs text-mute">
              Upload from Settings panel
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-surface-card p-2">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-[400px] bg-surface-doc">
                  <Loader2 className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs text-mute font-medium">Rendering {label} PDF...</p>
                </div>
              }
            >
              <PDFPreview
                url={`/api/portfolio/resume?locale=${locale}&view=true&v=${state.version}`}
                filename={`CV - Zakky Ahmad El-Kholily (${shortLabel}).pdf`}
                maxHeight="500px"
                showDownload={true}
                showPageInfo={true}
                showFileInfo={true}
                className="w-full"
              />
            </Suspense>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border-none">
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink leading-tight">
              CV / Resume Preview
            </h3>
            <p className="text-xs text-mute">Bilingual document previews (ID &amp; EN)</p>
          </div>
        </div>

        <button
          onClick={refreshAll}
          disabled={idCv.isLoading || enCv.isLoading}
          className="text-primary gap-2 flex items-center"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Sync</span>
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {renderCvCard('id', idCv)}
          {renderCvCard('en', enCv)}
        </div>

        {(idCv.url || enCv.url) && (
          <div className="flex items-center gap-3 px-2 mt-6 pt-4 border-t border-line">
            <div className="flex h-8 w-8 items-center justify-center bg-accent-green/10 text-accent-green">
              <CloudCheck size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-ink leading-none">Synced &amp; Secure</p>
              <p className="text-[8px] text-mute uppercase tracking-wider mt-0.5">Cloud Storage Active</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
