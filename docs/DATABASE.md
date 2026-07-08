# Database Schema Documentation

## Overview

PostgreSQL database hosted on Supabase. All content tables use `snake_case` column naming. TypeScript interfaces use `camelCase` with mapping in data transforms.

**Access:** Server-side operations use the Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`) with `autoRefreshToken: false` and `persistSession: false`, which bypasses Row Level Security (RLS). Client-side operations use the anon key with RLS policies.

---

## Tables

### `profiles`
Single-row profile/hero section data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `name` | `text` | Full name (Indonesian) |
| `role` | `text` | Professional role (Indonesian) |
| `tagline` | `text` | Tagline/introduction (Indonesian) |
| `status_label` | `text` | Status badge text (e.g. "Open to work") — max 50 chars |
| `name_en` | `text` | Full name (English, nullable) |
| `role_en` | `text` | Professional role (English, nullable) |
| `tagline_en` | `text` | Tagline (English, nullable) |
| `status_label_en` | `text` | Status badge (English, nullable) |
| `hero_image_url` | `text` | Hero section image URL |
| `resume_url` | `text` | Resume/CV document URL |
| `avatar_url` | `text` | Admin avatar URL |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**Constraints:** `CHECK ((length(status_label) <= 50))`

---

### `tech_stack`
Technology stack items displayed in the tech grid section.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `name` | `text` | Technology name |
| `category` | `text` | Category grouping (e.g. "Frontend", "Backend") |
| `icon_url` | `text` | URL to technology icon |
| `display_order` | `integer` | Sort order in the grid |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `journey_items`
Career/education timeline entries.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Entry title (Indonesian) |
| `description` | `text` | Entry description (Indonesian) |
| `title_en` | `text` | Entry title (English, nullable) |
| `description_en` | `text` | Entry description (English, nullable) |
| `year` | `text` | Year or period string |
| `category` | `text` | Category (education/work/organization) |
| `display_order` | `integer` | Sort order |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `projects`
Portfolio project entries.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Project title (Indonesian) |
| `description` | `text` | Project description (Indonesian) |
| `title_en` | `text` | Project title (English, nullable) |
| `description_en` | `text` | Project description (English, nullable) |
| `category` | `text` | Project category |
| `image_url` | `text` | Project thumbnail/image URL |
| `github_link` | `text` | GitHub repository URL |
| `live_link` | `text` | Live demo URL |
| `demo_link` | `text` | Additional demo URL (e.g. game demo) |
| `technologies` | `text[]` | Array of tech tags |
| `display_order` | `integer` | Sort order |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `achievements`
Certificates and achievements.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Achievement title (Indonesian) |
| `issuer` | `text` | Issuing organization |
| `title_en` | `text` | Achievement title (English, nullable) |
| `category` | `text` | Achievement category |
| `year` | `integer` | Year achieved |
| `pdf_url` | `text` | Certificate PDF URL |
| `external_link` | `text` | External verification link |
| `display_order` | `integer` | Sort order |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `contact_info`
Contact methods and social links.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `label` | `text` | Display label |
| `value` | `text` | Contact value (email, URL, etc.) |
| `type` | `text` | Contact type (email/phone/social/location) |
| `is_primary` | `boolean` | Whether this is a primary contact |
| `display_order` | `integer` | Sort order |
| `is_deleted` | `boolean` | Soft delete flag |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `admin_users`
Admin panel user accounts. **Not** linked to Supabase Auth — uses custom JWT authentication.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `email` | `text` | Login email (unique) |
| `password_hash` | `text` | bcrypt-hashed password |
| `name` | `text` | Display name |
| `avatar_url` | `text` | Avatar image URL |
| `is_active` | `boolean` | Whether the account is active |
| `last_login_at` | `timestamptz` | Last successful login timestamp |
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `audit_logs`
Records all admin CRUD operations for security auditing.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `admin_id` | `uuid` | Foreign key to `admin_users.id` |
| `action` | `text` | Action type (CREATE/UPDATE/DELETE) |
| `entity_type` | `text` | Entity type (profile/project/achievement/etc.) |
| `entity_id` | `text` | ID of the affected entity |
| `details` | `jsonb` | JSON object with change details |
| `created_at` | `timestamptz` | Row creation timestamp |

---

## Localization Strategy

Content tables use a `_en` column suffix pattern for bilingual support:

- **Columns without `_en` suffix:** Indonesian content (default locale)
- **Columns with `_en` suffix:** English translation (fallback: displays Indonesian when null)

The `applyLocale()` function in `src/lib/portfolio-data.ts` handles the swap: when locale is `en` and the English field is non-null, it overwrites the base field with the English value, then strips the `_en` columns from the response.
