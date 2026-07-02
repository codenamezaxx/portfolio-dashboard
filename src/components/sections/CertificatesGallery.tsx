'use client';

import { useState, useMemo, useCallback } from 'react';
import { Achievement } from '@/lib/portfolio-data';
import { TextInput } from '@/components/ui/TextInput';
import { Modal } from '@/components/ui/Modal';
import { PDFPreview } from '@/components/ui/PDFPreview';
import { Search, X, ChevronLeft, ChevronRight, Download, ExternalLink, FileText, Medal } from 'lucide-react';

interface CertificatesGalleryProps {
  achievements: Achievement[];
}

interface CertificateFilters {
  category: string | null;
  searchQuery: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 12;

export default function CertificatesGallery({ achievements }: CertificatesGalleryProps) {
  const [filters, setFilters] = useState<CertificateFilters>({
    category: null,
    searchQuery: ''
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1
  });
  const [selectedCertificate, setSelectedCertificate] = useState<Achievement | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(achievements.map(a => a.category))).sort();
  }, [achievements]);

  // Filter and search achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      // Category filter
      if (filters.category && achievement.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          achievement.title.toLowerCase().includes(query) ||
          achievement.issuer.toLowerCase().includes(query) ||
          achievement.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [achievements, filters]);

  // Paginate results
  const paginatedAchievements = useMemo(() => {
    const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE);
    const startIndex = (pagination.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setPagination(prev => ({
      ...prev,
      totalPages: Math.max(1, totalPages)
    }));

    return filteredAchievements.slice(startIndex, endIndex);
  }, [filteredAchievements, pagination.currentPage]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  // Handle category filter
  const handleCategoryFilter = useCallback((category: string | null) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  // Handle PDF preview
  const handleViewPDF = useCallback((certificate: Achievement) => {
    setSelectedCertificate(certificate);
    setShowPDFModal(true);
  }, []);

  // Handle PDF download
  const handleDownloadPDF = useCallback((certificate: Achievement) => {
    if (certificate.pdf_url) {
      const link = document.createElement('a');
      link.href = certificate.pdf_url;
      link.download = `${certificate.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1)
    }));
  }, []);

  const handleNextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.min(prev.totalPages, prev.currentPage + 1)
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(prev.totalPages, page))
    }));
  }, []);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      category: null,
      searchQuery: ''
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-12 p-6 border border-line bg-surface-card space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mute group-focus-within:text-primary transition-colors" />
          <TextInput
            type="text"
            placeholder="Cari berdasarkan judul, penerbit, atau kategori..."
            value={filters.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-surface-soft border border-line text-sm"
            aria-label="Search certificates"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-mute/60 ml-1">Filter Kategori</p>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 text-sm border border-line ${
                  filters.category === category
                    ? 'bg-primary text-background'
                    : 'bg-surface-soft text-body hover:bg-white/20'
                }`}
                aria-pressed={filters.category === category}
              >
                {category}
                <span className={`ml-2 text-[10px] uppercase px-1.5 py-0.5 ${
                  filters.category === category ? 'bg-white/20' : 'bg-mute/10 text-mute'
                }`}>
                  {achievements.filter(a => a.category === category).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.category || filters.searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--mute)]">Filter aktif:</span>
            {filters.category && (
              <span className="flex items-center gap-2 bg-primary/10 text-accent border border-[var(--primary)]/20 px-2 py-0.5 text-xs">
                {filters.category}
                <button
                  onClick={() => handleCategoryFilter(filters.category)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${filters.category} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="flex items-center gap-2 bg-primary/10 text-accent border border-[var(--primary)]/20 px-2 py-0.5 text-xs">
                Pencarian: {filters.searchQuery}
                <button
                  onClick={() => handleSearch('')}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-pressed)] transition-colors"
            >
              Hapus semua
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-mute font-sans">
        Menampilkan {paginatedAchievements.length > 0 ? (pagination.currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{' '}
        {Math.min(pagination.currentPage * ITEMS_PER_PAGE, filteredAchievements.length)} dari{' '}
        {filteredAchievements.length} sertifikat
      </div>

      {/* Certificates Grid */}
      {paginatedAchievements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedAchievements.map((certificate) => (
            <div
              key={certificate.id}
              className="group/cert h-full flex flex-col border border-line bg-surface-card"
            >
              {/* Top Banner / Icon Area */}
              <div className="relative h-20 bg-surface-soft border-b border-line flex items-center justify-center">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                  <Medal className="w-6 h-6" />
                </div>
              </div>

              {/* Header Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="bg-primary/10 text-primary border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] mb-2 inline-block">
                      {certificate.category}
                    </span>
                    <h3 className="text-lg font-medium text-ink line-clamp-2">
                      {certificate.title}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-sans px-2 py-0.5 bg-surface-soft text-mute border border-line">
                    {certificate.year}
                  </span>
                </div>
                
                <p className="text-sm text-mute mb-5 line-clamp-1" style={{fontFamily: "'Inter', sans-serif"}}>
                  {certificate.issuer}
                </p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-line">
                  <button
                    onClick={() => handleViewPDF(certificate)}
                    className="flex-1 px-3 py-2 border border-line bg-primary/10 text-ink text-sm hover:bg-primary/20"
                    aria-label={`View ${certificate.title} PDF`}
                  >
                    <FileText className="w-4 h-4 inline-block mr-1.5" />
                    Preview
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadPDF(certificate)}
                      className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20"
                      aria-label={`Download ${certificate.title} PDF`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {certificate.external_link && (
                      <a
                        href={certificate.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20"
                          aria-label={`View ${certificate.title} external link`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--mute)] text-lg mb-4">
            {filters.category || filters.searchQuery
              ? 'Tidak ada sertifikat yang sesuai dengan filter Anda.'
              : 'Belum ada sertifikat tersedia.'}
          </p>
          {(filters.category || filters.searchQuery) && (
            <button onClick={handleClearFilters} className="px-4 py-2 border border-line bg-surface-soft text-ink text-sm hover:bg-white/20">
              Hapus Filter
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 p-3 border border-line w-fit mx-auto">
          <button
            onClick={handlePreviousPage}
            disabled={pagination.currentPage === 1}
            className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 text-sm border border-line ${
                  pagination.currentPage === page
                    ? 'bg-primary text-background'
                    : 'bg-surface-soft text-body hover:bg-white/20'
                }`}
                aria-current={pagination.currentPage === page ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPDFModal && selectedCertificate && (
        <Modal
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
          title={`${selectedCertificate.title} — Pratinjau PDF`}
          size="lg"
        >
          <div className="space-y-4">
            <PDFPreview
              url={selectedCertificate.pdf_url}
              filename={`${selectedCertificate.title}.pdf`}
              showDownload={false}
              showPageInfo={true}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleDownloadPDF(selectedCertificate)}
                className="px-4 py-2 border border-line bg-surface-soft text-ink text-sm hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Unduh PDF
              </button>
              {selectedCertificate.external_link && (
                <a
                  href={selectedCertificate.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-4 py-2 border border-line bg-surface-soft text-ink text-sm hover:bg-white/20">Lihat Sertifikat</button>
                </a>
              )}
              <button
                onClick={() => setShowPDFModal(false)}
                className="px-4 py-2 border border-line text-ink text-sm hover:bg-white/20"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
