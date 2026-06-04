# Deployment Guide

## Vercel Deployment
1. Connect GitHub repository to Vercel.
2. Configure Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Vercel automatically handles the build and deployment on push to `master`.

## Post-Deployment Checklist
- [ ] Verify SSL/HTTPS
- [ ] Test login flow on production
- [ ] Check Sentry for any startup errors
- [ ] Verify image loading from Supabase Storage