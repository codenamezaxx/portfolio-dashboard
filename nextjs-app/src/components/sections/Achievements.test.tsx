/**
 * Tests for Achievements component
 * Validates rendering, props, interactions, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Achievements from './Achievements';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  staggerContainer: {},
  fadeInUp: {},
}));

// Mock child components
jest.mock('../ui/PDFPreviewCard', () => ({
  __esModule: true,
  default: ({ title, category, year }: any) => (
    <div data-testid="pdf-preview-card">
      <span>{title}</span>
      <span>{category}</span>
      <span>{year}</span>
    </div>
  ),
}));

jest.mock('../ui/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../shared/SectionHeader', () => ({
  __esModule: true,
  default: ({ title, subtitle }: any) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

const mockAchievements = [
  {
    id: 1,
    title: 'Test Certificate 1',
    category: 'Kursus Online',
    issuer: 'Test Issuer',
    year: '2024',
    pdfPath: '/certificates/test-1.pdf',
    link: 'https://example.com/cert1',
  },
  {
    id: 2,
    title: 'Test Certificate 2',
    category: 'Seminar',
    issuer: 'Another Issuer',
    year: '2023',
    pdfPath: '/certificates/test-2.pdf',
  },
  {
    id: 3,
    title: 'Test Certificate 3',
    category: 'International Forum',
    issuer: 'University',
    year: '2024',
    pdfPath: '/certificates/test-3.pdf',
  },
];

describe('Achievements Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the section with correct id', () => {
      const { container } = render(<Achievements />);
      const section = container.querySelector('#achievements');
      expect(section).toBeInTheDocument();
    });

    it('should render section header with correct title', () => {
      render(<Achievements />);
      expect(screen.getByText('Pelatihan & Penghargaan')).toBeInTheDocument();
    });

    it('should render section header subtitle', () => {
      render(<Achievements />);
      expect(screen.getByText('Sertifikat & highlights')).toBeInTheDocument();
    });

    it('should render default achievements when no items prop provided', () => {
      render(<Achievements />);
      expect(screen.getByText('Memulai Pemrograman dengan Python')).toBeInTheDocument();
    });

    it('should render custom achievements when items prop provided', () => {
      render(<Achievements items={mockAchievements} />);
      expect(screen.getByText('Test Certificate 1')).toBeInTheDocument();
      expect(screen.getByText('Test Certificate 2')).toBeInTheDocument();
    });

    it('should render "Lihat Semua Sertifikat" button', () => {
      render(<Achievements />);
      expect(screen.getByText('Lihat Semua Sertifikat')).toBeInTheDocument();
    });

    it('should render PDF preview cards', () => {
      render(<Achievements items={mockAchievements} />);
      const cards = screen.getAllByTestId('pdf-preview-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Items Display', () => {
    it('should display at most 6 items', () => {
      const manyItems = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Certificate ${i + 1}`,
        category: 'Kursus Online',
        issuer: 'Issuer',
        year: '2024',
        pdfPath: `/certificates/cert-${i + 1}.pdf`,
      }));
      render(<Achievements items={manyItems} />);
      const cards = screen.getAllByTestId('pdf-preview-card');
      expect(cards.length).toBeLessThanOrEqual(6);
    });

    it('should display achievement title in PDF card', () => {
      render(<Achievements items={mockAchievements} />);
      expect(screen.getByText('Test Certificate 1')).toBeInTheDocument();
    });

    it('should display achievement category in PDF card', () => {
      render(<Achievements items={mockAchievements} />);
      expect(screen.getByText('Kursus Online')).toBeInTheDocument();
    });

    it('should display achievement year in PDF card', () => {
      render(<Achievements items={mockAchievements} />);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call onViewAll when "Lihat Semua" button is clicked', () => {
      const mockOnViewAll = jest.fn();
      render(<Achievements onViewAll={mockOnViewAll} />);
      const button = screen.getByText('Lihat Semua Sertifikat');
      fireEvent.click(button);
      expect(mockOnViewAll).toHaveBeenCalledTimes(1);
    });

    it('should not throw when onViewAll is not provided', () => {
      render(<Achievements />);
      const button = screen.getByText('Lihat Semua Sertifikat');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Empty State', () => {
    it('should render with empty items array', () => {
      render(<Achievements items={[]} />);
      expect(screen.getByText('Pelatihan & Penghargaan')).toBeInTheDocument();
    });

    it('should still show the button with empty items', () => {
      render(<Achievements items={[]} />);
      expect(screen.getByText('Lihat Semua Sertifikat')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have section element', () => {
      const { container } = render(<Achievements />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have heading for section title', () => {
      render(<Achievements />);
      expect(screen.getByRole('heading', { name: 'Pelatihan & Penghargaan' })).toBeInTheDocument();
    });

    it('should have accessible button', () => {
      render(<Achievements />);
      expect(screen.getByRole('button', { name: 'Lihat Semua Sertifikat' })).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should render items in a grid container', () => {
      const { container } = render(<Achievements items={mockAchievements} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
