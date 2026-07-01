# Cartesian Style Consolidation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make FloatingChatButton, CertificatesGallery, ProjectCard, `/projects`, `/projects/[id]`, and admin panel visually consistent with the Cartesian editorial style.

**Architecture:** Pure CSS class changes — no logic, no layout, no behavior changes. Each task targets specific files and replaces rounded/shadow/blur/scale classes with flat Cartesian equivalents.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 4, Framer Motion, TypeScript

## Global Constraints

- No `rounded-*` classes (flat corners everywhere)
- No `shadow-*` classes (no shadows)
- No `backdrop-blur-*` classes (no blur)
- No hover scale/translate/rotate transforms (`hover:scale-*`, `hover:-translate-y-*`)
- Use `border border-line` for borders
- Use `bg-surface-card` for card backgrounds
- Use `bg-surface-soft` for soft backgrounds
- Use gold accent: `text-accent`, `bg-primary/10`, `border-[var(--primary)]/20`
- Use `px-4 py-2 border border-line text-sm` for button style
- Use `text-ink`, `text-body`, `text-mute`, `text-accent` for text colors
- All transitions inherited from global CSS (linear 400ms on desktop)
- No logic/behavior changes — preserve all event handlers, state, and data flow

---
### Task 1: FloatingChatButton

**Files:**
- Modify: `src/components/shared/FloatingChatButton.tsx`

**Interfaces:**
- Produces: Consistent floating contact button using Cartesian styles

- [ ] **Replace contact option colors and shape**

Replace each option's `bg-COLOR hover:bg-COLOR rounded-full` with `border border-line bg-surface-card hover:bg-white/20`.

Current:
```tsx
icon: <Mail className="w-6 h-6" />,
label: 'Email',
url: 'mailto:zakky.ahmad@protonmail.com',
bgColor: 'bg-blue-500',
hoverColor: 'hover:bg-blue-600',
```

Change to:
```tsx
icon: <Mail className="w-4 h-4" style={{color: 'var(--accent)'}} />,
label: 'Email',
url: 'mailto:zakky.ahmad@protonmail.com',
```

- [ ] **Update the contactOptions array** — remove `bgColor` and `hoverColor` fields from each entry. Keep only `id`, `icon`, `label`, `url`.

- [ ] **Update the option rendering** — replace:
```tsx
className={`w-16 h-16 ${option.bgColor} ${option.hoverColor} rounded-full flex items-center justify-center text-white shadow-lg relative`}
```
with:
```tsx
className="flex items-center gap-2 px-4 py-2 border border-line bg-surface-card hover:bg-white/20 text-ink"
```

- [ ] **Replace the icon rendering** inside the option to show icon + label side by side, not icon alone:
```tsx
<>
  {option.icon}
  <span className="text-sm" style={{fontFamily: "'Inter', sans-serif"}}>{option.label}</span>
</>
```

- [ ] **Update tooltip** — change from absolute positioned tooltip to nothing (label is already visible now)

- [ ] **Update main floating button** — replace:
```tsx
className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg bg-primary hover:bg-primary-pressed transition-all duration-200 cursor-pointer"
```
with:
```tsx
className="flex items-center gap-2 px-4 py-2 border border-line bg-primary text-background hover:bg-primary/80 cursor-pointer"
```

- [ ] **Remove motion variants** — simplify the container/item variants to remove scale animations

- [ ] **Move button** from `bottom-10 right-6` to `bottom-8 right-6` to sit with the section rhythm

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors (only pre-existing test file errors)

---
### Task 2: CertificatesGallery

**Files:**
- Modify: `src/components/sections/CertificatesGallery.tsx`

**Interfaces:**
- Consumes: Existing `Achievement` type, `Button`, `Badge`, `TextInput`, `Card`, `Modal`, `PDFPreview` components
- Produces: Flat Cartesian-styled certificates gallery

