# Real-Time Content Updates System

## Overview

The real-time content updates system enables the portfolio to automatically reflect changes made in the admin panel within 5 seconds. It uses Supabase real-time subscriptions, cache invalidation, and ISR revalidation to keep the public portfolio synchronized with the database.

## Architecture

### Components

1. **Real-time Subscriptions** (`lib/realtime.ts`)
   - Subscribes to Supabase database changes
   - Detects INSERT, UPDATE, DELETE operations
   - Triggers callbacks when content changes

2. **Cache Invalidation** (`lib/cache-invalidation.ts`)
   - Handles ISR revalidation
   - Batches revalidation requests with debouncing
   - Prevents excessive revalidation calls

3. **Notification System** (`lib/notifications.ts`)
   - Notifies users of content updates
   - Provides success, error, warning, and info notifications
   - Maintains notification history

4. **React Hooks** (`lib/useRealtimeUpdates.ts`)
   - `useRealtimeUpdates()` - Subscribe to all changes
   - `useTableUpdates()` - Subscribe to specific table
   - `useMultipleTableUpdates()` - Subscribe to multiple tables

5. **Providers** (`components/providers/`)
   - `RealtimeProvider` - Wraps app with real-time functionality
   - `NotificationProvider` - Manages notification state

6. **UI Components** (`components/ui/`)
   - `NotificationContainer` - Displays notifications to user

## How It Works

### 1. Content Change Detection

When content is updated in the admin panel:

```typescript
// Admin updates a project
await supabase
  .from('projects')
  .update({ title: 'New Title' })
  .eq('id', projectId);
```

Supabase real-time subscriptions detect this change and trigger callbacks.

### 2. Cache Invalidation

The change triggers cache invalidation:

```typescript
// Real-time listener detects change
subscribeToTableChanges('projects', (event) => {
  // Invalidate cache
  handleContentChange(event);
  
  // Notify user
  notifyContentChange(event);
});
```

### 3. ISR Revalidation

The cache invalidation queues an ISR revalidation:

```typescript
// Queue revalidation with debouncing (1 second)
queueRevalidation('projects', 1000);

// After 1 second, batch revalidate
POST /api/revalidate
{
  "tags": ["projects", "main"]
}
```

### 4. Page Refresh

Next.js ISR revalidates the static pages:

```typescript
// In page.tsx
export const revalidate = 3600; // Revalidate every hour

// Or on-demand via API
revalidateTag('projects');
```

### 5. User Notification

Users see a notification about the update:

```
ℹ️ Projects updated
Projects content has been updated. The page will refresh shortly.
```

## Usage

### In Components

#### Subscribe to All Changes

```typescript
'use client';

import { useRealtimeUpdates } from '@/lib/useRealtimeUpdates';

export function MyComponent() {
  // Subscribe to all content changes
  useRealtimeUpdates();

  return <div>Content will auto-update</div>;
}
```

#### Subscribe to Specific Table

```typescript
'use client';

import { useTableUpdates } from '@/lib/useRealtimeUpdates';

export function ProjectsList() {
  // Subscribe only to project changes
  useTableUpdates('projects', (event) => {
    console.log('Projects updated:', event);
  });

  return <div>Projects list</div>;
}
```

#### Subscribe to Multiple Tables

```typescript
'use client';

import { useMultipleTableUpdates } from '@/lib/useRealtimeUpdates';

export function Dashboard() {
  // Subscribe to multiple tables
  useMultipleTableUpdates(['projects', 'achievements'], (event) => {
    console.log('Content updated:', event);
  });

  return <div>Dashboard</div>;
}
```

### Manual Notifications

```typescript
import { notify, notifyUpdateSuccess, notifyError } from '@/lib/notifications';

// Success notification
notifyUpdateSuccess('Project');

// Error notification
notifyError('Update Failed', 'Could not update project');

// Custom notification
notify('info', 'Title', 'Message', 5000); // 5 second duration
```

### Manual Cache Invalidation

```typescript
import { revalidateTag, invalidateCacheImmediate } from '@/lib/cache-invalidation';

// Revalidate specific tag
await revalidateTag('projects');

// Immediately invalidate without debouncing
await invalidateCacheImmediate('projects');
```

## Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
REVALIDATE_SECRET=your_secret_token
```

### Revalidation Delay

Adjust debouncing delay in `cache-invalidation.ts`:

```typescript
// Default: 1000ms (1 second)
queueRevalidation(tag, 1000);
```

### Notification Duration

Adjust notification display time:

```typescript
// Default: 5000ms (5 seconds)
notify('info', 'Title', 'Message', 5000);
```

## Performance Considerations

### Debouncing

Multiple changes within 1 second are batched into a single revalidation request:

```
Change 1 → Queue revalidation
Change 2 → Add to queue (within 1s)
Change 3 → Add to queue (within 1s)
After 1s → Batch revalidate all 3 changes
```

### Subscription Management

Subscriptions are automatically cleaned up when components unmount:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToTableChanges('projects', callback);
  
  return () => {
    unsubscribe(); // Cleanup on unmount
  };
}, []);
```

### ISR Revalidation

Pages are revalidated on-demand, not on every change:

```typescript
// Page revalidates every hour or on-demand
export const revalidate = 3600;

// Or use dynamic revalidation
revalidateTag('projects');
```

## Testing

### Unit Tests

```bash
npm run test -- realtime.test.ts
npm run test -- cache-invalidation.test.ts
npm run test -- notifications.test.ts
```

### Integration Tests

Test real-time updates with actual Supabase:

```typescript
// Create a test project
const { data: project } = await supabase
  .from('projects')
  .insert({ title: 'Test Project' });

// Wait for real-time update
await new Promise(resolve => setTimeout(resolve, 2000));

// Verify cache was invalidated
expect(revalidationCalled).toBe(true);
```

### E2E Tests

Test full flow from admin update to public page refresh:

```typescript
// 1. Admin updates project
await adminPage.updateProject('New Title');

// 2. Wait for notification
await expect(page.locator('[role="alert"]')).toBeVisible();

// 3. Verify public page updated
await publicPage.goto('/');
await expect(page.locator('text=New Title')).toBeVisible();
```

## Troubleshooting

### Real-time Subscriptions Not Working

1. Check Supabase credentials in `.env.local`
2. Verify RLS policies allow read access
3. Check browser console for errors
4. Verify Supabase real-time is enabled

### Cache Not Invalidating

1. Check `REVALIDATE_SECRET` is set correctly
2. Verify `/api/revalidate` endpoint is accessible
3. Check Next.js build includes revalidation tags
4. Review ISR configuration in page components

### Notifications Not Showing

1. Verify `NotificationProvider` wraps app
2. Check `NotificationContainer` is rendered
3. Verify notification listeners are registered
4. Check browser console for errors

## Future Enhancements

1. **Optimistic Updates** - Update UI before server confirmation
2. **Conflict Resolution** - Handle concurrent edits
3. **Offline Support** - Queue changes when offline
4. **Analytics** - Track update frequency and performance
5. **Webhooks** - Trigger external services on updates
6. **Audit Trail** - Log all content changes with user info

## References

- [Supabase Real-time Documentation](https://supabase.com/docs/guides/realtime)
- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Next.js Cache Tags](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
