# API Documentation

## Overview

The application exposes two categories of API routes:

1. **Portfolio API** (`/api/portfolio/*`) — Public, locale-aware endpoints that serve the portfolio frontend. These routes read the `locale` cookie and swap `_en` fields when the locale is `en`.
2. **Content API** (`/api/content/*`) — Protected admin endpoints for CRUD operations on content. Authentication via JWT session cookie (`session_token`).
3. **Auth API** (`/api/auth/*`) — Authentication endpoints for admin login, logout, and session management.
4. **Admin API** (`/api/admin/*`) — Administrative operations (users, audit logs, backups, statistics).
5. **Upload API** (`/api/upload/*`) — File upload/delete operations for images and PDFs.
6. **Revalidation API** (`/api/revalidate`) — On-demand ISR cache purging.

---

## Portfolio API (Public)

All portfolio endpoints respect the `locale` cookie. When the cookie value is `en`, database content is swapped to English (`_en` fields replace the ID fields).

### GET /api/portfolio/hero
Returns the profile/hero data with locale-aware fields (tagline, role, name, status_label).

### GET /api/portfolio/tech-stack
Returns the tech stack items. Not locale-sensitive.

### GET /api/portfolio/journey
Returns journey timeline items with locale-aware title and description.

### GET /api/portfolio/projects
Returns all projects with locale-aware title and description.

### GET /api/portfolio/achievements
Returns all achievements with locale-aware title.

### GET /api/portfolio/contact-info
Returns contact information.

### GET /api/portfolio/resume
Returns the current profile's resume URL.

---

## Auth API

### POST /api/auth/login
Authenticate admin user and create session.
- **Body:** `{ "email": string, "password": string }`
- **Rate limited:** 5 attempts per IP per 15 minutes
- **Response:** Sets `session_token` httpOnly cookie (24h expiry)

### POST /api/auth/logout
Clears the session cookie.

### GET /api/auth/session
Returns current session validity and admin email.

### POST /api/auth/change-password
Changes the authenticated admin's password. Requires valid session.

---

## Content API (Admin, Protected)

All Content API routes require authentication via `session_token` cookie. Uses Supabase service role key directly (bypasses RLS).

### GET/PUT /api/content/profiles
- **GET:** Fetch profile record (returns camelCase mapped data)
- **PUT:** Update profile record. Validates and sanitizes all fields.
  - Fields: `name`, `role`, `tagline`, `status_label`, `name_en`, `role_en`, `tagline_en`, `status_label_en`, `heroImageUrl`

### GET /api/content/tech-stack
- **GET:** Fetch all tech stack items ordered by display_order
- **POST:** Create new tech stack item
- **PUT:** Update existing tech stack item
- **DELETE:** Delete tech stack item

### GET /api/content/journey
- **GET:** Fetch journey items ordered by year/display_order
- **POST:** Create new journey item
- **PUT:** Update existing journey item
- **DELETE:** Delete journey item

### GET /api/content/projects
- **GET:** Fetch all projects ordered by display_order
- **POST:** Create new project
- **PUT:** Update existing project
- **DELETE:** Delete project

### GET /api/content/achievements
- **GET:** Fetch all achievements ordered by display_order
- **POST:** Create new achievement
- **PUT:** Update existing achievement
- **DELETE:** Delete achievement

### GET /api/content/contact-info
- **GET:** Fetch all contact info entries
- **POST:** Create new contact entry
- **PUT:** Update existing contact entry
- **DELETE:** Delete contact entry

### POST /api/content/contact-info/restore
Restores a deleted contact info entry.

### GET /api/content/all
Fetch all content types in a single request.

### POST /api/content/profile-resume
Update the profile's resume URL.

---

## Admin API (Protected)

### GET /api/admin/users
List all admin users.

### POST /api/admin/users
Create a new admin user.

### GET/PUT/DELETE /api/admin/users/[id]
Get, update, or delete a specific admin user.

### GET /api/admin/audit-logs
Fetch audit log entries with pagination and filtering.

### POST /api/admin/audit-logs/cleanup
Clean up old audit log entries.

### GET /api/admin/statistics
Returns admin dashboard statistics (counts of projects, achievements, etc.).

### GET/POST /api/admin/backups
- **GET:** List all backups
- **POST:** Create a new backup

### GET/DELETE /api/admin/backups/[id]
Get or delete a specific backup.

### POST /api/admin/backups/[id]/restore
Restore from a backup.

### POST /api/admin/backups/[id]/verify
Verify backup integrity.

### POST /api/admin/profile/avatar
Upload admin avatar image.

---

## Upload API

### POST /api/upload/image
Upload an image to Supabase Storage. Returns the public URL.

### POST /api/upload/pdf
Upload a PDF document to Supabase Storage.

### POST /api/upload/batch
Batch upload multiple files.

### DELETE /api/upload/delete
Delete an uploaded file from storage.

---

## Revalidation API

### POST /api/revalidate
Triggers on-demand ISR revalidation of the home page. Requires `session_token` auth.
