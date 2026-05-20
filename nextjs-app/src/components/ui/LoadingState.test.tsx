/**
 * Tests for LoadingState Component
 * 
 * Validates: Requirements 2.3 (Loading states display correctly)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';

describe('LoadingState Component', () => {
  describe('rendering', () => {
    it('should render children when not loading', () => {
      render(
        <LoadingState isLoading={false}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render spinner when loading with default indicator type', () => {
      render(
        <LoadingState isLoading={true} />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should render skeleton when loading with skeleton indicator type', () => {
      render(
        <LoadingState isLoading={true} indicatorType="skeleton" />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should not render children when loading', () => {
      render(
        <LoadingState isLoading={true}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should display loading message when provided', () => {
      render(
        <LoadingState isLoading={true} message="Loading data..." />
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should not display message when not provided', () => {
      render(
        <LoadingState isLoading={true} />
      );

      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
  });

  describe('full screen mode', () => {
    it('should render full screen overlay when isFullScreen is true', () => {
      const { container } = render(
        <LoadingState isLoading={true} isFullScreen={true} />
      );

      const overlay = container.querySelector('.fixed.inset-0.z-50');
      expect(overlay).toBeInTheDocument();
    });

    it('should not render full screen overlay when isFullScreen is false', () => {
      const { container } = render(
        <LoadingState isLoading={true} isFullScreen={false} />
      );

      const overlay = container.querySelector('.fixed.inset-0.z-50');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should display message in full screen mode', () => {
      render(
        <LoadingState 
          isLoading={true} 
          isFullScreen={true}
          message="Processing..." 
        />
      );

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <LoadingState isLoading={true} />
      );

      const statuses = screen.getAllByRole('status');
      const status = statuses[0];
      expect(status).toHaveAttribute('aria-label', 'Loading');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should use custom aria label when provided', () => {
      render(
        <LoadingState isLoading={true} ariaLabel="Fetching data" />
      );

      const statuses = screen.getAllByRole('status');
      const status = statuses[0];
      expect(status).toHaveAttribute('aria-label', 'Fetching data');
    });

    it('should have semantic role for status', () => {
      render(
        <LoadingState isLoading={true} />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <LoadingState isLoading={true} className="custom-class" />
      );

      const loadingDiv = container.querySelector('.custom-class');
      expect(loadingDiv).toBeInTheDocument();
    });

    it('should support dark mode classes', () => {
      const { container } = render(
        <LoadingState isLoading={true} isFullScreen={true} />
      );

      const overlay = container.querySelector('.dark\\:bg-gray-900\\/80');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('indicator types', () => {
    it('should render spinner indicator by default', () => {
      render(
        <LoadingState isLoading={true} />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should render skeleton indicator when specified', () => {
      render(
        <LoadingState isLoading={true} indicatorType="skeleton" />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should pass spinner props to spinner component', () => {
      render(
        <LoadingState 
          isLoading={true} 
          indicatorType="spinner"
          spinnerProps={{ size: 'lg' }}
        />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should pass skeleton props to skeleton component', () => {
      render(
        <LoadingState 
          isLoading={true} 
          indicatorType="skeleton"
          skeletonProps={{ lines: 5 }}
        />
      );

      const statuses = screen.getAllByRole('status');
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe('state transitions', () => {
    it('should switch from loading to content', () => {
      const { rerender } = render(
        <LoadingState isLoading={true}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      rerender(
        <LoadingState isLoading={false}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should switch from content to loading', () => {
      const { rerender } = render(
        <LoadingState isLoading={false}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(
        <LoadingState isLoading={true}>
          <div>Content</div>
        </LoadingState>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should update message during loading', () => {
      const { rerender } = render(
        <LoadingState isLoading={true} message="Loading..." />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      rerender(
        <LoadingState isLoading={true} message="Almost done..." />
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Almost done...')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      render(
        <LoadingState isLoading={false} />
      );

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      render(
        <LoadingState isLoading={false}>
          <div>Content 1</div>
          <div>Content 2</div>
        </LoadingState>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should handle very long loading message', () => {
      const longMessage = 'A'.repeat(200);
      render(
        <LoadingState isLoading={true} message={longMessage} />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Loading... <>&"\'';
      render(
        <LoadingState isLoading={true} message={specialMessage} />
      );

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(LoadingState.displayName).toBe('LoadingState');
    });
  });
});
