'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import CertificateCard from '@/components/ui/CertificateCard';

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

const ITEMS_PER_PAGE = 12;

function CertificatesContent() {
  const searchParams = useSearchParams();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/portfolio/achievements');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch certificates');
        }
        const result = await response.json();

        let certificatesData: Certificate[] = [];
        if (Array.isArray(result)) {
          certificatesData = result;
        } else if (result && Array.isArray(result.data)) {
          certificatesData = result.data;
        } else if (result && result.data && Array.isArray(result.data.data)) {
          certificatesData = result.data.data;
        }

        setCertificates(certificatesData);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mb-4" />
          <p className="text-[var(--mute)]">Memuat sertifikat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-[var(--ink)] mb-4">Terjadi Kesalahan</h1>
          <p className="text-[var(--accent-red)] mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--primary)] text-[var(--on-primary)] rounded-lg hover:bg-[var(--primary-pressed)] transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const categories = Array.from(new Set(safeCertificates.map(c => c.category))).sort();

  const selectedCategory = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  let filtered = safeCertificates;
  if (selectedCategory) {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedCerts = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[var(--ink)] mb-4">Sertifikat &amp; Pencapaian</h1>
        <p className="text-lg text-[var(--body)]">
          Kumpulan sertifikasi, kursus, dan pencapaian yang telah saya selesaikan.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/certificates"
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !selectedCategory
                ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                : 'bg-[var(--surface-soft)] text-[var(--body)] border-[var(--hairline)] hover:border-[var(--primary)]/40 hover:text-[var(--ink)]'
            }`}
          >
            Semua ({safeCertificates.length})
          </Link>
          {categories.map(category => {
            const count = safeCertificates.filter(c => c.category === category).length;
            return (
              <Link
                key={category}
                href={`/certificates?category=${encodeURIComponent(category)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                    : 'bg-[var(--surface-soft)] text-[var(--body)] border-[var(--hairline)] hover:border-[var(--primary)]/40 hover:text-[var(--ink)]'
                }`}
              >
                {category} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6 text-[var(--mute)] text-sm">
        Menampilkan {paginatedCerts.length > 0 ? startIdx + 1 : 0}–{Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} sertifikat
      </div>

      {/* Certificates Grid */}
      {paginatedCerts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedCerts.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {validPage > 1 && (
                <Link
                  href={`/certificates?page=${validPage - 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`}
                  className="px-4 py-2 bg-[var(--surface-soft)] text-[var(--ink)] border border-[var(--hairline)] rounded-lg hover:border-[var(--primary)]/40 transition-colors text-sm font-medium"
                >
                  Sebelumnya
                </Link>
              )}

              <div className="flex gap-1 overflow-x-auto py-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Link
                    key={page}
                    href={`/certificates?page=${page}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`}
                    className={`w-9 h-9 rounded-lg transition-colors flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                      page === validPage
                        ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                        : 'bg-[var(--surface-soft)] text-[var(--body)] border border-[var(--hairline)] hover:border-[var(--primary)]/40 hover:text-[var(--ink)]'
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>

              {validPage < totalPages && (
                <Link
                  href={`/certificates?page=${validPage + 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`}
                  className="px-4 py-2 bg-[var(--surface-soft)] text-[var(--ink)] border border-[var(--hairline)] rounded-lg hover:border-[var(--primary)]/40 transition-colors text-sm font-medium"
                >
                  Berikutnya
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-[var(--mute)] mx-auto mb-4" />
          <p className="text-[var(--mute)] text-lg">Tidak ada sertifikat ditemukan.</p>
        </div>
      )}
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--hairline)] bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#achievements"
            className="inline-flex items-center gap-2 text-[var(--mute)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mb-4" />
            <p className="text-[var(--mute)]">Memuat...</p>
          </div>
        </div>
      }>
        <CertificatesContent />
      </Suspense>
    </main>
  );
}
