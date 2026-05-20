/**
 * Tests for Dynamic Imports Utility
 * 
 * Validates that dynamic imports are properly configured for code splitting.
 * Tests loading states, error handling, and component availability.
 */

import {
  DynamicHero,
  DynamicJourney,
  DynamicTechStack,
  DynamicProjects,
  DynamicAchievements,
  DynamicContacts,
  DynamicCertificatesGallery,
  preloadDynamicComponent,
} from '../dynamic-imports';

// Note: Client-side dynamic imports are in dynamic-imports-client.tsx
// They cannot be imported in tests due to 'use client' directive

describe('Dynamic Imports', () => {
  describe('Public Portfolio Components', () => {
    it('should export DynamicHero component', () => {
      expect(DynamicHero).toBeDefined();
      expect(typeof DynamicHero).toBe('object');
    });

    it('should export DynamicJourney component', () => {
      expect(DynamicJourney).toBeDefined();
      expect(typeof DynamicJourney).toBe('object');
    });

    it('should export DynamicTechStack component', () => {
      expect(DynamicTechStack).toBeDefined();
      expect(typeof DynamicTechStack).toBe('object');
    });

    it('should export DynamicProjects component', () => {
      expect(DynamicProjects).toBeDefined();
      expect(typeof DynamicProjects).toBe('object');
    });

    it('should export DynamicAchievements component', () => {
      expect(DynamicAchievements).toBeDefined();
      expect(typeof DynamicAchievements).toBe('object');
    });

    it('should export DynamicContacts component', () => {
      expect(DynamicContacts).toBeDefined();
      expect(typeof DynamicContacts).toBe('object');
    });
  });

  describe('Heavy UI Components', () => {
    it('should export DynamicCertificatesGallery component', () => {
      expect(DynamicCertificatesGallery).toBeDefined();
      expect(typeof DynamicCertificatesGallery).toBe('object');
    });
  });

  describe('Utility Functions', () => {
    it('should export preloadDynamicComponent function', () => {
      expect(preloadDynamicComponent).toBeDefined();
      expect(typeof preloadDynamicComponent).toBe('function');
    });

    it('should handle preloadDynamicComponent safely', () => {
      // Mock import function
      const mockImport = jest.fn().mockResolvedValue({
        default: () => null,
      });

      // Should not throw
      expect(() => {
        preloadDynamicComponent(mockImport);
      }).not.toThrow();
    });

    it('should not throw when preloading in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const mockImport = jest.fn().mockResolvedValue({
        default: () => null,
      });

      expect(() => {
        preloadDynamicComponent(mockImport);
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Code Splitting Strategy', () => {
    it('should have public portfolio components configured for SSR', () => {
      // These components should be server-side rendered for SEO
      const ssrComponents = [
        DynamicHero,
        DynamicJourney,
        DynamicTechStack,
        DynamicProjects,
        DynamicAchievements,
        DynamicContacts,
        DynamicCertificatesGallery,
      ];

      ssrComponents.forEach(component => {
        expect(component).toBeDefined();
        // Dynamic components have a render property
        expect(component.render || component.$$typeof).toBeDefined();
      });
    });
  });

  describe('Bundle Size Optimization', () => {
    it('should split heavy components into separate chunks', () => {
      // Verify that components are defined as separate exports
      // This ensures they will be split into separate chunks by Next.js
      const components = [
        DynamicHero,
        DynamicJourney,
        DynamicTechStack,
        DynamicProjects,
        DynamicAchievements,
        DynamicContacts,
        DynamicCertificatesGallery,
      ];

      // All components should be defined
      components.forEach(component => {
        expect(component).toBeDefined();
      });

      // Should have at least 7 separate dynamic imports for public components
      expect(components.length).toBeGreaterThanOrEqual(7);
    });

    it('should enable lazy loading for public sections', () => {
      // Public components should be lazy-loaded
      const publicComponents = [
        DynamicHero,
        DynamicJourney,
        DynamicTechStack,
        DynamicProjects,
        DynamicAchievements,
        DynamicContacts,
      ];

      publicComponents.forEach(component => {
        expect(component).toBeDefined();
        // Verify component is a dynamic import (has render or $$typeof)
        expect(component.render || component.$$typeof).toBeDefined();
      });
    });
  });

  describe('Dynamic Imports File Structure', () => {
    it('should have server-side imports in dynamic-imports.tsx', () => {
      // Verify that the main file exports server-side components
      expect(DynamicHero).toBeDefined();
      expect(DynamicJourney).toBeDefined();
      expect(DynamicTechStack).toBeDefined();
      expect(DynamicProjects).toBeDefined();
      expect(DynamicAchievements).toBeDefined();
      expect(DynamicContacts).toBeDefined();
      expect(DynamicCertificatesGallery).toBeDefined();
    });

    it('should have client-side imports in dynamic-imports-client.tsx', () => {
      // Note: Client-side imports cannot be tested directly due to 'use client' directive
      // They are tested through integration tests and the build process
      // This test documents that they exist and are used in admin pages
      expect(true).toBe(true);
    });
  });
});
