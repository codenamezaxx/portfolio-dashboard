'use client';

import React, { lazy } from 'react';
import { FileText, Download, ExternalLink, Eye } from 'lucide-react';
import Card from './Card';

// Lazy load PDFPreview to avoid server-side issues
const PDFPreview = lazy(() => import('./PDFPreview').then(mod => ({ default: mod.PDFPreview })));

interface PDFPreviewCardProps {
  title: string;
  category: string;
  year: string;
  pdfPath?: string;
  link?: string;
  issuer?: string;
  onView?: () => void;
}

const PDFPreviewCard: React.FC<PDFPreviewCardProps> = ({
  title,
  category,
  year,
  pdfPath,
  link,
  issuer,
  onView,
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (pdfPath) {
      const a = document.createElement('a');
      a.href = pdfPath;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleViewPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onView) onView();
  };

  return (
    <div
      onClick={pdfPath ? handleViewPDF : undefined}
      className={`group relative h-full ${pdfPath ? 'cursor-pointer' : ''}`}
    >
      <Card
        className="h-full"
      >
        {/* Content */}
        <div className="relative p-6 h-full flex flex-col justify-between">
          {/* Icon */}
          <div className="mb-4">
            <div className="w-12 h-12 border border-line p-2.5 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[2px] mb-2" style={{fontFamily: "'Inter', sans-serif", color: 'var(--accent)'}}>
              {category}
            </p>
            <h3 className="text-lg leading-snug mb-2 line-clamp-3" style={{fontFamily: "var(--font-display)", fontWeight: 400, color: 'var(--ink)'}}>
              {title}
            </h3>
            {issuer && (
              <p className="text-sm mb-3">
                {issuer}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <span className="text-sm" style={{fontFamily: "'Inter', sans-serif", color: 'var(--body)'}}>
              {year}
            </span>
            <div className="flex flex-row gap-2 relative z-10">
              {pdfPath && (
                <>
                    <button
                      onClick={handleViewPDF}
                      className="border border-line p-2 hover:bg-white/20 transition-colors text-accent"
                      title="View PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="border border-line p-2 hover:bg-white/20 transition-colors text-accent"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                </>
              )}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="border border-line p-2 hover:bg-white/20 transition-colors text-accent"
                  title="View certificate"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PDFPreviewCard;
