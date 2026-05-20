# Modal/Dialog Components

This directory contains reusable modal and dialog components for the admin panel. All components are built with TypeScript, styled with Tailwind CSS, and support accessibility best practices.

## Components

### Modal

A flexible modal component that can be used for any dialog, confirmation, or alert.

**Features:**
- Customizable title, message, and content
- Multiple action buttons with different variants
- Loading states for async operations
- Keyboard navigation (ESC to close)
- Focus management and ARIA attributes
- Accessible with proper semantic HTML
- Responsive sizing (sm, md, lg)
- Dark mode support
- Overlay click to dismiss (optional)

**Usage:**

```tsx
import { useState } from 'react';
import { Modal } from '@/components/ui';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    // Perform async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        actions={[
          {
            label: 'Cancel',
            onClick: () => setIsOpen(false),
            variant: 'secondary',
          },
          {
            label: 'Confirm',
            onClick: handleConfirm,
            variant: 'primary',
          },
        ]}
      />
    </>
  );
}
```

**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;                    // Whether the modal is visible
  onClose: () => void;                // Callback when modal should close
  title: string;                      // Modal title
  message?: string;                   // Optional message text
  children?: React.ReactNode;         // Optional custom content
  actions?: ModalAction[];            // Array of action buttons
  closeButton?: boolean;              // Show close button (default: true)
  size?: 'sm' | 'md' | 'lg';         // Modal size (default: 'md')
  isDismissible?: boolean;            // Allow ESC/overlay click to close (default: true)
  className?: string;                 // Custom container class
  contentClassName?: string;          // Custom content class
  overlayClassName?: string;          // Custom overlay class
}

interface ModalAction {
  label: string;                      // Button label
  onClick: () => void | Promise<void>; // Click handler (can be async)
  variant?: ButtonVariant;            // Button variant (default: 'secondary')
  isLoading?: boolean;                // Show loading spinner
  disabled?: boolean;                 // Disable button
}
```

### ConfirmationDialog

A specialized modal for confirmation dialogs with predefined actions.

**Features:**
- Simplified API for confirmations
- Default Cancel and Confirm buttons
- Customizable button labels and variants
- Loading state management
- Automatic button disabling during async operations

**Usage:**

```tsx
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // Perform async operation
      await deleteItem();
    } finally {
      setIsConfirming(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Item</button>

      <ConfirmationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirm}
        isConfirming={isConfirming}
      />
    </>
  );
}
```

**Props:**

```typescript
interface ConfirmationDialogProps extends Omit<ModalProps, 'actions' | 'children'> {
  confirmLabel?: string;              // Confirm button label (default: 'Confirm')
  cancelLabel?: string;               // Cancel button label (default: 'Cancel')
  confirmVariant?: ButtonVariant;     // Confirm button variant (default: 'primary')
  onConfirm: () => void | Promise<void>; // Confirm handler
  isConfirming?: boolean;             // Show loading state (default: false)
}
```

### DeleteConfirmationDialog

A specialized confirmation dialog for delete operations with delete-specific defaults.

**Features:**
- Pre-configured for delete operations
- Danger variant for confirm button
- Automatic message generation with item name
- Prevents accidental deletions

**Usage:**

```tsx
import { useState } from 'react';
import { DeleteConfirmationDialog } from '@/components/ui';

export function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      // Show success message
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div>
        <h3>{project.title}</h3>
        <button onClick={() => setIsOpen(true)}>Delete</button>
      </div>

      <DeleteConfirmationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        itemName={project.title}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </>
  );
}
```

**Props:**

```typescript
interface DeleteConfirmationDialogProps
  extends Omit<ConfirmationDialogProps, 'confirmVariant'> {
  itemName?: string;                  // Name of item being deleted (for message)
}
```

### AlertDialog

A specialized modal for displaying alerts with a single action button.

**Features:**
- Simplified API for alerts
- Single action button
- Multiple variants (info, success, warning, error)
- Automatic close on action

**Usage:**

```tsx
import { useState } from 'react';
import { AlertDialog } from '@/components/ui';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = () => {
    console.log('Alert dismissed');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show Alert</button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Success"
        message="Your changes have been saved successfully!"
        actionLabel="OK"
        onAction={handleAction}
        variant="success"
      />
    </>
  );
}
```

**Props:**

```typescript
interface AlertDialogProps extends Omit<ModalProps, 'actions' | 'children'> {
  actionLabel?: string;               // Action button label (default: 'OK')
  onAction?: () => void;              // Action handler
  variant?: 'info' | 'success' | 'warning' | 'error'; // Alert variant (default: 'info')
}
```

## Common Use Cases

### Delete Confirmation

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await api.delete(`/projects/${projectId}`);
    // Refresh data
  } finally {
    setIsDeleting(false);
    setIsOpen(false);
  }
};

<DeleteConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  itemName={projectName}
  onConfirm={handleDelete}
  isConfirming={isDeleting}
/>
```

