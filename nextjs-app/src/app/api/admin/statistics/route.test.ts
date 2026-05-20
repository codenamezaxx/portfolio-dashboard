/**
 * Tests for statistics API endpoint
 * 
 * Tests the /api/admin/statistics endpoint including:
 * - Successful statistics fetch with authentication
 * - Unauthorized access without authentication
 * - Error handling for database failures
 * - Correct response format
 */

import { NextRequest } from 'next/server';
import { GET } from './route';

// Mock dependencies
jest.mock('@/lib/auth');
jest.mock('@/lib/db');

describe('GET /api/admin/statistics', () => {
  let mockVerifySession;
  let mockSupabaseFrom;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get mocked modules
    const authLib = require('@/lib/auth');
    const dbLib = require('@/lib/db');
    
    mockVerifySession = authLib.verifySession;
    mockSupabaseFrom = dbLib.supabase.from;
  });

  it('should return statistics for authenticated user', async () => {
    // Mock session
    mockVerifySession.mockReturnValue({
      userId: 'test-user-id',
      email: 'test@example.com',
    });

    // Mock database queries - return resolved promises
    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: null,
        count: 5,
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
      method: 'GET',
      headers: {
        cookie: 'session_token=valid-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveProperty('projects');
    expect(data.data).toHaveProperty('achievements');
    expect(data.data).toHaveProperty('techStack');
    expect(data.data).toHaveProperty('lastUpdated');
  });

  it('should return 401 for unauthenticated request', async () => {
    // Mock no session
    mockVerifySession.mockReturnValue(null);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 500 on database error', async () => {
    // Mock session
    mockVerifySession.mockReturnValue({
      userId: 'test-user-id',
      email: 'test@example.com',
    });

    // Mock database error - return resolved promises with errors
    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: null,
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
      method: 'GET',
      headers: {
        cookie: 'session_token=valid-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch statistics');
  });

  it('should return correct statistics counts', async () => {
    // Mock session
    mockVerifySession.mockReturnValue({
      userId: 'test-user-id',
      email: 'test@example.com',
    });

    // Mock database queries with specific counts
    const counts = { projects: 5, achievements: 10, tech_stack: 15 };
    mockSupabaseFrom.mockImplementation((table) => {
      return {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: null,
          count: counts[table] || 0,
        }),
      };
    });

    const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
      method: 'GET',
      headers: {
        cookie: 'session_token=valid-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.projects).toBe(5);
    expect(data.data.achievements).toBe(10);
    expect(data.data.techStack).toBe(15);
  });

  it('should include lastUpdated timestamp', async () => {
    // Mock session
    mockVerifySession.mockReturnValue({
      userId: 'test-user-id',
      email: 'test@example.com',
    });

    // Mock database queries
    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: null,
        count: 0,
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
      method: 'GET',
      headers: {
        cookie: 'session_token=valid-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.lastUpdated).toBeDefined();
    expect(new Date(data.data.lastUpdated)).toBeInstanceOf(Date);
  });
});
