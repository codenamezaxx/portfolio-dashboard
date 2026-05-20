/**
 * Tests for useRealtimeUpdates Hook
 */

import { renderHook } from '@testing-library/react';
import { useRealtimeUpdates, useAllPortfolioUpdates, useContentTypeUpdates } from './useRealtimeUpdates';
import * as realtimeModule from '@/lib/realtime';

// Mock the modules
jest.mock('@/lib/realtime');
jest.mock('@/lib/cache-invalidation');

describe('useRealtimeUpdates Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRealtimeUpdates', () => {
    it('should subscribe to content updates on mount', () => {
      const mockSubscribe = jest.fn().mockReturnValue('listener_123');
      (realtimeModule.subscribeToContentUpdates as jest.Mock) = mockSubscribe;

      renderHook(() => useRealtimeUpdates({ tables: ['profiles'] }));

      expect(mockSubscribe).toHaveBeenCalled();
    });

    it('should call custom callback on update', () => {
      const mockCallback = jest.fn();
      const mockSubscribe = jest.fn((tables, callback) => {
        callback({
          type: 'UPDATE',
          table: 'profiles',
          record: { id: '1', name: 'Test' },
          timestamp: new Date()
        });
        return 'listener_123';
      });

      (realtimeModule.subscribeToContentUpdates as jest.Mock) = mockSubscribe;

      renderHook(() => useRealtimeUpdates({
        tables: ['profiles'],
        onUpdate: mockCallback
      }));

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should unsubscribe on unmount', () => {
      const mockUnsubscribe = jest.fn();
      (realtimeModule.unsubscribeFromContentUpdates as jest.Mock) = mockUnsubscribe;

      const mockSubscribe = jest.fn().mockReturnValue('listener_123');
      (realtimeModule.subscribeToContentUpdates as jest.Mock) = mockSubscribe;

      const { unmount } = renderHook(() => useRealtimeUpdates({ tables: ['profiles'] }));

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledWith('listener_123');
    });
  });

  describe('useAllPortfolioUpdates', () => {
    it('should subscribe to all portfolio updates', () => {
      const mockSubscribe = jest.fn().mockReturnValue('listener_123');
      (realtimeModule.subscribeToAllPortfolioUpdates as jest.Mock) = mockSubscribe;

      renderHook(() => useAllPortfolioUpdates());

      expect(mockSubscribe).toHaveBeenCalled();
    });
  });

  describe('useContentTypeUpdates', () => {
    it('should subscribe to specific content type', () => {
      const mockSubscribe = jest.fn().mockReturnValue('listener_123');
      (realtimeModule.subscribeToContentUpdates as jest.Mock) = mockSubscribe;

      renderHook(() => useContentTypeUpdates('projects'));

      expect(mockSubscribe).toHaveBeenCalledWith(['projects'], expect.any(Function));
    });
  });
});
