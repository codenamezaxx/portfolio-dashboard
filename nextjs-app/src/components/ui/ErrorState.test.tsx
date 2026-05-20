/**
 * Tests for ErrorState Component
 * 
 * Validates: Requirements 2.3 (Error states display correctly with recovery actions)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState Component', () => {
  describe('rendering', () => {
    it('should render children when not in error state', () => {
      render(
        <ErrorState isError={false}>
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render error message when in error state', () => {
      render(
        <ErrorState isError={true} message="Something went wrong" />
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should not render children when in error state', () => {
      render(
        <ErrorState isError={true} message="Error">
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should render error description when provided', () => {
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          description="Please try again later"
        />
      );

      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(
        <ErrorState isError={true} message="Error" />
      );

      expect(screen.queryByText(/Please try/)).not.toBeInTheDocument();
    });
  });

  describe('error types', () => {
    it('should render validation error with correct styling', () => {
      const { container } = render(
        <ErrorState isError={true} errorType="validation" message="Validation error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-yellow-50');
    });

    it('should render network error with correct styling', () => {
      const { container } = render(
        <ErrorState isError={true} errorType="network" message="Network error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-orange-50');
    });

    it('should render server error with correct styling', () => {
      const { container } = render(
        <ErrorState isError={true} errorType="server" message="Server error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-red-50');
    });

    it('should render auth error with correct styling', () => {
      const { container } = render(
        <ErrorState isError={true} errorType="auth" message="Auth error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-red-50');
    });

    it('should render generic error with correct styling', () => {
      const { container } = render(
        <ErrorState isError={true} errorType="generic" message="Generic error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-red-50');
    });

    it('should use generic error type by default', () => {
      const { container } = render(
        <ErrorState isError={true} message="Error" />
      );

      const errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-red-50');
    });
  });

  describe('recovery actions', () => {
    it('should render retry button when showRetry is true and onRetry is provided', () => {
      const onRetry = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showRetry={true}
          onRetry={onRetry}
        />
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should not render retry button when showRetry is false', () => {
      const onRetry = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showRetry={false}
          onRetry={onRetry}
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('should render dismiss button when showDismiss is true and onDismiss is provided', () => {
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showDismiss={true}
          onDismiss={onDismiss}
        />
      );

      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('should not render dismiss button when showDismiss is false', () => {
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showDismiss={false}
          onDismiss={onDismiss}
        />
      );

      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showRetry={true}
          onRetry={onRetry}
        />
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showDismiss={true}
          onDismiss={onDismiss}
        />
      );

      fireEvent.click(screen.getByText('Dismiss'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should use custom button text when provided', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showRetry={true}
          showDismiss={true}
          onRetry={onRetry}
          onDismiss={onDismiss}
          retryButtonText="Retry Now"
          dismissButtonText="Close"
        />
      );

      expect(screen.getByText('Retry Now')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('should show both buttons by default', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });
  });

  describe('full screen mode', () => {
    it('should render full screen overlay when isFullScreen is true', () => {
      const { container } = render(
        <ErrorState isError={true} isFullScreen={true} message="Error" />
      );

      const overlay = container.querySelector('.fixed');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('inset-0', 'z-50');
    });

    it('should not render full screen overlay when isFullScreen is false', () => {
      const { container } = render(
        <ErrorState isError={true} isFullScreen={false} message="Error" />
      );

      const overlay = container.querySelector('.fixed');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should display error in centered container in full screen mode', () => {
      const { container } = render(
        <ErrorState isError={true} isFullScreen={true} message="Error" />
      );

      const centered = container.querySelector('.max-w-md');
      expect(centered).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorState isError={true} message="Error" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Error');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should use custom aria label when provided', () => {
      render(
        <ErrorState isError={true} message="Error" ariaLabel="Validation failed" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Validation failed');
    });

    it('should have semantic role for alert', () => {
      render(
        <ErrorState isError={true} message="Error" />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ErrorState isError={true} message="Error" className="custom-class" />
      );

      const errorDiv = container.querySelector('.custom-class');
      expect(errorDiv).toBeInTheDocument();
    });

    it('should support dark mode classes', () => {
      const { container } = render(
        <ErrorState isError={true} isFullScreen={true} message="Error" />
      );

      const overlay = container.querySelector('.dark\\:bg-gray-900\\/80');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('should switch from error to content', () => {
      const { rerender } = render(
        <ErrorState isError={true} message="Error">
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      rerender(
        <ErrorState isError={false} message="Error">
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should switch from content to error', () => {
      const { rerender } = render(
        <ErrorState isError={false} message="Error">
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(
        <ErrorState isError={true} message="Error">
          <div>Content</div>
        </ErrorState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should update error message', () => {
      const { rerender } = render(
        <ErrorState isError={true} message="Error 1" />
      );

      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(
        <ErrorState isError={true} message="Error 2" />
      );

      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });

    it('should change error type', () => {
      const { container, rerender } = render(
        <ErrorState isError={true} errorType="validation" message="Error" />
      );

      let errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-yellow-50');

      rerender(
        <ErrorState isError={true} errorType="server" message="Error" />
      );

      errorDiv = container.querySelector('[role="alert"]');
      expect(errorDiv).toHaveClass('bg-red-50');
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      render(
        <ErrorState isError={true} message="" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should handle very long error message', () => {
      const longMessage = 'A'.repeat(500);
      render(
        <ErrorState isError={true} message={longMessage} />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error: <>&"\'';
      render(
        <ErrorState isError={true} message={specialMessage} />
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      render(
        <ErrorState isError={false}>
          <div>Content 1</div>
          <div>Content 2</div>
        </ErrorState>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should not render buttons when callbacks are not provided', () => {
      render(
        <ErrorState 
          isError={true} 
          message="Error"
          showRetry={true}
          showDismiss={true}
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(ErrorState.displayName).toBe('ErrorState');
    });
  });
});
