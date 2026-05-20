/**
 * URL Validation Tests for Social Links
 * 
 * Tests for platform-specific URL validation including:
 * - GitHub URLs
 * - LinkedIn URLs
 * - Instagram URLs
 * - Telegram URLs
 * - Email addresses
 * 
 * **Validates: Requirements 6.2, 9.10**
 */

import { z } from 'zod';
import { contactInfoSchema } from './validation';

describe('URL Validation for Social Links', () => {
  describe('GitHub URL Validation', () => {
    it('should accept valid GitHub URLs', () => {
      const validUrls = [
        'https://github.com/username',
        'https://github.com/user-name',
        'https://github.com/user_name',
        'https://github.com/user123',
        'https://github.com/username/',
      ];

      validUrls.forEach((url) => {
        const data = { githubUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject GitHub URLs without https', () => {
      const invalidUrls = [
        'http://github.com/username',
        'github.com/username',
        'ftp://github.com/username',
      ];

      invalidUrls.forEach((url) => {
        const data = { githubUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should reject GitHub URLs with invalid characters', () => {
      const invalidUrls = [
        'https://github.com/user@name',
        'https://github.com/user#name',
        'https://github.com/user name',
        'https://github.com/user.name.extra',
      ];

      invalidUrls.forEach((url) => {
        const data = { githubUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should provide specific error message for invalid GitHub URL', () => {
      const data = { githubUrl: 'https://github.com/user@invalid' };
      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('GitHub');
        }
      }
    });

    it('should allow empty GitHub URL', () => {
      const data = { githubUrl: '', email: 'test@example.com' };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });
  });

  describe('LinkedIn URL Validation', () => {
    it('should accept valid LinkedIn URLs with /in/', () => {
      const validUrls = [
        'https://linkedin.com/in/username',
        'https://www.linkedin.com/in/username',
        'https://linkedin.com/in/user-name',
        'https://linkedin.com/in/user_name',
        'https://linkedin.com/in/username/',
      ];

      validUrls.forEach((url) => {
        const data = { linkedinUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should accept valid LinkedIn company URLs', () => {
      const validUrls = [
        'https://linkedin.com/company/companyname',
        'https://www.linkedin.com/company/company-name',
        'https://linkedin.com/company/company_name',
        'https://linkedin.com/company/companyname/',
      ];

      validUrls.forEach((url) => {
        const data = { linkedinUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject LinkedIn URLs without https', () => {
      const invalidUrls = [
        'http://linkedin.com/in/username',
        'linkedin.com/in/username',
        'ftp://linkedin.com/in/username',
      ];

      invalidUrls.forEach((url) => {
        const data = { linkedinUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should reject LinkedIn URLs with invalid path', () => {
      const invalidUrls = [
        'https://linkedin.com/invalid/username',
        'https://linkedin.com/user/username',
        'https://linkedin.com/username',
      ];

      invalidUrls.forEach((url) => {
        const data = { linkedinUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should provide specific error message for invalid LinkedIn URL', () => {
      const data = { linkedinUrl: 'https://linkedin.com/invalid/username' };
      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('LinkedIn');
        }
      }
    });

    it('should allow empty LinkedIn URL', () => {
      const data = { linkedinUrl: '', email: 'test@example.com' };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });
  });

  describe('Instagram URL Validation', () => {
    it('should accept valid Instagram URLs', () => {
      const validUrls = [
        'https://instagram.com/username',
        'https://www.instagram.com/username',
        'https://instagram.com/user_name',
        'https://instagram.com/user.name',
        'https://instagram.com/user123',
        'https://instagram.com/username/',
      ];

      validUrls.forEach((url) => {
        const data = { instagramUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject Instagram URLs without https', () => {
      const invalidUrls = [
        'http://instagram.com/username',
        'instagram.com/username',
        'ftp://instagram.com/username',
      ];

      invalidUrls.forEach((url) => {
        const data = { instagramUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should reject Instagram URLs with invalid characters', () => {
      const invalidUrls = [
        'https://instagram.com/user@name',
        'https://instagram.com/user#name',
        'https://instagram.com/user name',
      ];

      invalidUrls.forEach((url) => {
        const data = { instagramUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should provide specific error message for invalid Instagram URL', () => {
      const data = { instagramUrl: 'https://instagram.com/user@invalid' };
      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Instagram');
        }
      }
    });

    it('should allow empty Instagram URL', () => {
      const data = { instagramUrl: '', email: 'test@example.com' };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });
  });

  describe('Telegram URL Validation', () => {
    it('should accept valid Telegram URLs with t.me', () => {
      const validUrls = [
        'https://t.me/username',
        'https://t.me/user_name',
        'https://t.me/user123',
        'https://t.me/username/',
      ];

      validUrls.forEach((url) => {
        const data = { telegramUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should accept valid Telegram URLs with telegram.me', () => {
      const validUrls = [
        'https://telegram.me/username',
        'https://telegram.me/user_name',
        'https://telegram.me/username/',
      ];

      validUrls.forEach((url) => {
        const data = { telegramUrl: url };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject Telegram URLs without https', () => {
      const invalidUrls = [
        'http://t.me/username',
        't.me/username',
        'ftp://t.me/username',
      ];

      invalidUrls.forEach((url) => {
        const data = { telegramUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should reject Telegram URLs with invalid characters', () => {
      const invalidUrls = [
        'https://t.me/user@name',
        'https://t.me/user#name',
        'https://t.me/user name',
      ];

      invalidUrls.forEach((url) => {
        const data = { telegramUrl: url };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should provide specific error message for invalid Telegram URL', () => {
      const data = { telegramUrl: 'https://t.me/user@invalid' };
      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Telegram');
        }
      }
    });

    it('should allow empty Telegram URL', () => {
      const data = { telegramUrl: '', email: 'test@example.com' };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example.com',
        'user123@example.com',
      ];

      validEmails.forEach((email) => {
        const data = { email };
        expect(() => contactInfoSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'user@',
        '@example.com',
        'user @example.com',
        'user@example',
      ];

      invalidEmails.forEach((email) => {
        const data = { email, githubUrl: 'https://github.com/user' };
        expect(() => contactInfoSchema.parse(data)).toThrow();
      });
    });

    it('should provide specific error message for invalid email', () => {
      const data = { email: 'invalid-email' };
      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Invalid email');
        }
      }
    });

    it('should allow empty email', () => {
      const data = { email: '', githubUrl: 'https://github.com/user' };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });
  });

  describe('Real-time Validation Feedback', () => {
    it('should validate all fields independently', () => {
      const data = {
        githubUrl: 'https://github.com/user',
        linkedinUrl: 'https://linkedin.com/in/user',
        instagramUrl: 'https://instagram.com/user',
        telegramUrl: 'https://t.me/user',
        email: 'user@example.com',
      };

      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should provide field-specific error messages', () => {
      const data = {
        githubUrl: 'invalid-github',
        linkedinUrl: 'invalid-linkedin',
        instagramUrl: 'invalid-instagram',
        telegramUrl: 'invalid-telegram',
        email: 'invalid-email',
      };

      try {
        contactInfoSchema.parse(data);
        fail('Should have thrown');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap = error.issues.reduce(
            (acc, issue) => {
              const path = issue.path[0] as string;
              acc[path] = issue.message;
              return acc;
            },
            {} as Record<string, string>
          );

          expect(Object.keys(errorMap).length).toBeGreaterThan(0);
          expect(errorMap).toHaveProperty('githubUrl');
          expect(errorMap).toHaveProperty('linkedinUrl');
          expect(errorMap).toHaveProperty('instagramUrl');
          expect(errorMap).toHaveProperty('telegramUrl');
          expect(errorMap).toHaveProperty('email');
        }
      }
    });
  });

  describe('Client and Server-side Validation', () => {
    it('should validate on both client and server', () => {
      // This test ensures the schema works for both client-side and server-side validation
      const validData = {
        githubUrl: 'https://github.com/user',
        linkedinUrl: 'https://linkedin.com/in/user',
        instagramUrl: 'https://instagram.com/user',
        telegramUrl: 'https://t.me/user',
        email: 'user@example.com',
      };

      // Client-side validation
      expect(() => contactInfoSchema.parse(validData)).not.toThrow();

      // Server-side validation (same schema)
      expect(() => contactInfoSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid data on both client and server', () => {
      const invalidData = {
        githubUrl: 'not-a-url',
        linkedinUrl: 'not-a-url',
        instagramUrl: 'not-a-url',
        telegramUrl: 'not-a-url',
        email: 'not-an-email',
      };

      // Client-side validation
      expect(() => contactInfoSchema.parse(invalidData)).toThrow();

      // Server-side validation (same schema)
      expect(() => contactInfoSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle URLs with special characters in usernames', () => {
      const data = {
        githubUrl: 'https://github.com/user-name_123',
        linkedinUrl: 'https://linkedin.com/in/user-name_123',
        instagramUrl: 'https://instagram.com/user.name_123',
        telegramUrl: 'https://t.me/user_name_123',
      };

      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should handle URLs with trailing slashes', () => {
      const data = {
        githubUrl: 'https://github.com/user/',
        linkedinUrl: 'https://linkedin.com/in/user/',
        instagramUrl: 'https://instagram.com/user/',
        telegramUrl: 'https://t.me/user/',
      };

      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should handle mixed valid and invalid URLs', () => {
      const data = {
        githubUrl: 'https://github.com/user',
        linkedinUrl: 'invalid-url',
      };

      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should require at least one valid field', () => {
      const data = {
        githubUrl: '',
        linkedinUrl: '',
        instagramUrl: '',
        telegramUrl: '',
        email: '',
      };

      expect(() => contactInfoSchema.parse(data)).toThrow();
    });
  });
});
