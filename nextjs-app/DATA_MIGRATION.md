# Data Migration Guide

## Overview

This guide explains how to migrate portfolio data from the static `portfolio.ts` file to Supabase database. The migration includes:

- **Profiles**: Personal information and role
- **Contact Info**: Social media links and email
- **Tech Stack**: Technologies and tools (12 items)
- **Journey Items**: Career timeline (8 items)
- **Projects**: Portfolio projects (4 items)
- **Achievements**: Certifications and courses (11 items)

## Prerequisites

1. Supabase project created and configured
2. Database tables created with proper schema
3. Environment variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Migration Steps

### 1. Prepare Environment

Ensure your `.env.local` has the required credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run Migration Script

```bash
# Install dependencies if needed
npm install

# Run the migration
npx ts-node scripts/migrate-data.ts
```

### 3. Verify Migration

```bash
# Verify all data was migrated correctly
npx ts-node scripts/verify-migration.ts
```

## Migration Script Details

### What It Does

1. **Creates Backup**: Saves original data to `backups/portfolio-backup-{timestamp}.json`
2. **Migrates Profiles**: Inserts personal information
3. **Migrates Contact Info**: Inserts social media links
4. **Migrates Tech Stack**: Inserts 12 technologies with display order
5. **Migrates Journey**: Inserts 8 career timeline items
6. **Migrates Projects**: Inserts 4 portfolio projects
7. **Migrates Achievements**: Inserts 11 certifications

### Data Transformation

The script transforms data from the static format to database format:

```typescript
// Static format (portfolio.ts)
{
  name: "HTML5",
  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
}

// Database format
{
  name: "HTML5",
  icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  display_order: 1,
  updated_at: "2024-01-15T10:30:00Z"
}
```

### Upsert Strategy

The script uses `upsert` to handle existing data:

- **Profiles**: Upserts by ID (single record)
- **Contact Info**: Upserts by ID (single record)
- **Tech Stack**: Upserts by name (prevents duplicates)
- **Journey**: Upserts by title (prevents duplicates)
- **Projects**: Upserts by title (prevents duplicates)
- **Achievements**: Upserts by title (prevents duplicates)

## Verification Script Details

### What It Checks

1. **Record Counts**: Verifies expected number of records in each table
2. **Profile Data**: Checks name, role, and tagline
3. **Contact Info**: Verifies all social links are present
4. **Sample Records**: Displays sample records from each table

### Expected Counts

- Profiles: 1
- Contact Info: 1
- Tech Stack: 12
- Journey Items: 8
- Projects: 4
- Achievements: 11

## Backup and Recovery

### Backup Location

Backups are saved to: `nextjs-app/backups/portfolio-backup-{timestamp}.json`

### Backup Contents

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "profile": { ... },
  "techStack": [ ... ],
  "journey": [ ... ],
  "projects": [ ... ],
  "achievements": [ ... ]
}
```

### Restore from Backup

If needed, you can restore data from the backup:

```typescript
import * as fs from 'fs';

const backup = JSON.parse(fs.readFileSync('backups/portfolio-backup-{timestamp}.json', 'utf-8'));

// Use backup data to restore
```

## Troubleshooting

### Migration Fails with "Invalid API Key"

**Solution**: Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `.env.local`

### Migration Fails with "Table Does Not Exist"

**Solution**: Ensure all database tables are created. Run the schema migration first:

```bash
# Check Supabase dashboard for table creation
# Or run migration scripts from Supabase
```

### Duplicate Records After Migration

**Solution**: The script uses upsert, so running it again will update existing records. To start fresh:

1. Delete all records from tables in Supabase dashboard
2. Run migration script again

### Verification Shows Missing Records

**Solution**: Check the migration output for errors. Common issues:

- Network connectivity problems
- Invalid data format
- Missing required fields

## Data Integrity Checks

### Before Migration

- ✓ All static data is valid
- ✓ No duplicate entries
- ✓ All URLs are accessible
- ✓ All required fields are present

### After Migration

- ✓ Record counts match expected values
- ✓ All data is accessible via API
- ✓ Display order is preserved
- ✓ Timestamps are set correctly

## Performance Considerations

### Migration Time

- Expected duration: 5-10 seconds
- Depends on network connectivity
- Batch operations are used for efficiency

### Database Impact

- Minimal impact on production
- Uses upsert to prevent conflicts
- No downtime required

## Next Steps

After successful migration:

1. **Test Public Portfolio**: Verify all content displays correctly
2. **Test Admin Panel**: Ensure admin can edit migrated content
3. **Monitor Real-time Updates**: Verify changes propagate within 5 seconds
4. **Archive Original Data**: Keep backup for reference

## Rollback Procedure

If migration fails or needs to be rolled back:

1. **Delete Migrated Data**: Clear all tables in Supabase
2. **Restore from Backup**: Use backup file to restore original data
3. **Investigate Issues**: Check error logs and fix issues
4. **Re-run Migration**: Run migration script again

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Data Migration Best Practices](https://supabase.com/docs/guides/migrations)
- [Backup and Recovery](https://supabase.com/docs/guides/database/backups)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review migration script output for error messages
3. Check Supabase dashboard for table status
4. Review environment variables configuration
