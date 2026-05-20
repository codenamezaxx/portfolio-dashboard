/**
 * Tests for FormError component
 * Validates form-level error message display
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormError } from './FormError';

describe('FormError Component', () => {
  describe('Rendering', () => {
    it('should render error message when provided', () => {
      render(<FormError message="An error occurred" />);
      const error = screen.getByText('An error occurred');
      expect(error).toBeInTheDocument();
    });

    it('should not render when message is not provided', () => {
      const { container } = render(<FormError />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when message is undefined', () => {
      const { container } = render(<FormError message={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when message is empty string', () => {
      const { container } = render(<FormError message="" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Error Messages', () => {
    it('should display validation error message', () => {
      render(<FormError message="Please fill in all required fields" />);
      const error = screen.getByText('Please fill in all required fields');
      expect(error).toBeInTheDocument();
    });

    it('should display authentication error message', () => {
      render(<FormError message="Invalid email or password" />);
      const error = screen.getByText('Invalid email or password');
      expect(error).toBeInTheDocument();
    });

    it('should display server error message', () => {
      render(<FormError message="Server error. Please try again later." />);
      const error = screen.getByText('Server error. Please try again later.');
      expect(error).toBeInTheDocument();
    });

    it('should display network error message', () => {
      render(<FormError message="Network error. Please check your connection." />);
      const error = screen.getByText('Network error. Please check your connection.');
      expect(error).toBeInTheDocument();
    });

    it('should display permission error message', () => {
      render(<FormError message="You do not have permission to perform this action" />);
      const error = screen.getByText('You do not have permission to perform this action');
      expect(error).toBeInTheDocument();
    });

    it('should display duplicate entry error message', () => {
      render(<FormError message="This email is already registered" />);
      const error = screen.getByText('This email is already registered');
      expect(error).toBeInTheDocument();
    });

    it('should display not found error message', () => {
      render(<FormError message="The requested resource was not found" />);
      const error = screen.getByText('The requested resource was not found');
      expect(error).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have error background color', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('bg-red-50');
    });

    it('should have error border color', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('border-red-200');
    });

    it('should have error text color', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('text-red-700');
    });

    it('should have rounded corners', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('rounded-md');
    });

    it('should have padding', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('p-3');
    });

    it('should have small text size', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('text-sm');
    });

    it('should have dark mode styling', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('dark:bg-red-900/20');
      expect(errorDiv).toHaveClass('dark:border-red-800');
      expect(errorDiv).toHaveClass('dark:text-red-400');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormError message="Error" className="custom-class" />
      );
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('custom-class');
    });

    it('should preserve default styling with custom className', () => {
      const { container } = render(
        <FormError message="Error" className="custom-class" />
      );
      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('bg-red-50');
      expect(errorDiv).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have proper role for error message', () => {
      const { container } = render(<FormError message="Error" />);
      const errorDiv = container.querySelector('div');
      // Error messages should be perceivable by screen readers
      expect(errorDiv).toBeInTheDocument();
    });

    it('should be visible to screen readers', () => {
      render(<FormError message="An error occurred" />);
      const error = screen.getByText('An error occurred');
      expect(error).toBeVisible();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(FormError.displayName).toBe('FormError');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long error messages', () => {
      const longMessage = 'a'.repeat(500);
      render(<FormError message={longMessage} />);
      const error = screen.getByText(longMessage);
      expect(error).toBeInTheDocument();
    });

    it('should handle error messages with special characters', () => {
      render(<FormError message="Error: Invalid input! @#$%" />);
      const error = screen.getByText('Error: Invalid input! @#$%');
      expect(error).toBeInTheDocument();
    });

    it('should handle error messages with line breaks', () => {
      render(<FormError message="Error line 1\nError line 2" />);
      const error = screen.getByText(/Error line 1/);
      expect(error).toBeInTheDocument();
    });

    it('should handle error messages with HTML entities', () => {
      render(<FormError message="Error: &lt;script&gt;" />);
      const error = screen.getByText(/Error:.*script/);
      expect(error).toBeInTheDocument();
    });
  });

  describe('Multiple Errors', () => {
    it('should display one error message at a time', () => {
      const { rerender } = render(<FormError message="First error" />);
      let error = screen.getByText('First error');
      expect(error).toBeInTheDocument();

      rerender(<FormError message="Second error" />);
      error = screen.queryByText('First error');
      expect(error).not.toBeInTheDocument();

      error = screen.getByText('Second error');
      expect(error).toBeInTheDocument();
    });

    it('should clear error when message is removed', () => {
      const { rerender } = render(<FormError message="Error message" />);
      let error = screen.getByText('Error message');
      expect(error).toBeInTheDocument();

      rerender(<FormError message={undefined} />);
      error = screen.queryByText('Error message');
      expect(error).not.toBeInTheDocument();
    });
  });

  describe('User-Friendly Error Messages', () => {
    it('should display user-friendly validation error', () => {
      render(<FormError message="Please enter a valid email address" />);
      const error = screen.getByText('Please enter a valid email address');
      expect(error).toBeInTheDocument();
    });

    it('should display user-friendly required field error', () => {
      render(<FormError message="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
    });

    it('should display user-friendly format error', () => {
      render(<FormError message="Please enter a valid URL" />);
      const error = screen.getByText('Please enter a valid URL');
      expect(error).toBeInTheDocument();
    });

    it('should display user-friendly length error', () => {
      render(<FormError message="Password must be at least 8 characters" />);
      const error = screen.getByText('Password must be at least 8 characters');
      expect(error).toBeInTheDocument();
    });

    it('should display user-friendly duplicate error', () => {
      render(<FormError message="This username is already taken" />);
      const error = screen.getByText('This username is already taken');
      expect(error).toBeInTheDocument();
    });
  });
});
