# Form Validation Guide

This guide explains how to use the form validation system with Zod schemas in the portfolio application.

## Overview

The form validation system provides:

- **Zod Schemas**: Type-safe validation schemas for all content types
- **Client-side Validation**: Real-time validation with `useFormValidation` hook
- **Server-side Validation**: Validation utilities for API routes
- **Form Components**: Pre-built form field components with validation display
- **Error Handling**: User-friendly error messages and field-level error display

## Architecture

### 1. Validation Schemas (`validation.ts`)

All validation schemas are defined in `src/lib/validation.ts` using Zod:

```typescript
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  role: z.string().min(1, 'Role is required').max(255),
  tagline: z.string().min(1, 'Tagline is required'),
  heroImageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
```

### 2. Client-side Validation Hook (`useFormValidation.ts`)

The `useFormValidation` hook manages form state and validation:

```typescript
import { useFormValidation } from '@/lib/useFormValidation';
import { profileSchema, type ProfileInput } from '@/lib/validation';

const form = useFormValidation({
  initialValues: { name: '', role: '', tagline: '', heroImageUrl: '' },
  schema: profileSchema,
  onSubmit: async (values) => {
    // Handle form submission
    await api.updateProfile(values);
  },
});
```

### 3. Form Field Components

Pre-built components with validation display:

- `FormField`: Text input with validation
- `TextAreaField`: Textarea with validation
- `SelectField`: Select dropdown with validation

```typescript
<FormField
  label="Full Name"
  name="name"
  value={form.values.name}
  onChange={form.handleChange}
  onBlur={form.handleBlur}
  error={form.errors.name}
  touched={form.touched.name}
  required
  variant="admin"
/>
```

### 4. Server-side Validation (`serverValidation.ts`)

Validation utilities for API routes:

```typescript
import { validateData, validateDataOrThrow } from '@/lib/serverValidation';
import { profileSchema } from '@/lib/validation';

// Option 1: Get validation result
const result = validateData(requestBody, profileSchema);
if (!result.success) {
  return res.status(400).json({ errors: result.errors });
}

// Option 2: Throw on validation error
try {
  const validatedData = validateDataOrThrow(requestBody, profileSchema);
  // Use validatedData
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ errors: error.errors });
  }
}
```

## Usage Examples

### Example 1: Profile Form

```typescript
'use client';

import { useFormValidation } from '@/lib/useFormValidation';
import { profileSchema, type ProfileInput } from '@/lib/validation';
import { FormField, TextAreaField, Button } from '@/components/ui';

export function ProfileForm() {
  const form = useFormValidation({
    initialValues: {
      name: '',
      role: '',
      tagline: '',
      heroImageUrl: '',
    },
    schema: profileSchema,
    onSubmit: async (values) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Failed to update profile');
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField
        label="Full Name"
        name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.name}
        touched={form.touched.name}
        required
      />

      <TextAreaField
        label="Tagline"
        name="tagline"
        value={form.values.tagline}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.tagline}
        touched={form.touched.tagline}
        required
      />

      <Button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

### Example 2: API Route with Validation

```typescript
// app/api/profile/route.ts
import { validateDataOrThrow, ValidationError } from '@/lib/serverValidation';
import { profileSchema } from '@/lib/validation';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = validateDataOrThrow(body, profileSchema);
    
    // Update database
    const profile = await db.profiles.update(validatedData);
    
    return Response.json(profile);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 3: Dynamic Form with Array Fields

```typescript
'use client';

import { useFormValidation } from '@/lib/useFormValidation';
import { projectSchema, type ProjectInput } from '@/lib/validation';
import { FormField, TextAreaField, Button } from '@/components/ui';

export function ProjectForm() {
  const [techInput, setTechInput] = useState('');

  const form = useFormValidation({
    initialValues: {
      title: '',
      description: '',
      category: '',
      imageUrl: '',
      technologies: [],
      githubLink: '',
      liveLink: '',
      demoLink: '',
      displayOrder: 0,
    },
    schema: projectSchema,
    onSubmit: async (values) => {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    },
  });

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      const newTechs = [...form.values.technologies, techInput.trim()];
      form.setFieldValue('technologies', newTechs);
      setTechInput('');
    }
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField
        label="Project Title"
        name="title"
        value={form.values.title}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.title}
        touched={form.touched.title}
        required
      />

      {/* Technologies array field */}
      <div>
        <label>Technologies</label>
        <div>
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTechnology();
              }
            }}
            placeholder="Add technology"
          />
          <button type="button" onClick={handleAddTechnology}>
            Add
          </button>
        </div>
        {form.errors.technologies && form.touched.technologies && (
          <p className="error">{form.errors.technologies}</p>
        )}
        <div>
          {form.values.technologies.map((tech, idx) => (
            <span key={idx}>
              {tech}
              <button
                type="button"
                onClick={() => {
                  const newTechs = form.values.technologies.filter(
                    (_, i) => i !== idx
                  );
                  form.setFieldValue('technologies', newTechs);
                }}
              >
                Remove
              </button>
            </span>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={form.isSubmitting || !form.isValid}>
        Save Project
      </Button>
    </form>
  );
}
```

## Available Schemas

### Profile Schema
```typescript
profileSchema: {
  name: string (required, 1-255 chars)
  role: string (required, 1-255 chars)
  tagline: string (required)
  heroImageUrl: string (optional, valid URL)
}
```

### Journey Item Schema
```typescript
journeyItemSchema: {
  year: string (required, 1-50 chars)
  title: string (required, 1-255 chars)
  description: string (required)
  displayOrder: number (optional)
}
```

