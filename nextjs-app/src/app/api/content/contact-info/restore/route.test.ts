/**
 * @jest-environment node
 * 
 * Contact Info Restore API Route Tests
 * 
 * Tests for the contact information restore endpoint including:
 * - POST endpoint for restoring a previous version
 * - Version validation
 * - Authentication checks
 * - Error handling
 */

import { POST } from './route';
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

describe('/api/content/contact-info/restore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should reject request without authentication', async () => {
      (verifySession as jest.Mock).mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/restore', {
        method: 'POST',
        body: JSON.stringify({
          versionId: '550e8400-e29b-41d4-a716-446655440000',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should validate version ID format', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/restore', {
        method: 'POST',
        body: JSON.stringify({
          versionId: 'invalid-id',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details.versionId).toBeDefined();
    });

    it('should return 404 if version not found', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Not found'),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/restore', {
        method: 'POST',
        body: JSON.stringify({
          versionId: '550e8400-e29b-41d4-a716-446655440000',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Version not found');
    });

    it('should handle malformed JSON', async () => {
      (verifySession as jest.Mock).mockReturnValue({ userId: 'test-user' });

      const request = new NextRequest('http://localhost:3000/api/content/contact-info/restore', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
});
