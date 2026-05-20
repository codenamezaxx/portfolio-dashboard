/**
 * @jest-environment node
 * 
 * Contact Info API Route Tests
 * 
 * Tests for the contact information API endpoints including:
 * - GET endpoint for fetching contact info
 * - PUT endpoint for updating contact info
 * - URL validation
 * - Authentication checks
 * - Error handling
 */

import { GET, PUT } from './route';
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

describe('/api/content/contact-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch contact info successfully', async () => {
      const mockData = [{
        id: '1',
        github_url: 'https://github.com/testuser',
        linkedin_url: 'https://linkedin.com/in/testuser',
        instagram_url: 'https://instagram.com/testuser',
        telegram_url: 'https://t.me/testuser',
        email: 'test@example.com',
        updated_at: new Date().toISOString(),
      }];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockData);
    });

    it('should return empty array if no contact info exists', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('should handle database errors', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Database error'),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch contact information');
    });
  });

  describe('PUT', () => {
    it('should update contact info successfully', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const mockUpdatedData = {
        id: '1',
        github_url: 'https://github.com/newuser',
        linkedin_url: 'https://linkedin.com/in/newuser',
        instagram_url: 'https://instagram.com/newuser',
        telegram_url: 'https://t.me/newuser',
        email: 'new@example.com',
        updated_at: new Date().toISOString(),
      };

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'contact_info') {
          return {
            upsert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockUpdatedData,
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === 'contact_info_history') {
          return {
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          };
        }
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          githubUrl: 'https://github.com/newuser',
          linkedinUrl: 'https://linkedin.com/in/newuser',
          instagramUrl: 'https://instagram.com/newuser',
          telegramUrl: 'https://t.me/newuser',
          email: 'new@example.com',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockUpdatedData);
      expect(data.message).toBe('Contact information updated successfully');
    });

    it('should reject request without authentication', async () => {
      (verifySession as jest.Mock).mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          githubUrl: 'https://github.com/testuser',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should validate GitHub URL format', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          githubUrl: 'invalid-url',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details.githubUrl).toBeDefined();
    });

    it('should validate LinkedIn URL format', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          linkedinUrl: 'not-a-url',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details.linkedinUrl).toBeDefined();
    });

    it('should validate email format', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details.email).toBeDefined();
    });

    it('should require at least one field', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({}),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should handle database errors during update', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          githubUrl: 'https://github.com/testuser',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update contact information');
    });

    it('should accept null values for optional fields', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const mockUpdatedData = {
        id: '1',
        github_url: null,
        linkedin_url: 'https://linkedin.com/in/testuser',
        instagram_url: null,
        telegram_url: null,
        email: 'test@example.com',
        updated_at: new Date().toISOString(),
      };

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'contact_info') {
          return {
            upsert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockUpdatedData,
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === 'contact_info_history') {
          return {
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          };
        }
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: JSON.stringify({
          githubUrl: null,
          linkedinUrl: 'https://linkedin.com/in/testuser',
          instagramUrl: null,
          telegramUrl: null,
          email: 'test@example.com',
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockUpdatedData);
    });

    it('should handle malformed JSON', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info', {
        method: 'PUT',
        body: 'invalid json',
      });

      const response = await PUT(request);

      expect(response.status).toBe(500);
    });
  });
});