### Tech Stack Schema
```typescript
techItemSchema: {
  name: string (required, 1-100 chars)
  icon: string (required, valid URL)
  displayOrder: number (optional)
}
```

### Project Schema
```typescript
projectSchema: {
  title: string (required, 1-255 chars)
  description: string (required)
  category: string (required, 1-100 chars)
  imageUrl: string (optional, valid URL)
  technologies: string[] (required, at least 1)
  githubLink: string (optional, valid URL)
  liveLink: string (optional, valid URL)
  demoLink: string (optional, valid URL)
  displayOrder: number (optional)
}
```

### Achievement Schema
```typescript
achievementSchema: {
  title: string (required, 1-255 chars)
  category: string (required, 1-100 chars)
  issuer: string (required, 1-255 chars)
  year: number (required, 1900-current year+1)
  pdfUrl: string (required, valid URL)
  externalLink: string (optional, valid URL)
  displayOrder: number (optional)
}
```

### Contact Info Schema
```typescript
contactInfoSchema: {
  githubUrl: string (optional, valid URL)
  linkedinUrl: string (optional, valid URL)
  instagramUrl: string (optional, valid URL)
  telegramUrl: string (optional, valid URL)
  email: string (optional, valid email)
}
```

## Form Hook API

### `useFormValidation(options)`

#### Options
- `initialValues: T` - Initial form values
- `schema: ZodSchema` - Zod validation schema
- `onSubmit: (values: T) => Promise<void> | void` - Submit handler
- `onError?: (error: Error) => void` - Error handler

#### Returns
- `values: T` - Current form values
- `errors: Partial<Record<keyof T, string>>` - Field errors
- `touched: Partial<Record<keyof T, boolean>>` - Touched fields
- `isSubmitting: boolean` - Submission state
- `isValid: boolean` - Form validity
- `handleChange: (e) => void` - Change handler
- `handleBlur: (e) => void` - Blur handler
- `handleSubmit: (e) => Promise<void>` - Submit handler
- `setFieldValue: (field, value) => void` - Set field value
- `setFieldError: (field, error) => void` - Set field error
- `setFieldTouched: (field, touched) => void` - Set field touched
- `resetForm: () => void` - Reset form
- `setValues: (values) => void` - Set all values

## Server Validation API

### `validateData(data, schema)`
Returns `{ success: boolean, data?: T, errors?: Record<string, string> }`

### `validateDataOrThrow(data, schema)`
Returns validated data or throws `ValidationError`

### `ValidationError`
Custom error class with `errors` property containing field-level errors

### Utility Functions
- `isValidUrl(url: string): boolean`
- `isValidEmail(email: string): boolean`
- `sanitizeString(input: string): string`
- `validateFile(file: File, options): { valid: boolean, error?: string }`

## Best Practices

1. **Always validate on both client and server**: Client validation improves UX, server validation ensures security
2. **Use TypeScript inference**: Use `z.infer<typeof schema>` to get types from schemas
3. **Handle errors gracefully**: Display user-friendly error messages
4. **Validate on blur**: Provide real-time feedback as users fill the form
5. **Disable submit when invalid**: Prevent submission of invalid data
6. **Show loading state**: Indicate when form is being submitted
7. **Sanitize user input**: Use `sanitizeString()` for user-generated content
8. **Validate file uploads**: Check size and MIME type before upload

## Testing

### Unit Tests
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '@/lib/useFormValidation';

it('should validate email format', () => {
  const { result } = renderHook(() =>
    useFormValidation({
      initialValues: { email: '' },
      schema: z.object({ email: z.string().email() }),
      onSubmit: async () => {},
    })
  );

  act(() => {
    result.current.setFieldValue('email', 'invalid');
  });

  expect(result.current.errors.email).toBeDefined();
});
```

### Integration Tests
```typescript
it('should submit valid form data', async () => {
  const onSubmit = jest.fn();
  const { result } = renderHook(() =>
    useFormValidation({
      initialValues: { email: '' },
      schema: z.object({ email: z.string().email() }),
      onSubmit,
    })
  );

  act(() => {
    result.current.setFieldValue('email', 'test@example.com');
  });

  await act(async () => {
    await result.current.handleSubmit({ preventDefault: () => {} } as any);
  });

  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

## Troubleshooting

### Form not validating on change
- Make sure field is marked as touched before validation shows
- Validation only shows after blur or submit attempt

### Errors not clearing
- Call `setFieldError(field, '')` to clear errors
- Or use `resetForm()` to reset all errors

### Type errors with form values
- Use `z.infer<typeof schema>` to get correct types
- Ensure initial values match schema types

### Server validation not working
- Check that schema is imported correctly
- Ensure request body is valid JSON
- Use `validateDataOrThrow` for detailed error info

## Migration Guide

If migrating from another validation library:

1. Define Zod schemas in `validation.ts`
2. Replace form hook with `useFormValidation`
3. Update form components to use new field components
4. Update API routes to use server validation utilities
5. Update tests to use new validation functions

## Performance Considerations

- Validation runs on blur and submit, not on every keystroke
- Use `touched` state to avoid showing errors while typing
- Memoize form components to prevent unnecessary re-renders
- Use `setFieldValue` for programmatic updates instead of `handleChange`

## Security Considerations

- Always validate on server side
- Sanitize user input with `sanitizeString()`
- Use HTTPS for form submissions
- Implement CSRF protection
- Never expose sensitive validation errors to users
- Log validation failures for security monitoring