- [ ] **Filter/search panel** — replace:
```tsx
className="mb-12 p-8 bg-surface-card/30 backdrop-blur-md rounded-3xl border border-hairline/50 space-y-8 shadow-soft-light dark:shadow-soft-dark"
```
with:
```tsx
className="mb-12 p-6 border border-line bg-surface-card space-y-6"
```

- [ ] **Search input** — replace:
```tsx
className="pl-12 h-14 bg-surface-soft/50 border-hairline hover:border-primary/30 focus:border-primary transition-all duration-300 rounded-2xl"
```
with:
```tsx
className="pl-12 h-12 bg-surface-soft border border-line text-sm"
```

- [ ] **Category filter buttons** — replace each button's className:
From:
```tsx
className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
  filters.category === category
    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
    : 'bg-surface-soft/80 text-body border-hairline hover:border-primary/40 hover:bg-surface-soft hover:text-ink'
}`}
```
To:
```tsx
className={`px-4 py-2 text-sm border border-line ${
  filters.category === category
    ? 'bg-primary text-background'
    : 'bg-surface-soft text-body hover:bg-white/20'
}`}
```

- [ ] **Active filter badges** — replace:
From `className="flex items-center gap-2"` (Badge variant="accent") to just `className="flex items-center gap-2"` with flat inline styling.

- [ ] **Certificate cards** — replace:
From:
```tsx
className="group/cert h-full flex flex-col overflow-hidden border border-hairline shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 rounded-2xl animate-fadeIn"
```
To:
```tsx
className="group/cert h-full flex flex-col border border-line bg-surface-card"
```

- [ ] **Top banner area** — replace:
From `className="relative h-24 bg-surface-soft/30 border-b border-hairline/30 flex items-center justify-center overflow-hidden"`
To `className="relative h-20 bg-surface-soft border-b border-line flex items-center justify-center"`

- [ ] **Remove gradient overlay** in banner — delete the entire `<div className="absolute inset-0 opacity-10 group-hover/cert:opacity-20 transition-opacity">` block

- [ ] **Icon container** — replace:
From `className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover/cert:scale-110 group-hover/cert:rotate-3 transition-all duration-500 shadow-lg shadow-primary/5"`
To `className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary"`

- [ ] **Card content padding** — replace `className="p-8 flex flex-col flex-1"` with `className="p-5 flex flex-col flex-1"`

- [ ] **Category badge inside card** — replace:
From `className="bg-primary/10 text-primary border-primary/20 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2 inline-block"`
To `className="bg-primary/10 text-primary border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] mb-2 inline-block"`

- [ ] **Title in card** — replace:
From `className="text-xl font-black text-ink line-clamp-2 group-hover/cert:text-primary transition-colors leading-tight tracking-tight"`
To `className="text-lg font-medium text-ink line-clamp-2"`

- [ ] **Year badge** — replace:
From `className="flex-shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg bg-surface-soft text-mute border border-hairline shadow-sm"`
To `className="flex-shrink-0 text-[10px] font-sans px-2 py-0.5 bg-surface-soft text-mute border border-line"`

- [ ] **Issuer text** — replace:
From `className="text-sm font-bold text-mute/80 mb-8 line-clamp-1 italic"`
To `className="text-sm text-mute mb-5 line-clamp-1" style={{fontFamily: "'Inter', sans-serif"}}`

- [ ] **Card action buttons section** — replace divider:
From `className="mt-auto flex items-center gap-3 pt-6 border-t border-hairline/30"`
To `className="mt-auto flex items-center gap-2 pt-4 border-t border-line"`

- [ ] **Preview button** — replace:
From:
```tsx
<Button onClick={...} variant="primary" size="sm"
  className="flex-1 rounded-xl h-11 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" >
  <FileText className="w-4 h-4 mr-2" /> Preview
</Button>
```
To:
```tsx
<button onClick={...}
  className="flex-1 px-3 py-2 border border-line bg-primary/10 text-ink text-sm hover:bg-primary/20">
  <FileText className="w-4 h-4 inline-block mr-1.5" /> Preview
</button>
```

