# File Validation Guide

## Overview

The file validation system provides comprehensive validation for image and PDF uploads with:

- **MIME type validation** - Ensures file has correct MIME type
- **Magic number validation** - Verifies file content matches its type (prevents renamed files)
- **File size validation** - Enforces maximum file size limits
- **User-friendly error messages** - Clear, actionable error messages
- **TypeScript support** - Full type safety with interfaces
- **Batch validation** - Validate multiple files at once
- **Format-specific validators** - Specialized validators for images and PDFs

## Quick Start

### Basic Image Validation

```typescript
import { validateImageFile } from '@/lib/fileValidation';

// Validate a single image file
const result = await validateImageFile(file);

if (result.valid) {
  console.log('File is valid:', result.details);
} else {
  console.error('Validation failed:', result.error);
}
```

### Basic PDF Validation

```typescript
import { validatePdfFile } from '@/lib/fileValidation';

// Validate a PDF file
const result = await validatePdfFile(file);

if (result.valid) {
  console.log('PDF is valid');
} else {
  console.error('PDF validation failed:', result.error);
}
```

### Comprehensive File Validation

```typescript
import { validateFile } from '@/lib/fileValidation';

// Validate with custom options
const result = await validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png'],
  checkMagicNumbers: true, // Enable magic number validation
});

if (result.valid) {
  console.log('File passed all validations');
  console.log('File details:', result.details);
} else {
  console.error('Validation error:', result.error);
}
```

## API Reference

### Types

#### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    filename: string;
    size: number;
    mimeType: string;
    detectedMimeType?: string;
  };
}
```

#### FileValidationOptions

```typescript
interface FileValidationOptions {
  maxSize?: number; // bytes (default: 5MB for images)
  allowedFormats?: string[]; // MIME types
  checkMagicNumbers?: boolean; // default: true
}
```

### Functions

#### validateFile()

Comprehensive validation combining all checks.

```typescript
async function validateFile(
  file: File,
  options?: FileValidationOptions
): Promise<ValidationResult>
```

**Parameters:**
- `file` - File to validate
- `options` - Validation options (optional)

**Returns:** Promise<ValidationResult>

**Example:**
```typescript
const result = await validateFile(file, {
  maxSize: 10 * 1024 * 1024,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  checkMagicNumbers: true,
});
```

#### validateImageFile()

Validate image files (JPG, PNG, WebP, SVG).

```typescript
async function validateImageFile(file: File): Promise<ValidationResult>
```

**Defaults:**
- Max size: 5MB
- Allowed formats: JPEG, PNG, WebP, SVG
- Magic number checking: enabled

**Example:**
```typescript
const result = await validateImageFile(file);
if (!result.valid) {
  showError(result.error);
}
```

#### validatePdfFile()

Validate PDF files.

```typescript
async function validatePdfFile(file: File): Promise<ValidationResult>
```

**Defaults:**
- Max size: 10MB
- Allowed format: PDF only
- Magic number checking: enabled

**Example:**
```typescript
const result = await validatePdfFile(file);
if (result.valid) {
  uploadPdf(file);
}
```

#### validateFiles()

Validate multiple files at once.

```typescript
async function validateFiles(
  files: File[],
  options?: FileValidationOptions
): Promise<ValidationResult[]>
```

**Example:**
```typescript
const results = await validateFiles(fileList);
const allValid = results.every(r => r.valid);
```

#### validateFileSize()

Validate file size only.

```typescript
function validateFileSize(
  file: File,
  maxSize?: number
): ValidationResult
```

**Example:**
```typescript
const result = validateFileSize(file, 5 * 1024 * 1024);
```

#### validateMimeType()

Validate MIME type only.

```typescript
function validateMimeType(
  file: File,
  allowedFormats?: string[]
): ValidationResult
```

**Example:**
```typescript
const result = validateMimeType(file, ['image/jpeg', 'image/png']);
```

#### validateMagicNumber()

Validate file magic number (signature).

```typescript
async function validateMagicNumber(
  file: File,
  allowedFormats?: string[]
): Promise<ValidationResult>
```

**Example:**
```typescript
const result = await validateMagicNumber(file);
```

#### detectMimeTypeFromMagicNumber()

Detect MIME type from file magic number.

```typescript
function detectMimeTypeFromMagicNumber(buffer: Uint8Array): string | null
```

**Example:**
```typescript
const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const mimeType = detectMimeTypeFromMagicNumber(buffer); // 'image/jpeg'
```

#### verifyMagicNumber()

Verify file magic number matches expected MIME type.

```typescript
function verifyMagicNumber(buffer: Uint8Array, mimeType: string): boolean
```

**Example:**
```typescript
const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const isValid = verifyMagicNumber(buffer, 'image/jpeg'); // true
```

#### formatValidationError()

Format validation error for display.

```typescript
function formatValidationError(result: ValidationResult): string
```

**Example:**
```typescript
const errorMessage = formatValidationError(result);
showToast(errorMessage);
```

#### getUserFriendlyErrorMessage()

Get user-friendly error message from error or ValidationResult.

```typescript
function getUserFriendlyErrorMessage(
  error: string | ValidationResult
): string
```

**Example:**
```typescript
const message = getUserFriendlyErrorMessage(result);
```

## Integration with ImageUpload Component

The ImageUpload component automatically uses the file validation system:

```typescript
import { ImageUpload } from '@/components/ui/ImageUpload';

