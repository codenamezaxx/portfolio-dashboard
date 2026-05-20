import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contacts from './Contacts';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

jest.mock('lucide-react', () => ({
  Mail: () => <svg />,
  Heart: () => <svg />,
  Send: () => <svg />,
  Linkedin: () => <svg />,
  ArrowUpRight: () => <svg />,
}));

jest.mock('../shared/SectionHeader', () => {
  return function MockSectionHeader({ title, subtitle }: any) {
    return <div data-testid="section-header"><span>{subtitle}</span><h2>{title}</h2></div>;
  };
});

describe('Contacts Component', () => {
  it('should render the contacts section', () => {
    const { container } = render(<Contacts />);
    const section = container.querySelector('section#contacts');
    expect(section).toBeInTheDocument();
  });

  it('should render all four contact method cards', () => {
    render(<Contacts />);
    expect(screen.getByLabelText('Contact via Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact via LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact via Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact via Telegram')).toBeInTheDocument();
  });

  it('should have correct email link', () => {
    render(<Contacts />);
    const emailLink = screen.getByLabelText('Contact via Email');
    expect(emailLink).toHaveAttribute('href', 'mailto:zakky.ahmad@protonmail.com');
  });

  it('should have correct LinkedIn link', () => {
    render(<Contacts />);
    const linkedinLink = screen.getByLabelText('Contact via LinkedIn');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/zakky-el');
  });

  it('should have correct Instagram link', () => {
    render(<Contacts />);
    const instagramLink = screen.getByLabelText('Contact via Instagram');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/codenamezaxx');
  });

  it('should have correct Telegram link', () => {
    render(<Contacts />);
    const telegramLink = screen.getByLabelText('Contact via Telegram');
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/codenamezaxx');
  });

  it('should open links in new tab', () => {
    render(<Contacts />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should have correct number of contact methods', () => {
    render(<Contacts />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('should display correct labels for all contact methods', () => {
    render(<Contacts />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Telegram')).toBeInTheDocument();
  });

  it('should display correct contact values', () => {
    render(<Contacts />);
    expect(screen.getByText('zakky.ahmad@protonmail.com')).toBeInTheDocument();
    expect(screen.getByText('@zakky-el')).toBeInTheDocument();
    expect(screen.getAllByText('@codenamezaxx')).toHaveLength(2);
  });

  it('should have proper ARIA labels for all links', () => {
    render(<Contacts />);
    expect(screen.getByLabelText('Contact via Email')).toHaveAttribute('aria-label', 'Contact via Email');
    expect(screen.getByLabelText('Contact via LinkedIn')).toHaveAttribute('aria-label', 'Contact via LinkedIn');
    expect(screen.getByLabelText('Contact via Instagram')).toHaveAttribute('aria-label', 'Contact via Instagram');
    expect(screen.getByLabelText('Contact via Telegram')).toHaveAttribute('aria-label', 'Contact via Telegram');
  });

  it('should have aria-describedby for contact values', () => {
    render(<Contacts />);
    expect(screen.getByLabelText('Contact via Email')).toHaveAttribute('aria-describedby', 'email');
    expect(screen.getByLabelText('Contact via LinkedIn')).toHaveAttribute('aria-describedby', 'linkedin');
  });

  it('should have correct section styling', () => {
    const { container } = render(<Contacts />);
    const section = container.querySelector('section#contacts');
    expect(section).toHaveClass('py-20', 'md:py-32', 'relative', 'border-t', 'border-surface');
  });

  it('should have correct color classes for email contact method', () => {
    render(<Contacts />);
    const emailLink = screen.getByLabelText('Contact via Email');
    expect(emailLink).toHaveClass('from-blue-500/20', 'to-blue-600/20', 'border-blue-500/30', 'text-blue-400');
  });

  it('should have correct color classes for Instagram contact method', () => {
    render(<Contacts />);
    const instagramLink = screen.getByLabelText('Contact via Instagram');
    expect(instagramLink).toHaveClass('from-pink-500/20', 'to-purple-500/20', 'border-pink-500/30', 'text-pink-400');
  });

  it('should have responsive grid classes', () => {
    const { container } = render(<Contacts />);
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6', 'max-w-3xl', 'mx-auto', 'mb-16');
  });

  it('should display contact method labels in correct order', () => {
    render(<Contacts />);
    const labels = screen.getAllByRole('heading', { level: 3 });
    expect(labels[0]).toHaveTextContent('Email');
    expect(labels[1]).toHaveTextContent('LinkedIn');
    expect(labels[2]).toHaveTextContent('Instagram');
    expect(labels[3]).toHaveTextContent('Telegram');
  });

  it('should have hover transition classes', () => {
    render(<Contacts />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('transition-all', 'duration-300');
    });
  });

  it('should display "Hubungi" text on all contact cards', () => {
    render(<Contacts />);
    const hubungiTexts = screen.getAllByText('Hubungi');
    expect(hubungiTexts).toHaveLength(4);
  });

  it('should render section header', () => {
    render(<Contacts />);
    const header = screen.getByTestId('section-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Hubungi Saya');
    expect(header).toHaveTextContent('Kontak');
  });

  it('should render intro text', () => {
    render(<Contacts />);
    expect(screen.getByText(/Tertarik untuk berkolaborasi/i)).toBeInTheDocument();
  });

  it('should render footer note', () => {
    render(<Contacts />);
    expect(screen.getByText(/Terima kasih atas kunjungan Anda/i)).toBeInTheDocument();
  });
});
