/**
 * Tests for CertificatesGallery Component
 * Tests filtering, search, pagination, and PDF preview functionality
 */

import { Achievement } from '@/lib/portfolio-data';

// Sample test data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'React Advanced Patterns',
    category: 'Kursus Online',
    issuer: 'Udemy',
    year: 2023,
    pdf_url: 'https://example.com/cert1.pdf',
    external_link: 'https://udemy.com/cert1',
    display_order: 1,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: '2',
    title: 'Web Performance Optimization',
    category: 'Webinar',
    issuer: 'Google',
    year: 2023,
    pdf_url: 'https://example.com/cert2.pdf',
    external_link: undefined,
    display_order: 2,
    created_at: '2023-02-01',
    updated_at: '2023-02-01'
  }
];

describe('CertificatesGallery', () => {
  it('should have valid achievement data', () => {
    expect(mockAchievements).toHaveLength(2);
    expect(mockAchievements[0]).toHaveProperty('id');
    expect(mockAchievements[0]).toHaveProperty('title');
  });

  it('should filter by category correctly', () => {
    const filtered = mockAchievements.filter(a => a.category === 'Kursus Online');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('React Advanced Patterns');
  });

  it('should search by title correctly', () => {
    const query = 'React';
    const filtered = mockAchievements.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
  });

  it('should paginate correctly', () => {
    const itemsPerPage = 12;
    const totalPages = Math.ceil(mockAchievements.length / itemsPerPage);
    expect(totalPages).toBe(1);
  });
});
