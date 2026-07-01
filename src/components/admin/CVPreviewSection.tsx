/**
 * CVPreviewSection Component
 * 
 * Displays a live preview of the currently uploaded CV/Resume using PDFPreview.
 * Integrates with /api/portfolio/resume to fetch the document.
 */

'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { RefreshCw, FileText, CloudCheck, AlertCircle, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';

// Lazy load PDFPreview to avoid server-side rendering issues
const PDFPreview = lazy(() =>
  import('@/components/ui/PDFPreview').then((mod) => ({ default: mod.PDFPreview }))
);

export function CVPreviewSection() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumeInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/portfolio/resume');
      
      if (response.ok) {
        const data = await response.json();
        if (data.resume_url) {
          setResumeUrl(data.resume_url);
          setPreviewVersion(Date.now()); // Update version to force cache bust and re-render
        } else {
          setResumeUrl(null);
        }
      } else {
        if (response.status === 404) {
          setResumeUrl(null);
        } else {
          throw new Error('Failed to fetch CV info');
        }
      }
    } catch (err) {
      console.error('Error fetching CV:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading CV');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeInfo();

    // Listen for custom events to reload CV when upload is successful
    const handleCVUploaded = () => {
      console.log('🔄 CV upload event detected, refreshing preview...');
      fetchResumeInfo();
    };

    window.addEventListener('cv-uploaded', handleCVUploaded);
    return () => {
      window.removeEventListener('cv-uploaded', handleCVUploaded);
    };
  }, []);

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
            <p className="text-xs text-mute">Live document preview from storage</p>
          </div>
        </div>
        
        {resumeUrl && (
          <button
            onClick={fetchResumeInfo}
            disabled={isLoading}
            className="text-primary gap-2"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        )}
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-doc/30 border border-dashed border-line">
            <Loader2 className="w-10 h-10 text-primary mb-4 opacity-50" />
            <p className="text-mute font-medium text-sm">Initializing Previewer...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-accent-red/5 border border-accent-red/20 text-center">
            <div className="w-12 h-12 bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-accent-red" size={24} />
            </div>
            <h4 className="text-ink font-semibold mb-1 text-sm">Preview Failed</h4>
            <p className="text-xs text-mute mb-4">{error}</p>
            <button
              onClick={fetchResumeInfo}
              className="border-accent-red/30 text-accent-red"
            >
              Retry Connection
            </button>
          </div>
        ) : !resumeUrl ? (
          <div className="p-12 border-2 border-dashed border-line text-center bg-surface-doc/20">
            <div className="w-16 h-16 bg-surface-card flex items-center justify-center mx-auto mb-6 border border-line">
              <FileText className="text-mute" size={32} />
            </div>
            <h4 className="text-base font-bold text-ink mb-2">
              No CV Document Found
            </h4>
            <p className="text-sm text-mute mb-6 max-w-xs mx-auto">
              Ready to showcase your journey? Upload your professional resume in the settings panel to enable this preview.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-surface-card p-4">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center h-[500px] bg-surface-doc">
                    <Loader2 className="w-8 h-8 text-primary mb-3" />
                    <p className="text-xs text-mute font-medium">Rendering PDF content...</p>
                  </div>
                }
              >
                <PDFPreview
                  url={`/api/portfolio/resume?view=true&v=${previewVersion}`}
                  filename="CV - Zakky Ahmad El-Kholily.pdf"
                  maxHeight="600px"
                  showDownload={true}
                  showPageInfo={true}
                  showFileInfo={true}
                  className="w-full"
                />
              </Suspense>
            </div>

            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center bg-accent-green/10 text-accent-green">
                <CloudCheck size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink leading-none">Synced & Secure</p>
                <p className="text-[8px] text-mute uppercase tracking-wider mt-0.5">Cloud Storage Active</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}