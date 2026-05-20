/**
 * Cache Invalidation Tests
 */

import {
  handleContentChange,
  queueRevalidation,
  clearPendingRevalidations,
  getPendingRevalidations,
  ContentChangeEvent
} from './cache-invalidation';

// Mock fetch
global.fetch = jest.fn();

describe('Cache Invalidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearPendingRevalidations();
  });

  afterEach(() => {
    clearPendingRevalidations();
  });

  describe('queueRevalidation', () => {
    it('should queue a revalidation', () => {
      queueRevalidation('profile', 0); // 0 delay for testing

      const pending = getPendingRevalidations();
      expect(pending).toContain('profile');
    });

    it('should batch multiple revalidations', (done) => {
      queueRevalidation('profile', 100);
      queueRevalidation('tech-stack', 100);
      queueRevalidation('projects', 100);

      setTimeout(() => {
        const pending = getPendingRevalidations();
        expect(pending.length).toBe(0); // Should be cleared after batch
        done();
      }, 150);
    });

    it('should debounce revalidations', (done) => {
      queueRevalidation('profile', 100);

      setTimeout(() => {
        queueRevalidation('profile', 100); // Queue again
      }, 50);

      setTimeout(() => {
        const pending = getPendingRevalidations();
        expect(pending).toContain('profile');
        done();
      }, 120);
    });
  });

  describe('handleContentChange', () => {
    it('should handle profile changes', () => {
      const event: ContentChangeEvent = {
        type: 'UPDATE',
        table: 'profiles',
        record: { id: '1', name: 'Test' },
        timestamp: Date.now()
      };

      handleContentChange(event);

      const pending = getPendingRevalidations();
      expect(pending).toContain('profile');
      expect(pending).toContain('main');
    });

    it('should handle tech stack changes', () => {
      const event: ContentChangeEvent = {
        type: 'INSERT',
        table: 'tech_stack',
        record: { id: '1', name: 'React' },
        timestamp: Date.now()
      };

      handleContentChange(event);

      const pending = getPendingRevalidations();
      expect(pending).toContain('tech-stack');
    });

    it('should handle project changes', () => {
      const event: ContentChangeEvent = {
        type: 'DELETE',
        table: 'projects',
        record: { id: '1' },
        timestamp: Date.now()
      };

      handleContentChange(event);

      const pending = getPendingRevalidations();
      expect(pending).toContain('projects');
    });
  });

  describe('clearPendingRevalidations', () => {
    it('should clear all pending revalidations', () => {
      queueRevalidation('profile', 0);
      queueRevalidation('projects', 0);

      expect(getPendingRevalidations().length).toBeGreaterThan(0);

      clearPendingRevalidations();

      expect(getPendingRevalidations().length).toBe(0);
    });
  });
});
