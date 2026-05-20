# Loading and Error States Implementation Guide

## Overview

This document describes the loading and error state components and their integration with the admin panel content management components.

## Components

### 1. LoadingState Component

A flexible loading state component that displays different types of loading indicators.

**Features:**
- Spinner and skeleton loader support
- Full-screen overlay mode
- Custom loading messages
- Smooth fade-in/fade-out animations
- Accessible with ARIA attributes (`aria-busy`, `aria-live`)
- Dark mode support

**Usage:**

```tsx
import { LoadingState } from '@/components/ui/LoadingState';

// Basic usage
<LoadingState isLoading={isLoading}>
  <YourContent />
</LoadingState>

// With custom message
<LoadingState 
  isLoading={isLoading} 
  message="Loading data..."
  indicatorType="spinner"
>
  <YourContent />
</LoadingState>

// Full-screen overlay
<LoadingState 
  isLoading={isLoading} 
  isFullScreen={true}
  message="Processing..."
>
  <YourContent />
</LoadingState>

// With skeleton loader
<LoadingState 
  isLoading={isLoading} 
  indicatorType="skeleton"
  skeletonProps={{ lines: 5 }}
>
  <YourContent />
</LoadingState>
```

**Props:**
- `isLoading: boolean` - Whether to show loading state
- `indicatorType?: 'spinner' | 'skeleton'` - Type of loading indicator (default: 'spinner')
- `message?: string` - Optional loading message
- `isFullScreen?: boolean` - Show as full-screen overlay (default: false)
- `ariaLabel?: string` - ARIA label for accessibility (default: 'Loading')
- `spinnerProps?: LoadingSpinnerProps` - Props for spinner component
- `skeletonProps?: SkeletonLoaderProps` - Props for skeleton component
- `children?: React.ReactNode` - Content to display when not loading

### 2. ErrorState Component

A flexible error state component that displays error messages with recovery actions.

**Features:**
- Multiple error types (validation, network, server, auth, generic)
- Retry and dismiss buttons
- Error descriptions
- Full-screen overlay mode
- Accessible with ARIA attributes (`aria-live`, `aria-label`)
- Dark mode support
- Type-specific styling and icons

**Usage:**

```tsx
import { ErrorState } from '@/components/ui/ErrorState';

// Basic usage
<ErrorState 
  isError={hasError} 
  message="Something went wrong"
  onRetry={handleRetry}
>
  <YourContent />
</ErrorState>

// With error type and description
<ErrorState 
  isError={hasError} 
  errorType="network"
  message="Network Error"
  description="Please check your connection and try again"
  onRetry={handleRetry}
  onDismiss={handleDismiss}
>
  <YourContent />
</ErrorState>

// Full-screen overlay
<ErrorState 
  isError={hasError} 
  isFullScreen={true}
  message="Error"
  onRetry={handleRetry}
>
  <YourContent />
</ErrorState>

// Custom button text
<ErrorState 
  isError={hasError} 
  message="Validation Error"
  retryButtonText="Try Again"
  dismissButtonText="Close"
  onRetry={handleRetry}
  onDismiss={handleDismiss}
>
  <YourContent />
</ErrorState>
```

**Props:**
- `isError: boolean` - Whether to show error state
- `message?: string` - Error message
- `errorType?: 'validation' | 'network' | 'server' | 'auth' | 'generic'` - Error type (default: 'generic')
- `description?: string` - Detailed error description
- `isFullScreen?: boolean` - Show as full-screen overlay (default: false)
- `onRetry?: () => void` - Callback for retry button
- `onDismiss?: () => void` - Callback for dismiss button
- `showRetry?: boolean` - Show retry button (default: true)
- `showDismiss?: boolean` - Show dismiss button (default: true)
- `retryButtonText?: string` - Custom retry button text (default: 'Try Again')
- `dismissButtonText?: string` - Custom dismiss button text (default: 'Dismiss')
- `ariaLabel?: string` - ARIA label for accessibility (default: 'Error')
- `children?: React.ReactNode` - Content to display when not in error state

