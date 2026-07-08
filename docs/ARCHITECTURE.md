# Architecture Documentation

## Overview

Full-stack Next.js 16 (App Router) portfolio website with a bilingual admin CMS. Integrates with Supabase for database and storage, but uses **custom JWT authentication** (not Supabase Auth) for the admin panel.

**Domain:** codenamezaxx.my.id

---

## Application Layers

```
┌─────────────────────────────────────────────────┐
│                  Browser                          │
├─────────────────────────────────────────────────┤
│           Next.js App Router (RSC)               │
│  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  Public Routes   │  │  Admin Routes        │  │
│  │  (/, /projects,  │  │  (/admin/*, /login)  │  │
│  │   /certificates) │  │                      │  │
│  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                        │              │
│  ┌────────▼────────────────────────▼───────────┐  │
│  │        Next.js Route Handlers (API)          │  │
│  │  Portfolio API → locale-aware public data    │  │
│  │  Content API → protected CRUD (JWT auth)     │  │
│  │  Auth API → custom JWT login/logout/session  │  │
│  └───────────────────────┬──────────────────────┘  │
├──────────────────────────┼──────────────────────────┤
│           Supabase                               │
│  ┌───────────────────────▼──────────────────────┐  │
│  │  PostgreSQL (service role key)                │  │
│  │  Storage (images, PDFs)                       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

### 1. Custom JWT Authentication (Not Supabase Auth)
- Passwords hashed with **bcrypt** (10 salt rounds)
- Session tokens signed with **HS256** JWT
- Token stored in **httpOnly cookie** (`session_token`) — 24h expiry
- Login API has **rate limiting** (5 attempts per IP per 15 min)
- Supabase Auth is not used; admin panel uses custom auth layer

### 2. Service Role Database Access
- Server-side operations use `SUPABASE_SERVICE_ROLE_KEY` with `autoRefreshToken: false` and `persistSession: false`
- This **bypasses RLS** — all access control is handled at the application layer (JWT verification)
- Admin CRUD operations are gated through Next.js Route Handlers, not through Supabase RLS policies

### 3. Bilingual Localization (i18n)
Uses a hybrid approach:
- **UI strings:** `next-intl` library with JSON message files (`messages/en.json`, `messages/id.json`)
- **Database content:** Cookie-based locale detection with `_en` column swapping
  - Server reads `locale` cookie → passes to data fetchers → `applyLocale()` swaps fields
  - Portfolio API routes (`/api/portfolio/*`) also read the cookie and apply locale
  - Pages: `page.tsx`, `projects/page.tsx`, `projects/[id]/page.tsx`, `certificates/page.tsx`
- **Locale toggle:** `useLocale` hook in Navbar sets cookie and reloads

### 4. Data Fetching Strategy
- **Server-side:** Direct function calls via `getAllPortfolioData(locale?)` with **in-memory query cache** (TTL-based, keyed by locale)
- **Client-side:** SWR for admin panel API fetches with automatic revalidation
- **ISR:** Home page revalidates every 60 seconds; sub-pages every 3600 seconds

### 5. Styling
- **Tailwind CSS 4** with `@import 'tailwindcss'` directive
- **Dark mode:** Class-based strategy via `@custom-variant dark (&:where(.dark, .dark *))`
- **Theme:** `localStorage` key `portfolio-theme`; inline `<script>` prevents flash
- **Gold accent palette:** CSS custom properties (`--primary: #c27508`)
- **Transitions:** Mobile has no transitions; desktop uses linear 400ms transitions

### 6. Security Headers
- CSP with restricted sources for scripts, styles, images
- HSTS (2 years, includeSubDomains, preload)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restricted camera, microphone, geolocation

---

## Component Organization

```
src/
├── app/              # Next.js App Router (routes, API handlers)
├── components/
│   ├── admin/        # CMS editors (HeroEditor, ProjectManager, etc.)
│   ├── layout/       # Navbar, Footer, Sidebar
│   ├── providers/    # RealtimeProvider (Supabase subscriptions)
│   ├── sections/     # Hero, Journey, TechStack, Projects, etc.
│   ├── shared/       # FloatingChatButton, SectionHeader, etc.
│   └── ui/           # UI primitives (TextInput, TextArea, ImageUpload, etc.)
├── hooks/            # useLocale, useToast, useTheme
├── i18n/             # next-intl request config
├── lib/              # Core libraries (auth, db, portfolio-data, validation, storage, etc.)
├── types/            # TypeScript interfaces and type definitions
├── messages/         # Translation JSON files (en, id)
└── env.ts            # Zod-validated environment variables
```

---

## Data Flow

### Public Page Load
1. Server component reads `locale` cookie from `next/headers`
2. Calls `getAllPortfolioData(locale)` — fetches all data + applies locale swap
3. Renders React Server Components with correct locale
4. Client hydrates → `useLocale` hook syncs cookie post-hydration
5. Future page navigations use client-side SWR via portfolio API routes

### Admin CMS Operations
1. Admin submits form in the browser
2. POST/PUT/DELETE request to `/api/content/*` with `session_token` cookie
3. Server verifies JWT session → validates input with Zod → sanitizes HTML
4. Writes to Supabase using service role key → logs to `audit_logs`
5. Returns updated data → triggers ISR revalidation
