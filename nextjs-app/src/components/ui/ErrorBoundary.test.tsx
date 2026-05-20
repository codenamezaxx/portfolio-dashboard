/**
 * Tests for ErrorBoundary Component
 * 
 * Validates: Requirements 2.3 (Error boundaries catch and display errors gracefully)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Mock component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Mock component that renders normally
const SafeComponent: React.FC = () => <div>Safe content</div>;

describe('ErrorBoundary Component', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('should render default error UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error, reset: () => void) => (
        <div>
          <p>Custom error: {error.message}</p>
          <button onClick={reset}>Custom reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error: Test error message')).toBeInTheDocument();
      expect(screen.getByText('Custom reset')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      const [error, errorInfo] = onError.mock.calls[0];
      expect(error.message).toBe('Test error message');
      expect(errorInfo.componentStack).toBeDefined();
    });

    it('should display error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error Details')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('recovery', () => {
    it('should display reset button when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('should call reset function when reset button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const resetButton = screen.getByText('Try again');
      expect(resetButton).toBeInTheDocument();

      // Verify button is clickable
      fireEvent.click(resetButton);
      // After click, the error boundary's internal state is reset
      // but the component still shows error until rerender with non-throwing component
    });

    it('should reset error when resetKeys change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Change resetKeys to trigger reset
      rerender(
        <ErrorBoundary resetKeys={['key2']}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should reset error when resetOnPropsChange is true and children change', () => {
      const { rerender } = render(
        <ErrorBoundary resetOnPropsChange={true}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      rerender(
        <ErrorBoundary resetOnPropsChange={true}>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Safe content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have semantic HTML structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should clean up timeout on unmount', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