### 3. ErrorBoundary Component

A React error boundary component that catches errors in child components.

**Features:**
- Catches React component errors
- Displays fallback UI
- Error logging for debugging
- Recovery options
- Custom error handlers
- Reset on prop changes
- Accessible error display

**Usage:**

```tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>

// With error handler
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Component error:', error);
    // Send to error tracking service
  }}
>
  <YourComponent />
</ErrorBoundary>

// With reset keys
<ErrorBoundary resetKeys={[userId]}>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children: ReactNode` - Child components to wrap
- `fallback?: (error: Error, reset: () => void) => ReactElement` - Custom fallback UI
- `onError?: (error: Error, errorInfo: React.ErrorInfo) => void` - Error handler callback
- `resetKeys?: Array<string | number>` - Keys to trigger reset on change
- `resetOnPropsChange?: boolean` - Reset when children change (default: false)

## Form Component Integration

### TextInput with Loading State

```tsx
import { TextInput } from '@/components/ui/TextInput';

<TextInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  isLoading={isValidating}
  loadingMessage="Validating..."
/>
```

**New Props:**
- `isLoading?: boolean` - Show loading spinner
- `loadingMessage?: string` - Message to display during loading

### TextArea with Loading State

```tsx
import { TextArea } from '@/components/ui/TextArea';

<TextArea
  label="Description"
  placeholder="Enter description"
  error={errors.description}
  isLoading={isSaving}
  loadingMessage="Saving..."
  showCharCount
  maxLength={500}
/>
```

**New Props:**
- `isLoading?: boolean` - Show loading spinner
- `loadingMessage?: string` - Message to display during loading

### Select with Loading State

```tsx
import { Select } from '@/components/ui/Select';

<Select
  label="Category"
  options={categories}
  placeholder="Select a category"
  error={errors.category}
  isLoading={isLoadingCategories}
  loadingMessage="Loading categories..."
/>
```

**New Props:**
- `isLoading?: boolean` - Show loading spinner
- `loadingMessage?: string` - Message to display during loading

## DataTable Integration

The DataTable component already supports loading states:

```tsx
import { DataTable } from '@/components/ui/DataTable';

<DataTable
  data={projects}
  columns={columns}
  actions={actions}
  isLoading={isLoading}
  emptyMessage="No projects found"
  pagination={{
    currentPage: page,
    pageSize: 10,
    total: total,
    onPageChange: setPage,
  }}
/>
```

**Props:**
- `isLoading?: boolean` - Show loading state
- `emptyMessage?: string` - Message when no data available

## Modal Integration

The Modal component supports loading states in actions:

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Delete Project"
  message="Are you sure you want to delete this project?"
  actions={[
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger',
      isLoading: isDeleting,
    },
    {
      label: 'Cancel',
      onClick: onClose,
      variant: 'secondary',
    },
  ]}
