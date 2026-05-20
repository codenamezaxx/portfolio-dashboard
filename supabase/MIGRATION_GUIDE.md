# Supabase Migration Guide

## Quick Start

This guide explains how to use the migration scripts to set up your Supabase database from scratch.

## Directory Structure

```
supabase/
├── migrations/
│   ├── 001_create_tables.sql      # Create all 9 tables
│   ├── 002_create_indexes.sql     # Create performance indexes
│   ├── 003_create_rls_policies.sql # Create Row Level Security policies
│   └── README.md                   # Detailed migration documentation
└── MIGRATION_GUIDE.md              # This file
```

## What These Migrations Do

### 001_create_tables.sql
Creates the complete database schema with 9 tables:

**Public Tables (Read-Only for Public):**
- `profiles` - Portfolio owner information
- `tech_stack` - Technologies and tools
- `journey_items` - Career timeline
- `projects` - Portfolio projects
- `achievements` - Certifications and awards
- `contact_info` - Social media links

**Admin Tables (Restricted Access):**
- `admin_users` - Admin user accounts
- `audit_logs` - Activity tracking
- `backups` - Database backups

### 002_create_indexes.sql
Creates 18+ performance indexes for:
- Display order sorting
- Category filtering
- Time-based queries
- Foreign key relationships
- Full-text search

### 003_create_rls_policies.sql
Implements Row Level Security (RLS) to:
- Allow public read access to portfolio content
- Restrict write access to authenticated users
- Protect admin data from unauthorized access

## How to Run Migrations

### Method 1: Supabase Dashboard (Easiest)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `001_create_tables.sql`
5. Click **Run**
6. Repeat steps 3-5 for `002_create_indexes.sql`
7. Repeat steps 3-5 for `003_create_rls_policies.sql`

### Method 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Method 3: Direct PostgreSQL Connection

```bash
# Connect to your database
psql -h your-host.supabase.co -U postgres -d postgres

# Run each migration
\i supabase/migrations/001_create_tables.sql
\i supabase/migrations/002_create_indexes.sql
\i supabase/migrations/003_create_rls_policies.sql
```

## Verification Checklist

After running all migrations, verify everything is set up correctly:

- [ ] All 9 tables created
- [ ] All 18+ indexes created
- [ ] All RLS policies enabled
- [ ] Can query public tables
- [ ] Admin tables are protected
- [ ] No errors in migration output

## Key Features

### Idempotent Migrations
All migrations use `IF NOT EXISTS` clauses, so they can be run multiple times safely without errors.

### Comprehensive Documentation
Each migration file includes:
- Detailed comments explaining each table and column
- Purpose and usage information
- Performance optimization notes

### Security by Default
- Row Level Security (RLS) enabled on all tables
- Public content readable by all users
- Admin operations restricted to authenticated users
- Audit logging for compliance

### Performance Optimized
- Indexes on all frequently queried fields
- Composite indexes for complex queries
- Full-text search support
- Query performance targets: < 200ms

## Database Schema Overview

### Table Relationships

```
admin_users (1)
    ├── (1:N) audit_logs
    └── (1:N) backups

profiles (1)
    └── (1:N) public portfolio content

tech_stack (N)
    └── displayed in portfolio

journey_items (N)
    └── displayed in portfolio

projects (N)
    ├── has technologies (array)
    └── displayed in portfolio

achievements (N)
    └── displayed in portfolio

contact_info (1)
    └── displayed in portfolio
```

### Data Types

- **UUID**: Unique identifiers (auto-generated)
- **VARCHAR**: Text with length limits
- **TEXT**: Unlimited text
- **INTEGER**: Whole numbers
- **TIMESTAMP**: Date and time
- **BOOLEAN**: True/false
- **JSONB**: JSON data (for audit logs and backups)
- **TEXT[]**: Array of text (for technologies)

## Common Tasks

### Add a New Admin User

```sql
INSERT INTO admin_users (email, password_hash, is_active)
VALUES ('newadmin@example.com', '<bcrypt-hash>', true);
```

### View Audit Logs

```sql
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;
```

### Check Database Size

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitor Index Usage

```sql
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

## Troubleshooting

### Migrations Won't Run

**Problem:** "Permission denied" error

**Solution:** Ensure you're using the postgres superuser role or a role with sufficient permissions.

### Tables Already Exist

**Problem:** "Relation already exists" error

**Solution:** This shouldn't happen with idempotent migrations. If it does, the migration files are correct and can be safely re-run.

### RLS Not Working

**Problem:** Can't access data even with authentication

**Solution:**
1. Verify RLS is enabled: `SELECT * FROM pg_tables WHERE tablename = 'profiles';`
2. Check policies exist: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`
3. Ensure JWT tokens are being sent with requests
4. Verify Supabase authentication is configured

### Slow Queries

**Problem:** Queries taking longer than expected

**Solution:**
1. Check if indexes are being used: `EXPLAIN ANALYZE SELECT ...;`
2. Verify indexes exist: `SELECT * FROM pg_indexes WHERE tablename = 'projects';`
3. Consider adding additional indexes for complex queries

## Next Steps

After running migrations:

1. **Populate Initial Data**
   - Create admin user
   - Migrate data from portfolio.ts
   - Upload images and PDFs

2. **Configure Application**
   - Set environment variables
   - Configure Supabase client
   - Test database connections

3. **Test Security**
   - Verify RLS policies work
   - Test authentication flow
   - Check audit logging

4. **Monitor Performance**
   - Run Lighthouse tests
   - Monitor query performance
   - Check database metrics

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Migrations Guide](https://supabase.com/docs/guides/database/migrations)

## Support

For detailed information about each migration, see `migrations/README.md`.

For issues or questions:
1. Check the detailed README in the migrations directory
2. Review Supabase documentation
3. Check project documentation
4. Contact the development team

---

**Version:** 1.0
**Last Updated:** 2025-05-15
**Status:** ✓ Ready for Use