- [ ] **Icon buttons (download, external)** — replace each:
From `className="w-11 h-11 p-0 rounded-xl hover:bg-surface-soft transition-colors"`
To `className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20"` and set variant to "outline" or remove variant

- [ ] **Results count text** — replace:
From `className="mb-6 text-sm text-[var(--mute)]"`
To `className="mb-4 text-sm text-mute font-sans"`

- [ ] **Pagination container** — replace:
From:
```tsx
className="flex items-center justify-center gap-4 mt-16 p-4 bg-surface-card/20 backdrop-blur-md rounded-2xl border border-hairline/30 w-fit mx-auto shadow-soft-light dark:shadow-soft-dark"
```
To:
```tsx
className="flex items-center justify-center gap-2 mt-12 p-3 border border-line w-fit mx-auto"
```

- [ ] **Pagination buttons** — replace page number buttons:
From:
```tsx
className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
  pagination.currentPage === page
    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
    : 'bg-surface-soft/50 text-body border border-hairline hover:border-primary/40 hover:text-ink'
}`}
```
To:
```tsx
className={`w-9 h-9 text-sm border border-line ${
  pagination.currentPage === page
    ? 'bg-primary text-background'
    : 'bg-surface-soft text-body hover:bg-white/20'
}`}
```

- [ ] **Pagination prev/next buttons** — replace:
From `className="w-10 h-10 p-0 rounded-xl"` with variant="secondary"
To `className="w-9 h-9 p-0 border border-line bg-surface-soft text-accent hover:bg-white/20"` wrapped in a `<button>` directly

- [ ] **Remove unused imports** — after replacing `Button` usage with native `<button>`, check if Button is still used. If not, remove its import. Similarly for `shadow-soft-light` etc.

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 3: ProjectCard

**Files:**
- Modify: `src/components/ui/ProjectCard.tsx`

- [ ] **Remove category badge rounded** — replace:
From `className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line"`
(already flat, no change needed)

- [ ] **Tech tag styling** — replace:
From `className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line"`
(already flat, no change needed)

- [ ] **Action buttons** — replace each Button usage:
From `<Button variant="outline" className="!p-1.5 h-8 w-8 border border-line text-accent hover:bg-white/20">`
To `<button className="p-1.5 h-8 w-8 border border-line text-accent hover:bg-white/20">`

From `<Button variant="outline" className="px-3 py-1 text-xs font-medium cursor-pointer">`
To `<button className="px-3 py-1 text-xs font-medium border border-line bg-surface-soft hover:bg-white/20 cursor-pointer">`

From `<Button ... className="px-3 py-1 text-xs font-medium cursor-pointer border border-line bg-primary/10 text-ink hover:bg-primary/20">`
To `<button className="px-3 py-1 text-xs font-medium border border-line bg-primary/10 text-ink hover:bg-primary/20 cursor-pointer">`

- [ ] **Card bottom bar** — replace:
From `className="flex items-center gap-2 pt-3 mt-auto border-t border-hairline"`
To `className="flex items-center gap-2 pt-3 mt-auto border-t border-line"`

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 4: /projects page

**Files:**
- Modify: `src/app/projects/page.tsx`

- [ ] **Back link** — replace:
From `className="group inline-flex items-center gap-2 text-mute hover:text-primary transition-all duration-300 text-sm font-bold bg-surface-soft/50 backdrop-blur-sm px-4 py-2 rounded-full border border-hairline hover:border-primary/30"`
To `className="group inline-flex items-center gap-2 px-4 py-2 border border-line text-sm text-mute hover:bg-white/20"`

- [ ] **Category heading gradient** — replace:
From `className="h-px flex-1 bg-gradient-to-r from-hairline to-transparent"`
To `className="h-px flex-1 bg-line"` (or just keep the gradient if it looks editorial)

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 5: /projects/[id] detail page

**Files:**
- Modify: `src/app/projects/[id]/page.tsx`

