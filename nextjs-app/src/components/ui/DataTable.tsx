import React, { useMemo, useState, useCallback } from 'react';
import { Button } from './Button';

/**
 * Column definition for DataTable
 */
export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  key: keyof T;
  /** Display label for the column header */
  label: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is filterable */
  filterable?: boolean;
  /** Custom render function for cell content */
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  /** CSS class for column styling */
  className?: string;
  /** Width of the column (CSS value) */
  width?: string;
}

/**
 * Row action definition for DataTable
 */
export interface DataTableRowAction<T> {
  /** Label for the action button */
  label: string;
  /** Callback when action is clicked */
  onClick: (row: T, index: number) => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Whether to show the action button */
  show?: (row: T) => boolean;
  /** CSS class for the button */
  className?: string;
}

/**
 * Pagination configuration
 */
export interface DataTablePagination {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}

/**
 * Sort configuration
 */
export interface DataTableSort<T> {
  /** Column key to sort by */
  key: keyof T | null;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Filter configuration
 */
export interface DataTableFilter {
  /** Column key to filter */
  key: string;
  /** Filter value */
  value: string;
}

/**
 * DataTable Props
 */
export interface DataTableProps<T> {
  /** Array of data to display */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Row actions */
  actions?: DataTableRowAction<T>[];
  /** Pagination configuration */
  pagination?: DataTablePagination;
  /** Initial sort configuration */
  initialSort?: DataTableSort<T>;
  /** Whether to show search/filter input */
  searchable?: boolean;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Callback when sort changes */
  onSortChange?: (sort: DataTableSort<T>) => void;
  /** Callback when filter changes */
  onFilterChange?: (filters: DataTableFilter[]) => void;
  /** CSS class for table wrapper */
  className?: string;
  /** CSS class for table element */
  tableClassName?: string;
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Accessible table title */
  ariaLabel?: string;
  /** Whether to enable keyboard navigation */
  keyboardNavigation?: boolean;
}

/**
 * DataTable Component
 * A reusable, accessible data table with sorting, filtering, and pagination
 *
 * Features:
 * - Sortable columns (click header to sort)
 * - Filterable columns (search/filter input)
 * - Pagination support
 * - Row actions (edit, delete, etc.)
 * - Keyboard navigation (arrow keys, enter)
 * - ARIA labels and semantic HTML
 * - Responsive design
 * - Dark mode support
 * - Loading state
 * - Empty state handling
 *
 * @example
 * ```tsx
 * const columns: DataTableColumn<Project>[] = [
 *   { key: 'title', label: 'Title', sortable: true, filterable: true },
 *   { key: 'category', label: 'Category', sortable: true },
 *   { key: 'createdAt', label: 'Created', render: (value) => new Date(value).toLocaleDateString() },
 * ];
 *
 * const actions: DataTableRowAction<Project>[] = [
 *   { label: 'Edit', onClick: (row) => handleEdit(row), variant: 'primary' },
 *   { label: 'Delete', onClick: (row) => handleDelete(row), variant: 'danger' },
 * ];
 *
 * <DataTable
 *   data={projects}
 *   columns={columns}
 *   actions={actions}
 *   searchable
 *   pagination={{ currentPage: 1, pageSize: 10, total: 50, onPageChange: setPage }}
 * />
 * ```
 */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      data,
      columns,
      actions = [],
      pagination,
      initialSort,
      searchable = true,
      searchPlaceholder = 'Search...',
      onSortChange,
      onFilterChange,
      className = '',
      tableClassName = '',
      showRowNumbers = false,
      emptyMessage = 'No data available',
      isLoading = false,
      ariaLabel = 'Data table',
      keyboardNavigation = true,
    },
    ref
  ) => {
    // State management
    const [sort, setSort] = useState<DataTableSort<any>>(
      initialSort || { key: null, direction: 'asc' }
    );
    const [filters, setFilters] = useState<DataTableFilter[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

    // Handle sort change
    const handleSort = useCallback(
      (columnKey: keyof any) => {
        const column = columns.find((col) => col.key === columnKey);
        if (!column?.sortable) return;

        const newSort: DataTableSort<any> = {
          key: columnKey,
          direction:
            sort.key === columnKey && sort.direction === 'asc'
              ? 'desc'
              : 'asc',
        };

        setSort(newSort);
        onSortChange?.(newSort);
      },
      [sort, columns, onSortChange]
    );

    // Handle search/filter
    const handleSearch = useCallback(
      (term: string) => {
        setSearchTerm(term);
        const newFilters = term
          ? [{ key: 'search', value: term }]
          : filters.filter((f) => f.key !== 'search');
        setFilters(newFilters);
        onFilterChange?.(newFilters);
      },
      [filters, onFilterChange]
    );

    // Filter data based on search term
    const filteredData = useMemo(() => {
      if (!searchTerm) return data;

      return data.filter((row) => {
        return columns.some((column) => {
          if (!column.filterable) return false;
          const value = row[column.key];
          if (value === null || value === undefined) return false;
          return String(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      });
    }, [data, searchTerm, columns]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sort.key) return filteredData;

      const sortKey = sort.key;
      const sorted = [...filteredData].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Compare values
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    }, [filteredData, sort]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;

      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return sortedData.slice(start, end);
    }, [sortedData, pagination]);

    // Calculate total pages
    const totalPages = useMemo(() => {
      if (!pagination) return 1;
      return Math.ceil(pagination.total / pagination.pageSize);
    }, [pagination]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTableElement>) => {
        if (!keyboardNavigation) return;

        const rowCount = paginatedData.length;
        if (rowCount === 0) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setFocusedRowIndex((prev) =>
              prev === null ? 0 : Math.min(prev + 1, rowCount - 1)
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFocusedRowIndex((prev) =>
              prev === null ? rowCount - 1 : Math.max(prev - 1, 0)
            );
            break;
          case 'Home':
            event.preventDefault();
            setFocusedRowIndex(0);
            break;
          case 'End':
            event.preventDefault();
            setFocusedRowIndex(rowCount - 1);
            break;
          default:
            break;
        }
      },
      [paginatedData.length, keyboardNavigation]
    );

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={`flex items-center justify-center p-8 ${className}`}
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    // Empty state
    if (paginatedData.length === 0) {
      return (
        <div
          ref={ref}
          className={`
            flex flex-col items-center justify-center p-8
            text-center
            ${className}
          `}
        >
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div ref={ref} className={`flex flex-col gap-4 ${className}`}>
        {/* Search/Filter Input */}
        {searchable && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="
                flex-1 px-4 py-2 rounded-md
                border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors duration-200
              "
              aria-label="Search table"
            />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table
            className={`
              w-full border-collapse
              bg-white dark:bg-gray-900
              text-sm
              ${tableClassName}
            `}
            role="table"
            aria-label={ariaLabel}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {showRowNumbers && (
                  <th
                    className="
                      px-4 py-3 text-left font-semibold
                      text-gray-700 dark:text-gray-300
                      w-12
                    "
                    scope="col"
                  >
                    #
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`
                      px-4 py-3 text-left font-semibold
                      text-gray-700 dark:text-gray-300
                      ${column.width ? `w-[${column.width}]` : ''}
                      ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                      transition-colors duration-200
                      ${column.className || ''}
                    `}
                    scope="col"
                    onClick={() => column.sortable && handleSort(column.key)}
                    role="columnheader"
                    aria-sort={
                      sort.key === column.key
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span
                          className="text-gray-400 dark:text-gray-500"
                          aria-hidden="true"
                        >
                          {sort.key === column.key ? (
                            sort.direction === 'asc' ? (
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 20a1 1 0 01-1.414-1.414l1.293-1.293H10a1 1 0 110-2h5.586l-1.293-1.293a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3z" />
                              </svg>
                            )
                          ) : (
                            <svg
                              className="w-4 h-4 opacity-0 group-hover:opacity-100"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {actions.length > 0 && (
                  <th
                    className="
                      px-4 py-3 text-left font-semibold
                      text-gray-700 dark:text-gray-300
                      w-24
                    "
                    scope="col"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    border-b border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition-colors duration-200
                    ${focusedRowIndex === rowIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                  role="row"
                  tabIndex={focusedRowIndex === rowIndex ? 0 : -1}
                >
                  {showRowNumbers && (
                    <td
                      className="
                        px-4 py-3
                        text-gray-600 dark:text-gray-400
                        font-medium
                      "
                      role="cell"
                    >
                      {pagination
                        ? (pagination.currentPage - 1) * pagination.pageSize +
                          rowIndex +
                          1
                        : rowIndex + 1}
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`
                        px-4 py-3
                        text-gray-900 dark:text-gray-100
                        ${column.className || ''}
                      `}
                      role="cell"
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td
                      className="px-4 py-3"
                      role="cell"
                    >
                      <div className="flex gap-2">
                        {actions.map((action, actionIndex) => {
                          const shouldShow =
                            action.show === undefined || action.show(row);
                          if (!shouldShow) return null;

                          return (
                            <Button
                              key={actionIndex}
                              variant={action.variant || 'secondary'}
                              size="sm"
                              onClick={() => action.onClick(row, rowIndex)}
                              className={action.className}
                            >
                              {action.label}
                            </Button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.currentPage} of {totalPages} (
              {pagination.total} total)
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  pagination.onPageChange(
                    Math.max(1, pagination.currentPage - 1)
                  )
                }
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and adjacent pages
                    const distance = Math.abs(page - pagination.currentPage);
                    return (
                      page === 1 ||
                      page === totalPages ||
                      distance <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 py-1 text-gray-600 dark:text-gray-400">
                            ...
                          </span>
                        )}
                        <Button
                          variant={
                            page === pagination.currentPage
                              ? 'primary'
                              : 'secondary'
                          }
                          size="sm"
                          onClick={() => pagination.onPageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  pagination.onPageChange(
                    Math.min(totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={pagination.currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
