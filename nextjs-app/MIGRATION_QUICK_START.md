# Data Migration - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Prepare Environment
```bash
cd nextjs-app

# Verify .env.local has these variables:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### Step 2: Run Migration
```bash
npx ts-node scripts/migrate-data.ts
```

### Step 3: Setup Storage
```bash
npm run setup:storage
```

Expected output:
```
🔧 Setting up Supabase Storage buckets...

📦 Checking bucket: portfolio-images...
   ✨ Creating bucket: portfolio-images...
   ✅ Bucket portfolio-images created successfully.

📦 Checking bucket: portfolio-pdfs...
   ✨ Creating bucket: portfolio-pdfs...
   ✅ Bucket portfolio-pdfs created successfully.

✨ Storage setup complete!
```

### Step 4: Verify Migration
```bash
npx ts-node scripts/verify-migration.ts
```

Expected output:
```
✓ profiles: 1/1
✓ contact_info: 1/1
✓ tech_stack: 12/12
✓ journey_items: 8/8
✓ projects: 4/4
✓ achievements: 11/11

✅ All data verified successfully!
```

## 📊 What Gets Migrated

| Table | Records | Source |
|-------|---------|--------|
| profiles | 1 | PROFILE object |
| contact_info | 1 | PROFILE.socials |
| tech_stack | 12 | TECH_STACK array |
| journey_items | 8 | JOURNEY array |
| projects | 4 | PROJECTS array |
| achievements | 11 | ACHIEVEMENTS array |
| **Total** | **37** | **portfolio.ts** |

## 🔄 Data Transformation

### Tech Stack Example
```
portfolio.ts:
  { name: "React", icon: "https://..." }

Supabase:
  {
    name: "React",
    icon_url: "https://...",
    display_order: 5,
    updated_at: "2024-01-15T10:30:00Z"
  }
```

## 💾 Backup Location

```
nextjs-app/backups/portfolio-backup-{timestamp}.json
```

## ⚠️ Troubleshooting

### Error: "Invalid API Key"
```bash
# Check .env.local
cat .env.local | grep SUPABASE

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### Error: "Table Does Not Exist"
```bash
# Ensure database schema is created in Supabase
# Check Supabase dashboard > SQL Editor
# Run schema migration if needed
```

### Error: "Network Error"
```bash
# Check internet connection
# Verify Supabase is accessible
# Retry migration
npx ts-node scripts/migrate-data.ts
```

## ✅ Verification Checklist

- [ ] Migration script ran successfully
- [ ] All 37 records migrated
- [ ] Verification script passed
- [ ] Backup file created
- [ ] Public portfolio displays content
- [ ] Admin panel can edit content

## 📝 Next Steps

1. Test public portfolio displays all content
2. Test admin panel can edit migrated content
3. Verify real-time updates work (Phase 4.3)
4. Proceed to Phase 4.5 - Project Detail Page
5. ✅ Phase 5.1 - Next.js Image Optimization Complete

## 🆘 Need Help?

1. Check `DATA_MIGRATION.md` for detailed guide
2. Review migration script output for errors
3. Check Supabase dashboard for table status
4. Verify environment variables are correct

## 📚 Related Files

- `scripts/migrate-data.ts` - Migration script
- `scripts/verify-migration.ts` - Verification script
- `DATA_MIGRATION.md` - Detailed guide
- `PHASE_4_4_SUMMARY.md` - Phase overview