- [ ] **Back link** — replace:
From `className="group inline-flex items-center gap-2 text-mute hover:text-primary transition-all duration-300 text-sm font-bold bg-surface-soft/50 backdrop-blur-sm px-4 py-2 rounded-full border border-hairline hover:border-primary/30"`
To `className="group inline-flex items-center gap-2 px-4 py-2 border border-line text-sm text-mute hover:bg-white/20"`

- [ ] **Category badge on hero** — replace:
From `className="bg-primary/10 text-primary border-primary/20 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3"`
To `className="bg-primary/10 text-primary border border-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] mb-3 inline-block"`

- [ ] **Technologies Card** — replace:
From `className="mb-12 p-8 border-white/5 shadow-xl"`
To `className="mb-8 p-6 border border-line bg-surface-card"`
And `className="text-lg font-black text-ink mb-6 tracking-tight"`
To `className="text-base font-medium text-ink mb-4"`

- [ ] **Tech badge** — replace each:
From `className="text-[10px] font-bold rounded-lg border-hairline bg-surface-soft/50 px-2.5 py-1 text-ink/80"`
To `className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-[2px] text-accent border border-line"`

- [ ] **Project Links Card** — replace:
From `className="mb-12 p-8 border-white/5 shadow-xl"`
To `className="mb-8 p-6 border border-line bg-surface-card"`
And heading from `className="text-lg font-black text-ink mb-6 tracking-tight"`
To `className="text-base font-medium text-ink mb-4"`

- [ ] **Link buttons** — replace each Button with native `<button>`:

GitHub button:
From `<Button variant="secondary" size="lg" className="rounded-xl h-12 px-6 font-bold hover:bg-surface-soft">`
To `<button className="px-4 py-2 border border-line text-sm text-accent hover:bg-white/20">`

Live Demo button:
From `<Button variant="primary" size="lg" className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95">`
To `<button className="px-4 py-2 border border-line bg-primary/10 text-ink text-sm hover:bg-primary/20">`

- [ ] **Remove icon hover rotations** — delete `group-hover/btn:rotate-12` from GitHub icon

- [ ] **Prev/Next navigation** — replace:
From `className="w-full justify-start gap-2 h-12 rounded-xl px-6 font-bold hover:bg-surface-soft"`
To `className="w-full px-4 py-3 border border-line text-sm text-accent hover:bg-white/20 text-left"`

- [ ] **Prev/Next divider** — replace:
From `className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 pt-8 border-t border-hairline/30"`
To `className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-6 border-t border-line"`

- [ ] **Remove unused imports** — check if `Button`, `Badge`, `Card`, `GithubIcon`, `Gamepad2` are still used after the changes. If they are only used in places now replaced with native elements or inline SVG, remove the import.

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 6: Admin Sidebar

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`

- [ ] **Navigation items** — replace active state:
From:
```tsx
className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium group
  ${active
    ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm'
    : 'text-[var(--body)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]'
  }
  ${isCollapsed ? 'justify-center px-0' : ''}`}
```
To:
```tsx
className={`flex items-center gap-3 px-3 py-2 text-sm
  ${active
    ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20'
    : 'text-[var(--body)] hover:bg-[var(--surface-soft)]'
  }
  ${isCollapsed ? 'justify-center px-0' : ''}`}
```

- [ ] **Remove rounded-md from mobile close button** — replace `className="md:hidden p-1 hover:bg-[var(--surface-soft)] rounded-md"`

- [ ] **Back to portfolio button** — replace:
From `className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-[var(--surface-soft)] hover:bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--hairline)] rounded-xl transition-colors text-md font-medium"`
To `className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-[var(--surface-soft)] text-[var(--ink)] border border-[var(--hairline)] text-sm"`
And remove the `isCollapsed` padding override.

- [ ] **Remove shadow transition icons** — replace `transition-transform duration-200` and icon scale effects with flat icons.

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 7: Admin Layout

**Files:**
- Modify: `src/app/admin/layout.tsx`

- [ ] **Header** — replace:
From `className="border-b border-hairline dark:border-hairline bg-[var(--surface-card)] shadow-sm sticky top-0 z-30"`
To `className="border-b border-[var(--line)] bg-[var(--surface-card)] sticky top-0 z-30"`

