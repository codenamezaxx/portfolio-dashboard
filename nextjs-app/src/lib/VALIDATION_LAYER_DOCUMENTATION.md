# Content Validation Layer Documentation

## Overview

The Content Validation Layer provides comprehensive validation for all portfolio content types using Zod schemas. It includes client-side validation, server-side validation, error message formatting, and field-level error display components.

## Architecture

### Three-Layer Validation System

```
┌─────────────────────────────────────────────────────────────┐
│                    Client-Side Validation                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useFormValidation Hook                              │  │
│  │  - Real-time field validation                        │  │
│  │  - Touch state management                            │  │
│  │  - Form submission handling                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Zod Schema Validation                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Shared Schemas (validation.ts)                      │  │
│  │  - Profile, Hero, Journey, Tech Stack               │  │
│  │  - Projects, Achievements, Contact Info             │  │
│  │  - Admin Users, File Uploads                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Server-Side Validation                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  serverValidation.ts                                 │  │
│  │  - validateData() - Returns validation result        │  │
│  │  - validateDataOrThrow() - Throws on error           │  │
│  │  - Input sanitization                                │  │
│  │  - Error formatting                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Zod Schemas

### Profile Schema

Validates hero section profile information.

```typescript
import { profileSchema, type ProfileInput } from '@/lib/validation';

const profileData: ProfileInput = {
  name: 'John Doe',
  role: 'Frontend Developer',
  tagline: 'Building amazing web experiences',
  heroImageUrl: 'https://example.com/hero.jpg',
};

// Validate
const result = profileSchema.safeParse(profileData);
if (!result.success) {
  console.error(result.error.errors);
}
```

**Validation Rules:**
- `name`: Required, max 255 characters
- `role`: Required, max 255 characters
- `tagline`: Required, no max length
- `heroImageUrl`: Optional, must be valid URL if provided

### Journey Item Schema

Validates career timeline entries.

```typescript
import { journeyItemSchema, type JourneyItemInput } from '@/lib/validation';

const journeyData: JourneyItemInput = {
  year: '2023',
  title: 'Senior Developer',
  description: 'Led development of new features',
  displayOrder: 1,
};
```

**Validation Rules:**
- `year`: Required, max 50 characters
- `title`: Required, max 255 characters
- `description`: Required, no max length
- `displayOrder`: Optional, must be non-negative integer

### Tech Stack Schema

Validates technology items.

```typescript
import { techItemSchema, type TechItemInput } from '@/lib/validation';

const techData: TechItemInput = {
  name: 'React',
  icon: 'https://example.com/react.svg',
  displayOrder: 1,
};
```

**Validation Rules:**
- `name`: Required, max 100 characters
- `icon`: Required, must be valid URL
- `displayOrder`: Optional, must be non-negative integer

### Project Schema

Validates project portfolio items.

```typescript
import { projectSchema, type ProjectInput } from '@/lib/validation';

const projectData: ProjectInput = {
  title: 'Amazing Project',
  description: 'A project that does amazing things',
  category: 'Web Development',
  imageUrl: 'https://example.com/project.jpg',
  technologies: ['React', 'TypeScript', 'Tailwind'],
  githubLink: 'https://github.com/user/project',
  liveLink: 'https://project.example.com',
  demoLink: 'https://demo.example.com',
  displayOrder: 1,
};
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `description`: Required, no max length
- `category`: Required, max 100 characters
- `imageUrl`: Optional, must be valid URL if provided
- `technologies`: Required, at least one technology
- `githubLink`, `liveLink`, `demoLink`: Optional, must be valid URLs if provided
- `displayOrder`: Optional, must be non-negative integer

### Achievement Schema

Validates certification and achievement records.

```typescript
import { achievementSchema, type AchievementInput } from '@/lib/validation';

const achievementData: AchievementInput = {
  title: 'AWS Certification',
  category: 'Cloud',
  issuer: 'Amazon Web Services',
  year: 2023,
  pdfUrl: 'https://example.com/cert.pdf',
  externalLink: 'https://aws.amazon.com/verify',
  displayOrder: 1,
};
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `category`: Required, max 100 characters
- `issuer`: Required, max 255 characters
- `year`: Required, must be between 1900 and current year + 1
- `pdfUrl`: Required, must be valid URL
- `externalLink`: Optional, must be valid URL if provided
- `displayOrder`: Optional, must be non-negative integer

### Contact Info Schema

Validates social media and contact links.

```typescript
import { contactInfoSchema, type ContactInfoInput } from '@/lib/validation';