export function ProfilePictureUpload() {
  const handleUpload = (result) => {
    console.log('Image uploaded:', result.url);
  };

  const handleError = (error) => {
    console.error('Upload failed:', error.message);
  };

  return (
    <ImageUpload
      bucket="portfolio-images"
      folder="profiles"
      onUpload={handleUpload}
      onError={handleError}
      label="Upload Profile Picture"
      helpText="JPG, PNG, WebP, or SVG (max 5MB)"
    />
  );
}
```

## Magic Number Validation

Magic numbers (file signatures) are the first few bytes of a file that identify its type. This prevents users from renaming files to bypass format restrictions.

### Supported Magic Numbers

| Format | Magic Number | Hex |
|--------|--------------|-----|
| JPEG | FFD8FF | `0xFF 0xD8 0xFF` |
| PNG | 89504E47 | `0x89 0x50 0x4E 0x47` |
| GIF | 474946 | `0x47 0x49 0x46` |
| WebP | RIFF...WEBP | `0x52 0x49 0x46 0x46 ... 0x57 0x45 0x42 0x50` |
| SVG | <?xml | `0x3C 0x3F 0x78 0x6D` |
| PDF | %PDF | `0x25 0x50 0x44 0x46` |

### How It Works

1. Read first 12 bytes of file
2. Compare against known magic numbers
3. Verify detected type matches declared MIME type
4. Reject if mismatch detected

**Example:**
```typescript
// User uploads file named "image.jpg" but it's actually a PNG
const result = await validateImageFile(file);
// result.valid = false
// result.error = "File content does not match its declared format..."
// result.details.detectedMimeType = "image/png"
```

## Error Messages

The validation system provides clear, user-friendly error messages:

### File Size Errors
```
"File size (6.5MB) exceeds maximum allowed size of 5MB"
```

### Format Errors
```
"Invalid file format. Only JPEG, PNG, WebP, SVG files are allowed."
```

### Magic Number Errors
```
"File appears to be corrupted or not a valid image file."
"File content does not match its declared format. The file may have been renamed or corrupted."
```

### PDF Errors
```
"Only PDF files are allowed."
"PDF file size (11.2MB) exceeds maximum allowed size of 10MB"
```

## Testing

The file validation system includes comprehensive tests:

```bash
npm run test -- fileValidation.test.ts
```

### Test Coverage

- ✅ Magic number detection (JPEG, PNG, GIF, WebP, SVG)
- ✅ Magic number verification
- ✅ File size validation
- ✅ MIME type validation
- ✅ Comprehensive file validation
- ✅ Batch file validation
- ✅ Format-specific validators (images, PDFs)
- ✅ Error message formatting
- ✅ Edge cases (empty files, special characters, etc.)

**Coverage:** 58 tests, 100% passing

## Best Practices

### 1. Always Validate on Upload

```typescript
const handleFileSelect = async (file: File) => {
  const result = await validateImageFile(file);
  if (!result.valid) {
    showError(result.error);
    return;
  }
  // Proceed with upload
};
```

### 2. Use Format-Specific Validators

```typescript
// For images
const imageResult = await validateImageFile(file);

// For PDFs
const pdfResult = await validatePdfFile(file);
```

### 3. Provide User Feedback

```typescript
const result = await validateFile(file);
if (!result.valid) {
  toast.error(result.error);
  return;
}
toast.success('File validation passed');
```

### 4. Handle Batch Uploads

```typescript
const results = await validateFiles(fileList);
const invalid = results.filter(r => !r.valid);

if (invalid.length > 0) {
  showError(`${invalid.length} file(s) failed validation`);
  return;
}
```

### 5. Customize Validation Options

```typescript
const result = await validateFile(file, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['image/jpeg', 'image/png'],
  checkMagicNumbers: true,
});
```

## Performance Considerations

- **Magic number checking:** Reads only first 12 bytes (minimal I/O)
- **Async operations:** Non-blocking file reading
- **Batch validation:** Parallel validation of multiple files
- **Error handling:** Graceful degradation on read errors

## Security Considerations

- **Magic number validation:** Prevents file type spoofing
- **MIME type checking:** Validates declared file type
- **Size limits:** Prevents resource exhaustion
- **Error messages:** No sensitive information exposed

## Troubleshooting

### "File appears to be corrupted"

**Cause:** File magic number doesn't match any known format

**Solution:**
- Verify file is a valid image/PDF
- Try re-saving the file
- Check file isn't corrupted

### "File content does not match its declared format"

**Cause:** File was renamed (e.g., PNG renamed to .jpg)

**Solution:**
- Rename file to correct extension
- Re-save file in correct format
- Use original file

### "File size exceeds maximum"

**Cause:** File is larger than allowed

**Solution:**
- Compress image before upload
- Use smaller resolution
- Check file size limit

## Examples

### Complete Upload Flow

```typescript
import { validateImageFile } from '@/lib/fileValidation';
import { uploadImage } from '@/lib/storage';

async function handleImageUpload(file: File) {
  try {
    // Step 1: Validate file
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    // Step 2: Show progress
    showProgress('Uploading...');

    // Step 3: Upload to storage
    const result = await uploadImage(file, {
      bucket: 'portfolio-images',
      folder: 'uploads',
    });

    // Step 4: Success
    showSuccess('Image uploaded successfully');
    return result.url;
  } catch (error) {
    showError('Upload failed: ' + error.message);
  }
}
```

### React Component Integration

```typescript
import { useState } from 'react';
import { validateImageFile } from '@/lib/fileValidation';

export function ImageUploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const result = await validateImageFile(file);
    if (!result.valid) {
      setError(result.error || 'Validation failed');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setError(null);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {error && <p className="text-red-500">{error}</p>}
      {preview && <img src={preview} alt="Preview" />}
    </div>
  );
}
```

## Related Documentation

- [Storage Library Guide](./storage.ts)
- [ImageUpload Component](../components/ui/ImageUpload.tsx)
- [Validation Schemas](./validation.ts)