- [ ] **Mobile sidebar toggle** — replace:
From `className="flex md:hidden p-2 hover:bg-surface-soft dark:hover:bg-surface-soft rounded-md transition-colors text-mute hover:text-primary cursor-pointer"`
To `className="flex md:hidden p-2 hover:bg-surface-soft text-mute cursor-pointer"`

- [ ] **Desktop sidebar toggle** — replace similarly:
From `className="hidden md:flex p-2 hover:bg-surface-soft dark:hover:bg-surface-soft rounded-md transition-colors text-mute hover:text-primary cursor-pointer"`
To `className="hidden md:flex p-2 hover:bg-surface-soft text-mute cursor-pointer"`

- [ ] **User avatar** — replace:
From `className="w-10 h-10 rounded-full bg-surface-soft dark:bg-surface-soft border border-hairline flex items-center justify-center text-primary overflow-hidden shadow-sm"`
To `className="w-10 h-10 bg-surface-soft border border-[var(--line)] flex items-center justify-center text-primary overflow-hidden"`

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 8: Admin Dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Loading spinner** — replace:
From `className="w-10 h-10 border-4 border-surface-soft dark:border-surface-soft border-t-primary dark:border-t-primary rounded-full animate-spin"`
To `className="w-8 h-8 border-2 border-surface-soft border-t-primary animate-spin"`

- [ ] **Quick Action cards** — replace each:
From `className="group p-5 bg-surface-card dark:bg-surface-card border ${action.color} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"`
To `className="group p-5 bg-surface-card border border-line hover:bg-white/20 flex items-center justify-between"`

- [ ] **Quick Action icon containers** — replace:
From `className="p-3 rounded-lg bg-surface-soft dark:bg-surface-soft group-hover:bg-primary/10 transition-colors"`
To `className="p-3 bg-surface-soft"`

- [ ] **Chevron icon animation** — remove the translate/opacity animation group on the chevron
From `className="w-5 h-5 text-mute opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"`
To `className="w-5 h-5 text-mute"`

- [ ] **Recent Activity card** — replace:
From `className="p-6 lg:p-8 bg-surface-card dark:bg-surface-card border border-hairline dark:border-hairline rounded-xl shadow-md dark:shadow-primary/20"`
To `className="p-6 bg-surface-card border border-line"`

- [ ] **Error alert box** — replace:
From `className="mb-8 p-4 bg-accent-red-soft dark:bg-accent-red-soft border border-accent-red/20 dark:border-accent-red/20 rounded-md"`
To `className="mb-8 p-4 bg-accent-red-soft border border-accent-red/20"`

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 9: Admin Subpages

**Files:**
- Scan and modify all `src/app/admin/*/page.tsx` files for `rounded-*`, `shadow-*`, `backdrop-blur-*` classes and replace with flat Cartesian equivalents.

- [ ] **Scan for Cartesian violations** in admin subpages
Run: `Select-String -Path "src/app/admin/*/page.tsx" -Pattern "rounded-|shadow-|backdrop-blur-"`

- [ ] **Fix violations** in each file — replace rounded/shadow/backdrop classes with flat equivalents following the pattern established in Tasks 6-8.

- [ ] **Verify build**

Run: `npm run type-check 2>&1 | Select-Object -First 5`
Expected: No new errors

---
### Task 10: Integration Verification

**Files:**
- `src/components/shared/FloatingChatButton.tsx`
- `src/components/sections/CertificatesGallery.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[id]/page.tsx`
- `src/components/admin/Sidebar.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/*/page.tsx`

- [ ] **TypeScript check**
Run: `npm run type-check 2>&1`
Expected: No new errors beyond pre-existing test file errors

- [ ] **Lint check**
Run: `npm run lint 2>&1`
Expected: Clean or pre-existing warnings only

- [ ] **Build check**
Run: `npm run build 2>&1 | Select-Object -First 10`
Expected: Build succeeds
