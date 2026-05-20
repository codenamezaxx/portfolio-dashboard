/**
 * Tests for ErrorAlert Component
 * 
 * Validates: Requirements 2.3 (Error alert component with retry functionality)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert Component', () => {
  describe('rendering', () => {
    it('should render error message', () => {
      render(
        <ErrorAlert
          message="Test error"
          type="generic"
        />
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <ErrorAlert
          message="Test error"
          description="Error details"
          type="generic"
        />
      );

      expect(screen.getByText('Error details')).toBeInTheDocument();
    });

    it('should render retry button when showRetry is true', () => {
      render(
        <ErrorAlert
          message="Test error"
          showRetry={true}
          onRetry={() => {}}
          type="generic"
        />
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should render dismiss button when showDismiss is true', () => {
      render(
        <ErrorAlert
          message="Test error"
          showDismiss={true}
          onDismiss={() => {}}
          type="generic"
        />
      );

      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('should not render retry button when showRetry is false', () => {
      render(
        <ErrorAlert
          message="Test error"
          showRetry={false}
          type="generic"
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('should not render dismiss button when showDismiss is false', () => {
      render(
        <ErrorAlert
          message="Test error"
          showDismiss={false}
          type="generic"
        />
      );

      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });
  });

  describe('error types', () => {
    it('should render validation error with correct styling', () => {
      const { container } = render(
        <ErrorAlert
          message="Validation error"
          type="validation"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-yellow-50');
    });

    it('should render network error with correct styling', () => {
      const { container } = render(
        <ErrorAlert
          message="Network error"
          type="network"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-orange-50');
    });

    it('should render server error with correct styling', () => {
      const { container } = render(
        <ErrorAlert
          message="Server error"
          type="server"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-red-50');
    });

    it('should render auth error with correct styling', () => {
      const { container } = render(
        <ErrorAlert
          message="Auth error"
          type="auth"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-red-50');
    });

    it('should render generic error with correct styling', () => {
      const { container } = render(
        <ErrorAlert
          message="Generic error"
          type="generic"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-red-50');
    });
  });

  describe('callbacks', () => {
    it('should call onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();

      render(
        <ErrorAlert
          message="Test error"
          showRetry={true}
          onRetry={onRetry}
          type="generic"
        />
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalled();
    });

    it('should call onDismiss when dismiss button is clicked', () => {
      const onDismiss = jest.fn();

      render(
        <ErrorAlert
          message="Test error"
          showDismiss={true}
          onDismiss={onDismiss}
          type="generic"
        />
      );

      fireEvent.click(screen.getByText('Dismiss'));
      expect(onDismiss).toHaveBeenCalled();
    });

    it('should support custom button text', () => {
      const onRetry = jest.fn();
      const onDismiss = jest.fn();

      render(
        <ErrorAlert
          message="Test error"
          showRetry={true}
          onRetry={onRetry}
          showDismiss={true}
          onDismiss={onDismiss}
          retryButtonText="Retry Now"
          dismissButtonText="Close"
          type="generic"
        />
      );

      expect(screen.getByText('Retry Now')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorAlert
          message="Test error"
          type="generic"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveAttribute('aria-label', 'Error alert');
    });

    it('should support custom ARIA label', () => {
      render(
        <ErrorAlert
          message="Test error"
          ariaLabel="Custom error"
          type="generic"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Custom error');
    });
  });

  describe('styling', () => {
    it('should support custom className', () => {
      const { container } = render(
        <ErrorAlert
          message="Test error"
          className="custom-class"
          type="generic"
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('custom-class');
    });
  });
});
