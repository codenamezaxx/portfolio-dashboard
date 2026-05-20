/**
 * Tests for server-side validation utilities
 */

import { z } from 'zod';
import {
  validateData,
  validateDataOrThrow,
  ValidationError,
  formatValidationErrors,
  isValidUrl,
  isValidEmail,
  sanitizeString,
  validateFile,
} from './serverValidation';

describe('Server Validation Utilities', () => {
  describe('validateData', () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
    });

    it('should return success with valid data', () => {
      const data = { name: 'John', email: 'john@example.com' };
      const result = validateData(data, schema);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors with invalid data', () => {
      const data = { name: '', email: 'invalid' };
      const result = validateData(data, schema);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.name).toBe('Name is required');
      expect(result.errors?.email).toBe('Invalid email');
    });

    it('should handle missing required fields', () => {
      const data = { name: 'John' };
      const result = validateData(data, schema);

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
    });
  });

  describe('validateDataOrThrow', () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
    });

    it('should return data with valid input', () => {
      const data = { name: 'John' };
      const result = validateDataOrThrow(data, schema);

      expect(result).toEqual(data);
    });

    it('should throw ValidationError with invalid input', () => {
      const data = { name: '' };

      expect(() => validateDataOrThrow(data, schema)).toThrow(ValidationError);
    });

    it('should include errors in thrown ValidationError', () => {
      const data = { name: '' };

      try {
        validateDataOrThrow(data, schema);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.errors.name).toBe('Name is required');
        }
      }
    });
  });

  describe('formatValidationErrors', () => {
    it('should format nested path errors', () => {
      const errors = {
        'profile.name': 'Name is required',
        'profile.email': 'Invalid email',
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted['profile_name']).toBe('Name is required');
      expect(formatted['profile_email']).toBe('Invalid email');
    });

    it('should handle flat errors', () => {
      const errors = {
        name: 'Name is required',
        email: 'Invalid email',
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted.name).toBe('Name is required');
      expect(formatted.email).toBe('Invalid email');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('john@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape ampersands', () => {
      expect(sanitizeString('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      expect(sanitizeString('He said "hello"')).toBe(
        'He said &quot;hello&quot;'
      );
    });

    it('should escape single quotes', () => {
      expect(sanitizeString("It's a test")).toBe('It&#x27;s a test');
    });

    it('should handle normal text', () => {
      expect(sanitizeString('Normal text')).toBe('Normal text');
    });
  });

  describe('validateFile', () => {
    it('should validate file size', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

      const result = validateFile(file, { maxSize: 5 * 1024 * 1024 });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should validate MIME type', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });

      const result = validateFile(file, {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should accept valid files', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateFile(file, {
        maxSize: 5 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      });

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should use default max size if not specified', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

      const result = validateFile(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('should create error with message and errors', () => {
      const errors = { name: 'Name is required' };
      const error = new ValidationError('Validation failed', errors);

      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(errors);
      expect(error.name).toBe('ValidationError');
    });

    it('should create error with empty errors object', () => {
      const error = new ValidationError('Validation failed');

      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual({});
    });
  });
});