### Unsaved Changes Warning

```tsx
const [isOpen, setIsOpen] = useState(false);

const handleDiscard = () => {
  // Discard changes and navigate away
  router.push('/admin/projects');
};

<ConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Unsaved Changes"
  message="You have unsaved changes. Do you want to discard them?"
  confirmLabel="Discard"
  cancelLabel="Keep Editing"
  confirmVariant="danger"
  onConfirm={handleDiscard}
/>
```

### Success Message

```tsx
const [isOpen, setIsOpen] = useState(false);

const handleClose = () => {
  setIsOpen(false);
  // Refresh data or navigate
};

<AlertDialog
  isOpen={isOpen}
  onClose={handleClose}
  title="Success"
  message="Project created successfully!"
  actionLabel="OK"
  variant="success"
/>
```

### Error Message

```tsx
const [isOpen, setIsOpen] = useState(false);
const [error, setError] = useState('');

const handleRetry = async () => {
  try {
    await retryOperation();
  } catch (err) {
    setError(err.message);
  }
};

<AlertDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Error"
  message={error}
  actionLabel="Retry"
  onAction={handleRetry}
  variant="error"
/>
```

### Custom Content Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Project"
  actions={[
    { label: 'Cancel', onClick: () => setIsOpen(false) },
    { label: 'Save', onClick: handleSave },
  ]}
>
  <form>
    <TextInput label="Title" {...register('title')} />
    <TextArea label="Description" {...register('description')} />
  </form>
</Modal>
```

## Accessibility

All modal components follow accessibility best practices:

- **ARIA Attributes**: Proper `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Keyboard Navigation**: ESC key to close (when dismissible)
- **Focus Management**: Focus moves to modal on open, returns to previous element on close
- **Semantic HTML**: Proper heading hierarchy and button semantics
- **Screen Reader Support**: Descriptive labels and messages

## Styling

All components use Tailwind CSS with support for:
- Light and dark modes
- Consistent color scheme
- Responsive design
- Focus states
- Disabled states

## Testing

All components include comprehensive unit tests:

```bash
npm test -- Modal.test.tsx
```

Test coverage includes:
- Rendering with various props
- User interactions (click, keyboard)
- Async operations
- Accessibility features
- Different variants and sizes

## Best Practices

1. **Always provide a title** for accessibility
2. **Use appropriate variants** (danger for destructive actions)
3. **Show loading state** during async operations
4. **Disable buttons** while operation is in progress
5. **Provide clear messages** to guide users
6. **Use specific action labels** (e.g., "Delete" instead of "OK")
7. **Test with keyboard navigation** for accessibility
8. **Handle errors gracefully** with error dialogs

## Export

All modal components are exported from the UI index:

```tsx
import {
  Modal,
  ConfirmationDialog,
  DeleteConfirmationDialog,
  AlertDialog,
  type ModalProps,
  type ModalAction,
  type ConfirmationDialogProps,
  type DeleteConfirmationDialogProps,
  type AlertDialogProps,
} from '@/components/ui';
```

## Type Definitions

All components are fully typed with TypeScript for better IDE support and type safety.

## Future Enhancements

- [ ] Add animation transitions
- [ ] Add custom backdrop blur
- [ ] Add nested modal support
- [ ] Add modal stacking
- [ ] Add custom icon support
- [ ] Add form validation integration
- [ ] Add toast notification integration
