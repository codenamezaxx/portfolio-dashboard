import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';

describe('Radio Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(
      <Radio label="Choose one" groupName="test" options={mockOptions} value="option1" onChange={() => {}} />
    );
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(
      <Radio
        label="Choose one"
        required
        groupName="test"
        options={mockOptions}
        value="option1"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(
      <Radio label="Choose" groupName="test" options={mockOptions} value="option1" onChange={() => {}} />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(
      <Radio
        groupName="test"
        options={mockOptions}
        error="Please select an option"
        value="option1"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(
      <Radio
        groupName="test"
        options={mockOptions}
        helperText="Choose from the list"
        value="option1"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Choose from the list')).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(
      <Radio
        groupName="test"
        options={mockOptions}
        error="Invalid"
        helperText="Choose from the list"
        value="option1"
        onChange={() => {}}
      />
    );
    expect(screen.queryByText('Choose from the list')).not.toBeInTheDocument();
  });

  it('allows selecting an option', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { rerender } = render(
      <Radio
        groupName="test"
        options={mockOptions}
        value="option1"
        onChange={handleChange}
      />
    );

    const option2 = screen.getByLabelText('Option 2') as HTMLInputElement;
    await user.click(option2);

    expect(handleChange).toHaveBeenCalled();
    
    // Rerender with new value to simulate state update
    rerender(
      <Radio
        groupName="test"
        options={mockOptions}
        value="option2"
        onChange={handleChange}
      />
    );
    
    expect(option2.checked).toBe(true);
  });

  it('only allows one option to be selected at a time', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Radio groupName="test" options={mockOptions} value="option1" onChange={() => {}} />
    );

    const option1 = screen.getByLabelText('Option 1') as HTMLInputElement;
    const option2 = screen.getByLabelText('Option 2') as HTMLInputElement;

    expect(option1.checked).toBe(true);
    expect(option2.checked).toBe(false);
  });

  it('disables disabled options', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
    ];
    const { container } = render(
      <Radio groupName="test" options={optionsWithDisabled} value="option1" onChange={() => {}} />
    );
    const option2 = screen.getByLabelText('Option 2') as HTMLInputElement;
    expect(option2.disabled).toBe(true);
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Radio groupName="test" options={mockOptions} error="Invalid" value="option1" onChange={() => {}} />
    );
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input).toHaveClass('border-red-500');
    });
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Radio
        groupName="test"
        options={mockOptions}
        className="custom-class"
        value="option1"
        onChange={() => {}}
      />
    );
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input).toHaveClass('custom-class');
    });
  });

  it('accepts custom containerClassName', () => {
    const { container } = render(
      <Radio
        groupName="test"
        options={mockOptions}
        containerClassName="custom-container"
        value="option1"
        onChange={() => {}}
      />
    );
    const div = container.querySelector('.custom-container');
    expect(div).toBeInTheDocument();
  });

  it('has correct input type', () => {
    const { container } = render(
      <Radio groupName="test" options={mockOptions} value="option1" onChange={() => {}} />
    );
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'radio');
    });
  });

  it('all options have the same group name', () => {
    const { container } = render(
      <Radio groupName="test-group" options={mockOptions} value="option1" onChange={() => {}} />
    );
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('name', 'test-group');
    });
  });
});
