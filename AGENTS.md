# AGENTS.md — Zakky Portfolio

## Project Identity

Personal portfolio + admin CMS for Zakky Ahmad El-Kholily.
**Domain:** codenamezaxx.my.id

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4 (class-based dark mode, gold accent palette)
- **Database:** Supabase PostgreSQL (service role key for server-side admin ops)
- **Auth:** Custom JWT (HS256) + bcrypt — *not* Supabase Auth
- **Data Fetching:** SWR (client), in-memory query cache with TTL (server)
- **Validation:** Zod 4
- **Animations:** Framer Motion
- **Monorepo tool:** none — single `package.json` at root
- **Package manager:** npm

## Essential Commands

```bash
npm run dev          # next dev
npm run build        # next build (includes type-check via Next)
npm run start        # next start
npm run lint         # eslint
npm run lint:fix     # eslint --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run type-check   # tsc --noEmit
npm test             # jest
npm run test:watch   # jest --watch
npm run test:coverage# jest --coverage
npm run setup:storage# ts-node scripts/setup-storage.ts
npm run analyze:bundle # ts-node scripts/analyze-bundle.ts
```

## Directory Map

```
src/
├── app/              # Next.js routes
│   ├── page.tsx      # Home (portfolio public page)
│   ├── layout.tsx    # Root layout (fonts, theme, analytics, JSON-LD)
│   ├── admin/        # Admin dashboard pages (achievements, hero, projects, etc.)
│   ├── login/        # Admin login page
│   ├── api/          # Route handlers (auth, admin, content, portfolio, revalidate, upload)
│   ├── projects/     # [slug] project detail pages
│   ├── certificates/ # Certificate pages
│   └── test-seo/     # SEO test
├── components/
│   ├── admin/        # CMS editors (HeroEditor, ProjectManager, etc.)
│   ├── layout/       # Navbar, Footer, Sidebar
│   ├── providers/    # RealtimeProvider
│   ├── sections/     # Hero, Journey, TechStack, Projects, Achievements, Contacts
│   ├── shared/       # FloatingChatButton, etc.
│   └── ui/           # UI primitives, form components
├── contexts/         # ThemeProvider, Toast context
├── hooks/            # Custom React hooks
├── lib/              # 29 modules: auth, db, portfolio-data, validation, storage, rate-limit, etc.
├── types/            # TypeScript type definitions
├── env.ts            # Zod-validated env vars (throws at startup if missing)
└── proxy.ts          # Proxy config
```

## Key Architecture Facts

- **Auth:** Custom JWT via `httpOnly` cookie (`session_token`), not Supabase Auth. Sessions last 24h. Tokens use HS256. See `src/lib/auth.ts`.
- **ISR:** Home page revalidates every **60 seconds** (`revalidate = 60` in `page.tsx`).
- **Dynamic imports:** Journey (ssr:false — carousel layout), Achievements (ssr:false — pdfjs DOMMatrix). Hero, TechStack, Projects, Contacts use ssr:true.
- **Data layer:** Server-side `src/lib/portfolio-data.ts` fetches from Supabase with an in-memory query cache. Client-side uses SWR.
- **Database tables:** `profiles`, `tech_stack`, `journey_items`, `projects`, `achievements`, `contact_info`, `admin_users`, `audit_logs`. Snake_case columns.
- **Service role bypass:** `src/lib/db.ts` creates a Supabase client with `SUPABASE_SERVICE_ROLE_KEY` and `autoRefreshToken: false, persistSession: false`. This bypasses RLS.
- **db.ts fallback queries:** Several functions include `avatar_url` column fallbacks — the column was added after initial schema. If modifying admin_user queries, preserve this pattern.
- **Rate limiting:** Login API has rate limiting (`src/lib/rate-limit.ts`).

## Environment Variables

Required (Zod-validated at startup via `src/env.ts`):

```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key (client-safe)
SUPABASE_SERVICE_ROLE_KEY     # Server-side service role key
JWT_SECRET                    # Min 32 chars for JWT signing
```

Optional:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID  # Google Analytics
NEXT_PUBLIC_SITE_URL           # Canonical site URL
ADMIN_EMAIL, ADMIN_PASSWORD    # For initial admin setup
```

## Testing

- **Jest** with `@swc/jest` transformer (fast, not ts-jest)
- **jsdom** test environment
- Source: `src/` — tests match `**/__tests__/**/*.ts?(x)` or `**/?(*.)+(spec|test).ts?(x)`
- Path alias `@/` → `<rootDir>/src/` mapped in jest config
- Setup: `jest.setup.ts` (loads `@testing-library/jest-dom`)
- Currently **1 test file exists**: `src/app/api/portfolio/contact-info/route.test.ts`
- **Cypress** in devDependencies (no test files found yet)

## Tailwind CSS 4 Notes

- Uses `@import 'tailwindcss'` directive, **not** the v3 `@tailwind` directives
- Dark mode uses class strategy via `@custom-variant dark (&:where(.dark, .dark *))` — NOT the default media query variant
- Theme stored in localStorage key `portfolio-theme`; inline `<script>` prevents flash
- Gold accent palette via CSS custom properties (`--primary: #c27508`)
- Mobile has no transitions; desktop uses linear 400ms transitions

## Deployment / Vercel

- `serverExternalPackages: ['jsdom']` in `next.config.ts` — required to avoid Runtime Error 500 on metadata parsing in serverless functions
- CSP security headers, HSTS (2 years), X-Frame-Options: DENY
- Image remote patterns: `cdn.jsdelivr.net`, `img.itch.zone`, `**.supabase.co`
- SVG images allowed (`dangerouslyAllowSVG: true` with CSP sandbox)
- Image formats: AVIF + WebP

## Conventions

- **TypeScript** strict mode
- `@/` path alias for all imports from `src/`
- Snake_case in DB columns, camelCase in TypeScript interfaces (with mapping in data transforms)
- Zod schemas for all API validation (`src/lib/validation.ts`, `src/lib/serverValidation.ts`)
- Audit logging for all admin CRUD operations (`src/lib/db.ts` → `audit_logs` table)
- Indonesian locale (`id_ID`) for Open Graph and HTML lang
