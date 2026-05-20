/**
 * Tests for File Validation Utilities
 * 
 * Tests cover:
 * - MIME type validation
 * - Magic number (file signature) validation
 * - File size validation
 * - Error message formatting
 * - Edge cases and boundary conditions
 */

import {
  validateFile,
  validateFileSize,
  validateMimeType,
  validateMagicNumber,
  validateImageFile,
  validatePdfFile,
  validateFiles,
  detectMimeTypeFromMagicNumber,
  verifyMagicNumber,
  formatValidationError,
  getUserFriendlyErrorMessage,
} from './fileValidation';

// ============================================================
// Helper Functions
// ============================================================

/**
 * Create a mock File object with specific properties.
 */
function createMockFile(
  name: string,
  size: number,
  type: string,
  content: Uint8Array = new Uint8Array()
): File {
  const blob = new Blob([content as BlobPart], { type });
  return new File([blob], name, { type });
}

/**
 * Create a File with JPEG magic number.
 */
function createJpegFile(name: string = 'test.jpg', size: number = 1024): File {
  const magicNumber = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
  const padding = new Uint8Array(Math.max(0, size - magicNumber.length));
  const content = new Uint8Array([...magicNumber, ...padding]);
  return createMockFile(name, size, 'image/jpeg', content);
}

/**
 * Create a File with PNG magic number.
 */
function createPngFile(name: string = 'test.png', size: number = 1024): File {
  const magicNumber = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const padding = new Uint8Array(Math.max(0, size - magicNumber.length));
  const content = new Uint8Array([...magicNumber, ...padding]);
  return createMockFile(name, size, 'image/png', content);
}

/**
 * Create a File with WebP magic number.
 */
function createWebpFile(name: string = 'test.webp', size: number = 1024): File {
  const magicNumber = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]);
  const padding = new Uint8Array(Math.max(0, size - magicNumber.length));
  const content = new Uint8Array([...magicNumber, ...padding]);
  return createMockFile(name, size, 'image/webp', content);
}

/**
 * Create a File with PDF magic number.
 */
function createPdfFile(name: string = 'test.pdf', size: number = 1024): File {
  const magicNumber = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
  const padding = new Uint8Array(Math.max(0, size - magicNumber.length));
  const content = new Uint8Array([...magicNumber, ...padding]);
  return createMockFile(name, size, 'application/pdf', content);
}

/**
 * Create a File with invalid content.
 */
function createInvalidFile(name: string = 'test.jpg', size: number = 1024): File {
  const content = new Uint8Array(size);
  return createMockFile(name, size, 'image/jpeg', content);
}

// ============================================================
// Magic Number Detection Tests
// ============================================================

describe('detectMimeTypeFromMagicNumber', () => {
  it('should detect JPEG from magic number', () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    expect(detectMimeTypeFromMagicNumber(buffer)).toBe('image/jpeg');
  });

  it('should detect PNG from magic number', () => {
    const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    expect(detectMimeTypeFromMagicNumber(buffer)).toBe('image/png');
  });

  it('should detect GIF from magic number', () => {
    const buffer = new Uint8Array([0x47, 0x49, 0x46]);
    expect(detectMimeTypeFromMagicNumber(buffer)).toBe('image/gif');
  });

  it('should detect WebP from magic number', () => {
    const buffer = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    expect(detectMimeTypeFromMagicNumber(buffer)).toBe('image/webp');
  });

  it('should detect SVG from magic number', () => {
    const buffer = new Uint8Array([0x3c, 0x3f, 0x78, 0x6d]); // <?xml
    expect(detectMimeTypeFromMagicNumber(buffer)).toBe('image/svg+xml');
  });

  it('should return null for unknown magic number', () => {
    const buffer = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    expect(detectMimeTypeFromMagicNumber(buffer)).toBeNull();
  });
});

describe('verifyMagicNumber', () => {
  it('should verify JPEG magic number', () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    expect(verifyMagicNumber(buffer, 'image/jpeg')).toBe(true);
  });

  it('should verify PNG magic number', () => {
    const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    expect(verifyMagicNumber(buffer, 'image/png')).toBe(true);
  });

  it('should reject mismatched magic number', () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]); // JPEG
    expect(verifyMagicNumber(buffer, 'image/png')).toBe(false);
  });
});

// ============================================================
// File Size Validation Tests
// ============================================================

