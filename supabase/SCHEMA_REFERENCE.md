# Database Schema Reference

Quick reference guide for the portfolio database schema.

## Table Summary

| Table | Type | Purpose | Rows |
|-------|------|---------|------|
| profiles | Public | Portfolio owner info | 1 |
| tech_stack | Public | Technologies | ~20 |
| journey_items | Public | Career timeline | ~10 |
| projects | Public | Portfolio projects | ~15 |
| achievements | Public | Certifications | ~20 |
| contact_info | Public | Social links | 1 |
| admin_users | Admin | Admin accounts | ~5 |
| audit_logs | Admin | Activity logs | ~1000s |
| backups | Admin | Database backups | ~30 |

## Table Details

### profiles
Portfolio owner profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  tagline TEXT NOT NULL,
  hero_image_url VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Query:**
```sql
SELECT * FROM profiles LIMIT 1;
```

---

### tech_stack
Technologies and tools used.

```sql
CREATE TABLE tech_stack (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all tech stack items sorted by display order
SELECT * FROM tech_stack ORDER BY display_order ASC;

-- Get specific technology
SELECT * FROM tech_stack WHERE name = 'React';
```

---

### journey_items
Career timeline and journey milestones.

```sql
CREATE TABLE journey_items (
  id UUID PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all journey items sorted by year
SELECT * FROM journey_items ORDER BY year DESC;

-- Get items from specific year
SELECT * FROM journey_items WHERE year = '2023';
```

---

### projects
Portfolio projects with descriptions and links.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  technologies TEXT[] NOT NULL,
  github_link VARCHAR(500),
  live_link VARCHAR(500),
  demo_link VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all projects sorted by display order
SELECT * FROM projects ORDER BY display_order ASC;

-- Get projects by category
SELECT * FROM projects WHERE category = 'web' ORDER BY display_order;

-- Get projects with specific technology
SELECT * FROM projects WHERE 'React' = ANY(technologies);

-- Full-text search
SELECT * FROM projects 
WHERE to_tsvector('english', title || ' ' || description) 
  @@ to_tsquery('english', 'portfolio');
```

---

### achievements
Certifications and achievements with PDF certificates.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  pdf_url VARCHAR(500) NOT NULL,
  external_link VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all achievements sorted by year
SELECT * FROM achievements ORDER BY year DESC;

-- Get achievements by category
SELECT * FROM achievements WHERE category = 'Course' ORDER BY year DESC;

-- Get achievements from specific year
SELECT * FROM achievements WHERE year = 2024;

-- Full-text search
SELECT * FROM achievements 
WHERE to_tsvector('english', title || ' ' || issuer) 
  @@ to_tsquery('english', 'AWS');
```

---

### contact_info
Social media and contact links.

```sql
CREATE TABLE contact_info (
  id UUID PRIMARY KEY,
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  instagram_url VARCHAR(500),
  telegram_url VARCHAR(500),
  email VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Query:**
```sql
SELECT * FROM contact_info LIMIT 1;
```

---

### admin_users
Admin panel user accounts.

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all active admin users
SELECT * FROM admin_users WHERE is_active = true;

-- Get specific admin by email
SELECT * FROM admin_users WHERE email = 'admin@example.com';

-- Update last login
UPDATE admin_users SET last_login = NOW() WHERE id = '<user-id>';
```

---

### audit_logs
Activity and change tracking for compliance.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get recent activity
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- Get activity by user
SELECT * FROM audit_logs 
WHERE admin_user_id = '<user-id>' 
ORDER BY created_at DESC;

-- Get activity by entity type
SELECT * FROM audit_logs 
WHERE entity_type = 'projects' 
ORDER BY created_at DESC;

-- Get specific action
SELECT * FROM audit_logs 
WHERE action = 'UPDATE' AND entity_type = 'projects'
ORDER BY created_at DESC;

-- Get activity in date range
SELECT * FROM audit_logs 
WHERE created_at >= '2024-01-01' AND created_at < '2024-02-01'
ORDER BY created_at DESC;
```

---

### backups
Database backups for disaster recovery.

```sql
CREATE TABLE backups (
  id UUID PRIMARY KEY,
  backup_name VARCHAR(255) NOT NULL,
  backup_data JSONB NOT NULL,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP
);
```

**Example Queries:**
```sql
-- Get all backups
SELECT id, backup_name, created_by, created_at FROM backups ORDER BY created_at DESC;

