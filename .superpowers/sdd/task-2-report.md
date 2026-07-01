# Task 2: CertificatesGallery — Cartesian Restyle

## Summary
CSS-only restyle of `src/components/sections/CertificatesGallery.tsx` to Cartesian editorial aesthetic. All `Button`, `Badge`, and `Card` components replaced with native HTML elements. All rounded corners, shadows, backdrop-blur, and hover transforms removed.

## Changes Applied

### Imports
- Removed `Badge` import (`@/components/ui/Badge`)
- Removed `Button` import (`@/components/ui/Button`)
- Removed `Card` import (`@/components/ui/Card`)

### Filter/Search Panel
- Container: `mb-12 p-6 border border-line bg-surface-card space-y-6` (flat, no rounded/blur/shadow)
- Search input: `pl-12 h-12 bg-surface-soft border border-line text-sm` (no hover/focus transitions)
- Category filter buttons: flat `px-4 py-2 text-sm border border-line` with `bg-primary text-background` active state

### Active Filter Badges
- Replaced `<Badge variant="accent">` with `<span>` using `bg-primary/10 border border-[var(--primary)]/20 px-2 py-0.5 text-xs`

### Certificate Cards
- Wrapper: `<Card>` → `<div>` with `border border-line bg-surface-card`
- Top banner: `h-20 bg-surface-soft border-b border-line` (gradient overlay removed entirely)
- Icon container: `w-10 h-10 bg-primary/10 flex items-center justify-center text-primary`
- Content padding: `p-5`
- Category badge: `<Badge>` → `<span>` with `border border-[var(--primary)]/20`
- Title: `text-lg font-medium text-ink line-clamp-2`
- Year badge: `text-[10px] font-sans px-2 py-0.5 bg-surface-soft text-mute border border-line`
- Issuer text: `text-sm text-mute mb-5 line-clamp-1` with `style={{fontFamily: "'Inter', sans-serif"}}`
- Action divider: `gap-2 pt-4 border-t border-line`

### Card Action Buttons
- Preview: `<button>` with `flex-1 px-3 py-2 border border-line bg-primary/10 text-ink text-sm hover:bg-primary/20`
- Download/External: `<button>` with `w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20`

### Results Count
- `mb-4 text-sm text-mute font-sans`

### Pagination
- Container: `gap-2 mt-12 p-3 border border-line w-fit mx-auto`
- Page buttons: `w-9 h-9 text-sm border border-line` with `bg-primary text-background` active state
- Prev/Next: `<button>` with `w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20`

### Empty State & Modal Buttons
- All remaining `<Button>` instances replaced with native `<button>` using flat Cartesian classes

## Verification
- `npm run type-check`: No errors in `CertificatesGallery.tsx` — all 16 pre-existing errors are in `src/app/api/portfolio/contact-info/route.test.ts` (unrelated)
- `npm run build`: Not run (task specification only requested type-check)

## Concerns
- Pre-existing type errors in `contact-info/route.test.ts` (16 errors, vitest matchers not recognized by tsc)
- No functional changes — pure CSS restyle
