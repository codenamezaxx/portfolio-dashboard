# Development Guide

## Prerequisites

- **Node.js:** 20.x or later
- **npm:** 9.x or later
- **Supabase project:** PostgreSQL database and Storage bucket

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env.local
# Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#           SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET (min 32 chars)

# Initialize Supabase storage buckets
npm run setup:storage

# Start development server (Turbopack)
npm run dev
```

## Tech Stack (Current)

| Technology | Version |
| :--- | :--- |
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 (strict mode) |
| Tailwind CSS | 4 |
| Supabase JS | 2.x |
| Zod | 4 |
| Framer Motion | 12 |
| next-intl | 4 |

## Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Build for production (includes type-check) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm test` | Run Jest unit/integration tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Run Jest with coverage report |
| `npm run setup:storage` | Initialize Supabase Storage buckets |
| `npm run analyze:bundle` | Analyze Next.js bundle composition |

## i18n / Localization Patterns

### UI Strings (next-intl)
- Message files: `messages/id.json` (Indonesian) and `messages/en.json` (English)
- Usage in client components: `const t = useTranslations('namespace')`
- Usage in server components: `const t = await getTranslations('namespace')`
- Locale detection: `src/i18n/request.ts` reads `locale` cookie

### Database Content (_en fields)
- Content tables have `_en` suffix columns (e.g., `title_en`, `tagline_en`)
- Data layer: `applyLocale()` in `src/lib/portfolio-data.ts` swaps fields when cookie is `en`
- Pages must pass locale to data fetchers: `getAllPortfolioData(locale)`

## Styling Notes

- **Tailwind CSS 4** uses `@import 'tailwindcss'` (NOT v3 `@tailwind` directives)
- Dark mode uses **class strategy** — NOT media query
- Custom variant: `@custom-variant dark (&:where(.dark, .dark *))`
- Theme stored in `localStorage` key `portfolio-theme`
- Gold accent: CSS custom property `--primary: #c27508`
- Mobile: no transitions; Desktop: linear 400ms transitions

## Testing

### Unit / Integration (Jest)
- **Transformer:** @swc/jest (fast SWC-based compilation)
- **Environment:** jsdom
- **Setup:** `jest.setup.ts` (loads `@testing-library/jest-dom`)
- **Path alias:** `@/` → `<rootDir>/src/`
- **Test files:** `**/__tests__/**/*.ts?(x)` or `**/?(*.)+(spec|test).ts?(x)`

### E2E (Cypress)
- **Installed:** Yes (no test files found yet)
- **Config:** `cypress.config.ts`

## Code Conventions

- Path alias `@/` for all imports from `src/`
- Snake_case in DB columns, camelCase in TypeScript interfaces
- Zod schemas for all API validation
- Audit logging for all admin CRUD operations
- Indonesian locale (`id_ID`) for Open Graph and HTML lang
- Dynamic imports for heavy components (pdfjs, carousel)
