# Deployment Guide

## Vercel Deployment

### 1. Connect Repository
Connect your GitHub repository to Vercel via the Vercel dashboard.

### 2. Configure Environment Variables
In your Vercel project settings, add these environment variables:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side service role key |
| `JWT_SECRET` | Yes | Min 32 characters for JWT signing |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics ID |
| `ADMIN_EMAIL` | No | For initial admin setup |
| `ADMIN_PASSWORD` | No | For initial admin setup |

### 3. Deploy
Push to your default branch (or merge a PR) — Vercel automatically detects the Next.js project, builds, and deploys.

---

## Important Build Notes

### serverExternalPackages
`next.config.ts` includes:
```ts
serverExternalPackages: ['jsdom']
```
This prevents **Runtime Error 500** on serverless functions that parse HTML/metadata. Without this, `jsdom` (a dependency of some metadata libraries) fails to initialize in the Vercel serverless Node.js environment.

### Image Configuration
Ensure external image domains are configured in `next.config.ts`:
- `cdn.jsdelivr.net` — Tech stack icon CDN
- `img.itch.zone` — Game project images
- `**.supabase.co` — Supabase Storage for uploaded images

SVG images are allowed with CSP sandbox protection.

### Locale Cookie Persistence
The i18n system relies on a `locale` cookie (`locale=id` or `locale=en`). Since Vercel deploys are stateless, ensure:
- Cookie domain matches your production domain
- Path is set to `/` (already the default in the code)
- No CDN caching interferes with the cookie

---

## Post-Deployment Checklist

- [ ] Verify SSL/HTTPS is active
- [ ] Test login flow: `/login` → credentials → redirects to `/admin`
- [ ] Test locale toggle: globe icon switches between ID/EN
- [ ] Check Sentry for any startup errors
- [ ] Verify image loading from Supabase Storage
- [ ] Run Lighthouse audit: `npx lhci autorun`
- [ ] Verify ISR revalidation: update content → check home page updates within 60s
- [ ] Check security headers: inspect response headers for CSP, HSTS, X-Frame-Options

---

## CI/CD

### GitHub Actions
- **Lighthouse CI:** Runs performance, accessibility, SEO audits on every push
- Configuration: `lighthouserc.json`

### Manual Audits
```bash
# Lighthouse audit
npx lhci autorun

# Bundle analysis
npm run analyze:bundle
```
