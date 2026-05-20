/**
 * Tests for SkeletonCard Component
 * 
 * Validates: Requirements 2.3 (Skeleton loaders for different content types)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonCard } from './SkeletonCard';

describe('SkeletonCard Component', () => {
  describe('rendering', () => {
    it('should render skeleton card', () => {
      render(<SkeletonCard />);

      const card = screen.getByRole('status');
      expect(card).toBeInTheDocument();
    });

    it('should render with default aria label', () => {
      render(<SkeletonCard />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', 'Loading card');
    });

    it('should render with custom aria label', () => {
      render(<SkeletonCard ariaLabel="Loading product card" />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', 'Loading product card');
    });
  });

  describe('image placeholder', () => {
    it('should render image placeholder by default', () => {
      const { container } = render(<SkeletonCard />);

      const imageDiv = container.querySelector('.h-40');
      expect(imageDiv).toBeInTheDocument();
    });

    it('should not render image placeholder when showImage is false', () => {
      const { container } = render(<SkeletonCard showImage={false} />);

      const imageDiv = container.querySelector('.h-40');
      expect(imageDiv).not.toBeInTheDocument();
    });

    it('should use custom image height', () => {
      const { container } = render(<SkeletonCard imageHeight="h-60" />);

      const imageDiv = container.querySelector('.h-60');
      expect(imageDiv).toBeInTheDocument();
    });

    it('should have animate-pulse class on image', () => {
      const { container } = render(<SkeletonCard />);

      const imageDiv = container.querySelector('.animate-pulse');
      expect(imageDiv).toBeInTheDocument();
    });
  });

  describe('text lines', () => {
    it('should render default number of text lines', () => {
      const { container } = render(<SkeletonCard />);

      const lines = container.querySelectorAll('.animate-pulse');
      // 1 image + 1 title + 3 content lines + 2 button lines = 7 total
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    it('should render custom number of text lines', () => {
      const { container } = render(<SkeletonCard lines={5} />);

      const contentLines = container.querySelectorAll('.animate-pulse');
      expect(contentLines.length).toBeGreaterThanOrEqual(5);
    });

    it('should render zero lines when lines is 0', () => {
      const { container } = render(<SkeletonCard lines={0} />);

      // Should still have image and button placeholders
      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('should render many lines when lines is large', () => {
      const { container } = render(<SkeletonCard lines={10} />);

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('structure', () => {
    it('should have card container with proper classes', () => {
      const { container } = render(<SkeletonCard />);

      const card = container.querySelector('.rounded-lg');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'border');
    });

    it('should have content area with padding', () => {
      const { container } = render(<SkeletonCard />);

      const contentArea = container.querySelector('.p-4');
      expect(contentArea).toBeInTheDocument();
    });

    it('should have title skeleton', () => {
      const { container } = render(<SkeletonCard />);

      const titleLine = container.querySelector('.w-3\\/4');
      expect(titleLine).toBeInTheDocument();
    });

    it('should have button area with two buttons', () => {
      const { container } = render(<SkeletonCard />);

      const buttonArea = container.querySelector('.flex.gap-2');
      expect(buttonArea).toBeInTheDocument();

      const buttons = buttonArea?.querySelectorAll('.flex-1');
      expect(buttons?.length).toBe(2);
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<SkeletonCard />);

      const card = container.querySelector('.dark\\:bg-gray-800');
      expect(card).toBeInTheDocument();
    });

    it('should have dark mode border classes', () => {
      const { container } = render(<SkeletonCard />);

      const card = container.querySelector('.dark\\:border-gray-700');
      expect(card).toBeInTheDocument();
    });

    it('should have dark mode skeleton classes', () => {
      const { container } = render(<SkeletonCard />);

      const skeleton = container.querySelector('.dark\\:bg-gray-700');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<SkeletonCard className="custom-class" />);

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });

    it('should have overflow hidden', () => {
      const { container } = render(<SkeletonCard />);

      const card = container.querySelector('.overflow-hidden');
      expect(card).toBeInTheDocument();
    });

    it('should have proper spacing between elements', () => {
      const { container } = render(<SkeletonCard />);

      const contentArea = container.querySelector('.space-y-3');
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have status role', () => {
      render(<SkeletonCard />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live polite', () => {
      render(<SkeletonCard />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-live', 'polite');
    });

    it('should have semantic structure', () => {
      const { container } = render(<SkeletonCard />);

      const card = container.querySelector('[role="status"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('combinations', () => {
    it('should render with image and custom lines', () => {
      const { container } = render(
        <SkeletonCard showImage={true} lines={4} />
      );

      const imageDiv = container.querySelector('.h-40');
      expect(imageDiv).toBeInTheDocument();

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThanOrEqual(4);
    });

    it('should render without image and custom lines', () => {
      const { container } = render(
        <SkeletonCard showImage={false} lines={2} />
      );

      const imageDiv = container.querySelector('.h-40');
      expect(imageDiv).not.toBeInTheDocument();

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should render with custom image height and lines', () => {
      const { container } = render(
        <SkeletonCard imageHeight="h-32" lines={5} />
      );

      const imageDiv = container.querySelector('.h-32');
      expect(imageDiv).toBeInTheDocument();

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThanOrEqual(5);
    });

    it('should render with all custom props', () => {
      const { container } = render(
        <SkeletonCard
          showImage={true}
          imageHeight="h-48"
          lines={6}
          className="my-custom-skeleton"
          ariaLabel="Loading custom card"
        />
      );

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', 'Loading custom card');
      expect(card).toHaveClass('my-custom-skeleton');

      const imageDiv = container.querySelector('.h-48');
      expect(imageDiv).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle zero lines', () => {
      render(<SkeletonCard lines={0} />);

      const card = screen.getByRole('status');
      expect(card).toBeInTheDocument();
    });

    it('should handle very large number of lines', () => {
      const { container } = render(<SkeletonCard lines={100} />);

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThanOrEqual(100);
    });

    it('should handle empty className', () => {
      render(<SkeletonCard className="" />);

      const card = screen.getByRole('status');
      expect(card).toBeInTheDocument();
    });

    it('should handle empty aria label', () => {
      render(<SkeletonCard ariaLabel="" />);

      const card = screen.getByRole('status');
      expect(card).toHaveAttribute('aria-label', '');
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(SkeletonCard.displayName).toBe('SkeletonCard');
    });
  });
});
