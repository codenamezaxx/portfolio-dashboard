/**
 * Tests for GET /api/portfolio/tech-stack endpoint
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

describe('GET /api/portfolio/tech-stack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tech stack items successfully', async () => {
    const mockTechStack = [
      {
        id: '1',
        name: 'React',
        icon_url: 'https://example.com/react.svg',
        display_order: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'TypeScript',
        icon_url: 'https://example.com/typescript.svg',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockTechStack,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockTechStack);
    expect(data.data).toHaveLength(2);
  });

  it('should return empty array when no tech stack items exist', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch tech stack');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should order items by display_order ascending', async () => {
    const mockTechStack = [
      { id: '1', name: 'React', display_order: 0 },
      { id: '2', name: 'TypeScript', display_order: 1 },
      { id: '3', name: 'Node.js', display_order: 2 },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockTechStack,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/tech-stack');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
