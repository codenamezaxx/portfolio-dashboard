import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(<Select label="Category" options={mockOptions} />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<Select label="Category" required options={mockOptions} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders placeholder option', () => {
    render(
      <Select
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(
      <Select
        options={mockOptions}
        error="Please select an option"
      />
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(
      <Select
        options={mockOptions}
        helperText="Choose from the list"
      />
    );
    expect(screen.getByText('Choose from the list')).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(
      <Select
        options={mockOptions}
        error="Invalid"
        helperText="Choose from the list"
      />
    );
    expect(screen.queryByText('Choose from the list')).not.toBeInTheDocument();
  });

  it('allows selecting an option', async () => {
    const user = userEvent.setup();
    const { container } = render(<Select options={mockOptions} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    await user.selectOptions(select, 'option2');
    expect(select.value).toBe('option2');
  });

  it('disables disabled options', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
    ];
    const { container } = render(<Select options={optionsWithDisabled} />);
    const option2 = container.querySelector('option[value="option2"]') as HTMLOptionElement;
    expect(option2.disabled).toBe(true);
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Select options={mockOptions} error="Invalid" />
    );
    const select = container.querySelector('select');
    expect(select).toHaveClass('border-red-500');
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(
      <Select options={mockOptions} disabled />
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Select options={mockOptions} className="custom-class" />
    );
    const select = container.querySelector('select');
    expect(select).toHaveClass('custom-class');
  });

  it('accepts custom containerClassName', () => {
    const { container } = render(
      <Select
        options={mockOptions}
        containerClassName="custom-container"
      />
    );
    const div = container.querySelector('.custom-container');
    expect(div).toBeInTheDocument();
  });

  it('generates unique id when not provided', () => {
    const { container: container1 } = render(
      <Select options={mockOptions} />
    );
    const { container: container2 } = render(
      <Select options={mockOptions} />
    );

    const select1 = container1.querySelector('select');
    const select2 = container2.querySelector('select');

    expect(select1?.id).not.toBe(select2?.id);
  });

  it('uses provided id', () => {
    const { container } = render(
      <Select options={mockOptions} id="custom-id" />
    );
    const select = container.querySelector('select');
    expect(select).toHaveAttribute('id', 'custom-id');
  });

  describe('loading state', () => {
    it('should render loading spinner when isLoading is true', () => {
      const { container } = render(<Select options={mockOptions} isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable select when isLoading is true', () => {
      const { container } = render(<Select options={mockOptions} isLoading={true} />);
      const select = container.querySelector('select') as HTMLSelectElement;
      expect(select.disabled).toBe(true);
    });

    it('should display loading message when provided', () => {
      render(
        <Select options={mockOptions} isLoading={true} loadingMessage="Loading options..." />
      );
      expect(screen.getByText('Loading options...')).toBeInTheDocument();
    });

    it('should have aria-busy attribute when loading', () => {
      const { container } = render(<Select options={mockOptions} isLoading={true} />);
      const select = container.querySelector('select');
      expect(select).toHaveAttribute('aria-busy', 'true');
    });

    it('should not render loading spinner when isLoading is false', () => {
      const { container } = render(<Select options={mockOptions} isLoading={false} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });

    it('should apply opacity class when loading', () => {
      const { container } = render(<Select options={mockOptions} isLoading={true} />);
      const select = container.querySelector('select');
      expect(select).toHaveClass('opacity-60');
    });

    it('should disable select when isLoading is true even if disabled is false', () => {
      const { container } = render(<Select options={mockOptions} disabled={false} isLoading={true} />);
      const select = container.querySelector('select') as HTMLSelectElement;
      expect(select.disabled).toBe(true);
    });

    it('should have aria-disabled when disabled', () => {
      const { container } = render(<Select options={mockOptions} disabled />);
      const select = container.querySelector('select');
      expect(select).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy when loading', () => {
      const { container } = render(<Select options={mockOptions} isLoading={true} />);
      const select = container.querySelector('select');
      expect(select).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<Select label="Category" options={mockOptions} />);
      const select = container.querySelector('select');
      expect(select).toHaveClass('dark:bg-gray-800');
      expect(select).toHaveClass('dark:text-gray-100');
      expect(select).toHaveClass('dark:border-gray-600');
    });
  });
});
