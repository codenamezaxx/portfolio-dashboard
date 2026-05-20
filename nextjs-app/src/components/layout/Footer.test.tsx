import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock IntersectionObserver for Framer Motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

describe('Footer Component', () => {
  it('renders footer with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    
    const footerText = screen.getByText(new RegExp(`© ${currentYear}`));
    expect(footerText).toBeInTheDocument();
  });

  it('renders footer with custom year', () => {
    render(<Footer year={2024} />);
    
    const footerText = screen.getByText(/© 2024/);
    expect(footerText).toBeInTheDocument();
  });

  it('renders footer with correct text', () => {
    render(<Footer />);
    
    const footerText = screen.getByText(/Made by codenamezaxx/);
    expect(footerText).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toHaveClass('py-8');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-hairline');
    expect(footer).toHaveClass('text-center');
    expect(footer).toHaveClass('text-body');
    expect(footer).toHaveClass('text-sm');
    expect(footer).toHaveClass('bg-canvas');
  });
});
