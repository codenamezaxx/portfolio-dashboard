# Resume Download Fix - Implementation Summary

## Problem
Tombol "Unduh CV" di halaman Hero menampilkan error 404 karena:
1. Tidak ada kolom `resume_url` di tabel `profiles` di database
2. Tidak ada endpoint API untuk mengambil resume URL
3. Tidak ada cara untuk admin mengupload resume

## Solution
Implementasi sistem lengkap untuk upload dan download resume dengan langkah-langkah berikut:

## 1. Database Schema Update

### Tambahkan kolom `resume_url` ke tabel `profiles`

**SQL Command:**
```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS resume_url TEXT;

COMMENT ON COLUMN profiles.resume_url IS 'URL to the user resume/CV file stored in Supabase Storage';
```

**Cara menjalankan:**
1. Buka Supabase Dashboard
2. Pergi ke SQL Editor
3. Jalankan query di atas
4. Atau jalankan script: `npx ts-node scripts/add-resume-column.ts`

## 2. API Endpoints

### A. GET /api/portfolio/resume
**File:** `src/app/api/portfolio/resume/route.ts`

Mengambil resume URL dari profile untuk ditampilkan di halaman publik.

**Response:**
```json
{
  "resume_url": "https://supabase-storage-url/resumes/resume.pdf"
}
```

**Error:**
- 404: Resume tidak tersedia
- 500: Server error

### B. PUT /api/content/profile-resume
**File:** `src/app/api/content/profile-resume/route.ts`

Update resume URL di profile (memerlukan autentikasi).

**Request:**
```json
{
  "resume_url": "https://supabase-storage-url/resumes/resume.pdf"
}
```

**Response:**
```json
{
  "message": "Resume updated successfully",
  "data": { ... }
}
```

**Autentikasi:** Diperlukan session token di cookie

## 3. Frontend Components

### A. Hero Component (`src/components/sections/Hero.tsx`)

**Perubahan:**
- Tambah state untuk `resumeUrl` dan `isDownloading`
- Fetch resume URL dari `/api/portfolio/resume` saat component mount
- Update button handler untuk download resume
- Button disabled jika resume tidak tersedia

**Fitur:**
- Loading state saat mengunduh
- Error handling dengan alert
- Membuka resume di tab baru

### B. ProfileSettings Component (`src/components/admin/ProfileSettings.tsx`)

**Perubahan:**
- Tambah form untuk upload resume
- Validasi file (hanya PDF, max 5MB)
- Upload ke Supabase Storage via `/api/upload/pdf`
- Update profile dengan resume URL via `/api/content/profile-resume`
- Success/error messages

**Fitur:**
- File preview sebelum upload
- Progress indication
- Error handling
- Success confirmation

## 4. Type Definitions

### Profile Interface (`src/lib/portfolio-data.ts`)

```typescript
export interface Profile {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  hero_image_url?: string;
  resume_url?: string;  // NEW
  created_at?: string;
  updated_at?: string;
}
```

## 5. Migration Script

**File:** `scripts/add-resume-column.ts`

Script untuk menambahkan kolom `resume_url` ke database secara otomatis.

**Cara menjalankan:**
```bash
npx ts-node scripts/add-resume-column.ts
```

## Setup Instructions

### Step 1: Update Database
```bash
# Option A: Manual SQL
# Buka Supabase Dashboard > SQL Editor dan jalankan query di atas

# Option B: Menggunakan script
npx ts-node scripts/add-resume-column.ts
```

### Step 2: Deploy Changes
```bash
npm run build
npm run dev
```

### Step 3: Upload Resume (Admin)
1. Login ke admin panel
2. Pergi ke Profile Settings
3. Klik "Upload Resume/CV"
4. Pilih file PDF (max 5MB)
5. Klik "Upload Resume"
6. Tunggu hingga berhasil

### Step 4: Test Download (Public)
1. Buka halaman home
2. Klik tombol "Unduh CV"
3. Resume akan dibuka di tab baru atau diunduh

## File Changes Summary

### New Files
- `src/app/api/portfolio/resume/route.ts` - GET endpoint untuk resume
- `src/app/api/content/profile-resume/route.ts` - PUT endpoint untuk update resume
- `scripts/add-resume-column.ts` - Migration script
- `RESUME_DOWNLOAD_FIX.md` - Dokumentasi ini

### Modified Files
- `src/components/sections/Hero.tsx` - Update untuk fetch dan download resume
- `src/components/admin/ProfileSettings.tsx` - Tambah form upload resume
- `src/lib/portfolio-data.ts` - Tambah `resume_url` ke Profile interface

## Testing Checklist

- [ ] Database column `resume_url` berhasil ditambahkan
- [ ] API endpoint `/api/portfolio/resume` berfungsi
- [ ] API endpoint `/api/content/profile-resume` berfungsi
- [ ] Admin bisa upload resume di ProfileSettings
- [ ] Resume tersimpan di Supabase Storage
- [ ] Resume URL tersimpan di database
- [ ] Tombol "Unduh CV" di Hero berfungsi
- [ ] Resume terbuka di tab baru saat diklik
- [ ] Build berhasil tanpa error

## Troubleshooting

### Resume tidak muncul di Hero
1. Pastikan resume sudah diupload di admin panel
2. Check browser console untuk error messages
3. Verify API endpoint `/api/portfolio/resume` mengembalikan URL

### Upload resume gagal
1. Pastikan file adalah PDF
2. Pastikan ukuran file < 5MB
3. Check Supabase Storage permissions
4. Verify session token valid

### 404 saat download
1. Pastikan resume URL valid di database
2. Check Supabase Storage bucket `portfolio-pdfs` ada
3. Verify file ada di storage

## Performance Notes

- Resume URL di-cache dengan TTL 1 jam
- Lazy loading resume URL saat Hero component mount
- File upload dengan progress tracking
- Optimized untuk mobile dan desktop

## Security Notes

- Resume upload memerlukan autentikasi
- File validation (PDF only, max 5MB)
- URL stored di database, file di Supabase Storage
- RLS policies applied ke storage bucket

## Future Enhancements

- [ ] Multiple resume versions (EN, ID)
- [ ] Resume preview sebelum download
- [ ] Analytics untuk download tracking
- [ ] Automatic resume backup
- [ ] Resume versioning dengan history
