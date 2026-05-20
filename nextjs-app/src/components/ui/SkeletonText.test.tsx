/**
 * Tests for SkeletonText Component
 * 
 * Validates: Requirements 2.3 (Skeleton loaders for different content types)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from './SkeletonLoader';

describe('SkeletonText Component (SkeletonLoader)', () => {
  describe('rendering', () => {
    it('should render skeleton loader', () => {
      render(<SkeletonLoader />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
    });

    it('should render with default aria label', () => {
      render(<SkeletonLoader />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Loading content');
    });

    it('should render with custom aria label', () => {
      render(<SkeletonLoader ariaLabel="Loading text" />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Loading text');
    });
  });

  describe('line rendering', () => {
    it('should render default number of lines', () => {
      const { container } = render(<SkeletonLoader />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(1);
    });

    it('should render custom number of lines', () => {
      const { container } = render(<SkeletonLoader lines={5} />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(5);
    });

    it('should render zero lines', () => {
      const { container } = render(<SkeletonLoader lines={0} />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(0);
    });

    it('should render many lines', () => {
      const { container } = render(<SkeletonLoader lines={20} />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(20);
    });
  });

  describe('line height', () => {
    it('should use default line height', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.h-4');
      expect(line).toBeInTheDocument();
    });

    it('should use custom line height', () => {
      const { container } = render(<SkeletonLoader lineHeight="h-8" />);

      const line = container.querySelector('.h-8');
      expect(line).toBeInTheDocument();
    });

    it('should apply line height to all lines', () => {
      const { container } = render(
        <SkeletonLoader lines={3} lineHeight="h-6" />
      );

      const lines = container.querySelectorAll('.h-6');
      expect(lines.length).toBe(3);
    });
  });

  describe('width', () => {
    it('should use default width', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.w-full');
      expect(line).toBeInTheDocument();
    });

    it('should use custom width', () => {
      const { container } = render(<SkeletonLoader width="w-1/2" />);

      const line = container.querySelector('.w-1\\/2');
      expect(line).toBeInTheDocument();
    });

    it('should apply width to all lines', () => {
      const { container } = render(
        <SkeletonLoader lines={3} width="w-3/4" />
      );

      const lines = container.querySelectorAll('.w-3\\/4');
      expect(lines.length).toBe(3);
    });

    it('should make last line narrower', () => {
      const { container } = render(
        <SkeletonLoader lines={3} />
      );

      const lines = container.querySelectorAll('.animate-pulse');
      const lastLine = lines[lines.length - 1];
      expect(lastLine).toHaveClass('w-3/4');
    });
  });

  describe('gap', () => {
    it('should use default gap', () => {
      const { container } = render(<SkeletonLoader />);

      const container_div = container.querySelector('.gap-2');
      expect(container_div).toBeInTheDocument();
    });

    it('should use custom gap', () => {
      const { container } = render(<SkeletonLoader gap="gap-4" />);

      const container_div = container.querySelector('.gap-4');
      expect(container_div).toBeInTheDocument();
    });
  });

  describe('circular skeleton', () => {
    it('should render circular skeleton when isCircle is true', () => {
      const { container } = render(<SkeletonLoader isCircle={true} />);

      const circle = container.querySelector('.rounded-full');
      expect(circle).toBeInTheDocument();
    });

    it('should not render lines when isCircle is true', () => {
      const { container } = render(
        <SkeletonLoader isCircle={true} lines={5} />
      );

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(1); // Only the circle
    });

    it('should use default circle size', () => {
      const { container } = render(<SkeletonLoader isCircle={true} />);

      const circle = container.querySelector('.w-12');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveClass('h-12');
    });

    it('should use custom circle size', () => {
      const { container } = render(
        <SkeletonLoader isCircle={true} circleSize="w-20 h-20" />
      );

      const circle = container.querySelector('.w-20');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveClass('h-20');
    });

    it('should have rounded-full class for circle', () => {
      const { container } = render(<SkeletonLoader isCircle={true} />);

      const circle = container.querySelector('.rounded-full');
      expect(circle).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have animate-pulse class', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.animate-pulse');
      expect(line).toBeInTheDocument();
    });

    it('should have rounded corners', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.rounded');
      expect(line).toBeInTheDocument();
    });

    it('should have light gray background', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.bg-gray-200');
      expect(line).toBeInTheDocument();
    });

    it('should have dark mode background', () => {
      const { container } = render(<SkeletonLoader />);

      const line = container.querySelector('.dark\\:bg-gray-700');
      expect(line).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <SkeletonLoader className="custom-class" />
      );

      const container_div = container.querySelector('.custom-class');
      expect(container_div).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have status role', () => {
      render(<SkeletonLoader />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live polite', () => {
      render(<SkeletonLoader />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have semantic structure', () => {
      const { container } = render(<SkeletonLoader />);

      const status = container.querySelector('[role="status"]');
      expect(status).toBeInTheDocument();
    });
  });

  describe('combinations', () => {
    it('should render multiple lines with custom height and gap', () => {
      const { container } = render(
        <SkeletonLoader lines={4} lineHeight="h-5" gap="gap-3" />
      );

      const lines = container.querySelectorAll('.h-5');
      expect(lines.length).toBe(4);

      const gapContainer = container.querySelector('.gap-3');
      expect(gapContainer).toBeInTheDocument();
    });

    it('should render multiple lines with custom width', () => {
      const { container } = render(
        <SkeletonLoader lines={3} width="w-2/3" />
      );

      const lines = container.querySelectorAll('.w-2\\/3');
      expect(lines.length).toBe(3);
    });

    it('should render circle with custom size and className', () => {
      const { container } = render(
        <SkeletonLoader
          isCircle={true}
          circleSize="w-16 h-16"
          className="my-avatar"
        />
      );

      const circle = container.querySelector('.my-avatar');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveClass('w-16', 'h-16');
    });

    it('should render with all custom props', () => {
      const { container } = render(
        <SkeletonLoader
          lines={5}
          lineHeight="h-6"
          width="w-4/5"
          gap="gap-4"
          className="custom-skeleton"
          ariaLabel="Loading data"
        />
      );

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Loading data');
      expect(status).toHaveClass('custom-skeleton');

      const lines = container.querySelectorAll('.h-6');
      expect(lines.length).toBe(5);
    });
  });

  describe('flex layout', () => {
    it('should use flex column layout', () => {
      const { container } = render(<SkeletonLoader />);

      const container_div = container.querySelector('.flex.flex-col');
      expect(container_div).toBeInTheDocument();
    });

    it('should maintain flex layout with multiple lines', () => {
      const { container } = render(<SkeletonLoader lines={5} />);

      const container_div = container.querySelector('.flex.flex-col');
      expect(container_div).toBeInTheDocument();

      const lines = container_div?.querySelectorAll('.animate-pulse');
      expect(lines?.length).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle zero lines', () => {
      const { container } = render(<SkeletonLoader lines={0} />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(0);
    });

    it('should handle very large number of lines', () => {
      const { container } = render(<SkeletonLoader lines={100} />);

      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines.length).toBe(100);
    });

    it('should handle empty className', () => {
      render(<SkeletonLoader className="" />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
    });

    it('should handle empty aria label', () => {
      render(<SkeletonLoader ariaLabel="" />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', '');
    });

    it('should handle circle with lines prop (lines should be ignored)', () => {
      const { container } = render(
        <SkeletonLoader isCircle={true} lines={5} />
      );

      const circle = container.querySelector('.rounded-full');
      expect(circle).toBeInTheDocument();

      // Should only have one animated element (the circle)
      const animated = container.querySelectorAll('.animate-pulse');
      expect(animated.length).toBe(1);
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(SkeletonLoader.displayName).toBe('SkeletonLoader');
    });
  });
});
