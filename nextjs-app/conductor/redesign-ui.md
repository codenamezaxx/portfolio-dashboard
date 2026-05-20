# Plan: UI Redesign (PostHog-Inspired)

Redesign all UI components, especially the admin dashboard, to align with the PostHog-inspired aesthetics defined in `DESIGN.md`.

## 1. Foundation: Styles and Configuration

### Update `src/app/globals.css`
- Replace Mastercard variables with PostHog tokens.
- **Colors:**
  - `--background`: `#eeefe9` (Canvas Cream)
  - `--surface-soft`: `#e5e7e0`
  - `--surface-card`: `#ffffff`
  - `--surface-doc`: `#fcfcfa`
  - `--surface-dark`: `#23251d`
  - `--primary`: `#f7a501` (Yellow-Orange)
  - `--primary-pressed`: `#dd9001`
  - `--foreground`: `#23251d` (Ink Black)
  - `--body`: `#4d4f46` (Olive-Gray)
  - `--mute`: `#6c6e63`
  - `--ash`: `#9b9c92`
  - `--hairline`: `#bfc1b7`
  - `--hairline-soft`: `#dcdfd2`
- **Radii:**
  - `--radius-xs`: `2px`
  - `--radius-sm`: `4px`
  - `--radius-md`: `6px`
  - `--radius-lg`: `8px`
  - `--radius-full`: `9999px`
- **Typography:** Set up IBM Plex Sans as the primary font.

### Update `src/app/layout.tsx`
- Replace `Sofia_Sans` with `IBM_Plex_Sans` from `next/font/google`.
- Update body classes.

## 2. Layout & Core Components

### Redesign `src/components/admin/Sidebar.tsx`
- Width: `240px`
- Background: `{colors.canvas}`
- Style: Sticky, rounded outline icons for section headers.
- Items: Use `{typography.body-xs}` and `{colors.body}`.

### Redesign `src/app/admin/layout.tsx`
- Header: `{colors.canvas}` background, remove `var(--surface)`.
- Main: `{colors.canvas}` background.
- Spacing: Implement `{spacing.section}` (80px) rhythm where appropriate.

### Redesign `src/components/layout/Navbar.tsx` & `Footer.tsx`
- Navbar: `{colors.canvas}` background, yellow primary pill CTA.
- Footer: `{colors.canvas}` background, `{colors.hairline}` top rule, `{typography.body-xs}`.

## 3. UI Components (Standardization)

### Create/Update Shared UI (if needed)
- If components like `Button`, `Input`, `Card` are shared, update them.
- Otherwise, apply styles in-place or create utility classes in `globals.css`.

## 4. Admin Dashboard Redesign

### Redesign Widgets and Forms
- `src/components/admin/StatisticsWidget.tsx`: Flat white cards (`surface-card`), 1px `hairline` border, 6px radius. Remove gradients.
- `src/components/admin/ProjectForm.tsx`, `ProfileForm.tsx`, etc.:
  - Inputs: White background, 1px `hairline` border, 6px radius.
  - Primary Buttons: Yellow-orange fill, deep olive text.
  - Secondary Buttons: Soft surface fill, ink text.

## 5. Verification
- Manual verification of key pages (Dashboard, Projects, Profile).
- Ensure responsiveness (mobile hamburger menu, grid collapsing).
- Run tests: `npm test`.

