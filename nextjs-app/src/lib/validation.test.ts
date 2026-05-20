/**
 * Tests for Zod validation schemas
 * Validates all content types with specific error messages
 */

import { z } from 'zod';
import {
  loginSchema,
  profileSchema,
  journeyItemSchema,
  techItemSchema,
  projectSchema,
  achievementSchema,
  contactInfoSchema,
  createAdminUserSchema,
  imageUploadSchema,
  pdfUploadSchema,
} from './validation';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login credentials', () => {
      const data = { email: 'user@example.com', password: 'SecurePass123!' };
      expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid-email', password: 'SecurePass123!' };
      expect(() => loginSchema.parse(data)).toThrow();
    });

    it('should reject short password', () => {
      const data = { email: 'user@example.com', password: 'short' };
      expect(() => loginSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid email', () => {
      const data = { email: 'invalid', password: 'SecurePass123!' };
      try {
        loginSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Invalid email');
        }
      }
    });

    it('should provide specific error message for short password', () => {
      const data = { email: 'user@example.com', password: 'short' };
      try {
        loginSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('at least 8 characters');
        }
      }
    });
  });

  describe('profileSchema', () => {
    it('should validate complete profile', () => {
      const data = {
        name: 'John Doe',
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
        heroImageUrl: 'https://example.com/hero.jpg',
      };
      expect(() => profileSchema.parse(data)).not.toThrow();
    });

    it('should validate profile without hero image', () => {
      const data = {
        name: 'John Doe',
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
        heroImageUrl: '',
      };
      expect(() => profileSchema.parse(data)).not.toThrow();
    });

    it('should reject empty name', () => {
      const data = {
        name: '',
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
      };
      expect(() => profileSchema.parse(data)).toThrow();
    });

    it('should reject empty role', () => {
      const data = {
        name: 'John Doe',
        role: '',
        tagline: 'Building amazing web experiences',
      };
      expect(() => profileSchema.parse(data)).toThrow();
    });

    it('should reject empty tagline', () => {
      const data = {
        name: 'John Doe',
        role: 'Frontend Developer',
        tagline: '',
      };
      expect(() => profileSchema.parse(data)).toThrow();
    });

    it('should reject invalid hero image URL', () => {
      const data = {
        name: 'John Doe',
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
        heroImageUrl: 'not-a-url',
      };
      expect(() => profileSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for required name', () => {
      const data = {
        name: '',
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
      };
      try {
        profileSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Name is required');
        }
      }
    });

    it('should reject name exceeding max length', () => {
      const data = {
        name: 'a'.repeat(256),
        role: 'Frontend Developer',
        tagline: 'Building amazing web experiences',
      };
      expect(() => profileSchema.parse(data)).toThrow();
    });
  });

  describe('journeyItemSchema', () => {
    it('should validate complete journey item', () => {
      const data = {
        year: '2023',
        title: 'Senior Developer',
        description: 'Led development of new features',
        displayOrder: 1,
      };
      expect(() => journeyItemSchema.parse(data)).not.toThrow();
    });

    it('should validate journey item without display order', () => {
      const data = {
        year: '2023',
        title: 'Senior Developer',
        description: 'Led development of new features',
      };
      expect(() => journeyItemSchema.parse(data)).not.toThrow();
    });

    it('should reject empty year', () => {
      const data = {
        year: '',
        title: 'Senior Developer',
        description: 'Led development of new features',
      };
      expect(() => journeyItemSchema.parse(data)).toThrow();
    });

    it('should reject empty title', () => {
      const data = {
        year: '2023',
        title: '',
        description: 'Led development of new features',
      };
      expect(() => journeyItemSchema.parse(data)).toThrow();
    });

    it('should reject empty description', () => {
      const data = {
        year: '2023',
        title: 'Senior Developer',
        description: '',
      };
      expect(() => journeyItemSchema.parse(data)).toThrow();
    });

    it('should provide specific error messages for required fields', () => {
      const data = {
        year: '',
        title: '',
        description: '',
      };
      try {
        journeyItemSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const messages = error.issues.map((e) => e.message);
          expect(messages).toContain('Year is required');
          expect(messages).toContain('Title is required');
          expect(messages).toContain('Description is required');
        }
      }
    });
  });

  describe('techItemSchema', () => {
    it('should validate complete tech item', () => {
      const data = {
        name: 'React',
        icon: 'https://example.com/react.svg',
        displayOrder: 1,
      };
      expect(() => techItemSchema.parse(data)).not.toThrow();
    });

    it('should validate tech item without display order', () => {
      const data = {
        name: 'React',
        icon: 'https://example.com/react.svg',
      };
      expect(() => techItemSchema.parse(data)).not.toThrow();
    });

    it('should reject empty name', () => {
      const data = {
        name: '',
        icon: 'https://example.com/react.svg',
      };
      expect(() => techItemSchema.parse(data)).toThrow();
    });

    it('should reject invalid icon URL', () => {
      const data = {
        name: 'React',
        icon: 'not-a-url',
      };
      expect(() => techItemSchema.parse(data)).toThrow();
    });

    it('should reject name exceeding max length', () => {
      const data = {
        name: 'a'.repeat(101),
        icon: 'https://example.com/react.svg',
      };
      expect(() => techItemSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid icon URL', () => {
      const data = {
        name: 'React',
        icon: 'invalid-url',
      };
      try {
        techItemSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('valid URL');
        }
      }
    });
  });

  describe('projectSchema', () => {
    it('should validate complete project', () => {
      const data = {
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
      expect(() => projectSchema.parse(data)).not.toThrow();
    });

    it('should validate project with minimal fields', () => {
      const data = {
        title: 'Amazing Project',
        description: 'A project that does amazing things',
        category: 'Web Development',
        technologies: ['React'],
      };
      expect(() => projectSchema.parse(data)).not.toThrow();
    });

    it('should reject empty title', () => {
      const data = {
        title: '',
        description: 'A project that does amazing things',
        category: 'Web Development',
        technologies: ['React'],
      };
      expect(() => projectSchema.parse(data)).toThrow();
    });

    it('should reject empty description', () => {
      const data = {
        title: 'Amazing Project',
        description: '',
        category: 'Web Development',
        technologies: ['React'],
      };
      expect(() => projectSchema.parse(data)).toThrow();
    });

    it('should reject empty category', () => {
      const data = {
        title: 'Amazing Project',
        description: 'A project that does amazing things',
        category: '',
        technologies: ['React'],
      };
      expect(() => projectSchema.parse(data)).toThrow();
    });

    it('should reject empty technologies array', () => {
      const data = {
        title: 'Amazing Project',
        description: 'A project that does amazing things',
        category: 'Web Development',
        technologies: [],
      };
      expect(() => projectSchema.parse(data)).toThrow();
    });

    it('should reject invalid GitHub link', () => {
      const data = {
        title: 'Amazing Project',
        description: 'A project that does amazing things',
        category: 'Web Development',
        technologies: ['React'],
        githubLink: 'not-a-url',
      };
      expect(() => projectSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for required technologies', () => {
      const data = {
        title: 'Amazing Project',
        description: 'A project that does amazing things',
        category: 'Web Development',
        technologies: [],
      };
      try {
        projectSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('At least one technology');
        }
      }
    });
  });

  describe('achievementSchema', () => {
    it('should validate complete achievement', () => {
      const data = {
        title: 'AWS Certification',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: 2023,
        pdfUrl: 'https://example.com/cert.pdf',
        externalLink: 'https://aws.amazon.com/verify',
        displayOrder: 1,
      };
      expect(() => achievementSchema.parse(data)).not.toThrow();
    });

    it('should validate achievement without external link', () => {
      const data = {
        title: 'AWS Certification',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: 2023,
        pdfUrl: 'https://example.com/cert.pdf',
      };
      expect(() => achievementSchema.parse(data)).not.toThrow();
    });

    it('should reject empty title', () => {
      const data = {
        title: '',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: 2023,
        pdfUrl: 'https://example.com/cert.pdf',
      };
      expect(() => achievementSchema.parse(data)).toThrow();
    });

    it('should reject invalid year', () => {
      const data = {
        title: 'AWS Certification',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: 1800,
        pdfUrl: 'https://example.com/cert.pdf',
      };
      expect(() => achievementSchema.parse(data)).toThrow();
    });

    it('should reject future year beyond next year', () => {
      const data = {
        title: 'AWS Certification',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: new Date().getFullYear() + 2,
        pdfUrl: 'https://example.com/cert.pdf',
      };
      expect(() => achievementSchema.parse(data)).toThrow();
    });

    it('should reject invalid PDF URL', () => {
      const data = {
        title: 'AWS Certification',
        category: 'Cloud',
        issuer: 'Amazon Web Services',
        year: 2023,
        pdfUrl: 'not-a-url',
      };
      expect(() => achievementSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for required fields', () => {
      const data = {
        title: '',
        category: '',
        issuer: '',
        year: 1800,
        pdfUrl: 'invalid',
      };
      try {
        achievementSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const messages = error.issues.map((e) => e.message);
          expect(messages.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('contactInfoSchema', () => {
    it('should validate complete contact info', () => {
      const data = {
        githubUrl: 'https://github.com/user',
        linkedinUrl: 'https://linkedin.com/in/user',
        instagramUrl: 'https://instagram.com/user',
        telegramUrl: 'https://t.me/user',
        email: 'user@example.com',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject contact info with all empty strings', () => {
      const data = {
        githubUrl: '',
        linkedinUrl: '',
        instagramUrl: '',
        telegramUrl: '',
        email: '',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should validate contact info with partial data', () => {
      const data = {
        githubUrl: 'https://github.com/user',
        email: 'user@example.com',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    // GitHub URL validation tests
    it('should validate valid GitHub URL', () => {
      const data = {
        githubUrl: 'https://github.com/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate GitHub URL with trailing slash', () => {
      const data = {
        githubUrl: 'https://github.com/testuser/',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject GitHub URL without https', () => {
      const data = {
        githubUrl: 'http://github.com/user',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject GitHub URL with invalid format', () => {
      const data = {
        githubUrl: 'https://github.com/user@invalid',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid GitHub URL', () => {
      const data = {
        githubUrl: 'https://github.com/user@invalid',
      };
      try {
        contactInfoSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('GitHub');
        }
      }
    });

    // LinkedIn URL validation tests
    it('should validate valid LinkedIn URL with /in/', () => {
      const data = {
        linkedinUrl: 'https://linkedin.com/in/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate LinkedIn URL with www', () => {
      const data = {
        linkedinUrl: 'https://www.linkedin.com/in/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate LinkedIn company URL', () => {
      const data = {
        linkedinUrl: 'https://linkedin.com/company/testcompany',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject LinkedIn URL without https', () => {
      const data = {
        linkedinUrl: 'http://linkedin.com/in/user',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject LinkedIn URL with invalid format', () => {
      const data = {
        linkedinUrl: 'https://linkedin.com/invalid/user',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid LinkedIn URL', () => {
      const data = {
        linkedinUrl: 'https://linkedin.com/invalid/user',
      };
      try {
        contactInfoSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('LinkedIn');
        }
      }
    });

    // Instagram URL validation tests
    it('should validate valid Instagram URL', () => {
      const data = {
        instagramUrl: 'https://instagram.com/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate Instagram URL with www', () => {
      const data = {
        instagramUrl: 'https://www.instagram.com/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate Instagram URL with dots in username', () => {
      const data = {
        instagramUrl: 'https://instagram.com/test.user.name',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject Instagram URL without https', () => {
      const data = {
        instagramUrl: 'http://instagram.com/user',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject Instagram URL with invalid format', () => {
      const data = {
        instagramUrl: 'https://instagram.com/user@invalid',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid Instagram URL', () => {
      const data = {
        instagramUrl: 'https://instagram.com/user@invalid',
      };
      try {
        contactInfoSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Instagram');
        }
      }
    });

    // Telegram URL validation tests
    it('should validate valid Telegram URL with t.me', () => {
      const data = {
        telegramUrl: 'https://t.me/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate Telegram URL with telegram.me', () => {
      const data = {
        telegramUrl: 'https://telegram.me/testuser',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate Telegram URL with trailing slash', () => {
      const data = {
        telegramUrl: 'https://t.me/testuser/',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject Telegram URL without https', () => {
      const data = {
        telegramUrl: 'http://t.me/user',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject Telegram URL with invalid format', () => {
      const data = {
        telegramUrl: 'https://t.me/user@invalid',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid Telegram URL', () => {
      const data = {
        telegramUrl: 'https://t.me/user@invalid',
      };
      try {
        contactInfoSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Telegram');
        }
      }
    });

    // Email validation tests
    it('should validate valid email', () => {
      const data = {
        email: 'user@example.com',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should validate email with subdomain', () => {
      const data = {
        email: 'user@mail.example.co.uk',
      };
      expect(() => contactInfoSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid email without @', () => {
      const data = {
        email: 'userexample.com',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject invalid email without domain', () => {
      const data = {
        email: 'user@',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject invalid email with spaces', () => {
      const data = {
        email: 'user @example.com',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for invalid email', () => {
      const data = {
        email: 'invalid',
      };
      try {
        contactInfoSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('Invalid email');
        }
      }
    });

    it('should reject invalid GitHub URL', () => {
      const data = {
        githubUrl: 'not-a-url',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });

    it('should reject invalid LinkedIn URL', () => {
      const data = {
        linkedinUrl: 'invalid-url',
      };
      expect(() => contactInfoSchema.parse(data)).toThrow();
    });
  });

  describe('createAdminUserSchema', () => {
    it('should validate strong password', () => {
      const data = {
        email: 'admin@example.com',
        password: 'SecurePass123!',
      };
      expect(() => createAdminUserSchema.parse(data)).not.toThrow();
    });

    it('should reject password without uppercase', () => {
      const data = {
        email: 'admin@example.com',
        password: 'securepass123!',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should reject password without lowercase', () => {
      const data = {
        email: 'admin@example.com',
        password: 'SECUREPASS123!',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should reject password without number', () => {
      const data = {
        email: 'admin@example.com',
        password: 'SecurePass!',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should reject password without special character', () => {
      const data = {
        email: 'admin@example.com',
        password: 'SecurePass123',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should reject short password', () => {
      const data = {
        email: 'admin@example.com',
        password: 'Pass1!',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'SecurePass123!',
      };
      expect(() => createAdminUserSchema.parse(data)).toThrow();
    });

    it('should provide specific error messages for password requirements', () => {
      const data = {
        email: 'admin@example.com',
        password: 'weakpass',
      };
      try {
        createAdminUserSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const messages = error.issues.map((e) => e.message);
          expect(messages.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('imageUploadSchema', () => {
    it('should validate valid image file', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).not.toThrow();
    });

    it('should validate PNG image', () => {
      const file = new File(['content'], 'image.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).not.toThrow();
    });

    it('should validate WebP image', () => {
      const file = new File(['content'], 'image.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).not.toThrow();
    });

    it('should validate SVG image', () => {
      const file = new File(['content'], 'image.svg', { type: 'image/svg+xml' });
      Object.defineProperty(file, 'size', { value: 100 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).not.toThrow();
    });

    it('should reject file exceeding 5MB', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).toThrow();
    });

    it('should reject non-image file', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      expect(() => imageUploadSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for file size', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

      const data = { file };
      try {
        imageUploadSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('5MB');
        }
      }
    });

    it('should provide specific error message for invalid format', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      try {
        imageUploadSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('JPG, PNG, WebP, and SVG');
        }
      }
    });
  });

  describe('pdfUploadSchema', () => {
    it('should validate valid PDF file', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });

      const data = { file };
      expect(() => pdfUploadSchema.parse(data)).not.toThrow();
    });

    it('should reject file exceeding 10MB', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });

      const data = { file };
      expect(() => pdfUploadSchema.parse(data)).toThrow();
    });

    it('should reject non-PDF file', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      expect(() => pdfUploadSchema.parse(data)).toThrow();
    });

    it('should provide specific error message for file size', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });

      const data = { file };
      try {
        pdfUploadSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('10MB');
        }
      }
    });

    it('should provide specific error message for invalid format', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const data = { file };
      try {
        pdfUploadSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.issues[0].message).toContain('PDF');
        }
      }
    });
  });
});
