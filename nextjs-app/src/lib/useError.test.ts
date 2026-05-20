/**
 * Tests for useError Hook
 * 
 * Validates: Requirements 2.3 (Error states display with clear messages)
 */

import { renderHook, act } from '@testing-library/react';
import { useError } from './useError';

describe('useError Hook', () => {
  describe('initialization', () => {
    it('should initialize with no error', () => {
      const { result } = renderHook(() => useError());
      expect(result.current.error).toBeNull();
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('setError method', () => {
    it('should set error with message and default type', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toEqual({
        message: 'Test error',
        type: 'generic',
        description: undefined,
      });
      expect(result.current.hasError).toBe(true);
    });

    it('should set error with custom type', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('Network error', 'network');
      });

      expect(result.current.error).toEqual({
        message: 'Network error',
        type: 'network',
        description: undefined,
      });
    });

    it('should set error with description', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('Validation error', 'validation', 'Email is required');
      });

      expect(result.current.error).toEqual({
        message: 'Validation error',
        type: 'validation',
        description: 'Email is required',
      });
    });

    it('should support all error types', () => {
      const { result } = renderHook(() => useError());
      const errorTypes = ['validation', 'network', 'server', 'auth', 'generic'] as const;

      errorTypes.forEach((type) => {
        act(() => {
          result.current.setError('Test', type);
        });

        expect(result.current.error?.type).toBe(type);
      });
    });
  });

  describe('clearError method', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.hasError).toBe(true);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.hasError).toBe(false);
    });

    it('should handle clearing when no error exists', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('setErrorInfo method', () => {
    it('should set error info directly', () => {
      const { result } = renderHook(() => useError());

      const errorInfo = {
        message: 'Custom error',
        type: 'server' as const,
        description: 'Server error details',
      };

      act(() => {
        result.current.setErrorInfo(errorInfo);
      });

      expect(result.current.error).toEqual(errorInfo);
      expect(result.current.hasError).toBe(true);
    });

    it('should clear error when setting null', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.hasError).toBe(true);

      act(() => {
        result.current.setErrorInfo(null);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('integration', () => {
    it('should handle error lifecycle', () => {
      const { result } = renderHook(() => useError());

      // Initial state
      expect(result.current.hasError).toBe(false);

      // Set error
      act(() => {
        result.current.setError('Operation failed', 'network');
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.error?.type).toBe('network');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.hasError).toBe(false);
    });

    it('should replace previous error when setting new one', () => {
      const { result } = renderHook(() => useError());

      act(() => {
        result.current.setError('First error', 'network');
      });

      expect(result.current.error?.message).toBe('First error');

      act(() => {
        result.current.setError('Second error', 'server');
      });

      expect(result.current.error?.message).toBe('Second error');
      expect(result.current.error?.type).toBe('server');
    });
  });
});