-- Get recent backups
SELECT * FROM backups ORDER BY created_at DESC LIMIT 5;

-- Get backups by creator
SELECT * FROM backups WHERE created_by = '<user-id>' ORDER BY created_at DESC;
```

---

## Indexes

### Display Order Indexes
- `idx_tech_stack_display_order` - Sort tech stack
- `idx_journey_items_display_order` - Sort journey items
- `idx_projects_display_order` - Sort projects
- `idx_achievements_display_order` - Sort achievements

### Category Indexes
- `idx_projects_category` - Filter projects by category
- `idx_achievements_category` - Filter achievements by category

### Time-Based Indexes
- `idx_journey_items_year` - Filter by year
- `idx_achievements_year` - Filter by year
- `idx_audit_logs_created_at` - Time-based audit queries
- `idx_backups_created_at` - Time-based backup queries

### Foreign Key Indexes
- `idx_admin_users_email` - Email lookups
- `idx_audit_logs_admin_user_id` - Filter by user
- `idx_backups_created_by` - Filter by creator

### Full-Text Search Indexes
- `idx_projects_fts` - Search projects
- `idx_achievements_fts` - Search achievements

---

## Row Level Security (RLS)

### Public Tables (Read-Only for Public)
- profiles
- tech_stack
- journey_items
- projects
- achievements
- contact_info

**Policies:**
- SELECT: Allowed for all users
- INSERT, UPDATE, DELETE: Restricted to authenticated users

### Admin-Only Tables
- admin_users
- audit_logs
- backups

**Policies:**
- All operations: Restricted to authenticated users

---

## Common Operations

### Insert New Project
```sql
INSERT INTO projects (
  title, description, category, image_url, 
  technologies, github_link, live_link, display_order
) VALUES (
  'My Project', 'Description', 'web', 'https://...',
  ARRAY['React', 'TypeScript'], 'https://github.com/...',
  'https://...', 1
);
```

### Update Project
```sql
UPDATE projects 
SET title = 'Updated Title', updated_at = NOW()
WHERE id = '<project-id>';
```

### Delete Project
```sql
DELETE FROM projects WHERE id = '<project-id>';
```

### Add Audit Log Entry
```sql
INSERT INTO audit_logs (
  admin_user_id, action, entity_type, entity_id,
  old_values, new_values, ip_address, user_agent
) VALUES (
  '<user-id>', 'UPDATE', 'projects', '<project-id>',
  '{"title": "Old Title"}', '{"title": "New Title"}',
  '192.168.1.1', 'Mozilla/5.0...'
);
```

### Create Backup
```sql
INSERT INTO backups (
  backup_name, backup_data, created_by
) VALUES (
  'backup-2024-01-15', 
  jsonb_build_object(
    'profiles', (SELECT jsonb_agg(row_to_json(t)) FROM profiles t),
    'projects', (SELECT jsonb_agg(row_to_json(t)) FROM projects t)
  ),
  '<user-id>'
);
```

---

## Performance Tips

1. **Always use indexes** - Queries on indexed columns are much faster
2. **Limit results** - Use LIMIT for large result sets
3. **Use pagination** - Fetch data in chunks for better performance
4. **Filter early** - Apply WHERE clauses to reduce data transfer
5. **Monitor slow queries** - Use EXPLAIN ANALYZE to identify bottlenecks

---

## Data Types

| Type | Example | Notes |
|------|---------|-------|
| UUID | `550e8400-e29b-41d4-a716-446655440000` | Unique identifier |
| VARCHAR(n) | `'Hello'` | Text with max length |
| TEXT | `'Long text...'` | Unlimited text |
| INTEGER | `42` | Whole numbers |
| TIMESTAMP | `2024-01-15 10:30:00` | Date and time |
| BOOLEAN | `true` | True/false |
| JSONB | `{"key": "value"}` | JSON data |
| TEXT[] | `ARRAY['a', 'b']` | Array of text |

---

## Useful Queries

### Database Statistics
```sql
-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Verify RLS
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

**Version:** 1.0
**Last Updated:** 2025-05-15
