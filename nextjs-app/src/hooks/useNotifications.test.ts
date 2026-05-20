/**
 * Tests for useNotifications Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useNotifications } from './useNotifications';
import * as notificationsModule from '@/lib/notifications';

// Mock the notifications module
jest.mock('@/lib/notifications');

describe('useNotifications Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNotifications', () => {
    it('should initialize with empty notifications', () => {
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});

      const { result } = renderHook(() => useNotifications());

      expect(result.current.notifications).toEqual([]);
    });

    it('should provide show method', () => {
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});
      (notificationsModule.showNotification as jest.Mock).mockReturnValue('notification_123');

      const { result } = renderHook(() => useNotifications());

      expect(typeof result.current.show).toBe('function');
    });

    it('should provide dismiss method', () => {
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});

      const { result } = renderHook(() => useNotifications());

      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should provide convenience methods', () => {
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});

      const { result } = renderHook(() => useNotifications());

      expect(typeof result.current.success).toBe('function');
      expect(typeof result.current.error).toBe('function');
      expect(typeof result.current.info).toBe('function');
      expect(typeof result.current.warning).toBe('function');
      expect(typeof result.current.contentUpdate).toBe('function');
      expect(typeof result.current.sync).toBe('function');
    });

    it('should call show method', () => {
      const mockShow = jest.fn().mockReturnValue('notification_123');
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});
      (notificationsModule.showNotification as jest.Mock) = mockShow;

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.show('success', 'Test', 'Message');
      });

      expect(mockShow).toHaveBeenCalled();
    });

    it('should call dismiss method', () => {
      const mockDismiss = jest.fn();
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(() => {});
      (notificationsModule.dismissNotification as jest.Mock) = mockDismiss;

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.dismiss('notification_123');
      });

      expect(mockDismiss).toHaveBeenCalledWith('notification_123');
    });

    it('should unsubscribe on unmount', () => {
      const mockUnsubscribe = jest.fn();
      (notificationsModule.subscribeToNotifications as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useNotifications());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
