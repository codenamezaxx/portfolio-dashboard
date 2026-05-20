# URL Validation for Social Links

## Overview

This guide documents the URL validation implementation for social media links and email addresses in the portfolio admin panel. The validation is implemented using Zod schemas and provides platform-specific validation rules for each social media platform.

**Validates: Requirements 6.2, 9.10**

## Validation Rules

### GitHub URLs

**Format:** `https://github.com/{username}`

**Valid Examples:**
- `https://github.com/username`
- `https://github.com/user-name`
- `https://github.com/user_name`
- `https://github.com/user123`
- `https://github.com/username/` (with trailing slash)

**Invalid Examples:**
- `http://github.com/username` (must use https)
- `github.com/username` (missing protocol)
- `https://github.com/user@name` (invalid characters)
- `https://github.com/user#name` (invalid characters)

**Validation Rules:**
1. Must start with `https://github.com/`
2. Username must contain only alphanumeric characters, hyphens, and underscores
3. Optional trailing slash is allowed
4. No special characters like @, #, or spaces

### LinkedIn URLs

**Format:** `https://linkedin.com/in/{username}` or `https://linkedin.com/company/{companyname}`

**Valid Examples:**
- `https://linkedin.com/in/username`
- `https://www.linkedin.com/in/username`
- `https://linkedin.com/in/user-name`
- `https://linkedin.com/company/companyname`
- `https://www.linkedin.com/company/company-name`

**Invalid Examples:**
- `http://linkedin.com/in/username` (must use https)
- `https://linkedin.com/username` (missing /in/ or /company/)
- `https://linkedin.com/invalid/username` (invalid path)

**Validation Rules:**
1. Must start with `https://linkedin.com/` or `https://www.linkedin.com/`
2. Must contain either `/in/` or `/company/` path
3. Username/company name must contain only alphanumeric characters, hyphens, and underscores
4. Optional trailing slash is allowed

### Instagram URLs

**Format:** `https://instagram.com/{username}`

**Valid Examples:**
- `https://instagram.com/username`
- `https://www.instagram.com/username`
- `https://instagram.com/user_name`
- `https://instagram.com/user.name`
- `https://instagram.com/user123`

**Invalid Examples:**
- `http://instagram.com/username` (must use https)
- `https://instagram.com/user@name` (invalid characters)
- `https://instagram.com/user#name` (invalid characters)

**Validation Rules:**
1. Must start with `https://instagram.com/` or `https://www.instagram.com/`
2. Username must contain only alphanumeric characters, underscores, and dots
3. Optional trailing slash is allowed
4. No special characters like @, #, or spaces

### Telegram URLs

**Format:** `https://t.me/{username}` or `https://telegram.me/{username}`

**Valid Examples:**
- `https://t.me/username`
- `https://telegram.me/username`
- `https://t.me/user_name`
- `https://t.me/user123`
- `https://t.me/username/` (with trailing slash)

**Invalid Examples:**
- `http://t.me/username` (must use https)
- `t.me/username` (missing protocol)
- `https://t.me/user@name` (invalid characters)
- `https://t.me/user#name` (invalid characters)

**Validation Rules:**
1. Must start with `https://t.me/` or `https://telegram.me/`
2. Username must contain only alphanumeric characters and underscores
3. Optional trailing slash is allowed
4. No special characters like @, #, or spaces

### Email Addresses

**Format:** `{local}@{domain}.{tld}`

**Valid Examples:**
- `user@example.com`
- `user.name@example.com`
- `user+tag@example.co.uk`
- `user_name@example.com`
- `user123@example.com`

**Invalid Examples:**
- `invalid` (missing @ and domain)
- `user@` (missing domain)
- `@example.com` (missing local part)
- `user @example.com` (space in local part)
- `user@example` (missing TLD)

**Validation Rules:**
1. Must contain exactly one @ symbol
2. Local part must not be empty
3. Domain must not be empty
4. Must contain a TLD (top-level domain)
5. No spaces allowed

## Implementation

### Zod Schemas

The validation is implemented using Zod schemas in `src/lib/validation.ts`:

```typescript
// GitHub URL validation
const githubUrlSchema = z
  .string()
  .refine(
    (url) => !url || url.startsWith('https://github.com/'),
    'GitHub URL must start with https://github.com/'
  )
  .refine(
    (url) => !url || /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/.test(url),
    'Invalid GitHub URL format. Use https://github.com/username'
  )
  .optional()
  .or(z.literal(''));

// Similar schemas for LinkedIn, Instagram, Telegram, and Email
```

### Contact Info Schema

The `contactInfoSchema` combines all individual field schemas:

```typescript
export const contactInfoSchema = z
  .object({
    githubUrl: githubUrlSchema,
    linkedinUrl: linkedinUrlSchema,
    instagramUrl: instagramUrlSchema,
    telegramUrl: telegramUrlSchema,
    email: emailSchema,
  })
  .refine(
    (data) => {
      // At least one field should be provided
      return Object.values(data).some((value) => value && value !== '');
    },
    { message: 'At least one contact information field is required' }
  );
```

## Client-Side Validation

The `ContactInfoEditor` component uses the validation schema for real-time validation feedback:

```typescript
const validateForm = (): boolean => {
  try {
    contactInfoSchema.parse(formData);
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Record<string, string> = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
      }
      setErrors(newErrors);
    }
    return false;
  }
};
```

## Server-Side Validation

The same Zod schema is used on the server side in API routes to validate incoming data:

```typescript
// In API route handler
try {
  const validatedData = contactInfoSchema.parse(req.body);
  // Process validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.errors });
  }
}
```

## Error Messages

The validation provides specific error messages for each field:

- **GitHub URL:** "GitHub URL must start with https://github.com/" or "Invalid GitHub URL format. Use https://github.com/username"
- **LinkedIn URL:** "LinkedIn URL must start with https://linkedin.com/ or https://www.linkedin.com/" or "Invalid LinkedIn URL format. Use https://linkedin.com/in/username or https://linkedin.com/company/companyname"
- **Instagram URL:** "Instagram URL must start with https://instagram.com/ or https://www.instagram.com/" or "Invalid Instagram URL format. Use https://instagram.com/username"
- **Telegram URL:** "Telegram URL must start with https://t.me/ or https://telegram.me/" or "Invalid Telegram URL format. Use https://t.me/username"
- **Email:** "Invalid email format"
- **At least one field:** "At least one contact information field is required"

## Testing

Comprehensive tests are provided in:
- `src/lib/validation.test.ts` - General validation tests
- `src/lib/urlValidation.test.ts` - Platform-specific URL validation tests
- `src/components/admin/ContactInfoEditor.test.tsx` - Component integration tests

### Running Tests

```bash
# Run all validation tests
npm run test -- src/lib/validation.test.ts src/lib/urlValidation.test.ts

# Run ContactInfoEditor tests
npm run test -- src/components/admin/ContactInfoEditor.test.tsx

# Run all tests
npm run test
```

## Real-Time Validation Feedback

The `ContactInfoEditor` component provides real-time validation feedback:

1. **Field-level validation:** Each field is validated independently
2. **Specific error messages:** Users see exactly what's wrong with each field
3. **Test link functionality:** Users can test social media links by clicking "Test Link"
4. **Version history:** Users can restore previous versions of their contact information

## Best Practices

1. **Always validate on both client and server:** Use the same Zod schema on both sides
2. **Provide specific error messages:** Help users understand what's wrong
3. **Allow optional fields:** Users don't need to fill all fields
4. **Require at least one field:** Ensure users provide at least one contact method
5. **Test with various formats:** Use the provided test cases to verify validation

## Future Enhancements

Potential improvements to the URL validation:

1. **URL reachability check:** Verify that URLs are actually accessible
2. **Username availability check:** Check if usernames exist on platforms
3. **Custom validation rules:** Allow admins to define custom validation rules
4. **Internationalization:** Support URLs in different languages/regions
5. **Additional platforms:** Add validation for more social media platforms

## References

- [Zod Documentation](https://zod.dev/)
- [GitHub URL Format](https://github.com/)
- [LinkedIn URL Format](https://linkedin.com/)
- [Instagram URL Format](https://instagram.com/)
- [Telegram URL Format](https://t.me/)
- [Email Format RFC 5322](https://tools.ietf.org/html/rfc5322)
