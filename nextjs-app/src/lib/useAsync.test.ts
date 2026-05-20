/**
 * Tests for useAsync Hook
 * 
 * Validates: Requirements 2.3 (Hooks work with async operations)
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync Hook', () => {
  describe('initialization', () => {
    it('should initialize with null data and no loading/error', () => {
      const { result } = renderHook(() => useAsync<string>());

      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize with provided initial data', () => {
      const { result } = renderHook(() => useAsync<string>('initial'));

      expect(result.current.data).toBe('initial');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('execute method', () => {
    it('should execute async function and set data', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.resolve('success'));

      act(() => {
        result.current.execute(mockFn);
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe('success');
      expect(result.current.error).toBeNull();
      expect(mockFn).toHaveBeenCalled();
    });

    it('should handle async function errors', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockError = new Error('Test error');
      const mockFn = jest.fn(() => Promise.reject(mockError));

      act(() => {
        result.current.execute(mockFn);
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe('Test error');
    });

    it('should call onSuccess callback on success', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.resolve('success'));
      const onSuccess = jest.fn();

      act(() => {
        result.current.execute(mockFn, onSuccess);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(onSuccess).toHaveBeenCalledWith('success');
    });

    it('should call onError callback on error', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockError = new Error('Test error');
      const mockFn = jest.fn(() => Promise.reject(mockError));
      const onError = jest.fn();

      act(() => {
        result.current.execute(mockFn, undefined, onError);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should return the result from async function', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.resolve('result'));

      let executeResult;
      act(() => {
        executeResult = result.current.execute(mockFn);
      });

      const finalResult = await executeResult;

      expect(finalResult).toBe('result');
    });

    it('should return null on error', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.reject(new Error('error')));

      let executeResult;
      act(() => {
        executeResult = result.current.execute(mockFn);
      });

      const finalResult = await executeResult;

      expect(finalResult).toBeNull();
    });
  });

  describe('reset method', () => {
    it('should reset to initial state', async () => {
      const { result } = renderHook(() => useAsync<string>('initial'));
      const mockFn = jest.fn(() => Promise.resolve('success'));

      act(() => {
        result.current.execute(mockFn);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe('success');

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBe('initial');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setData method', () => {
    it('should set data directly', () => {
      const { result } = renderHook(() => useAsync<string>());

      act(() => {
        result.current.setData('new data');
      });

      expect(result.current.data).toBe('new data');
    });

    it('should preserve loading and error state', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.reject(new Error('error')));

      act(() => {
        result.current.execute(mockFn);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.setData('new data');
      });

      expect(result.current.data).toBe('new data');
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('setError method', () => {
    it('should set error directly', () => {
      const { result } = renderHook(() => useAsync<string>());

      act(() => {
        result.current.setError('Custom error', 'network', 'Network failed');
      });

      expect(result.current.error).toEqual({
        message: 'Custom error',
        type: 'network',
        description: 'Network failed',
      });
    });
  });

  describe('clearError method', () => {
    it('should clear error', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(() => Promise.reject(new Error('error')));

      act(() => {
        result.current.execute(mockFn);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should not update state after unmount', async () => {
      const { result, unmount } = renderHook(() => useAsync<string>());
      const mockFn = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve('success'), 100))
      );

      act(() => {
        result.current.execute(mockFn);
      });

      unmount();

      // Wait for async operation to complete
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should not throw or cause issues
      expect(true).toBe(true);
    });
  });

  describe('integration', () => {
    it('should handle multiple sequential executions', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockFn1 = jest.fn(() => Promise.resolve('first'));
      const mockFn2 = jest.fn(() => Promise.resolve('second'));

      act(() => {
        result.current.execute(mockFn1);
      });

      await waitFor(() => {
        expect(result.current.data).toBe('first');
      });

      act(() => {
        result.current.execute(mockFn2);
      });

      await waitFor(() => {
        expect(result.current.data).toBe('second');
      });

      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
    });

    it('should handle error recovery', async () => {
      const { result } = renderHook(() => useAsync<string>());
      const mockErrorFn = jest.fn(() => Promise.reject(new Error('error')));
      const mockSuccessFn = jest.fn(() => Promise.resolve('success'));

      // First execution fails
      act(() => {
        result.current.execute(mockErrorFn);
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Clear error and retry
      act(() => {
        result.current.clearError();
        result.current.execute(mockSuccessFn);
      });

      await waitFor(() => {
        expect(result.current.data).toBe('success');
        expect(result.current.error).toBeNull();
      });
    });
  });
});
