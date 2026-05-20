# Toast Notification System

A reusable, accessible toast notification system for the admin panel. Supports multiple toast types, auto-dismiss, custom actions, and TypeScript type safety.

## Features

- **Multiple Toast Types**: success, error, warning, info
- **Auto-Dismiss**: Configurable duration with pause on hover
- **Action Buttons**: Optional action button with custom callback
- **Accessible**: ARIA labels, keyboard navigation, semantic HTML
- **TypeScript**: Full type safety with proper interfaces
- **Dark Mode**: Automatic dark mode support
- **Stacking**: Multiple toasts displayed simultaneously
- **Positioning**: Configurable position (top-right, top-left, bottom-right, bottom-left)

## Setup

### 1. Add ToastProvider to Root Layout

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ToastProvider position="top-right" maxToasts={5}>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### 2. Use Toast in Components

```tsx
'use client';

import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      // Your save logic here
      toast.success('Changes saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Usage Examples

### Basic Toasts

```tsx
const toast = useToast();

// Success toast
toast.success('Profile updated successfully!');

// Error toast
toast.error('Failed to update profile');

// Warning toast
toast.warning('This action cannot be undone');

// Info toast
toast.info('New updates available');
```

### Custom Duration

```tsx
// Show toast for 3 seconds
toast.success('Saved!', { duration: 3000 });

// Show toast indefinitely (must be manually closed)
toast.info('Important notice', { duration: 0 });
```

### With Action Button

```tsx
const handleUndo = () => {
  // Undo logic here
  toast.info('Changes undone');
};

toast.success('Profile updated!', {
  action: {
    label: 'Undo',
    onClick: handleUndo,
  },
});
```

### Generic addToast Method

```tsx
// For more control, use the generic addToast method
const toastId = toast.addToast('Custom message', 'warning', {
  duration: 4000,
  action: {
    label: 'Retry',
    onClick: () => {
      // Retry logic
    },
  },
});

// Later, remove the toast programmatically
toast.removeToast(toastId);
```

### Clear All Toasts

```tsx
// Remove all toasts at once
toast.clearToasts();
```

## API Reference

### useToast Hook

```tsx
const toast = useToast();
```

#### Methods

**success(message, options?)**
- Adds a success toast
- Returns: `string` (toast ID)
- Options: `{ duration?: number }`

**error(message, options?)**
- Adds an error toast
- Returns: `string` (toast ID)
- Options: `{ duration?: number }`

**warning(message, options?)**
- Adds a warning toast
- Returns: `string` (toast ID)
- Options: `{ duration?: number }`

**info(message, options?)**
- Adds an info toast
- Returns: `string` (toast ID)
- Options: `{ duration?: number }`

**addToast(message, type, options?)**
- Adds a toast with full control
- Returns: `string` (toast ID)
- Options:
  ```tsx
  {
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  ```

**removeToast(id)**
- Removes a specific toast
- Parameters: `id: string`

**clearToasts()**
- Removes all toasts

#### Properties

**toasts**
- Array of current toasts
- Type: `ToastMessage[]`

### ToastProvider Props

```tsx
<ToastProvider
  position="top-right"  // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  maxToasts={5}         // Maximum number of visible toasts
>
  {children}
</ToastProvider>
```

### Toast Component Props

```tsx
interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Real-World Examples

### Form Submission

```tsx
'use client';

import { useToast } from '@/hooks/useToast';
import { Button, TextInput } from '@/components/ui';
import { useState } from 'react';

export function ProfileForm() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput name="name" label="Name" required />
      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}
```

### Delete Confirmation with Undo

```tsx
'use client';

import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui';
import { useState } from 'react';

export function DeleteButton({ itemId }: { itemId: string }) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      toast.success('Item deleted', {
        action: {
          label: 'Undo',
          onClick: async () => {
            // Restore the item
            await fetch(`/api/items/${itemId}/restore`, {
              method: 'POST',
            });
            toast.info('Item restored');
          },
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete item'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      isLoading={isDeleting}
    >
      Delete
    </Button>
  );
}
```

### API Error Handling

```tsx
'use client';

import { useToast } from '@/hooks/useToast';

export async function fetchWithToast(
  url: string,
  options?: RequestInit
) {
  const toast = useToast();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || 'An error occurred');
      throw new Error(error.message);
    }

    return response;
  } catch (error) {
    if (!(error instanceof Error) || !error.message) {
      toast.error('Network error. Please try again.');
    }
    throw error;
  }
}
```

### Batch Operations

```tsx
'use client';

import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui';
import { useState } from 'react';

export function BulkDeleteButton({ itemIds }: { itemIds: string[] }) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/items/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: itemIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete items');
      }

      toast.success(`${itemIds.length} items deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete items'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleBulkDelete}
      isLoading={isDeleting}
      disabled={itemIds.length === 0}
    >
      Delete {itemIds.length} items
    </Button>
  );
}
```

## Styling

The toast system uses Tailwind CSS with automatic dark mode support. Colors are based on the toast type:

- **Success**: Green (bg-green-50, border-green-200)
- **Error**: Red (bg-red-50, border-red-200)
- **Warning**: Yellow (bg-yellow-50, border-yellow-200)
- **Info**: Blue (bg-blue-50, border-blue-200)

Dark mode variants are automatically applied based on the system preference.

## Accessibility

The toast system follows WCAG 2.1 AA guidelines:

- **ARIA Live Region**: Uses `aria-live="polite"` for screen reader announcements
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Keyboard Navigation**: All buttons are keyboard accessible
- **Focus Management**: Focus is properly managed when toasts appear/disappear
- **Color Contrast**: All text meets WCAG AA contrast requirements
- **Labels**: All interactive elements have proper labels

## Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { useToast } from '@/hooks/useToast';

const TestComponent = () => {
  const toast = useToast();
  return (
    <button onClick={() => toast.success('Test toast')}>
      Show Toast
    </button>
  );
};

test('should show success toast', async () => {
  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );

  fireEvent.click(screen.getByText('Show Toast'));

  await waitFor(() => {
    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Use Appropriate Types**: Choose the right toast type for the message
2. **Keep Messages Short**: Toast messages should be concise and actionable
3. **Avoid Overuse**: Don't show too many toasts at once
4. **Provide Context**: Include relevant information in the message
5. **Use Actions Sparingly**: Only add action buttons when necessary
6. **Handle Errors Gracefully**: Always show error toasts for failed operations
7. **Test Accessibility**: Verify toasts work with screen readers
8. **Consider Duration**: Use longer durations for important messages

## Troubleshooting

### Toast not appearing

- Ensure `ToastProvider` is wrapping your component
- Check that `useToast` is called within a component inside `ToastProvider`
- Verify the component is marked with `'use client'` directive

### Toast disappearing too quickly

- Increase the `duration` option
- Use `duration: 0` to prevent auto-dismiss

### Multiple toasts not showing

- Check the `maxToasts` prop on `ToastProvider`
- Increase the limit if needed

### Styling issues

- Ensure Tailwind CSS is properly configured
- Check that dark mode is enabled in your Tailwind config
- Verify CSS is being applied correctly

## Future Enhancements

- [ ] Toast sound notifications
- [ ] Toast persistence (save to localStorage)
- [ ] Toast history/log viewer
- [ ] Custom toast templates
- [ ] Toast animations customization
- [ ] Toast grouping by type
- [ ] Toast priority levels