const contactData: ContactInfoInput = {
  githubUrl: 'https://github.com/user',
  linkedinUrl: 'https://linkedin.com/in/user',
  instagramUrl: 'https://instagram.com/user',
  telegramUrl: 'https://t.me/user',
  email: 'user@example.com',
};
```

**Validation Rules:**
- All fields optional
- URLs must be valid if provided
- Email must be valid email format if provided

### Admin User Schema

Validates admin user creation with strong password requirements.

```typescript
import { createAdminUserSchema, type CreateAdminUserInput } from '@/lib/validation';

const adminData: CreateAdminUserInput = {
  email: 'admin@example.com',
  password: 'SecurePass123!',
};
```

**Validation Rules:**
- `email`: Required, must be valid email
- `password`: Required, must contain:
  - At least 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### File Upload Schemas

#### Image Upload Schema

```typescript
import { imageUploadSchema } from '@/lib/validation';

const imageData = {
  file: imageFile, // File object
};

// Validates:
// - File size: max 5MB
// - File types: JPG, PNG, WebP, SVG
```

#### PDF Upload Schema

```typescript
import { pdfUploadSchema } from '@/lib/validation';

const pdfData = {
  file: pdfFile, // File object
};

// Validates:
// - File size: max 10MB
// - File type: PDF only
```

## Client-Side Validation

### useFormValidation Hook

The `useFormValidation` hook provides real-time form validation with Zod schemas.

```typescript
import { useFormValidation } from '@/lib/useFormValidation';
import { profileSchema, type ProfileInput } from '@/lib/validation';

