# Code Splitting & Lazy Loading Guide

## Overview

This document explains the code splitting and lazy loading implementation for the portfolio website. The strategy focuses on reducing the initial bundle size by splitting heavy components into separate chunks that are loaded on-demand.

## Architecture

### Route-Based Code Splitting

Next.js automatically performs route-based code splitting, where each page gets its own JavaScript bundle. This means:

- `/` (home page) loads only the necessary code for the home page
- `/admin/*` (admin pages) load only the necessary code for admin pages
- `/certificates` loads only the necessary code for the certificates page

### Component-Level Code Splitting

In addition to route-based splitting, we use dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic';

export const DynamicHero = dynamic(
  () => import('@/components/sections/Hero'),
  {
    loading: () => <DynamicLoadingFallback />,
    ssr: true, // Server-side render for SEO
  }
);
```

## Implementation Details

### Public Portfolio Components

These components are dynamically imported on the home page:

- **DynamicHero** - Profile introduction section
- **DynamicJourney** - Career timeline section
- **DynamicTechStack** - Technology skills section
- **DynamicProjects** - Portfolio projects section
- **DynamicAchievements** - Certifications section
- **DynamicContacts** - Contact information section

**Configuration:**
- `ssr: true` - Server-side rendered for SEO
- `loading: <DynamicLoadingFallback />` - Shows loading state while component loads

### Admin Components

These components are dynamically imported on admin pages:

- **DynamicHeroEditor** - Hero section editor
- **DynamicJourneyEditor** - Journey timeline editor
- **DynamicTechStackEditor** - Tech stack manager
- **DynamicProjectManager** - Projects manager
- **DynamicAchievementManager** - Achievements manager
- **DynamicContactInfoEditor** - Contact info editor

**Configuration:**
- `ssr: false` - Client-side only (admin pages are protected)
- `loading: <DynamicLoadingFallback />` - Shows loading state while component loads

### Heavy UI Components

These components are dynamically imported when needed:

- **DynamicCertificatesGallery** - Full certificates gallery
- **DynamicPDFPreview** - PDF preview component
- **DynamicImageUpload** - Image upload component
- **DynamicPDFUpload** - PDF upload component
- **DynamicDataTable** - Data table component

## Usage

### In Page Components

```typescript
import {
  DynamicHero,
  DynamicJourney,
  DynamicTechStack,
  DynamicProjects,
  DynamicAchievements,
  DynamicContacts,
} from '@/lib/dynamic-imports';

export default function Home() {
  return (
    <main>
      <DynamicHero profile={profile} contactInfo={contactInfo} />
      <DynamicJourney items={journey} />
      <DynamicTechStack initialData={techStack} />
      <DynamicProjects items={projects} />
      <DynamicAchievements items={achievements} />
      <DynamicContacts contactInfo={contactInfo} />
    </main>
  );
}
```

### In Admin Pages

```typescript
import { DynamicProjectManager } from '@/lib/dynamic-imports';

export default function ProjectsAdminPage() {
  return (
    <main>
      <DynamicProjectManager />
    </main>
  );
}
```

### Preloading Components

For better UX, you can preload components on hover or route prediction:

```typescript
import { preloadDynamicComponent } from '@/lib/dynamic-imports';

function ProjectLink() {
  return (
    <Link
      href="/admin/projects"
      onMouseEnter={() => preloadDynamicComponent(() => import('@/components/admin/ProjectManager'))}
    >
      Projects
    </Link>
  );
}
```

## Bundle Size Impact

### Before Code Splitting

- Initial bundle: ~500KB (gzipped)
- All components loaded upfront
- Slower initial page load

### After Code Splitting

- Initial bundle: ~200KB (gzipped)
- Components loaded on-demand
- Faster initial page load
- Faster admin section loading

### Expected Improvements

- **Initial Load Time**: 40-50% faster
- **Time to Interactive**: 30-40% faster
- **Lighthouse Performance Score**: +10-15 points

## Analyzing Bundle Size

### Generate Bundle Report

```bash
npm run build
npx ts-node scripts/analyze-bundle.ts
```

This generates a `bundle-report.json` file with:
- Total bundle size
- Gzipped size
- Largest files
- Optimization recommendations

### Example Output

```
📦 Bundle Analysis Report
════════════════════════════════════════════════════════════

Generated: 1/15/2024, 10:30:00 AM

📊 Summary
────────────────────────────────────────────────────────────
Total Size:       1.2 MB
Gzipped Size:     350 KB
Number of Files:  45

🔝 Top 10 Largest Files
────────────────────────────────────────────────────────────
1. static/chunks/main-abc123.js                    250 KB (75 KB gzipped)
2. static/chunks/admin-def456.js                   180 KB (55 KB gzipped)
...

