/**
 * Tests for SkeletonTableRow Component
 * 
 * Validates: Requirements 2.3 (Skeleton loaders for different content types - tables)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonTableRow } from './SkeletonTableRow';

describe('SkeletonTableRow Component', () => {
  describe('rendering', () => {
    it('should render skeleton table row', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toBeInTheDocument();
    });

    it('should render as table row element', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      expect(row).toBeInTheDocument();
    });

    it('should render with default aria label', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toHaveAttribute('aria-label', 'Loading table row');
    });

    it('should render with custom aria label', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow ariaLabel="Loading user row" />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toHaveAttribute('aria-label', 'Loading user row');
    });
  });

  describe('columns', () => {
    it('should render default number of columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(4);
    });

    it('should render custom number of columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={6} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(6);
    });

    it('should render single column', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={1} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(1);
    });

    it('should render many columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={10} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(10);
    });

    it('should render zero columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={0} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(0);
    });
  });

  describe('column widths', () => {
    it('should use default column width', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} />
          </tbody>
        </table>
      );

      const skeletons = container.querySelectorAll('.w-full');
      expect(skeletons.length).toBe(3);
    });

    it('should use custom uniform column width', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} columnWidths="w-1/3" />
          </tbody>
        </table>
      );

      const skeletons = container.querySelectorAll('.w-1\\/3');
      expect(skeletons.length).toBe(3);
    });

    it('should use array of column widths', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow 
              columns={3} 
              columnWidths={['w-1/4', 'w-1/2', 'w-1/4']}
            />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells[0].querySelector('.w-1\\/4')).toBeInTheDocument();
      expect(cells[1].querySelector('.w-1\\/2')).toBeInTheDocument();
      expect(cells[2].querySelector('.w-1\\/4')).toBeInTheDocument();
    });

    it('should handle array with fewer widths than columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow 
              columns={5} 
              columnWidths={['w-1/4', 'w-1/2']}
            />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(5);
      expect(cells[0].querySelector('.w-1\\/4')).toBeInTheDocument();
      expect(cells[1].querySelector('.w-1\\/2')).toBeInTheDocument();
    });

    it('should handle array with more widths than columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow 
              columns={2} 
              columnWidths={['w-1/4', 'w-1/2', 'w-1/4']}
            />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(2);
    });
  });

  describe('structure', () => {
    it('should have table row with border', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      expect(row).toHaveClass('border-b');
    });

    it('should have table cells with padding', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      cells.forEach(cell => {
        expect(cell).toHaveClass('px-4', 'py-3');
      });
    });

    it('should have skeleton divs in each cell', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} />
          </tbody>
        </table>
      );

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });

    it('should have proper skeleton styling', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveClass('h-4', 'bg-gray-200', 'rounded');
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode border classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      expect(row).toHaveClass('dark:border-gray-700');
    });

    it('should have dark mode skeleton classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveClass('dark:bg-gray-700');
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow className="custom-row" />
          </tbody>
        </table>
      );

      const row = container.querySelector('.custom-row');
      expect(row).toBeInTheDocument();
    });

    it('should have animate-pulse on skeletons', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} />
          </tbody>
        </table>
      );

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });
  });

  describe('accessibility', () => {
    it('should have status role', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live polite', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toHaveAttribute('aria-live', 'polite');
    });

    it('should have semantic table structure', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const row = container.querySelector('tr');
      expect(row).toBeInTheDocument();

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe('multiple rows', () => {
    it('should render multiple skeleton rows', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </tbody>
        </table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows.length).toBe(3);
    });

    it('should render rows with different column counts', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} />
            <SkeletonTableRow columns={5} />
          </tbody>
        </table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows.length).toBe(2);

      const firstRowCells = rows[0].querySelectorAll('td');
      const secondRowCells = rows[1].querySelectorAll('td');

      expect(firstRowCells.length).toBe(3);
      expect(secondRowCells.length).toBe(5);
    });

    it('should render rows with different widths', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={2} columnWidths={['w-1/4', 'w-3/4']} />
            <SkeletonTableRow columns={2} columnWidths={['w-1/2', 'w-1/2']} />
          </tbody>
        </table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows.length).toBe(2);
    });
  });

  describe('combinations', () => {
    it('should render with custom columns and widths', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow 
              columns={4}
              columnWidths={['w-1/6', 'w-1/3', 'w-1/4', 'w-1/6']}
            />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(4);
    });

    it('should render with all custom props', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow 
              columns={3}
              columnWidths={['w-1/4', 'w-1/2', 'w-1/4']}
              className="custom-skeleton-row"
              ariaLabel="Loading product row"
            />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toHaveAttribute('aria-label', 'Loading product row');
      expect(row).toHaveClass('custom-skeleton-row');

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle zero columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={0} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(0);
    });

    it('should handle very large number of columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={50} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(50);
    });

    it('should handle empty className', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow className="" />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toBeInTheDocument();
    });

    it('should handle empty aria label', () => {
      render(
        <table>
          <tbody>
            <SkeletonTableRow ariaLabel="" />
          </tbody>
        </table>
      );

      const row = screen.getByRole('status');
      expect(row).toHaveAttribute('aria-label', '');
    });

    it('should handle empty columnWidths array', () => {
      const { container } = render(
        <table>
          <tbody>
            <SkeletonTableRow columns={3} columnWidths={[]} />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells.length).toBe(3);
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(SkeletonTableRow.displayName).toBe('SkeletonTableRow');
    });
  });
});
