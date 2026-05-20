/**
 * useTheme Hook Tests
 * Tests for the useTheme hook functionality
 */

import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeProvider';
import React from 'react';

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
  });

  it('should return theme context with correct initial values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { defaultTheme: 'light' }, children)
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should allow setting theme to dark', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { defaultTheme: 'light' }, children)
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should allow setting theme to light', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { defaultTheme: 'dark' }, children)
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { defaultTheme: 'light' }, children)
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should persist theme changes to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(
        ThemeProvider,
        { defaultTheme: 'light', storageKey: 'test-theme' },
        children
      )
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorage.getItem('test-theme')).toBe('dark');
  });

  it('should restore theme from localStorage', () => {
    localStorage.setItem('test-theme', 'dark');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(
        ThemeProvider,
        { defaultTheme: 'light', storageKey: 'test-theme' },
        children
      )
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });

  it('should throw error when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');

    consoleError.mockRestore();
  });
});
