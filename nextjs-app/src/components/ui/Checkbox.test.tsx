import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Checkbox label="Accept terms" error="You must accept" />);
    expect(screen.getByText('You must accept')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(
      <Checkbox
        label="Accept terms"
        helperText="Please read the terms first"
      />
    );
    expect(screen.getByText('Please read the terms first')).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(
      <Checkbox
        label="Accept terms"
        error="Invalid"
        helperText="Please read the terms"
      />
    );
    expect(screen.queryByText('Please read the terms')).not.toBeInTheDocument();
  });

  it('can be checked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Checkbox label="Accept" />);
    const checkbox = container.querySelector('input') as HTMLInputElement;

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('can be unchecked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Checkbox label="Accept" defaultChecked />);
    const checkbox = container.querySelector('input') as HTMLInputElement;

    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('applies error styling when error is present', () => {
    const { container } = render(<Checkbox error="Invalid" />);
    const checkbox = container.querySelector('input');
    expect(checkbox).toHaveClass('border-red-500');
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<Checkbox disabled />);
    const checkbox = container.querySelector('input') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('accepts custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkbox = container.querySelector('input');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('accepts custom containerClassName', () => {
    const { container } = render(
      <Checkbox containerClassName="custom-container" />
    );
    const div = container.querySelector('.custom-container');
    expect(div).toBeInTheDocument();
  });

  it('generates unique id when not provided', () => {
    const { container: container1 } = render(<Checkbox />);
    const { container: container2 } = render(<Checkbox />);

    const checkbox1 = container1.querySelector('input');
    const checkbox2 = container2.querySelector('input');

    expect(checkbox1?.id).not.toBe(checkbox2?.id);
  });

  it('uses provided id', () => {
    const { container } = render(<Checkbox id="custom-id" />);
    const checkbox = container.querySelector('input');
    expect(checkbox).toHaveAttribute('id', 'custom-id');
  });

  it('calls onChange handler when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { container } = render(
      <Checkbox label="Accept" onChange={handleChange} />
    );
    const checkbox = container.querySelector('input') as HTMLInputElement;

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('has correct input type', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });
});
