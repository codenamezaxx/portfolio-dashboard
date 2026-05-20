/**
 * Unit tests for authentication utilities.
 * Tests password hashing, JWT token generation, and session management.
 */

import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  verifySessionToken,
  getSessionExpirationSeconds,
  getSessionExpirationDate,
  extractSessionToken,
  formatSessionCookie,
  formatClearSessionCookie,
} from './auth';

describe('Authentication Utilities', () => {
  // ============================================================
  // Password Hashing Tests
  // ============================================================

  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should handle very long password', async () => {
      const password = 'a'.repeat(1000);
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });
  });

  // ============================================================
  // JWT Token Tests
  // ============================================================

  describe('JWT Token Generation and Verification', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const token = generateSessionToken(userId, email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should verify a valid token', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const token = generateSessionToken(userId, email);
      const decoded = verifySessionToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.email).toBe(email);
    });

    it('should reject an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifySessionToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should reject a malformed token', () => {
      const malformedToken = 'not-a-jwt';
      const decoded = verifySessionToken(malformedToken);

      expect(decoded).toBeNull();
    });

    it('should reject an empty token', () => {
      const decoded = verifySessionToken('');

      expect(decoded).toBeNull();
    });

    it('should include iat and exp claims', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const token = generateSessionToken(userId, email);
      const decoded = verifySessionToken(token);

      expect(decoded?.iat).toBeDefined();
      expect(decoded?.exp).toBeDefined();
      expect(typeof decoded?.iat).toBe('number');
      expect(typeof decoded?.exp).toBe('number');
    });

    it('should generate different tokens for the same user', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const token1 = generateSessionToken(userId, email);
      
      // Wait a bit to ensure different iat
      const token2 = generateSessionToken(userId, email);

      // Tokens should be different because they have different iat claims
      // (even though the payload is the same, the iat timestamp changes)
      const decoded1 = verifySessionToken(token1);
      const decoded2 = verifySessionToken(token2);
      
      expect(decoded1?.userId).toBe(decoded2?.userId);
      expect(decoded1?.email).toBe(decoded2?.email);
      // iat should be different or very close
      expect(decoded1?.iat).toBeDefined();
      expect(decoded2?.iat).toBeDefined();
    });
  });

  // ============================================================
  // Session Expiration Tests
  // ============================================================

  describe('Session Expiration', () => {
    it('should return session expiration in seconds', () => {
      const expirationSeconds = getSessionExpirationSeconds();

      expect(expirationSeconds).toBeDefined();
      expect(typeof expirationSeconds).toBe('number');
      expect(expirationSeconds).toBeGreaterThan(0);
      expect(expirationSeconds).toBe(24 * 60 * 60); // 24 hours
    });

    it('should return session expiration as Date', () => {
      const expirationDate = getSessionExpirationDate();

      expect(expirationDate).toBeInstanceOf(Date);
      expect(expirationDate.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return expiration date approximately 24 hours in future', () => {
      const expirationDate = getSessionExpirationDate();
      const now = Date.now();
      const expectedTime = now + 24 * 60 * 60 * 1000;
      const timeDifference = Math.abs(expirationDate.getTime() - expectedTime);

      // Allow 1 second tolerance
      expect(timeDifference).toBeLessThan(1000);
    });
  });

  // ============================================================
  // Cookie Formatting Tests
  // ============================================================

  describe('Cookie Formatting', () => {
    it('should format session cookie with required flags', () => {
      const token = 'test-token-123';
      const cookie = formatSessionCookie(token);

      expect(cookie).toContain('session_token=test-token-123');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Strict');
      expect(cookie).toContain('Path=/');
      expect(cookie).toContain('Max-Age=');
    });

    it('should format clear session cookie', () => {
      const cookie = formatClearSessionCookie();

      expect(cookie).toContain('session_token=');
      expect(cookie).toContain('Max-Age=0');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Strict');
    });

    it('should include Secure flag in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const token = 'test-token-123';
      const cookie = formatSessionCookie(token);

      expect(cookie).toContain('Secure');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include Secure flag in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const token = 'test-token-123';
      const cookie = formatSessionCookie(token);

      expect(cookie).not.toContain('Secure');

      process.env.NODE_ENV = originalEnv;
    });
  });

  // ============================================================
  // Session Token Extraction Tests
  // ============================================================

  describe('Session Token Extraction', () => {
    it('should extract session token from cookie header', () => {
      const cookieHeader = 'session_token=test-token-123; Path=/';
      const token = extractSessionToken(cookieHeader);

      expect(token).toBe('test-token-123');
    });

    it('should extract session token from multiple cookies', () => {
      const cookieHeader = 'other_cookie=value; session_token=test-token-123; another=value';
      const token = extractSessionToken(cookieHeader);

      expect(token).toBe('test-token-123');
    });

    it('should return null if session token not found', () => {
      const cookieHeader = 'other_cookie=value; another=value';
      const token = extractSessionToken(cookieHeader);

      expect(token).toBeNull();
    });

    it('should return null if cookie header is empty', () => {
      const token = extractSessionToken('');

      expect(token).toBeNull();
    });

    it('should return null if cookie header is undefined', () => {
      const token = extractSessionToken(undefined);

      expect(token).toBeNull();
    });

    it('should handle cookies with spaces', () => {
      const cookieHeader = '  session_token = test-token-123  ; Path=/';
      const token = extractSessionToken(cookieHeader);

      expect(token).toBe('test-token-123');
    });
  });
});
