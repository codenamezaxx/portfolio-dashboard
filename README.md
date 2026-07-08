# ⚡ Modern Dynamic Portfolio & Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)

## 🚀 Project Overview

High-performance bilingual (ID/EN) digital portfolio built with Next.js 16 App Router. Features a public portfolio site with a full admin CMS dashboard, custom JWT authentication, and Supabase PostgreSQL backend.

**Domain:** [codenamezaxx.my.id](https://codenamezaxx.my.id)

---

## ✨ Key Features

### 🌐 Public Portfolio
- **Bilingual (ID/EN):** Toggle between Indonesian and English with locale-aware database content
- **Modern Styling:** Tailwind CSS 4 with dark/light theme toggle, gold accent palette
- **Interactive Sections:** Hero, Journey timeline, Tech Stack grid, Project showcase, Certificates gallery, Contact form
- **Dynamic Contact Form:** Integrated messaging system with real-time submission
- **SEO Optimized:** Open Graph, Twitter Cards, JSON-LD structured data, Indonesian locale metadata
- **ISR Caching:** Home page revalidates every 60 seconds for near-realtime updates
- **Framer Motion Animations:** Smooth scroll, entrance, and interaction animations

### 🔐 Admin Dashboard
- **Custom JWT Auth:** Secure login with bcrypt password hashing and HS256 session tokens
- **24h Session:** httpOnly cookie-based sessions with automatic expiry
- **Sidebar Navigation:** Collapsible sidebar with breadcrumb context
- **Activity Logging:** Full audit trail of all admin CRUD operations
- **Backup System:** Create, verify, and restore database backups

### 🛠️ Content Management (CMS)
- **Hero Section Editor:** Update name, role, tagline, status label, and hero image (bilingual)
- **Tech Stack Manager:** Add/remove/reorder technology items with icons
- **Journey Editor:** Manage career/education timeline entries (bilingual)
- **Project Manager:** Full project CRUD with categories, tech tags, image uploads (bilingual)
- **Achievement Manager:** Certificate management with PDF uploads and external links (bilingual)
- **Contact Info Editor:** Manage email, phone, social links, location
- **User Manager:** Create/edit/disable admin accounts
- **Image Upload:** Integrated image and PDF upload via Supabase Storage

### 📊 Operations
- **Sentry Error Tracking:** Real-time error monitoring
- **Lighthouse CI:** Performance auditing via GitHub Actions
- **Bundle Analysis:** Analyze JS bundle composition

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 4, CSS Custom Properties |
| **Animations** | Framer Motion 12, Typewriter Effect |
| **Language** | TypeScript 5 (strict mode) |
| **Database** | Supabase PostgreSQL (service role key) |
| **Auth** | Custom JWT (HS256) + bcrypt |
| **Validation** | Zod 4 |
| **Data Fetching** | SWR (client), In-memory cache with TTL (server) |
| **i18n** | next-intl (UI), `_en` DB columns (content) |
| **Icons** | Lucide React |
| **Monitoring** | Sentry, Vercel Analytics & Speed Insights |
| **Testing** | Jest + @swc/jest, Cypress |
| **CI/CD** | GitHub Actions (Lighthouse) |
| **Deployment** | Vercel (Production) |

---

## 🔑 Environment Variables

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# === Security (required, min 32 chars) ===
JWT_SECRET=your_jwt_secret_for_admin_auth

# === Optional ===
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga4_measurement_id
NEXT_PUBLIC_SITE_URL=https://codenamezaxx.my.id
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_initial_admin_password
```

---

## 💻 Local Development

```bash
# 1. Clone & install
git clone https://github.com/codenamezaxx/portfolio.git
cd portfolio
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials and JWT_SECRET

# 3. Start development server
npm run dev
# → http://localhost:3000

# 4. Build & test production build
npm run build
npm run start
```

### Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run type-check` | Run TypeScript type checking (tsc --noEmit) |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Run Jest with coverage report |
| `npm run setup:storage` | Initialize Supabase Storage buckets |
| `npm run analyze:bundle` | Analyze Next.js bundle composition |

### Locale Development

- UI strings: Edit `messages/id.json` and `messages/en.json`
- Database content: Manage via admin CMS at `/admin/hero` (bilingual fields)
- Toggle locale: Click globe icon in nav bar (sets `locale` cookie)

---

## 📦 Deployment (Vercel)

1. Connect repository to Vercel
2. Add all environment variables in Vercel Project Settings
3. Deploy — Vercel detects Next.js and configures automatically

**Important config notes:**
- `serverExternalPackages: ['jsdom']` in `next.config.ts` — prevents Runtime Error 500 in serverless functions
- Image domains configured in `remotePatterns` (Supabase Storage, cdn.jsdelivr.net, img.itch.zone)
- SVGs allowed via `dangerouslyAllowSVG: true` with CSP sandbox

---

## 🧪 Testing

```bash
# Unit & integration tests (Jest + @swc/jest)
npm test

# E2E tests (Cypress)
npx cypress run

# Performance audit
npx lhci autorun
```

---

## 📁 Project Structure

```
src/
├── app/              # Next.js routes (pages, API handlers)
│   ├── page.tsx      # Home (ISR, 60s revalidation)
│   ├── admin/        # Admin dashboard pages
│   ├── projects/     # Project listing and detail pages
│   ├── certificates/ # Certificate gallery page
│   └── api/          # ~35 Route Handlers
├── components/       # React components by domain
├── hooks/            # Custom hooks (useLocale, useToast, useTheme)
├── i18n/             # next-intl request configuration
├── contexts/         # Theme, Toast providers
├── lib/              # Core libraries (auth, db, validation, storage, etc.)
├── types/            # TypeScript type definitions
├── messages/         # Translation JSON files (en, id)
└── env.ts            # Zod-validated environment variables
```

---

## 🔒 Security

- **Auth:** Custom JWT with bcrypt — not Supabase Auth
- **Session:** httpOnly cookie (`session_token`), 24h expiry
- **Rate Limiting:** Login endpoint (5 attempts/IP/15 min)
- **Input Validation:** Zod schemas on all API routes
- **Sanitization:** HTML sanitization on all text inputs
- **CSP:** Content Security Policy with restrictive rules
- **HSTS:** 2-year strict transport security
- **Audit Logs:** All admin operations logged to database

---

Dibuat dengan dedikasi untuk performa dan estetika.
