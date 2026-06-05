'use client';

import React, { useState, lazy, Suspense } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import { Button } from './Button';

// Lazy load PDFPreview to avoid server-side issues
const PDFPreview = lazy(() => import('./PDFPreview').then(mod => ({ default: mod.PDFPreview })));

interface Certificate {
  id: string;
  title: string;
  category: string;
  issuer: string;
  year: number;
  pdf_url?: string;
  external_link?: string;
  display_order: number;
}

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <>
      <div className="bg-surface-card/40 dark:bg-surface-card/20 border border-hairline dark:border-white/5 rounded-2xl overflow-hidden dark:shadow-primary/10 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 h-full flex flex-col group hover:scale-[1.01]">
        {/* Header with Icon */}
        <div className="bg-surface-soft/30 dark:bg-surface-soft/10 border-b border-hairline/30 dark:border-white/5 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-heading-md font-bold text-ink dark:text-ink mb-1.5 line-clamp-2 leading-tight">
              {certificate.title}
            </h3>
            <p className="text-body-sm text-mute dark:text-mute font-medium line-clamp-1">{certificate.issuer}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 ml-3 group-hover:bg-primary/20 transition-colors">
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Category and Year */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <Badge variant="accent" className="text-body-xs font-bold px-3 py-1 rounded-full bg-primary/10 border-0 text-primary">
              {certificate.category}
            </Badge>
            <span className="text-body-sm font-bold text-mute dark:text-mute">{certificate.year}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto pt-5 border-t border-hairline/30 dark:border-white/5">
            {certificate.pdf_url && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPDF(true)}
                className="flex-1 rounded-xl font-bold h-10 shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Lihat PDF
              </Button>
            )}
            {certificate.external_link && (
              <a
                href={certificate.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className={certificate.pdf_url ? 'w-12' : 'flex-1'}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-xl h-10 border-hairline dark:border-white/10 hover:bg-surface-soft/50"
                  title="Lihat Link Eksternal"
                >
                  <ExternalLink className="w-4 h-4" />
                  {!certificate.pdf_url && <span className="ml-2">Lihat Kredensial</span>}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDF && certificate.pdf_url && (
        <Suspense fallback={<div>Loading PDF...</div>}>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-surface-card dark:bg-surface-card rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-hairline dark:border-white/10 shadow-2xl flex flex-col">
              <div className="bg-background/50 backdrop-blur-md border-b border-hairline dark:border-white/10 p-5 flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{certificate.category}</span>
                  <h3 className="text-heading-md text-foreground font-bold line-clamp-1">{certificate.title}</h3>
                  <p className="text-xs text-zinc-400">{certificate.issuer}</p>
                </div>
                <button
                  onClick={() => setShowPDF(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-foreground"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-background relative p-2 md:p-4">
                <div className="w-full h-full min-h-[500px]">
                  <PDFPreview
                    url={certificate.pdf_url}
                    filename={`${certificate.title}.pdf`}
                    maxHeight="100%"
                    className="w-full h-full bg-background"
                    showDownload={true}
                    showPageInfo={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};

export default CertificateCard;
