# DataTable Component Usage Guide

## Overview

The `DataTable` component is a reusable, accessible data table with built-in support for sorting, filtering, pagination, and row actions. It's designed to work seamlessly with TypeScript and follows accessibility best practices (WCAG 2.1 AA).

## Features

- ✅ **Sortable Columns**: Click column headers to sort data
- ✅ **Filterable Columns**: Search/filter data across multiple columns
- ✅ **Pagination**: Built-in pagination with customizable page size
- ✅ **Row Actions**: Add custom actions (edit, delete, etc.) for each row
- ✅ **Keyboard Navigation**: Arrow keys, Home, End for navigation
- ✅ **Accessibility**: Full ARIA labels, semantic HTML, screen reader support
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Dark Mode**: Full dark mode support with Tailwind CSS
- ✅ **Loading State**: Built-in loading indicator
- ✅ **Empty State**: Customizable empty state message
- ✅ **TypeScript**: Full type safety with generics

## Installation

The DataTable component is already available in the UI components library:

```typescript
import { DataTable, type DataTableColumn, type DataTableRowAction } from '@/components/ui';
```

## Basic Usage

### Simple Table

```typescript
import { DataTable, type DataTableColumn } from '@/components/ui';

interface Project {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'inactive';
}

const projects: Project[] = [
  { id: 1, title: 'Project A', category: 'Web', status: 'active' },
  { id: 2, title: 'Project B', category: 'Mobile', status: 'inactive' },
];

const columns: DataTableColumn<Project>[] = [
  { key: 'title', label: 'Title', sortable: true, filterable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

export function ProjectsTable() {
  return (
    <DataTable
      data={projects}
      columns={columns}
      searchable
      ariaLabel="Projects table"
    />
  );
}
```

## Advanced Usage

### With Pagination

```typescript
import { useState } from 'react';
import { DataTable, type DataTableColumn, type DataTablePagination } from '@/components/ui';

export function ProjectsTableWithPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const pagination: DataTablePagination = {
    currentPage,
    pageSize,
    total: projects.length,
    onPageChange: setCurrentPage,
  };

  return (
    <DataTable
      data={projects}
      columns={columns}
      pagination={pagination}
      searchable
    />
  );
}
```

### With Row Actions

```typescript
import { DataTable, type DataTableRowAction } from '@/components/ui';

export function ProjectsTableWithActions() {
  const handleEdit = (project: Project) => {
    console.log('Edit:', project);
    // Navigate to edit page or open modal
  };

  const handleDelete = (project: Project) => {
    console.log('Delete:', project);
    // Show confirmation and delete
  };

  const actions: DataTableRowAction<Project>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'primary',
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <DataTable
      data={projects}
      columns={columns}
      actions={actions}
      searchable
    />
  );
}
```

### With Custom Cell Rendering

```typescript
import { DataTable, type DataTableColumn } from '@/components/ui';

const columns: DataTableColumn<Project>[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    filterable: true,
    render: (value) => <strong>{value}</strong>,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <span
        className={`
          px-2 py-1 rounded text-sm font-medium
          ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}
      >
        {value}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
];
```

### With Conditional Actions

```typescript
const actions: DataTableRowAction<Project>[] = [
  {
    label: 'Activate',
    onClick: handleActivate,
    variant: 'primary',
    show: (project) => project.status === 'inactive',
  },
  {
    label: 'Deactivate',
    onClick: handleDeactivate,
    variant: 'secondary',
    show: (project) => project.status === 'active',
  },
  {
    label: 'Delete',
    onClick: handleDelete,
    variant: 'danger',
  },
];
```

### With Sort and Filter Callbacks

```typescript
import { useState } from 'react';
import { DataTable, type DataTableSort, type DataTableFilter } from '@/components/ui';

