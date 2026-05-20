/**
 * Certificates Gallery Page Tests
 */

import { render, screen } from '@testing-library/react';
import CertificatesPage from './page';

// Mock the portfolio-data module
jest.mock('@/lib/portfolio-data', () => ({
  getAchievements: jest.fn(() =>
    Promise.resolve([
      {
        id: '1',
        title: 'Memulai Pemrograman dengan Python',
        category: 'Kursus Online',
        issuer: 'Dicoding Indonesia',
        year: 2025,
        pdf_url: '/certificates/cert-1.pdf',
        external_link: 'https://www.dicoding.com/certificates/98XWOL0DLZM3',
        display_order: 1,
      },
      {
        id: '2',
        title: 'Belajar Dasar AI',
        category: 'Kursus Online',
        issuer: 'Dicoding Indonesia',
        year: 2025,
        pdf_url: '/certificates/cert-2.pdf',
        external_link: 'https://www.dicoding.com/certificates/98XWOL0DLZM3',
        display_order: 2,
      },
      {
        id: '3',
        title: 'Public Speaking With Trainer',
        category: 'Webinar Online',
        issuer: 'KT&G SangSang University',
        year: 2024,
        pdf_url: '/certificates/cert-4.pdf',
        display_order: 3,
      },
    ])
  ),
}));

describe('CertificatesPage', () => {
  it('renders the page title', async () => {
    const { container } = render(
      await CertificatesPage({ searchParams: {} })
    );
    expect(screen.getByText('Certificates & Achievements')).toBeInTheDocument();
  });

  it('displays all certificates', async () => {
    render(await CertificatesPage({ searchParams: {} }));
    expect(screen.getByText('Memulai Pemrograman dengan Python')).toBeInTheDocument();
    expect(screen.getByText('Belajar Dasar AI')).toBeInTheDocument();
    expect(screen.getByText('Public Speaking With Trainer')).toBeInTheDocument();
  });

  it('displays category filters', async () => {
    render(await CertificatesPage({ searchParams: {} }));
    expect(screen.getByText(/All \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Kursus Online \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Webinar Online \(1\)/)).toBeInTheDocument();
  });

  it('filters certificates by category', async () => {
    render(
      await CertificatesPage({
        searchParams: { category: 'Kursus Online' },
      })
    );
    expect(screen.getByText('Memulai Pemrograman dengan Python')).toBeInTheDocument();
    expect(screen.getByText('Belajar Dasar AI')).toBeInTheDocument();
    expect(screen.queryByText('Public Speaking With Trainer')).not.toBeInTheDocument();
  });

  it('displays back to home link', async () => {
    render(await CertificatesPage({ searchParams: {} }));
    const backLink = screen.getByText('Back to Home');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/#achievements');
  });

  it('displays issuer information', async () => {
    render(await CertificatesPage({ searchParams: {} }));
    expect(screen.getByText('Dicoding Indonesia')).toBeInTheDocument();
    expect(screen.getByText('KT&G SangSang University')).toBeInTheDocument();
  });

  it('displays year information', async () => {
    render(await CertificatesPage({ searchParams: {} }));
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('handles empty results gracefully', async () => {
    jest.resetModules();
    jest.doMock('@/lib/portfolio-data', () => ({
      getAchievements: jest.fn(() => Promise.resolve([])),
    }));

    const { getAchievements } = require('@/lib/portfolio-data');
    getAchievements.mockResolvedValueOnce([]);

    render(await CertificatesPage({ searchParams: {} }));
    expect(screen.getByText('No certificates found.')).toBeInTheDocument();
  });
});
