/**
 * Tests for TextArea component
 * Validates field-level error display and user interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './TextArea';

describe('TextArea Component', () => {
  describe('Rendering', () => {
    it('should render textarea field', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<TextArea label="Description" />);
      const label = screen.getByText('Description');
      expect(label).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<TextArea label="Description" required />);
      const required = screen.getByText('*');
      expect(required).toBeInTheDocument();
    });

    it('should render placeholder text', () => {
      render(<TextArea placeholder="Enter description" />);
      const textarea = screen.getByPlaceholderText('Enter description');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      render(<TextArea error="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
    });

    it('should not display error message when error is not provided', () => {
      render(<TextArea />);
      const error = screen.queryByText('This field is required');
      expect(error).not.toBeInTheDocument();
    });

    it('should display specific error message for required field', () => {
      render(<TextArea error="Description is required" />);
      const error = screen.getByText('Description is required');
      expect(error).toBeInTheDocument();
    });

    it('should display specific error message for minimum length', () => {
      render(<TextArea error="Must be at least 10 characters" />);
      const error = screen.getByText('Must be at least 10 characters');
      expect(error).toBeInTheDocument();
    });

    it('should display specific error message for maximum length', () => {
      render(<TextArea error="Must not exceed 1000 characters" />);
      const error = screen.getByText('Must not exceed 1000 characters');
      expect(error).toBeInTheDocument();
    });

    it('should apply error styling to textarea when error is present', () => {
      const { container } = render(<TextArea error="This field is required" />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('border-red-500');
    });

    it('should not apply error styling when no error', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea');
      expect(textarea).not.toHaveClass('border-red-500');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      render(<TextArea helperText="Enter a detailed description" />);
      const helper = screen.getByText('Enter a detailed description');
      expect(helper).toBeInTheDocument();
    });

    it('should not display helper text when error is present', () => {
      render(
        <TextArea
          error="Description is required"
          helperText="Enter a detailed description"
        />
      );
      const helper = screen.queryByText('Enter a detailed description');
      expect(helper).not.toBeInTheDocument();
    });

    it('should display helper text when no error', () => {
      render(<TextArea helperText="Enter a detailed description" />);
      const helper = screen.getByText('Enter a detailed description');
      expect(helper).toBeInTheDocument();
    });
  });

  describe('Character Count', () => {
    it('should display character count when showCharCount is true', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('Hello');
        return (
          <TextArea 
            showCharCount 
            maxLength={500} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      render(<TestComponent />);
      const count = screen.getByText('5/500');
      expect(count).toBeInTheDocument();
    });

    it('should not display character count when showCharCount is false', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('Hello');
        return (
          <TextArea 
            showCharCount={false} 
            maxLength={500} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      render(<TestComponent />);
      const count = screen.queryByText('5/500');
      expect(count).not.toBeInTheDocument();
    });

    it('should update character count as user types', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <TextArea 
            showCharCount 
            maxLength={500} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      const { container } = render(<TestComponent />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
      const count = screen.getByText('11/500');
      expect(count).toBeInTheDocument();
    });

    it('should display correct count at max length', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('a'.repeat(500));
        return (
          <TextArea 
            showCharCount 
            maxLength={500} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      render(<TestComponent />);
      const count = screen.getByText('500/500');
      expect(count).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update value on input change', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Test description' } });
      expect(textarea.value).toBe('Test description');
    });

    it('should be focusable', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).not.toBeDisabled();
    });

    it('should handle blur event', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.blur(textarea);
      expect(textarea).not.toBeDisabled();
    });

    it('should respect maxLength attribute', () => {
      const { container } = render(<TextArea maxLength={100} />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Loading State', () => {
    it('should display loading spinner when isLoading is true', () => {
      const { container } = render(<TextArea isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should display loading message when provided', () => {
      render(<TextArea isLoading={true} loadingMessage="Saving..." />);
      const message = screen.getByText('Saving...');
      expect(message).toBeInTheDocument();
    });

    it('should disable textarea when loading', () => {
      const { container } = render(<TextArea isLoading={true} />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });

    it('should apply opacity when loading', () => {
      const { container } = render(<TextArea isLoading={true} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('opacity-60');
    });
  });

  describe('Disabled State', () => {
    it('should disable textarea when disabled prop is true', () => {
      const { container } = render(<TextArea disabled={true} />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      const { container } = render(<TextArea disabled={true} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('disabled:bg-gray-100');
    });

    it('should disable textarea when loading', () => {
      const { container } = render(<TextArea isLoading={true} />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-busy attribute when loading', () => {
      const { container } = render(<TextArea isLoading={true} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper aria-disabled attribute when disabled', () => {
      const { container } = render(<TextArea disabled={true} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveAttribute('aria-disabled', 'true');
    });

    it('should associate label with textarea via htmlFor', () => {
      render(<TextArea label="Description" id="desc-input" />);
      const label = screen.getByText('Description');
      expect(label).toHaveAttribute('for', 'desc-input');
    });

    it('should generate unique id if not provided', () => {
      const { container: container1 } = render(<TextArea label="Field 1" />);
      const { container: container2 } = render(<TextArea label="Field 2" />);

      const textarea1 = container1.querySelector('textarea');
      const textarea2 = container2.querySelector('textarea');

      expect(textarea1?.id).not.toBe(textarea2?.id);
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<TextArea className="custom-class" />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('custom-class');
    });

    it('should apply custom containerClassName', () => {
      const { container } = render(
        <TextArea containerClassName="custom-container" />
      );
      const wrapper = container.querySelector('.custom-container');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Field-Level Error Display', () => {
    it('should display error for empty required field', () => {
      render(<TextArea error="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-500');
    });

    it('should display error for minimum length validation', () => {
      render(<TextArea error="Must be at least 10 characters" />);
      const error = screen.getByText('Must be at least 10 characters');
      expect(error).toBeInTheDocument();
    });

    it('should display error for maximum length validation', () => {
      render(<TextArea error="Must not exceed 1000 characters" />);
      const error = screen.getByText('Must not exceed 1000 characters');
      expect(error).toBeInTheDocument();
    });

    it('should clear error when error prop is removed', () => {
      const { rerender } = render(<TextArea error="This field is required" />);
      let error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();

      rerender(<TextArea error={undefined} />);
      error = screen.queryByText('This field is required');
      expect(error).not.toBeInTheDocument();
    });

    it('should display error with correct styling', () => {
      const { container } = render(<TextArea error="Invalid input" />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('border-red-500');
      expect(textarea).toHaveClass('focus:ring-red-500');
    });
  });

  describe('Min Height', () => {
    it('should have minimum height for textarea', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('min-h-[100px]');
    });
  });

  describe('Resize Behavior', () => {
    it('should allow vertical resize', () => {
      const { container } = render(<TextArea />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('resize-vertical');
    });
  });
});
