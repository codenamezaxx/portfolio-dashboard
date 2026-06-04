# Architecture Documentation

## Overview
The portfolio website is built as a full-stack Next.js application using the App Router. It integrates with Supabase for Database, Authentication, and Storage.

## System Components
1. **Frontend**: React components styled with Tailwind CSS, animations with Framer Motion.
2. **Admin Panel**: Secure dashboard for content management.
3. **Backend (API)**: Next.js Route Handlers for data operations and authentication.
4. **Database**: PostgreSQL (via Supabase) with Row Level Security.
5. **Storage**: Supabase Buckets for images and PDF certificates.

## Data Flow
- Public site fetches data via Server Components and ISR.
- Admin panel interacts with API routes using client-side fetching (SWR).
- Real-time updates are pushed via Supabase Realtime subscriptions.