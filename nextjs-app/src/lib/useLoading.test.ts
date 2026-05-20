/**
 * Tests for useLoading Hook
 * 
 * Validates: Requirements 2.3 (Loading states display correctly)
 */

import { renderHook, act } from '@testing-library/react';
import { useLoading } from './useLoading';

describe('useLoading Hook', () => {
  describe('initialization', () => {
    it('should initialize with false by default', () => {
      const { result } = renderHook(() => useLoading());
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with provided initial state', () => {
      const { result } = renderHook(() => useLoading(true));
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('start method', () => {
    it('should set isLoading to true', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.start();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should remain true when called multiple times', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.start();
        result.current.start();
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('stop method', () => {
    it('should set isLoading to false', () => {
      const { result } = renderHook(() => useLoading(true));

      act(() => {
        result.current.stop();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should remain false when called multiple times', () => {
      const { result } = renderHook(() => useLoading(true));

      act(() => {
        result.current.stop();
        result.current.stop();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('toggle method', () => {
    it('should toggle isLoading from false to true', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should toggle isLoading from true to false', () => {
      const { result } = renderHook(() => useLoading(true));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.toggle(); // true
        result.current.toggle(); // false
        result.current.toggle(); // true
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('setLoading method', () => {
    it('should set isLoading to specified value', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('integration', () => {
    it('should work with async operations', async () => {
      const { result } = renderHook(() => useLoading());

      const mockAsyncFn = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isLoading).toBe(true);

      await mockAsyncFn();

      act(() => {
        result.current.stop();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useLoading());

      act(() => {
        result.current.start();
        result.current.stop();
        result.current.start();
        result.current.toggle();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
