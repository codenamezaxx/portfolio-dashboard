/**
 * Tests for useStatistics hook
 * 
 * Tests the statistics fetching functionality including:
 * - Successful statistics fetch
 * - Error handling
 * - Loading states
 * - Refetch functionality
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useStatistics } from './useStatistics';

// Mock fetch
global.fetch = jest.fn();

describe('useStatistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch statistics successfully', async () => {
    const mockStats = {
      projects: 5,
      achievements: 10,
      techStack: 15,
      lastUpdated: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockStats }),
    });

    const { result } = renderHook(() => useStatistics());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toEqual(mockStats);
    expect(result.current.error).toBeNull();
  });

  it('should handle 401 unauthorized error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toBeNull();
    expect(result.current.error).toBe('Unauthorized - please log in again');
  });

  it('should handle generic fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toBeNull();
    expect(result.current.error).toBe('Failed to fetch statistics');
  });

  it('should handle network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toBeNull();
    expect(result.current.error).toBe('Failed to fetch statistics');
  });

  it('should refetch statistics', async () => {
    const mockStats = {
      projects: 5,
      achievements: 10,
      techStack: 15,
      lastUpdated: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockStats }),
    });

    const { result } = renderHook(() => useStatistics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics).toEqual(mockStats);

    // Refetch
    await result.current.refetch();

    expect(result.current.statistics).toEqual(mockStats);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should include credentials in fetch request', async () => {
    const mockStats = {
      projects: 5,
      achievements: 10,
      techStack: 15,
      lastUpdated: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockStats }),
    });

    renderHook(() => useStatistics());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/statistics',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });
});
