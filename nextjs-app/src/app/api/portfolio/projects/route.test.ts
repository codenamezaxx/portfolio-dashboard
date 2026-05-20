/**
 * Tests for GET /api/portfolio/projects endpoint
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

describe('GET /api/portfolio/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return projects successfully', async () => {
    const mockProjects = [
      {
        id: '1',
        title: 'Portfolio Website',
        description: 'A modern portfolio website built with Next.js',
        category: 'web',
        image_url: 'https://example.com/portfolio.jpg',
        technologies: ['Next.js', 'React', 'TypeScript'],
        github_link: 'https://github.com/example/portfolio',
        live_link: 'https://portfolio.example.com',
        demo_link: null,
        display_order: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce platform',
        category: 'web',
        image_url: 'https://example.com/ecommerce.jpg',
        technologies: ['Node.js', 'React', 'MongoDB'],
        github_link: 'https://github.com/example/ecommerce',
        live_link: 'https://ecommerce.example.com',
        demo_link: null,
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProjects,
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockProjects);
    expect(data.data).toHaveLength(2);
  });

  it('should return empty array when no projects exist', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch projects');
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

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
    const response = await GET(request);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should include all project fields in response', async () => {
    const mockProject = {
      id: '1',
      title: 'Portfolio Website',
      description: 'A modern portfolio website',
      category: 'web',
      image_url: 'https://example.com/portfolio.jpg',
      technologies: ['Next.js', 'React'],
      github_link: 'https://github.com/example/portfolio',
      live_link: 'https://portfolio.example.com',
      demo_link: null,
      display_order: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [mockProject],
          error: null,
        }),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(data.data[0]).toHaveProperty('id');
    expect(data.data[0]).toHaveProperty('title');
    expect(data.data[0]).toHaveProperty('description');
    expect(data.data[0]).toHaveProperty('category');
    expect(data.data[0]).toHaveProperty('image_url');
    expect(data.data[0]).toHaveProperty('technologies');
    expect(data.data[0]).toHaveProperty('github_link');
    expect(data.data[0]).toHaveProperty('live_link');
  });

  it('should handle unexpected errors gracefully', async () => {
    (supabase.from as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const request = new NextRequest('http://localhost:3000/api/portfolio/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