describe('validateFileSize', () => {
  it('should accept file under 5MB', () => {
    const file = createJpegFile('test.jpg', 1024 * 1024); // 1MB
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
  });

  it('should accept file exactly 5MB', () => {
    const file = createJpegFile('test.jpg', 5 * 1024 * 1024);
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
  });

  it('should reject file over 5MB', () => {
    const file = createJpegFile('test.jpg', 6 * 1024 * 1024);
    const result = validateFileSize(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum allowed size');
  });

  it('should reject file with custom max size', () => {
    const file = createJpegFile('test.jpg', 3 * 1024 * 1024);
    const result = validateFileSize(file, 2 * 1024 * 1024);
    expect(result.valid).toBe(false);
  });

  it('should include file details in result', () => {
    const file = createJpegFile('test.jpg', 1024);
    const result = validateFileSize(file);
    expect(result.details).toBeDefined();
    expect(result.details?.filename).toBe('test.jpg');
    expect(result.details?.size).toBe(1024);
    expect(result.details?.mimeType).toBe('image/jpeg');
  });
});

// ============================================================
// MIME Type Validation Tests
// ============================================================

describe('validateMimeType', () => {
  it('should accept JPEG MIME type', () => {
    const file = createJpegFile();
    const result = validateMimeType(file);
    expect(result.valid).toBe(true);
  });

  it('should accept PNG MIME type', () => {
    const file = createPngFile();
    const result = validateMimeType(file);
    expect(result.valid).toBe(true);
  });

  it('should accept WebP MIME type', () => {
    const file = createWebpFile();
    const result = validateMimeType(file);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid MIME type', () => {
    const file = createMockFile('test.txt', 1024, 'text/plain');
    const result = validateMimeType(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });

  it('should reject with custom allowed formats', () => {
    const file = createJpegFile();
    const result = validateMimeType(file, ['image/png']);
    expect(result.valid).toBe(false);
  });

  it('should include format list in error message', () => {
    const file = createMockFile('test.txt', 1024, 'text/plain');
    const result = validateMimeType(file, ['image/jpeg', 'image/png']);
    expect(result.error).toContain('JPEG');
    expect(result.error).toContain('PNG');
  });
});

// ============================================================
// Magic Number Validation Tests
// ============================================================

describe('validateMagicNumber', () => {
  it('should accept valid JPEG file', async () => {
    const file = createJpegFile();
    const result = await validateMagicNumber(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid PNG file', async () => {
    const file = createPngFile();
    const result = await validateMagicNumber(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid WebP file', async () => {
    const file = createWebpFile();
    const result = await validateMagicNumber(file);
    expect(result.valid).toBe(true);
  });

  it('should reject file with invalid magic number', async () => {
    const file = createInvalidFile();
    const result = await validateMagicNumber(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('corrupted');
  });

  it('should reject file with mismatched magic number', async () => {
    // Create a file with JPEG magic number but PNG MIME type
    const magicNumber = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    const padding = new Uint8Array(1020);
    const content = new Uint8Array([...magicNumber, ...padding]);
    const file = createMockFile('test.png', 1024, 'image/png', content);

    const result = await validateMagicNumber(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('does not match');
  });

  it('should include detected MIME type in result', async () => {
    const file = createJpegFile();
    const result = await validateMagicNumber(file);
    expect(result.details?.detectedMimeType).toBe('image/jpeg');
  });
});

// ============================================================
// Comprehensive File Validation Tests
// ============================================================

describe('validateFile', () => {
  it('should accept valid JPEG file', async () => {
    const file = createJpegFile();
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid PNG file', async () => {
    const file = createPngFile();
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should accept valid WebP file', async () => {
    const file = createWebpFile();
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject file over 5MB', async () => {
    const file = createJpegFile('test.jpg', 6 * 1024 * 1024);
    const result = await validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  it('should reject invalid MIME type', async () => {
    const file = createMockFile('test.txt', 1024, 'text/plain');
    const result = await validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });

  it('should reject file with invalid magic number', async () => {
    const file = createInvalidFile();
    const result = await validateFile(file);
    expect(result.valid).toBe(false);
  });

  it('should skip magic number check when disabled', async () => {
    const file = createInvalidFile();
    const result = await validateFile(file, { checkMagicNumbers: false });
    // Should pass MIME type check but fail magic number check is skipped
    expect(result.valid).toBe(true);
  });

  it('should accept custom max size', async () => {
    const file = createJpegFile('test.jpg', 3 * 1024 * 1024);
    const result = await validateFile(file, { maxSize: 4 * 1024 * 1024 });
    expect(result.valid).toBe(true);
  });

  it('should accept custom allowed formats', async () => {
    const file = createJpegFile();
    const result = await validateFile(file, {
      allowedFormats: ['image/jpeg'],
    });
    expect(result.valid).toBe(true);
  });

  it('should include file details in result', async () => {
    const file = createJpegFile('test.jpg', 1024);
    const result = await validateFile(file);
    expect(result.details).toBeDefined();
    expect(result.details?.filename).toBe('test.jpg');
    expect(result.details?.size).toBe(1024);
    expect(result.details?.mimeType).toBe('image/jpeg');
  });
});

// ============================================================
// Batch File Validation Tests
// ============================================================

describe('validateFiles', () => {
  it('should validate multiple files', async () => {
    const files = [createJpegFile(), createPngFile(), createWebpFile()];
    const results = await validateFiles(files);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.valid)).toBe(true);
  });

  it('should handle mixed valid and invalid files', async () => {
    const files = [
      createJpegFile(),
      createInvalidFile(),
      createPngFile(),
    ];
    const results = await validateFiles(files);
    expect(results).toHaveLength(3);
    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
    expect(results[2].valid).toBe(true);
  });

  it('should apply options to all files', async () => {
    const files = [
      createJpegFile('test1.jpg', 6 * 1024 * 1024),
      createJpegFile('test2.jpg', 6 * 1024 * 1024),
    ];
    const results = await validateFiles(files, {
      maxSize: 5 * 1024 * 1024,
    });
    expect(results.every((r) => !r.valid)).toBe(true);
  });
});

// ============================================================
// Format-Specific Validator Tests
// ============================================================

describe('validateImageFile', () => {
  it('should accept valid image file', async () => {
    const file = createJpegFile();
    const result = await validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject non-image file', async () => {
    const file = createMockFile('test.txt', 1024, 'text/plain');
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
  });

  it('should reject image over 5MB', async () => {
    const file = createJpegFile('test.jpg', 6 * 1024 * 1024);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
  });
});

describe('validatePdfFile', () => {
  it('should accept valid PDF file', async () => {
    const file = createPdfFile();
    const result = await validatePdfFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject non-PDF file', async () => {
    const file = createJpegFile();
    const result = await validatePdfFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Only PDF files');
  });

  it('should reject PDF over 10MB', async () => {
    const file = createPdfFile('test.pdf', 11 * 1024 * 1024);
    const result = await validatePdfFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  it('should reject file with invalid PDF magic number', async () => {
    const file = createInvalidFile('test.pdf', 1024);
    // Override the MIME type to be PDF so it passes the first check
    Object.defineProperty(file, 'type', {
      value: 'application/pdf',
      writable: false,
    });
    const result = await validatePdfFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('corrupted');
  });

  it('should accept PDF exactly 10MB', async () => {
    const file = createPdfFile('test.pdf', 10 * 1024 * 1024);
    const result = await validatePdfFile(file);
    expect(result.valid).toBe(true);
  });
});

// ============================================================
// Error Message Formatting Tests
// ============================================================

describe('formatValidationError', () => {
  it('should return empty string for valid result', () => {
    const result = { valid: true };
    expect(formatValidationError(result)).toBe('');
  });

  it('should return error message for invalid result', () => {
    const result = {
      valid: false,
      error: 'Test error message',
    };
    expect(formatValidationError(result)).toBe('Test error message');
  });

  it('should return default message if no error provided', () => {
    const result = { valid: false };
    expect(formatValidationError(result)).toBe('File validation failed');
  });
});

describe('getUserFriendlyErrorMessage', () => {
  it('should return string as-is', () => {
    const message = 'Test error message';
    expect(getUserFriendlyErrorMessage(message)).toBe(message);
  });

  it('should format ValidationResult', () => {
    const result = {
      valid: false,
      error: 'Test error',
    };
    expect(getUserFriendlyErrorMessage(result)).toBe('Test error');
  });

  it('should handle ValidationResult without error', () => {
    const result = { valid: false };
    expect(getUserFriendlyErrorMessage(result)).toBe('File validation failed');
  });
});

// ============================================================
// Edge Cases and Boundary Tests
// ============================================================

describe('Edge Cases', () => {
  it('should handle empty file', async () => {
    const file = createJpegFile('test.jpg', 0);
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should handle very small file', async () => {
    const file = createJpegFile('test.jpg', 1);
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should handle file with special characters in name', async () => {
    const file = createJpegFile('test-file_2024 (1).jpg', 1024);
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.details?.filename).toBe('test-file_2024 (1).jpg');
  });

  it('should handle file with no extension', async () => {
    const file = createJpegFile('testfile', 1024);
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });

  it('should handle file with multiple dots in name', async () => {
    const file = createJpegFile('test.backup.jpg', 1024);
    const result = await validateFile(file);
    expect(result.valid).toBe(true);
  });
});