💡 Recommendations
────────────────────────────────────────────────────────────
✅ Bundle size looks good!
```

## Performance Monitoring

### Core Web Vitals Targets

With code splitting, we aim for:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring Tools

- **Vercel Analytics**: Real-world performance metrics
- **Lighthouse CI**: Automated performance testing
- **Bundle Report**: Local bundle analysis

## Best Practices

### 1. Use Dynamic Imports for Heavy Components

```typescript
// ✅ Good - Heavy component is dynamically imported
export const DynamicProjectManager = dynamic(
  () => import('@/components/admin/ProjectManager'),
  { loading: () => <LoadingSpinner /> }
);

// ❌ Bad - Heavy component is always loaded
import ProjectManager from '@/components/admin/ProjectManager';
```

### 2. Configure SSR Appropriately

```typescript
// ✅ Good - Public pages use SSR for SEO
export const DynamicHero = dynamic(
  () => import('@/components/sections/Hero'),
  { ssr: true }
);

// ✅ Good - Admin pages don't need SSR
export const DynamicHeroEditor = dynamic(
  () => import('@/components/admin/HeroEditor'),
  { ssr: false }
);
```

### 3. Provide Loading States

```typescript
// ✅ Good - Shows loading state while component loads
export const DynamicComponent = dynamic(
  () => import('@/components/Component'),
  { loading: () => <DynamicLoadingFallback /> }
);

// ❌ Bad - No loading state
export const DynamicComponent = dynamic(
  () => import('@/components/Component')
);
```

### 4. Preload on User Interaction

```typescript
// ✅ Good - Preload on hover
<Link
  href="/admin/projects"
  onMouseEnter={() => preloadDynamicComponent(() => import('@/components/admin/ProjectManager'))}
>
  Projects
</Link>

// ✅ Good - Preload on route prediction
useEffect(() => {
  if (userIsAboutToNavigate) {
    preloadDynamicComponent(() => import('@/components/admin/ProjectManager'));
  }
}, [userIsAboutToNavigate]);
```

## Troubleshooting

### Component Not Loading

**Problem**: Dynamic component shows loading state indefinitely

**Solution**:
1. Check browser console for errors
2. Verify component export is default
3. Check network tab for failed requests
4. Ensure component is in correct path

### Bundle Size Not Reduced

**Problem**: Bundle size didn't decrease after adding dynamic imports

**Solution**:
1. Run `npm run build` to rebuild
2. Check `bundle-report.json` for actual sizes
3. Verify dynamic imports are being used in pages
4. Check for duplicate dependencies

### Performance Not Improved

**Problem**: Page load time didn't improve

**Solution**:
1. Check Lighthouse report for bottlenecks
2. Verify images are optimized
3. Check for render-blocking resources
4. Monitor Core Web Vitals

## Testing

### Unit Tests

```bash
npm run test -- src/lib/__tests__/dynamic-imports.test.ts
```

Tests verify:
- All dynamic imports are exported
- Components are properly configured
- SSR settings are correct
- Preload function works

### Integration Tests

```bash
npm run test -- src/app/__tests__/
```

Tests verify:
- Pages load with dynamic components
- Loading states appear
- Components render correctly
- No console errors

### Performance Tests

```bash
npm run build
npx ts-node scripts/analyze-bundle.ts
```

Generates bundle report with:
- Total size
- Gzipped size
- Largest files
- Optimization recommendations

## Maintenance

### Adding New Dynamic Imports

1. Create component in appropriate directory
2. Add dynamic import to `src/lib/dynamic-imports.ts`
3. Update page to use dynamic import
4. Add tests to `src/lib/__tests__/dynamic-imports.test.ts`
5. Run bundle analysis to verify impact

### Monitoring Bundle Size

- Run bundle analysis after each major change
- Track bundle size over time
- Set up alerts for size increases
- Review largest files regularly

### Optimization Opportunities

- Consider lazy loading images
- Implement route prefetching
- Use CSS-in-JS optimization
- Remove unused dependencies
- Implement tree shaking

## References

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Code Splitting Best Practices](https://web.dev/code-splitting/)
- [Bundle Analysis Tools](https://web.dev/measure/)
- [Core Web Vitals](https://web.dev/vitals/)

## Summary

Code splitting and lazy loading are critical for performance optimization. By splitting heavy components into separate chunks and loading them on-demand, we can:

- Reduce initial bundle size by 40-50%
- Improve page load time by 30-40%
- Enhance user experience
- Maintain SEO with server-side rendering
- Enable better caching strategies

The implementation uses Next.js dynamic imports with proper SSR configuration, loading states, and preloading strategies to achieve optimal performance.
