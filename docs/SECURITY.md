# Security Audit Findings

## Authentication

### Custom JWT (Not Supabase Auth)
- **Password hashing:** bcrypt with 10 salt rounds (`src/lib/auth.ts`)
- **Session tokens:** HS256 JWT, 24-hour expiration
- **Cookie:** `session_token` — httpOnly, path `/`, SameSite=Lax
- **Login rate limiting:** 5 attempts per IP per 15 minutes (`src/lib/rate-limit.ts`)
- **Session verification:** Server-side JWT decode on every protected request

**Why custom auth over Supabase Auth?**
The admin panel is a single-user system. Supabase Auth adds unnecessary complexity (RLS policies, user management UI, etc.) for this use case. A lightweight bcrypt + JWT solution with rate limiting provides adequate security with less infrastructure overhead.

---

## Database Access

### Service Role Key
- Server-side operations use `SUPABASE_SERVICE_ROLE_KEY` (`src/lib/db.ts`)
- Configuration: `autoRefreshToken: false`, `persistSession: false`
- This **bypasses RLS** — access control is handled entirely at the application layer

### Access Control Model
1. Public portfolio routes → No auth needed → Read-only DB queries
2. Admin CRUD routes → JWT session required → Full DB access via service role
3. No Supabase RLS policies are relied upon for security

---

## API Security

### Input Validation
- **Zod schemas:** Every API route validates input with Zod 4 (`src/lib/validation.ts`, `src/lib/serverValidation.ts`)
- **HTML sanitization:** All text inputs sanitized via `src/lib/sanitization.ts`
- **URL sanitization:** URLs validated and sanitized before storage

### Auth Protection
- `verifySession()` called on all `PUT`, `POST`, `DELETE` endpoints
- Returns 401 if session cookie is missing, expired, or tampered
- No public write endpoints exist

---

## HTTP Security Headers

Configured in `next.config.ts`:

| Header | Value |
| :--- | :--- |
| Content-Security-Policy | Restricted script/src/style/img sources |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` (2 years) |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| X-XSS-Protection | `1; mode=block` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Camera, microphone, geolocation disabled |

### CSP Highlights
- Scripts: `'self'` + Supabase SDK + Vercel scripts + GA
- Images: `'self'` + Supabase Storage + CDNs
- SVG images allowed via `dangerouslyAllowSVG: true` with CSP sandbox
- Connections: `'self'` + Supabase REST + WebSocket + GA

---

## Environment Variables

- **Server-only:** `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- **Client-safe:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Validation:** All env vars validated at startup via Zod schema in `src/env.ts`
- Missing required vars cause the app to throw at startup

---

## Findings Summary

| Category | Status |
| :--- | :--- |
| Authentication | ✅ Custom JWT + bcrypt with rate limiting |
| Session Management | ✅ httpOnly cookie, 24h expiry |
| CSP | ✅ Comprehensive policy configured |
| Input Validation | ✅ Zod schemas on all API routes |
| HTML Sanitization | ✅ Sanitization layer on all inputs |
| Rate Limiting | ✅ Login endpoint (5/IP/15min) |
| Audit Trail | ✅ All admin CRUD logged to `audit_logs` |
| Service Role Key Exposure | ✅ Never client-side (server-only) |
| HSTS | ✅ 2-year preload |

### Recommendations
1. **JWT_SECRET rotation:** Rotate the JWT secret periodically
2. **Audit log retention:** Configure cleanup of old audit log entries
3. **Monitor rate limit hits:** Track repeated login failures via Sentry
4. **CSP review:** Revisit CSP when adding third-party scripts
