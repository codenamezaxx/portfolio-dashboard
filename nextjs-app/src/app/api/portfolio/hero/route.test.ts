/**
 * Tests for GET /api/portfolio/hero endpoint
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

describe('GET /api/portfolio/hero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hero section data successfully', async () => {
    const mockProfile = {
      id: '1',
      name: 'John Doe',
      role: 'Full Stack Developer',
      tagline: 'Building amazing web experiences',
      heroImageUrl: 'https://example.com/hero.jpg',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/hero');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockProfile);
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600');
  });

  it('should return 500 when database query fails', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/hero');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch hero section');
  });

  it('should set proper caching headers for ISR', async () => {
    const mockProfile = {
      id: '1',
      name: 'John Doe',
      role: 'Full Stack Developer',
      tagline: 'Building amazing web experiences',
      heroImageUrl: 'https://example.com/hero.jpg',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/hero');
    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should handle unexpected errors gracefully', async () => {
    (supabase.from as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/hero');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