export function ProjectsTableWithCallbacks() {
  const [sort, setSort] = useState<DataTableSort<Project> | null>(null);
  const [filters, setFilters] = useState<DataTableFilter[]>([]);

  const handleSortChange = (newSort: DataTableSort<Project>) => {
    setSort(newSort);
    // Fetch data from API with new sort
    console.log('Sort changed:', newSort);
  };

  const handleFilterChange = (newFilters: DataTableFilter[]) => {
    setFilters(newFilters);
    // Fetch data from API with new filters
    console.log('Filters changed:', newFilters);
  };

  return (
    <DataTable
      data={projects}
      columns={columns}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      searchable
    />
  );
}
```

### Complete Example with All Features

```typescript
import { useState } from 'react';
import {
  DataTable,
  type DataTableColumn,
  type DataTableRowAction,
  type DataTablePagination,
  type DataTableSort,
} from '@/components/ui';

interface Project {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export function ProjectsTableComplete() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: 'Project A', category: 'Web', status: 'active', createdAt: '2024-01-15' },
    { id: 2, title: 'Project B', category: 'Mobile', status: 'inactive', createdAt: '2024-01-20' },
    { id: 3, title: 'Project C', category: 'Web', status: 'active', createdAt: '2024-02-01' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: DataTableColumn<Project>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true,
      render: (value) => <strong>{value}</strong>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`
            px-2 py-1 rounded text-sm font-medium
            ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: DataTableRowAction<Project>[] = [
    {
      label: 'Edit',
      onClick: (project) => console.log('Edit:', project),
      variant: 'primary',
    },
    {
      label: 'Delete',
      onClick: (project) => {
        setProjects(projects.filter((p) => p.id !== project.id));
      },
      variant: 'danger',
    },
  ];

  const pagination: DataTablePagination = {
    currentPage,
    pageSize: 10,
    total: projects.length,
    onPageChange: setCurrentPage,
  };

  return (
    <DataTable
      data={projects}
      columns={columns}
      actions={actions}
      pagination={pagination}
      searchable
      searchPlaceholder="Search projects..."
      showRowNumbers
      isLoading={isLoading}
      emptyMessage="No projects found"
      ariaLabel="Projects management table"
      keyboardNavigation
    />
  );
}
```

## API Reference

### DataTableColumn<T>

```typescript
interface DataTableColumn<T> {
  // Unique identifier for the column (must be a key of T)
  key: keyof T;

  // Display label for the column header
  label: string;

  // Whether the column is sortable (default: false)
  sortable?: boolean;

  // Whether the column is filterable (default: false)
  filterable?: boolean;

  // Custom render function for cell content
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;

  // CSS class for column styling
  className?: string;

  // Width of the column (CSS value)
  width?: string;
}
```

### DataTableRowAction<T>

```typescript
interface DataTableRowAction<T> {
  // Label for the action button
  label: string;

  // Callback when action is clicked
  onClick: (row: T, index: number) => void;

  // Button variant (default: 'secondary')
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  // Whether to show the action button
  show?: (row: T) => boolean;

  // CSS class for the button
  className?: string;
}
```

### DataTablePagination

```typescript
interface DataTablePagination {
  // Current page number (1-indexed)
  currentPage: number;

  // Items per page
  pageSize: number;

  // Total number of items
  total: number;

  // Callback when page changes
  onPageChange: (page: number) => void;
}
```

### DataTableSort<T>

```typescript
interface DataTableSort<T> {
  // Column key to sort by
  key: keyof T | null;

  // Sort direction
  direction: 'asc' | 'desc';
}
```

### DataTableFilter

```typescript
interface DataTableFilter {
  // Column key to filter
  key: string;

  // Filter value
  value: string;
}
```

### DataTableProps<T>

```typescript
interface DataTableProps<T> {
  // Array of data to display
  data: T[];

  // Column definitions
  columns: DataTableColumn<T>[];

  // Row actions (optional)
  actions?: DataTableRowAction<T>[];

  // Pagination configuration (optional)
  pagination?: DataTablePagination;

  // Initial sort configuration (optional)
  initialSort?: DataTableSort<T>;

  // Whether to show search/filter input (default: true)
  searchable?: boolean;

  // Placeholder for search input (default: 'Search...')
  searchPlaceholder?: string;

  // Callback when sort changes
  onSortChange?: (sort: DataTableSort<T>) => void;

  // Callback when filter changes
  onFilterChange?: (filters: DataTableFilter[]) => void;

  // CSS class for table wrapper
  className?: string;

  // CSS class for table element
  tableClassName?: string;

  // Whether to show row numbers (default: false)
  showRowNumbers?: boolean;

  // Empty state message (default: 'No data available')
  emptyMessage?: string;

  // Loading state (default: false)
  isLoading?: boolean;

  // Accessible table title (default: 'Data table')
  ariaLabel?: string;

  // Whether to enable keyboard navigation (default: true)
  keyboardNavigation?: boolean;
}
```

## Keyboard Navigation

When `keyboardNavigation` is enabled (default), users can navigate the table using:

- **Arrow Down**: Move to next row
- **Arrow Up**: Move to previous row
- **Home**: Jump to first row
- **End**: Jump to last row
- **Escape**: Close any open modals/dialogs

## Accessibility Features

- ✅ Semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- ✅ ARIA labels and roles (`role="table"`, `role="columnheader"`, `role="cell"`)
- ✅ `aria-sort` attributes for sortable columns
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ High contrast support
- ✅ Proper heading hierarchy

## Styling

The DataTable component uses Tailwind CSS for styling and supports dark mode out of the box. You can customize styling by:

1. **Using className props**:
   ```typescript
   <DataTable
     className="custom-wrapper-class"
     tableClassName="custom-table-class"
   />
   ```

2. **Customizing column rendering**:
   ```typescript
   {
     key: 'status',
     label: 'Status',
     className: 'w-24',
     render: (value) => <CustomStatusBadge status={value} />,
   }
   ```

3. **Using Tailwind CSS**:
   ```typescript
   <div className="dark:bg-gray-900">
     <DataTable data={data} columns={columns} />
   </div>
   ```

## Performance Considerations

- **Large Datasets**: Use pagination to limit rendered rows
- **Sorting/Filtering**: For large datasets, implement server-side sorting/filtering
- **Custom Rendering**: Keep render functions simple to avoid performance issues
- **Memoization**: Use `useMemo` for expensive computations

## Testing

The DataTable component includes comprehensive unit tests. To run tests:

```bash
npm run test -- DataTable.test.tsx
```

## Common Use Cases

### Projects Management Table

```typescript
<DataTable
  data={projects}
  columns={[
    { key: 'title', label: 'Title', sortable: true, filterable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ]}
  actions={[
    { label: 'Edit', onClick: handleEdit, variant: 'primary' },
    { label: 'Delete', onClick: handleDelete, variant: 'danger' },
  ]}
  pagination={{ currentPage, pageSize: 10, total, onPageChange }}
  searchable
/>
```

### Achievements/Certificates Table

```typescript
<DataTable
  data={achievements}
  columns={[
    { key: 'title', label: 'Title', sortable: true, filterable: true },
    { key: 'issuer', label: 'Issuer', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
  ]}
  actions={[
    { label: 'View', onClick: handleView, variant: 'primary' },
    { label: 'Delete', onClick: handleDelete, variant: 'danger' },
  ]}
  searchable
/>
```

### Tech Stack Table

```typescript
<DataTable
  data={techStack}
  columns={[
    { key: 'name', label: 'Technology', sortable: true, filterable: true },
    { key: 'category', label: 'Category', sortable: true },
  ]}
  actions={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete, variant: 'danger' },
  ]}
  showRowNumbers
  searchable
/>
```

## Troubleshooting

### Table not showing data
- Check that `data` prop is not empty
- Verify column `key` values match data object keys
- Check browser console for errors

### Sorting not working
- Ensure `sortable: true` is set on columns
- Check that data types are comparable

### Filtering not working
- Ensure `filterable: true` is set on columns
- Check that search term matches data values (case-sensitive)

### Pagination not showing
- Ensure `pagination` prop is provided
- Check that `total` is greater than `pageSize`

### Accessibility issues
- Use semantic HTML in custom render functions
- Provide proper ARIA labels
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This component is part of the portfolio project and follows the same license.
