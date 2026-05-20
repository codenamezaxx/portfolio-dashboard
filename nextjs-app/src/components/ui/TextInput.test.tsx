/**
 * Tests for TextInput component
 * Validates field-level error display and user interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput Component', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<TextInput />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<TextInput label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<TextInput label="Email" required />);
      const required = screen.getByText('*');
      expect(required).toBeInTheDocument();
    });

    it('should render placeholder text', () => {
      render(<TextInput placeholder="Enter email" />);
      const input = screen.getByPlaceholderText('Enter email');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      render(<TextInput error="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
    });

    it('should not display error message when error is not provided', () => {
      render(<TextInput />);
      const error = screen.queryByText('This field is required');
      expect(error).not.toBeInTheDocument();
    });

    it('should display specific error message for email validation', () => {
      render(<TextInput error="Invalid email address" />);
      const error = screen.getByText('Invalid email address');
      expect(error).toBeInTheDocument();
    });

    it('should display specific error message for required field', () => {
      render(<TextInput error="Name is required" />);
      const error = screen.getByText('Name is required');
      expect(error).toBeInTheDocument();
    });

    it('should display specific error message for URL validation', () => {
      render(<TextInput error="Invalid URL format" />);
      const error = screen.getByText('Invalid URL format');
      expect(error).toBeInTheDocument();
    });

    it('should apply error styling to input when error is present', () => {
      const { container } = render(<TextInput error="This field is required" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-accent-red');
    });

    it('should not apply error styling when no error', () => {
      const { container } = render(<TextInput />);
      const input = container.querySelector('input');
      expect(input).not.toHaveClass('border-accent-red');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      render(<TextInput helperText="Enter a valid email address" />);
      const helper = screen.getByText('Enter a valid email address');
      expect(helper).toBeInTheDocument();
    });

    it('should not display helper text when error is present', () => {
      render(
        <TextInput
          error="Invalid email"
          helperText="Enter a valid email address"
        />
      );
      const helper = screen.queryByText('Enter a valid email address');
      expect(helper).not.toBeInTheDocument();
    });

    it('should display helper text when no error', () => {
      render(<TextInput helperText="Enter a valid email address" />);
      const helper = screen.getByText('Enter a valid email address');
      expect(helper).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update value on input change', () => {
      const { container } = render(<TextInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      expect(input.value).toBe('test@example.com');
    });

    it('should be focusable', () => {
      const { container } = render(<TextInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it('should handle blur event', () => {
      const { container } = render(<TextInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.blur(input);
      expect(input).not.toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should display loading spinner when isLoading is true', () => {
      const { container } = render(<TextInput isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should display loading message when provided', () => {
      render(<TextInput isLoading={true} loadingMessage="Validating..." />);
      const message = screen.getByText('Validating...');
      expect(message).toBeInTheDocument();
    });

    it('should disable input when loading', () => {
      const { container } = render(<TextInput isLoading={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should apply opacity when loading', () => {
      const { container } = render(<TextInput isLoading={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('opacity-60');
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      const { container } = render(<TextInput disabled={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      const { container } = render(<TextInput disabled={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('disabled:bg-surface-soft');
    });

    it('should disable input when loading', () => {
      const { container } = render(<TextInput isLoading={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe('Input Types', () => {
    it('should support email input type', () => {
      const { container } = render(<TextInput type="email" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('should support password input type', () => {
      const { container } = render(<TextInput type="password" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should support number input type', () => {
      const { container } = render(<TextInput type="number" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('number');
    });

    it('should support URL input type', () => {
      const { container } = render(<TextInput type="url" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('url');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-busy attribute when loading', () => {
      const { container } = render(<TextInput isLoading={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper aria-disabled attribute when disabled', () => {
      const { container } = render(<TextInput disabled={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });

    it('should associate label with input via htmlFor', () => {
      render(<TextInput label="Email" id="email-input" />);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });

    it('should generate unique id if not provided', () => {
      const { container: container1 } = render(<TextInput label="Field 1" />);
      const { container: container2 } = render(<TextInput label="Field 2" />);

      const input1 = container1.querySelector('input');
      const input2 = container2.querySelector('input');

      expect(input1?.id).not.toBe(input2?.id);
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<TextInput className="custom-class" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should apply custom containerClassName', () => {
      const { container } = render(
        <TextInput containerClassName="custom-container" />
      );
      const wrapper = container.querySelector('.custom-container');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Field-Level Error Display', () => {
    it('should display error for empty required field', () => {
      render(<TextInput error="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-accent-red');
    });

    it('should display error for invalid email format', () => {
      render(<TextInput error="Invalid email address" />);
      const error = screen.getByText('Invalid email address');
      expect(error).toBeInTheDocument();
    });

    it('should display error for invalid URL format', () => {
      render(<TextInput error="Invalid URL format" />);
      const error = screen.getByText('Invalid URL format');
      expect(error).toBeInTheDocument();
    });

    it('should display error for minimum length validation', () => {
      render(<TextInput error="Must be at least 8 characters" />);
      const error = screen.getByText('Must be at least 8 characters');
      expect(error).toBeInTheDocument();
    });

    it('should display error for maximum length validation', () => {
      render(<TextInput error="Must not exceed 255 characters" />);
      const error = screen.getByText('Must not exceed 255 characters');
      expect(error).toBeInTheDocument();
    });

    it('should clear error when error prop is removed', () => {
      const { rerender } = render(<TextInput error="This field is required" />);
      let error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();

      rerender(<TextInput error={undefined} />);
      error = screen.queryByText('This field is required');
      expect(error).not.toBeInTheDocument();
    });
  });
});
