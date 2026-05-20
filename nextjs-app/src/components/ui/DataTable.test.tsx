import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, DataTableColumn, DataTableRowAction } from './DataTable';

// Test data types
interface TestItem {
  id: number;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Sample test data
const testData: TestItem[] = [
  {
    id: 1,
    name: 'Project Alpha',
    category: 'Web',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Project Beta',
    category: 'Mobile',
    status: 'inactive',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Project Gamma',
    category: 'Web',
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Project Delta',
    category: 'Desktop',
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    name: 'Project Epsilon',
    category: 'Mobile',
    status: 'inactive',
    createdAt: '2024-02-15',
  },
];

// Default columns
const defaultColumns: DataTableColumn<TestItem>[] = [
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
];

describe('DataTable Component', () => {
  describe('Rendering', () => {
    it('should render table with columns and data', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          ariaLabel="Test table"
        />
      );

      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Created')).toBeInTheDocument();

      // Check data rows
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
      expect(screen.getAllByText('Web')).toHaveLength(2); // Project Alpha and Project Gamma
      expect(screen.getAllByText('Mobile')).toHaveLength(2); // Project Beta and Project Epsilon
    });

    it('should render with row numbers when showRowNumbers is true', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          showRowNumbers
        />
      );

      // Check for row numbers
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render empty state when data is empty', () => {
      render(
        <DataTable<TestItem>
          data={[]}
          columns={defaultColumns}
          emptyMessage="No items found"
        />
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          isLoading
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render custom cell content using render function', () => {
      const columnsWithRender: DataTableColumn<TestItem>[] = [
        {
          key: 'name',
          label: 'Name',
          render: (value) => `[${value}]`,
        },
        { key: 'category', label: 'Category' },
      ];

      render(
        <DataTable<TestItem>
          data={testData}
          columns={columnsWithRender}
        />
      );

      expect(screen.getByText('[Project Alpha]')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort data by column when header is clicked', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
        />
      );

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // After sorting ascending, Project Alpha should come first
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Project Alpha');
    });

    it('should toggle sort direction when header is clicked twice', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
        />
      );

      const nameHeader = screen.getByText('Name');

      // First click - ascending
      fireEvent.click(nameHeader);
      let rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Project Alpha');

      // Second click - descending
      fireEvent.click(nameHeader);
      rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Project Gamma');
    });

    it('should not sort when column is not sortable', () => {
      const nonSortableColumns: DataTableColumn<TestItem>[] = [
        { key: 'name', label: 'Name', sortable: false },
        { key: 'category', label: 'Category' },
      ];

      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={nonSortableColumns}
        />
      );

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // Should not have sort indicator
      const sortIcon = container.querySelector('[aria-sort="ascending"]');
      expect(sortIcon).not.toBeInTheDocument();
    });

    it('should call onSortChange callback when sort changes', () => {
      const onSortChange = jest.fn();

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          onSortChange={onSortChange}
        />
      );

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      expect(onSortChange).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc',
      });
    });
  });

  describe('Filtering/Search', () => {
    it('should filter data based on search input', async () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
          searchPlaceholder="Search projects..."
        />
      );

      const searchInput = screen.getByPlaceholderText('Search projects...');
      await userEvent.type(searchInput, 'Alpha');

      // Only Project Alpha should be visible
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.queryByText('Project Beta')).not.toBeInTheDocument();
    });

    it('should filter across multiple filterable columns', async () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');

      // Search for "Project" which appears in all project names
      await userEvent.type(searchInput, 'Project');

      // Should show all projects since they all contain "Project"
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
      expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    });

    it('should show empty state when search returns no results', async () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
          emptyMessage="No matching items"
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'NonExistent');

      expect(screen.getByText('No matching items')).toBeInTheDocument();
    });

    it('should call onFilterChange callback when search changes', async () => {
      const onFilterChange = jest.fn();

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
          onFilterChange={onFilterChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Alpha');

      expect(onFilterChange).toHaveBeenCalledWith([
        { key: 'search', value: 'Alpha' },
      ]);
    });

    it('should not filter non-filterable columns', async () => {
      const nonFilterableColumns: DataTableColumn<TestItem>[] = [
        { key: 'name', label: 'Name', filterable: false },
        { key: 'category', label: 'Category', filterable: true },
      ];

      render(
        <DataTable<TestItem>
          data={testData}
          columns={nonFilterableColumns}
          searchable
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Alpha');

      // Should not find Project Alpha since name is not filterable
      expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should paginate data correctly', () => {
      const onPageChange = jest.fn();

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          pagination={{
            currentPage: 1,
            pageSize: 2,
            total: testData.length,
            onPageChange,
          }}
        />
      );

      // Should show only 2 items per page
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // 1 header + 2 data rows
    });

    it('should show pagination controls', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          pagination={{
            currentPage: 1,
            pageSize: 2,
            total: testData.length,
            onPageChange: jest.fn(),
          }}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      // Check for pagination info text (may be split across elements)
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
    });

    it('should disable Previous button on first page', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          pagination={{
            currentPage: 1,
            pageSize: 2,
            total: testData.length,
            onPageChange: jest.fn(),
          }}
        />
      );

      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });

    it('should disable Next button on last page', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          pagination={{
            currentPage: 3,
            pageSize: 2,
            total: testData.length,
            onPageChange: jest.fn(),
          }}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should call onPageChange when page button is clicked', () => {
      const onPageChange = jest.fn();

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          pagination={{
            currentPage: 1,
            pageSize: 2,
            total: testData.length,
            onPageChange,
          }}
        />
      );

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should show correct row numbers with pagination', () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          showRowNumbers
          pagination={{
            currentPage: 2,
            pageSize: 2,
            total: testData.length,
            onPageChange: jest.fn(),
          }}
        />
      );

      // On page 2 with pageSize 2, should show rows 3 and 4
      const rowNumbers = screen.getAllByText('3');
      expect(rowNumbers.length).toBeGreaterThan(0); // At least one "3" in row numbers
      expect(screen.getAllByText('4').length).toBeGreaterThan(0); // At least one "4" in row numbers
    });
  });

  describe('Row Actions', () => {
    it('should render action buttons for each row', () => {
      const actions: DataTableRowAction<TestItem>[] = [
        { label: 'Edit', onClick: jest.fn() },
        { label: 'Delete', onClick: jest.fn(), variant: 'danger' },
      ];

      render(
        <DataTable<TestItem>
          data={testData.slice(0, 2)}
          columns={defaultColumns}
          actions={actions}
        />
      );

      // Should have 2 Edit buttons and 2 Delete buttons (one per row)
      expect(screen.getAllByText('Edit')).toHaveLength(2);
      expect(screen.getAllByText('Delete')).toHaveLength(2);
    });

    it('should call action callback with correct row data', () => {
      const onEdit = jest.fn();
      const actions: DataTableRowAction<TestItem>[] = [
        { label: 'Edit', onClick: onEdit },
      ];

      render(
        <DataTable<TestItem>
          data={testData.slice(0, 1)}
          columns={defaultColumns}
          actions={actions}
        />
      );

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(testData[0], 0);
    });

    it('should conditionally show actions based on show function', () => {
      const actions: DataTableRowAction<TestItem>[] = [
        {
          label: 'Activate',
          onClick: jest.fn(),
          show: (row) => row.status === 'inactive',
        },
        {
          label: 'Deactivate',
          onClick: jest.fn(),
          show: (row) => row.status === 'active',
        },
      ];

      render(
        <DataTable<TestItem>
          data={testData.slice(0, 2)}
          columns={defaultColumns}
          actions={actions}
        />
      );

      // First row is active, should show Deactivate
      // Second row is inactive, should show Activate
      expect(screen.getByText('Deactivate')).toBeInTheDocument();
      expect(screen.getByText('Activate')).toBeInTheDocument();
    });

    it('should render Actions column header when actions are provided', () => {
      const actions: DataTableRowAction<TestItem>[] = [
        { label: 'Edit', onClick: jest.fn() },
      ];

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          actions={actions}
        />
      );

      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate rows with arrow keys', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          keyboardNavigation
        />
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();

      // Simulate arrow down
      fireEvent.keyDown(table!, { key: 'ArrowDown' });

      // First row should be focused
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveClass('bg-blue-50');
    });

    it('should navigate to first row with Home key', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          keyboardNavigation
        />
      );

      const table = container.querySelector('table');

      // Navigate down first
      fireEvent.keyDown(table!, { key: 'ArrowDown' });
      fireEvent.keyDown(table!, { key: 'ArrowDown' });

      // Then press Home
      fireEvent.keyDown(table!, { key: 'Home' });

      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveClass('bg-blue-50');
    });

    it('should navigate to last row with End key', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          keyboardNavigation
        />
      );

      const table = container.querySelector('table');

      // Press End
      fireEvent.keyDown(table!, { key: 'End' });

      const rows = screen.getAllByRole('row');
      expect(rows[rows.length - 1]).toHaveClass('bg-blue-50');
    });

    it('should not navigate when keyboardNavigation is false', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          keyboardNavigation={false}
        />
      );

      const table = container.querySelector('table');

      fireEvent.keyDown(table!, { key: 'ArrowDown' });

      const rows = screen.getAllByRole('row');
      expect(rows[1]).not.toHaveClass('bg-blue-50');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          ariaLabel="Projects table"
        />
      );

      const table = container.querySelector('table');
      expect(table).toHaveAttribute('role', 'table');
      expect(table).toHaveAttribute('aria-label', 'Projects table');
    });

    it('should have proper column header attributes', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
        />
      );

      const headers = container.querySelectorAll('th');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
        expect(header).toHaveAttribute('role', 'columnheader');
      });
    });

    it('should have proper aria-sort attributes for sortable columns', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveAttribute('aria-sort', 'none');

      fireEvent.click(nameHeader!);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should have proper cell roles', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData.slice(0, 1)}
          columns={defaultColumns}
        />
      );

      const cells = container.querySelectorAll('td');
      cells.forEach((cell) => {
        expect(cell).toHaveAttribute('role', 'cell');
      });
    });

    it('should have proper row roles', () => {
      const { container } = render(
        <DataTable<TestItem>
          data={testData.slice(0, 1)}
          columns={defaultColumns}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        expect(row).toHaveAttribute('role', 'row');
      });
    });
  });

  describe('Combined Features', () => {
    it('should work with sorting, filtering, and pagination together', async () => {
      const onSortChange = jest.fn();
      const onFilterChange = jest.fn();
      const onPageChange = jest.fn();

      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
          pagination={{
            currentPage: 1,
            pageSize: 2,
            total: testData.length,
            onPageChange,
          }}
        />
      );

      // Search
      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Project');

      // Sort
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // Paginate
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      expect(onFilterChange).toHaveBeenCalled();
      expect(onSortChange).toHaveBeenCalled();
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should maintain sort when filtering', async () => {
      render(
        <DataTable<TestItem>
          data={testData}
          columns={defaultColumns}
          searchable
        />
      );

      // Sort by name descending
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);

      // Filter
      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Project');

      // Should still be sorted
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Project Gamma');
    });
  });
});
