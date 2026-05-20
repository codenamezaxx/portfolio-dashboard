import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-primary', 'text-on-primary');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-surface-soft', 'text-ink');
  });

  it('renders with danger variant', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-accent-red-soft', 'text-accent-red');
  });

  it('renders with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Cancel</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('renders with small size', () => {
    const { container } = render(<Button size="sm">Click</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-3', 'py-1', 'text-xs', 'h-8');
  });

  it('renders with medium size by default', () => {
    const { container } = render(<Button>Click</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-4', 'py-2', 'h-10');
  });

  it('renders with large size', () => {
    const { container } = render(<Button size="lg">Click</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base', 'h-12');
  });

  it('renders full width when fullWidth is true', () => {
    const { container } = render(<Button fullWidth>Click</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-full');
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Click</Button>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('is disabled when isLoading is true', () => {
    const { container } = render(<Button isLoading>Click</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Click</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    await user.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Button className="custom-class">Click</Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with children elements', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('has focus ring styling', () => {
    const { container } = render(<Button>Click</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('focus:ring-2', 'focus:ring-accent-blue/50');
  });
});
