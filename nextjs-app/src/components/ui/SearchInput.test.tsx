/**
 * Tests for SearchInput component
 * Validates search input styling and functionality with design system colors
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput Component', () => {
  describe('Rendering', () => {
    it('should render search input field', () => {
      render(<SearchInput />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<SearchInput label="Search" />);
      const label = screen.getByText('Search');
      expect(label).toBeInTheDocument();
    });

    it('should render search icon', () => {
      const { container } = render(<SearchInput />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render placeholder text', () => {
      render(<SearchInput placeholder="Search projects..." />);
      const input = screen.getByPlaceholderText('Search projects...');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Design System Styling', () => {
    it('should have design system background color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('bg-surface-card');
    });

    it('should have design system border color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-hairline');
    });

    it('should have design system text color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('text-body');
    });

    it('should have correct height (36px / h-9)', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-9');
    });

    it('should have correct border radius (6px / rounded-md)', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('rounded-md');
    });

    it('should have left padding for icon (pl-10)', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('pl-10');
    });

    it('should have mute placeholder color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('placeholder-mute');
    });
  });

  describe('Focus State', () => {
    it('should have accent-blue focus border', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('focus:border-accent-blue');
    });

    it('should have accent-blue focus ring', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('focus:ring-accent-blue/50');
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      render(<SearchInput error="Search failed" />);
      const error = screen.getByText('Search failed');
      expect(error).toBeInTheDocument();
    });

    it('should apply error styling to input when error is present', () => {
      const { container } = render(<SearchInput error="Search failed" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-accent-red');
    });

    it('should not display error message when error is not provided', () => {
      render(<SearchInput />);
      const error = screen.queryByText('Search failed');
      expect(error).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      render(<SearchInput helperText="Search by project name" />);
      const helper = screen.getByText('Search by project name');
      expect(helper).toBeInTheDocument();
    });

    it('should not display helper text when error is present', () => {
      render(
        <SearchInput
          error="Search failed"
          helperText="Search by project name"
        />
      );
      const helper = screen.queryByText('Search by project name');
      expect(helper).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update value on input change', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'react' } });
      expect(input.value).toBe('react');
    });

    it('should be focusable', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it('should handle blur event', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      fireEvent.blur(input);
      expect(input).not.toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should display loading spinner when isLoading is true', () => {
      const { container } = render(<SearchInput isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable input when loading', () => {
      const { container } = render(<SearchInput isLoading={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should apply opacity when loading', () => {
      const { container } = render(<SearchInput isLoading={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('opacity-60');
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      const { container } = render(<SearchInput disabled={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      const { container } = render(<SearchInput disabled={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('disabled:bg-surface-soft');
    });

    it('should disable input when loading', () => {
      const { container } = render(<SearchInput isLoading={true} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode background color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:bg-surface-card');
    });

    it('should have dark mode border color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:border-hairline');
    });

    it('should have dark mode text color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:text-body');
    });

    it('should have dark mode placeholder color', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:placeholder-mute');
    });

    it('should have dark mode focus border', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:focus:border-accent-blue');
    });

    it('should have dark mode focus ring', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:focus:ring-accent-blue/50');
    });

    it('should have dark mode disabled styling', () => {
      const { container } = render(<SearchInput disabled={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:disabled:bg-surface-soft');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-busy attribute when loading', () => {
      const { container } = render(<SearchInput isLoading={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper aria-disabled attribute when disabled', () => {
      const { container } = render(<SearchInput disabled={true} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });

    it('should associate label with input via htmlFor', () => {
      render(<SearchInput label="Search" id="search-input" />);
      const label = screen.getByText('Search');
      expect(label).toHaveAttribute('for', 'search-input');
    });

    it('should generate unique id if not provided', () => {
      const { container: container1 } = render(<SearchInput label="Search 1" />);
      const { container: container2 } = render(<SearchInput label="Search 2" />);

      const input1 = container1.querySelector('input');
      const input2 = container2.querySelector('input');

      expect(input1?.id).not.toBe(input2?.id);
    });

    it('should have type="search" for semantic HTML', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('search');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<SearchInput className="custom-class" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should apply custom containerClassName', () => {
      const { container } = render(
        <SearchInput containerClassName="custom-container" />
      );
      const wrapper = container.querySelector('.custom-container');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
