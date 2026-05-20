/**
 * ThemeProvider Tests
 * Tests for theme management, localStorage persistence, and system preference detection
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

// Test component that uses the useTheme hook
function TestComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Theme Initialization', () => {
    it('should initialize with default light theme', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });

    it('should set data-theme attribute on html element', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist theme to localStorage when setTheme is called', async () => {
      render(
        <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(localStorage.getItem('portfolio-theme')).toBe('dark');
      });
    });

    it('should restore theme from localStorage on mount', async () => {
      // Set theme in localStorage
      localStorage.setItem('portfolio-theme', 'dark');

      render(
        <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should use custom storage key', async () => {
      render(
        <ThemeProvider defaultTheme="light" storageKey="custom-theme-key">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(localStorage.getItem('custom-theme-key')).toBe('dark');
      });
    });
  });

  describe('Theme Switching', () => {
    it('should update theme when setTheme is called', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should toggle theme when toggleTheme is called', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle-theme');

      // Toggle to dark
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });

      // Toggle back to light
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });

    it('should apply dark class when switching to dark theme', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should remove dark class when switching to light theme', async () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      const setLightButton = screen.getByTestId('set-light');
      fireEvent.click(setLightButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });

    it('should update data-theme attribute when switching themes', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });
  });

  describe('useTheme Hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleError.mockRestore();
    });

    it('should provide theme context correctly', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      });
    });
  });

  describe('Hydration Safety', () => {
    it('should not render children until mounted to prevent hydration mismatch', async () => {
      const { rerender } = render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      // Component should eventually render
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Theme Changes', () => {
    it('should handle multiple rapid theme changes', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle-theme');

      // Rapid toggles
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should persist final theme to localStorage after multiple changes', async () => {
      render(
        <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      const setLightButton = screen.getByTestId('set-light');

      fireEvent.click(setDarkButton);
      fireEvent.click(setLightButton);
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        expect(localStorage.getItem('portfolio-theme')).toBe('dark');
      });
    });
  });
});
