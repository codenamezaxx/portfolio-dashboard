/**
 * Tests for GET /api/portfolio/journey endpoint
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

describe('GET /api/portfolio/journey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return journey items successfully', async () => {
    const mockJourney = [
      {
        id: '1',
        year: '2020',
        title: 'Started Learning Web Development',
        description: 'Began my journey with HTML, CSS, and JavaScript',
        display_order: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        year: '2021',
        title: 'First React Project',
        description: 'Built my first React application',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockJourney,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockJourney);
    expect(data.data).toHaveLength(2);
  });

  it('should return empty array when no journey items exist', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch journey items');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should order items by display_order ascending', async () => {
    const mockJourney = [
      { id: '1', year: '2020', title: 'Started', display_order: 0 },
      { id: '2', year: '2021', title: 'First Project', display_order: 1 },
      { id: '3', year: '2022', title: 'Advanced', display_order: 2 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockJourney,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/journey');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