/>
```

**Action Props:**
- `isLoading?: boolean` - Show loading state on button
- `disabled?: boolean` - Disable button

## Accessibility Features

### ARIA Attributes

All loading and error state components include proper ARIA attributes:

- `aria-busy="true"` - Indicates element is busy/loading
- `aria-live="polite"` - Announces status changes
- `aria-live="assertive"` - Announces errors immediately
- `aria-label` - Descriptive labels for screen readers
- `role="alert"` - Semantic role for error messages
- `role="status"` - Semantic role for status messages

### Keyboard Navigation

- ErrorBoundary: Buttons are keyboard accessible
- Modal: ESC key to close, Tab to navigate
- Form inputs: Tab navigation, Enter to submit
- DataTable: Arrow keys for row navigation

### Color Contrast

All components maintain WCAG 2.1 AA color contrast ratios:
- Text on background: 4.5:1 minimum
- UI components: 3:1 minimum

## Dark Mode Support

All components include dark mode classes:

```tsx
// Example dark mode classes
className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-300 dark:border-gray-600
"
```

## Testing

### Unit Tests

All components include comprehensive unit tests:

```bash
npm test -- TextInput.test.tsx
npm test -- TextArea.test.tsx
npm test -- Select.test.tsx
npm test -- LoadingState.test.tsx
npm test -- ErrorState.test.tsx
npm test -- ErrorBoundary.test.tsx
```

### Test Coverage

Target coverage: **80%+** for all components

**Tested scenarios:**
- Rendering with various props
- Loading state transitions
- Error state transitions
- Accessibility attributes
- Dark mode classes
- User interactions
- Edge cases

### Example Test

```tsx
describe('TextInput with Loading State', () => {
  it('should disable input when loading', () => {
    const { container } = render(
      <TextInput isLoading={true} />
    );
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });

  it('should show loading spinner', () => {
    const { container } = render(
      <TextInput isLoading={true} />
    );
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have aria-busy attribute', () => {
    const { container } = render(
      <TextInput isLoading={true} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-busy', 'true');
  });
});
```

## Best Practices

### 1. Use Appropriate Loading Indicators

- **Spinner**: For quick operations (< 2 seconds)
- **Skeleton**: For content loading (> 2 seconds)
- **Full-screen**: For page-level operations

### 2. Provide User Feedback

Always include loading messages:
```tsx
<LoadingState 
  isLoading={isLoading}
  message="Saving your changes..."
>
  <Form />
</LoadingState>
```

### 3. Handle Errors Gracefully

Always provide retry options:
```tsx
<ErrorState
  isError={hasError}
  message="Failed to load data"
  onRetry={handleRetry}
>
  <Content />
</ErrorState>
```

### 4. Disable Interactions During Loading

Automatically disable form inputs:
```tsx
<TextInput
  isLoading={isSubmitting}
  disabled={isSubmitting}
/>
```

### 5. Use Error Types for Context

Choose appropriate error types:
```tsx
// Network error
<ErrorState errorType="network" message="Connection failed" />

// Validation error
<ErrorState errorType="validation" message="Invalid input" />

// Server error
<ErrorState errorType="server" message="Server error" />

// Auth error
<ErrorState errorType="auth" message="Unauthorized" />
```

### 6. Wrap Components with ErrorBoundary

Protect critical sections:
```tsx
<ErrorBoundary>
  <AdminDashboard />
</ErrorBoundary>
```

## Performance Considerations

### 1. Memoization

Components are optimized with React.memo and useMemo:
```tsx
export const LoadingState = React.memo(({ isLoading, ... }) => {
  // Component implementation
});
```

### 2. Animation Performance

Loading spinners use CSS animations for better performance:
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 3. Lazy Loading

Skeleton loaders are used for large content:
```tsx
<LoadingState 
  isLoading={isLoading}
  indicatorType="skeleton"
  skeletonProps={{ lines: 10 }}
>
  <LargeContent />
</LoadingState>
```

## Migration Guide

### From Old Loading Pattern

**Before:**
```tsx
{isLoading ? <Spinner /> : <Content />}
```

**After:**
```tsx
<LoadingState isLoading={isLoading}>
  <Content />
</LoadingState>
```

### From Old Error Pattern

**Before:**
```tsx
{error && <div className="error">{error}</div>}
```

**After:**
```tsx
<ErrorState 
  isError={!!error}
  message={error}
  onRetry={handleRetry}
>
  <Content />
</ErrorState>
```

## Troubleshooting

### Loading spinner not showing

- Check `isLoading` prop is `true`
- Verify `indicatorType` is set correctly
- Check CSS classes are applied

### Error message not displaying

- Check `isError` prop is `true`
- Verify `message` prop is provided
- Check `aria-live` attribute is present

### Accessibility issues

- Use semantic HTML (role="alert", role="status")
- Include ARIA labels and descriptions
- Test with screen readers
- Verify keyboard navigation

## Related Components

- [LoadingSpinner](./LoadingSpinner.tsx)
- [SkeletonLoader](./SkeletonLoader.tsx)
- [Button](./Button.tsx)
- [Modal](./Modal.tsx)
- [DataTable](./DataTable.tsx)

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
