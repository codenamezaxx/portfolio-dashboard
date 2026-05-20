/**
 * @jest-environment node
 * 
 * Contact Info History API Route Tests
 * 
 * Tests for the contact information version history endpoints including:
 * - GET endpoint for fetching version history
 * - Pagination support
 * - Authentication checks
 * - Error handling
 */

import { GET } from './route';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('@/lib/auth', () => ({
  verifySession: jest.fn(),
}));

describe('/api/content/contact-info/history', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch version history successfully', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const mockHistory = [
        {
          id: 'v1',
          contact_info_id: '1',
          admin_user_id: 'user1',
          github_url: 'https://github.com/user1',
          linkedin_url: 'https://linkedin.com/in/user1',
          instagram_url: 'https://instagram.com/user1',
          telegram_url: 'https://t.me/user1',
          email: 'user1@example.com',
          created_at: new Date().toISOString(),
        },
        {
          id: 'v2',
          contact_info_id: '1',
          admin_user_id: 'user1',
          github_url: 'https://github.com/user2',
          linkedin_url: 'https://linkedin.com/in/user2',
          instagram_url: 'https://instagram.com/user2',
          telegram_url: 'https://t.me/user2',
          email: 'user2@example.com',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: mockHistory,
              error: null,
              count: 2,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockHistory);
      expect(data.total).toBe(2);
      expect(data.limit).toBe(50);
      expect(data.offset).toBe(0);
    });

    it('should support pagination with limit and offset', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const mockHistory = [
        {
          id: 'v1',
          contact_info_id: '1',
          admin_user_id: 'user1',
          github_url: 'https://github.com/user1',
          linkedin_url: 'https://linkedin.com/in/user1',
          instagram_url: 'https://instagram.com/user1',
          telegram_url: 'https://t.me/user1',
          email: 'user1@example.com',
          created_at: new Date().toISOString(),
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: mockHistory,
              error: null,
              count: 100,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history?limit=10&offset=20');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(10);
      expect(data.offset).toBe(20);
      expect(data.total).toBe(100);
    });

    it('should cap limit at 100', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: [],
              error: null,
              count: 0,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history?limit=200');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(100);
    });

    it('should reject request without authentication', async () => {
      (verifySession as jest.Mock).mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return empty array if no history exists', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: [],
              error: null,
              count: 0,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.total).toBe(0);
    });

    it('should handle database errors', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
              count: null,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch version history');
    });

    it('should order by created_at descending', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const mockHistory = [];

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: mockHistory,
              error: null,
              count: 0,
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock) = mockFrom;

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/history');
      await GET(request);

      const orderCall = mockFrom().select().order;
      expect(orderCall).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });
});
