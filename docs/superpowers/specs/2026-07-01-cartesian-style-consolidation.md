# Cartesian Style Consolidation

## Goal

Bring FloatingChatButton, CertificatesGallery, ProjectCard, `/projects`, `/projects/[id]`, and admin panel into visual consistency with the Cartesian editorial style already applied to Hero, Journey, TechStack, Projects section, Achievements, and Contacts.

## Cartesian Design Rules (existing)

- **Flat surfaces** — no rounded corners (`rounded-*` forbidden)
- **Borders** — `border border-line` (taupe hairline)
- **Backgrounds** — `bg-surface-card` (white overlay), `bg-surface-soft` (soft warm stone)
- **Accent** — `--primary: #c27508` gold, via `text-accent`, `bg-primary/10`, `border-[var(--primary)]/20`
- **Typography** — serif display (`--font-display`) for headers, Inter for body
- **Shadows** — none (`shadow-*` forbidden)
- **Backdrop blur** — none (`backdrop-blur-*` forbidden)
- **Hover effects** — `hover:bg-white/20` or `hover:opacity-*` only; no `scale`, `translateY`, `rotate`
- **Transitions** — linear 400ms on desktop only (inherited from global CSS)

## Files to Modify

| File | Change scope |
|---|---|
| `src/components/shared/FloatingChatButton.tsx` | Full restyle |
| `src/components/sections/CertificatesGallery.tsx` | Full restyle |
| `src/components/ui/ProjectCard.tsx` | Restyle |
| `src/app/projects/page.tsx` | Minor class cleanup |
| `src/app/projects/[id]/page.tsx` | Restyle |
| `src/app/admin/layout.tsx` | Class cleanup |
| `src/components/admin/Sidebar.tsx` | Class cleanup |
| `src/app/admin/page.tsx` | Class cleanup |
| `src/app/admin/*/page.tsx` (subpages) | Class cleanup |

## Specific Changes Per File

### FloatingChatButton
- Replace colored icon circles (`bg-blue-500`, `bg-pink-500`, `bg-cyan-500`, `bg-blue-700`, `rounded-full`) with taupe link labels + gold accent icon
- Main button: `bg-primary` tetap, but no shadow, no rounded-full — use the section's button style (border-line, inline-flex)
- Remove `shadow-lg` on button
- Tooltip: adjust to flat, no rounded corners

### CertificatesGallery
- Filter/search panel: remove `rounded-3xl`, `backdrop-blur-md`, `shadow-soft-light`, `shadow-soft-dark`
  → flat `border border-line bg-surface-card p-6`
- Category buttons: remove `rounded-xl`, `rounded-md` → flat `px-4 py-2 border border-line`
- Cards: remove `rounded-2xl`, `shadow-xl`, `shadow-lg`, `shadow-primary/20`, `hover:scale-[1.02]`, `hover:-translate-y-2`, `rounded-lg`
  → flat `border border-line bg-surface-card`
- Buttons inside cards: remove `rounded-xl`, `rounded-lg`, `shadow-lg`, `shadow-primary/20`, `hover:scale-[1.02]`
  → flat `border border-line px-4 py-2 text-sm`
- Pagination: remove `rounded-2xl`, `rounded-xl`, `shadow-soft-light`, `shadow-soft-dark`
  → flat `border border-line`

### ProjectCard
- Already has `border-line bg-surface-card` — good baseline
- Buttons: remove `rounded-xl`, `rounded-lg`, `shadow-*` → flat `border border-line`
- Badge: remove `rounded-lg` → flat
- Remove `hover:bg-white/30` if present

### /projects/page.tsx
- Back link: remove `rounded-full`, `backdrop-blur-sm` → flat `border border-line px-4 py-2`
- Category headings: clean up, no change needed

### /projects/[id]/page.tsx
- Hero image: gradient overlay (`bg-gradient-to-t from-background...`) — keep, it's editorial
- Back link: remove `rounded-full`, `backdrop-blur-sm` → flat
- Category badge: remove `rounded-lg` → flat
- Cards (technologies, links): remove `rounded-xl`, `rounded-2xl`, `shadow-xl`, `shadow-lg`, `border-white/5`, `shadow-primary/20`
  → flat `border border-line bg-surface-card p-6`
- Buttons: remove `rounded-xl`, `shadow-lg`, `shadow-primary/20`, `hover:scale-[1.02]`, `hover:rotate-12`
  → flat `border border-line px-4 py-2`
- Prev/Next nav: remove `rounded-xl`, `shadow-*` → flat

### Admin Panel
- Layout header: remove `shadow-sm`, keep border-b
- Sidebar: remove `rounded-md`, `rounded-xl`, `shadow-sm` → flat
- Dashboard cards (StatisticsWidget, Quick Actions, Recent Activity): 
  - remove `rounded-xl`, `rounded-lg`, `shadow-md`, `shadow-lg`, `shadow-soft-light`, `shadow-soft-dark`, `shadow-primary/20`
  - `rounded-lg` on icon containers → flat
  - `rounded-xl` on stat widgets → flat
  - `backdrop-blur-sm` → remove
  - → flat `border border-line bg-surface-card p-5`
- Subpages: follow same pattern — all `rounded-*` → flat, all `shadow-*` → remove, use `border-line`

## Non-Goals
- No logic changes (data fetching, state, handlers all preserved)
- No layout changes (grid, flex, spacing preserved)
- No color changes beyond what's needed for Cartesian consistency

## Files NOT Modified
- Section components already Cartesian (Hero, Journey, TechStack, Projects section, Achievements, Contacts)
- UI primitives (Button, Badge, Card, TextInput, Modal) — they may be used elsewhere; keep as-is unless they're only used in these pages
