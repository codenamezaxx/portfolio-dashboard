# Database Schema Documentation

## Tables

### `profiles`
- `id`: uuid (primary key)
- `name`: text
- `role`: text
- `tagline`: text
- `status_label`: text
- `image_url`: text
- `updated_at`: timestamp

### `tech_stack`
- `id`: uuid (primary key)
- `name`: text
- `icon_url`: text
- `display_order`: integer

### `projects`
- `id`: uuid (primary key)
- `title`: text
- `description`: text
- `category`: text
- `image_url`: text
- `github_url`: text
- `demo_url`: text
- `technologies`: text[]
- `display_order`: integer

### `achievements`
- `id`: uuid (primary key)
- `title`: text
- `issuer`: text
- `category`: text
- `year`: integer
- `pdf_url`: text
- `display_order`: integer

### `audit_logs`
- `id`: uuid (primary key)
- `admin_id`: uuid (ref: admin_users)
- `action`: text
- `entity_type`: text
- `entity_id`: text
- `details`: jsonb
- `created_at`: timestamp