export function ProfileEditor() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation({
      initialValues: {
        name: '',
        role: '',
        tagline: '',
        heroImageUrl: '',
      },
      schema: profileSchema,
      onSubmit: async (data) => {
        // Submit to API
        await fetch('/api/content/profiles', {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : undefined}
        required
      />
      <TextInput
        label="Role"
        name="role"
        value={values.role}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.role ? errors.role : undefined}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Hook API

```typescript
interface FormValidationState<T> {
  values: T;                                    // Current form values
  errors: Partial<Record<keyof T, string>>;   // Field errors
  touched: Partial<Record<keyof T, boolean>>; // Touched fields
  isSubmitting: boolean;                       // Submission state
  isValid: boolean;                            // Form validity
}

interface FormValidationActions<T> {
  handleChange: (e: React.ChangeEvent<...>) => void;
  handleBlur: (e: React.FocusEvent<...>) => void;
  handleSubmit: (e: React.FormEvent<...>) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  setValues: (values: T) => void;
}
```

## Server-Side Validation

### validateData Function

Returns a validation result object without throwing.

```typescript
import { validateData } from '@/lib/serverValidation';
import { profileSchema } from '@/lib/validation';

export async function PUT(request: Request) {
  const data = await request.json();
  
  const result = validateData(data, profileSchema);
  
  if (!result.success) {
    return Response.json(
      { errors: result.errors },
      { status: 400 }
    );
  }
  
  // Use result.data (type-safe)
  const profile = result.data;
  // ... save to database
}
```

### validateDataOrThrow Function

Throws a `ValidationError` if validation fails.

```typescript
import { validateDataOrThrow, ValidationError } from '@/lib/serverValidation';
import { projectSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const project = validateDataOrThrow(data, projectSchema);
    
    // Use project (type-safe)
    // ... save to database
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Input Sanitization

```typescript
import { sanitizeString } from '@/lib/serverValidation';

const userInput = '<script>alert("xss")</script>';
const safe = sanitizeString(userInput);
// Result: &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;
```

## Field-Level Error Display

### TextInput Component

Displays field-level errors with user-friendly messages.

```typescript
import { TextInput } from '@/components/ui/TextInput';

<TextInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.email ? errors.email : undefined}
  helperText="We'll never share your email"
  required
/>
```

**Features:**
- Displays error message when field is touched and has error
- Shows helper text when no error
- Applies error styling (red border, red text)
- Supports loading state with spinner
- Accessible with proper ARIA attributes

### TextArea Component

Similar to TextInput but for multi-line text.

```typescript
import { TextArea } from '@/components/ui/TextArea';

<TextArea
  label="Description"
  placeholder="Enter description"
  value={values.description}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.description ? errors.description : undefined}
  showCharCount
  maxLength={1000}
  required
/>
```

**Features:**
- Character count display
- Minimum height (100px)
- Vertical resize support
- All TextInput features

### FormError Component

Displays form-level error messages.

```typescript
import { FormError } from '@/components/ui/FormError';

<FormError message={formError} />
```

**Features:**
- Only renders when message is provided
- Red background with border
- Dark mode support
- Accessible styling

## Error Message Formatting

### Specific Error Messages

All validation errors provide specific, user-friendly messages:

**Required Fields:**
- "Name is required"
- "Email is required"
- "Description is required"

**Format Validation:**
- "Invalid email address"
- "Invalid URL format"
- "Must be a valid URL"

**Length Validation:**
- "Must be at least 8 characters"
- "Must not exceed 255 characters"

**Type Validation:**
- "Only JPG, PNG, WebP, and SVG images are allowed"
- "Only PDF files are allowed"

**File Size:**
- "Image must be under 5MB"
- "PDF must be under 10MB"

**Password Requirements:**
- "Password must contain at least one uppercase letter"
- "Password must contain at least one lowercase letter"
- "Password must contain at least one number"
- "Password must contain at least one special character"

## Testing

### Unit Tests

Comprehensive unit tests for all validation schemas:

```bash
npm run test -- --testPathPatterns="validation"
```

Tests cover:
- Valid data acceptance
- Invalid data rejection
- Specific error messages
- Edge cases
- File upload validation

### Component Tests

Tests for field-level error display components:

```bash
npm run test -- --testPathPatterns="TextInput|TextArea|FormError"
```

Tests cover:
- Error message display
- Error styling
- Helper text display
- Loading states
- Accessibility
- User interactions

## Best Practices

### 1. Always Validate on Both Client and Server

```typescript
// Client-side: Prevent invalid submissions
const { errors, handleSubmit } = useFormValidation({
  schema: profileSchema,
  onSubmit: async (data) => {
    // Only called if validation passes
  },
});

// Server-side: Ensure data integrity
const result = validateData(data, profileSchema);
if (!result.success) {
  return Response.json({ errors: result.errors }, { status: 400 });
}
```

### 2. Display Errors Only After Touch

```typescript
<TextInput
  error={touched.email ? errors.email : undefined}
  // Only show error after user has interacted with field
/>
```

### 3. Provide Helpful Error Messages

```typescript
// Good: Specific, actionable
"Password must contain at least one uppercase letter"

// Bad: Generic
"Invalid password"
```

### 4. Sanitize User Input on Server

```typescript
const sanitized = sanitizeString(userInput);
// Prevents XSS attacks
```

### 5. Use Type-Safe Validation

```typescript
// Type-safe after validation
const profile = validateDataOrThrow(data, profileSchema);
// profile is typed as ProfileInput
```

## Common Patterns

### Form with Multiple Fields

```typescript
export function ProjectEditor() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation({
      initialValues: {
        title: '',
        description: '',
        category: '',
        technologies: [],
      },
      schema: projectSchema,
      onSubmit: async (data) => {
        const response = await fetch('/api/content/projects', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to save project');
        }
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title ? errors.title : undefined}
        required
      />
      <TextArea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description ? errors.description : undefined}
        required
      />
      {/* More fields... */}
      <button type="submit">Save Project</button>
    </form>
  );
}
```

### API Endpoint with Validation

```typescript
import { validateData } from '@/lib/serverValidation';
import { projectSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input
    const result = validateData(data, projectSchema);
    if (!result.success) {
      return Response.json(
        { errors: result.errors },
        { status: 400 }
      );
    }
    
    // Save to database
    const project = await db.projects.create(result.data);
    
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return Response.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

## Troubleshooting

### Error Messages Not Displaying

**Problem:** Error messages don't show even though validation fails.

**Solution:** Check that the field is marked as touched:
```typescript
error={touched.fieldName ? errors.fieldName : undefined}
```

### Validation Not Triggering

**Problem:** Form submits even with invalid data.

**Solution:** Ensure `handleSubmit` is called on form submission:
```typescript
<form onSubmit={handleSubmit}>
  {/* fields */}
</form>
```

### Type Errors After Validation

**Problem:** TypeScript complains about types after validation.

**Solution:** Use `validateDataOrThrow` for type safety:
```typescript
const data = validateDataOrThrow(input, schema); // Typed as schema type
```

## Performance Considerations

- Validation runs on every field change (optimized with touch state)
- Server-side validation runs once on submission
- Zod schemas are compiled once and reused
- Error messages are pre-defined strings (no computation)

## Security Considerations

- All user input is sanitized on the server
- Passwords are validated for strength requirements
- File uploads are validated for type and size
- URLs are validated to prevent injection attacks
- HTML entities are escaped to prevent XSS

## Future Enhancements

- [ ] Async validation (e.g., checking email uniqueness)
- [ ] Custom validation rules
- [ ] Validation error analytics
- [ ] Multi-language error messages
- [ ] Real-time validation feedback
