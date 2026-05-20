# UI Form Components

This directory contains reusable form components for the admin panel. All components are built with TypeScript, styled with Tailwind CSS, and support form validation integration with Zod.

## Components

### TextInput

A reusable text input field with label, error handling, and helper text.

**Features:**
- Label with optional required indicator
- Error message display
- Helper text support
- Disabled state
- Custom styling via className and containerClassName
- Auto-generated unique IDs
- Supports all standard HTML input attributes

**Usage:**
```tsx
import { TextInput } from '@/components/ui';

<TextInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

### TextArea

A reusable textarea field with label, error handling, helper text, and optional character count.

**Features:**
- Label with optional required indicator
- Error message display
- Helper text support
- Character count display (optional)
- Max length validation
- Disabled state
- Custom styling
- Resizable with min-height

**Usage:**
```tsx
import { TextArea } from '@/components/ui';

<TextArea
  label="Description"
  placeholder="Enter a detailed description"
  maxLength={500}
  showCharCount
  error={errors.description}
  required
/>
```

### Select

A reusable select dropdown with label, error handling, and helper text.

**Features:**
- Label with optional required indicator
- Error message display
- Helper text support
- Placeholder option
- Disabled options support
- Disabled state
- Custom styling
- Auto-generated unique IDs

**Usage:**
```tsx
import { Select } from '@/components/ui';

const options = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'other', label: 'Other', disabled: true },
];

<Select
  label="Category"
  options={options}
  placeholder="Select a category"
  error={errors.category}
  required
/>
```

### Checkbox

A reusable checkbox input with label, error handling, and helper text.

**Features:**
- Label with optional required indicator
- Error message display
- Helper text support
- Disabled state
- Custom styling
- Auto-generated unique IDs
- Cursor pointer on label

**Usage:**
```tsx
import { Checkbox } from '@/components/ui';

<Checkbox
  label="I agree to the terms and conditions"
  error={errors.terms}
  required
/>
```

### Radio

A reusable radio button group with label, error handling, and helper text.

**Features:**
- Label with optional required indicator
- Error message display
- Helper text support
- Multiple options with disabled support
- Disabled state
- Custom styling
- Grouped radio buttons with same name

**Usage:**
```tsx
import { Radio } from '@/components/ui';

const options = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'maybe', label: 'Maybe', disabled: true },
];

<Radio
  label="Do you want to continue?"
  groupName="continue"
  options={options}
  value={selectedValue}
  onChange={handleChange}
  error={errors.continue}
  required
/>
```

### Button

A reusable button component with multiple variants, sizes, and loading state.

**Features:**
- Multiple variants: primary, secondary, danger, ghost
- Multiple sizes: sm, md, lg
- Loading state with spinner
- Full width option
- Disabled state
- Focus ring styling
- Smooth transitions

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleSubmit}>
  Submit
</Button>

<Button variant="danger" isLoading={isSubmitting}>
  Delete
</Button>

<Button variant="ghost" fullWidth>
  Cancel
</Button>
```

### FormGroup

A wrapper component for grouping form fields with consistent spacing.

**Usage:**
```tsx
import { FormGroup, TextInput, Button } from '@/components/ui';

<FormGroup>
  <TextInput label="Name" />
  <TextInput label="Email" type="email" />
  <Button>Submit</Button>
</FormGroup>
```

### FormError

A component for displaying form-level error messages.

**Usage:**
```tsx
import { FormError } from '@/components/ui';

<FormError message={formError} />
```

### FormSuccess

A component for displaying form-level success messages.

**Usage:**
```tsx
import { FormSuccess } from '@/components/ui';

<FormSuccess message="Changes saved successfully!" />
```

## Styling

All components use Tailwind CSS for styling with support for:
- Light and dark modes
- Consistent color scheme
- Responsive design
- Focus states
- Disabled states
- Error states

## Validation Integration

Components support integration with Zod validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, FormError } from '@/components/ui';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
});

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />
      <TextInput
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Accessibility

All components follow accessibility best practices:
- Proper label associations with `htmlFor`
- ARIA labels for error messages
- Keyboard navigation support
- Focus management
- Semantic HTML

## Testing

All components include comprehensive unit tests using Jest and React Testing Library:

```bash
npm test -- src/components/ui
```

Test coverage includes:
- Rendering with various props
- User interactions
- Error states
- Disabled states
- Custom styling
- Accessibility features

## Export

All components are exported from the index file for easy importing:

```tsx
import {
  TextInput,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Button,
  FormGroup,
  FormError,
  FormSuccess,
} from '@/components/ui';
```

## Type Definitions

All components are fully typed with TypeScript:

```tsx
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}
```

## Best Practices

1. **Always provide labels** for accessibility
2. **Use error messages** to guide users
3. **Provide helper text** for complex fields
4. **Use appropriate input types** (email, password, etc.)
5. **Validate on both client and server** for security
6. **Test with keyboard navigation** for accessibility
7. **Use semantic HTML** for better SEO

## Future Enhancements

- [ ] Add file upload component
- [ ] Add date picker component
- [ ] Add time picker component
- [ ] Add multi-select component
- [ ] Add search/autocomplete component
- [ ] Add slider component
- [ ] Add toggle switch component
- [ ] Add color picker component
