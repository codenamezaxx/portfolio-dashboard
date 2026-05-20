/**
 * Tests for GET /api/portfolio/achievements endpoint
 */

import { GET } from './route';
import { supabase } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock Supabase
jest.mock('@/lib/db', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('GET /api/portfolio/achievements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return achievements successfully', async () => {
    const mockAchievements = [
      {
        id: '1',
        title: 'React Certification',
        category: 'certification',
        issuer: 'Udemy',
        year: 2023,
        pdf_url: 'https://example.com/react-cert.pdf',
        external_link: null,
        display_order: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'TypeScript Advanced',
        category: 'certification',
        issuer: 'Coursera',
        year: 2023,
        pdf_url: 'https://example.com/typescript-cert.pdf',
        external_link: null,
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockAchievements,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockAchievements);
    expect(data.data).toHaveLength(2);
  });

  it('should return empty array when no achievements exist', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it('should return 500 when database query fails', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch achievements');
  });

  it('should set proper caching headers for ISR', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should include all achievement fields in response', async () => {
    const mockAchievement = {
      id: '1',
      title: 'React Certification',
      category: 'certification',
      issuer: 'Udemy',
      year: 2023,
      pdf_url: 'https://example.com/react-cert.pdf',
      external_link: 'https://example.com/verify',
      display_order: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [mockAchievement],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data[0]).toHaveProperty('id');
    expect(data.data[0]).toHaveProperty('title');
    expect(data.data[0]).toHaveProperty('category');
    expect(data.data[0]).toHaveProperty('issuer');
    expect(data.data[0]).toHaveProperty('year');
    expect(data.data[0]).toHaveProperty('pdf_url');
    expect(data.data[0]).toHaveProperty('external_link');
  });

  it('should order items by display_order ascending', async () => {
    const mockAchievements = [
      { id: '1', title: 'Cert 1', display_order: 0 },
      { id: '2', title: 'Cert 2', display_order: 1 },
      { id: '3', title: 'Cert 3', display_order: 2 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockAchievements,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data[0].display_order).toBeLessThanOrEqual(data.data[1].display_order);
    expect(data.data[1].display_order).toBeLessThanOrEqual(data.data[2].display_order);
  });

  it('should handle unexpected errors gracefully', async () => {
    (supabase.from as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/achievements');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
