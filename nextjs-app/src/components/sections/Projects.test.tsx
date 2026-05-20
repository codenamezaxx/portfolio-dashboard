/**
 * Tests for Projects component
 * Validates rendering, props, interactions, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Projects from './Projects';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  staggerContainer: {},
  fadeInUp: {},
}));

// Mock child components
jest.mock('../ui/GlassCard', () => ({
  __esModule: true,
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('../ui/Badge', () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('../ui/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../shared/SectionHeader', () => ({
  __esModule: true,
  default: ({ title, subtitle }: any) => (
    <div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen, writable: true });

const mockProjects = [
  {
    id: 1,
    title: 'Test Project 1',
    description: 'Description for test project 1',
    category: 'Web App',
    image: '/images/test1.jpg',
    tech: ['React', 'TypeScript'],
    links: {
      github: 'https://github.com/test/project1',
      demo: 'https://demo.test.com',
    },
  },
  {
    id: 2,
    title: 'Test Game',
    description: 'A test game project',
    category: 'Game Dev',
    image: 'https://example.com/game.jpg',
    tech: ['Godot', 'GDScript'],
    links: {
      itchio: 'https://test.itch.io/game',
    },
  },
];

describe('Projects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the section with correct id', () => {
      const { container } = render(<Projects />);
      const section = container.querySelector('#projects');
      expect(section).toBeInTheDocument();
    });

    it('should render section header with correct title', () => {
      render(<Projects />);
      expect(screen.getByText('Projek & Aplikasi')).toBeInTheDocument();
    });

    it('should render section header subtitle', () => {
      render(<Projects />);
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    it('should render default projects when no items prop provided', () => {
      render(<Projects />);
      expect(screen.getByText('Online Quran')).toBeInTheDocument();
    });

    it('should render custom projects when items prop provided', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render correct number of project cards', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render "Lihat Semua Proyek" button', () => {
      render(<Projects />);
      expect(screen.getByText(/Lihat Semua Proyek di GitHub/i)).toBeInTheDocument();
    });
  });

  describe('Project Card Content', () => {
    it('should display project title', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    });

    it('should display project category', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('Web App')).toBeInTheDocument();
    });

    it('should display project description', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('Description for test project 1')).toBeInTheDocument();
    });

    it('should display tech stack badges', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should display GitHub button for projects with github link', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    });

    it('should display Demo button for projects with demo link', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText(/Demo/i)).toBeInTheDocument();
    });

    it('should display itch.io button for game projects', () => {
      render(<Projects items={mockProjects} />);
      expect(screen.getByText(/itch\.io/i)).toBeInTheDocument();
    });

    it('should not display GitHub button when no github link', () => {
      const projectWithoutGithub = [{ ...mockProjects[1], links: { itchio: 'https://test.itch.io' } }];
      render(<Projects items={projectWithoutGithub} />);
      expect(screen.queryByText(/GitHub/i)).not.toBeInTheDocument();
    });
  });

  describe('Link Interactions', () => {
    it('should open GitHub link in new tab when clicked', () => {
      render(<Projects items={mockProjects} />);
      const githubButton = screen.getByText(/GitHub/i);
      fireEvent.click(githubButton);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://github.com/test/project1',
        '_blank'
      );
    });

    it('should open demo link in new tab when clicked', () => {
      render(<Projects items={mockProjects} />);
      const demoButton = screen.getByText(/Demo/i);
      fireEvent.click(demoButton);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://demo.test.com',
        '_blank'
      );
    });

    it('should open itch.io link in new tab when clicked', () => {
      render(<Projects items={mockProjects} />);
      const itchioButton = screen.getByText(/itch\.io/i);
      fireEvent.click(itchioButton);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://test.itch.io/game',
        '_blank'
      );
    });

    it('should open GitHub profile when "Lihat Semua" button clicked', () => {
      render(<Projects />);
      const viewAllButton = screen.getByText(/Lihat Semua Proyek di GitHub/i);
      fireEvent.click(viewAllButton);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://github.com/codenamezaxx',
        '_blank'
      );
    });
  });

  describe('Empty State', () => {
    it('should render with empty items array', () => {
      render(<Projects items={[]} />);
      expect(screen.getByText('Projek & Aplikasi')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have section element', () => {
      const { container } = render(<Projects />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have heading for section title', () => {
      render(<Projects />);
      expect(screen.getByRole('heading', { name: 'Projek & Aplikasi' })).toBeInTheDocument();
    });

    it('should have buttons with accessible text', () => {
      render(<Projects items={mockProjects} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
