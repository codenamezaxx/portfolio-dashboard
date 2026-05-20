# Data Export from portfolio.ts

## Overview

This document provides a comprehensive export of all static portfolio data from the Vite React portfolio (`data/portfolio.ts`). The data has been extracted, structured, and prepared for migration to Supabase database.

**Export Date**: 2024-01-15  
**Source**: `/data/portfolio.ts` (Vite React Portfolio)  
**Destination**: Supabase PostgreSQL Database  
**Total Records**: 37

---

## 1. Profile Information

### Profile Data
```json
{
  "name": "Zakky Ahmad El-Kholily",
  "role": "Front-End Web Developer | Public Speaker",
  "tagline": "IT Enthusiast dari jurusan Teknik Jaringan Komputer dan Telekomunikasi yang senang memecahkan masalah, membangun sistem yang berjalan dengan baik, terus belajar teknologi baru, serta senang berbagi pengetahuan dan pengalaman.",
  "heroImage": null
}
```

**Database Table**: `profiles`  
**Record Count**: 1  
**Fields**:
- `name` (VARCHAR 255): Full name
- `role` (VARCHAR 255): Professional role/title
- `tagline` (TEXT): Professional tagline/bio
- `hero_image_url` (VARCHAR 500): Hero section image URL (optional)

---

## 2. Contact Information

### Contact Data
```json
{
  "github": "https://github.com/codenamezaxx",
  "linkedin": "https://linkedin.com/in/zakky-el",
  "instagram": "https://instagram.com/codenamezaxx",
  "telegram": "https://t.me/codenamezaxx",
  "email": "zakky.ahmad@protonmail.com"
}
```

**Database Table**: `contact_info`  
**Record Count**: 1  
**Fields**:
- `github_url` (VARCHAR 500): GitHub profile URL
- `linkedin_url` (VARCHAR 500): LinkedIn profile URL
- `instagram_url` (VARCHAR 500): Instagram profile URL
- `telegram_url` (VARCHAR 500): Telegram profile URL
- `email` (VARCHAR 255): Email address

---

## 3. Tech Stack

### Tech Stack Items (12 items)

| # | Name | Icon URL | Category |
|---|------|----------|----------|
| 1 | HTML5 | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg | Frontend |
| 2 | CSS3 | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg | Frontend |
| 3 | JavaScript | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg | Frontend |
| 4 | TypeScript | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg | Frontend |
| 5 | React | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg | Frontend |
| 6 | Tailwind | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg | Frontend |
| 7 | Node.js | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg | Backend |
| 8 | Python | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg | Backend |
| 9 | Godot Engine | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg | Game Dev |
| 10 | Unity Engine | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg | Game Dev |
| 11 | C# | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg | Backend |
| 12 | Git | https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg | Tools |

**Database Table**: `tech_stack`  
**Record Count**: 12  
**Fields**:
- `name` (VARCHAR 100): Technology name
- `icon_url` (VARCHAR 500): Icon URL (Devicon CDN)
- `display_order` (INTEGER): Display order in UI
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

## 4. Journey Timeline

### Journey Items (8 items)

| Year | Title | Description |
|------|-------|-------------|
| 2020 | Mulai belajar programming | Dasar-dasar programming dan problem solving. |
| 2021 | Fokus pada Web Development | HTML, CSS, JavaScript dan aplikasi web kecil. |
| 2022 | Langkah awal Public Speaking | Melatih kemampuan untuk berani berbicara di depan umum. |
| 2023 | Game Development | Fokus mempelajari game engine dan interactive systems. |
| 2024 | Mengikuti Organisasi | Melatih teamwork dan leadership melalui kegiatan organisasi. |
| 2025 | Membangun Portofolio | Membangun proyek portofolio serta terjun ke dunia kerja melalui program internship. |
| Sekarang | Berkembang dan Membangun Karier | Berkomitmen untuk terus belajar teknologi baru, meningkatkan skill, dan membangun karier di bidang IT. |
| Mendatang | Menjadi Profesional IT yang Handal | Berkeinginan menjadi seorang Fullstack Web Developer serta menjadi Indie Game Developer yang kompeten. |

**Database Table**: `journey_items`  
**Record Count**: 8  
**Fields**:
- `year` (VARCHAR 50): Year or time period
- `title` (VARCHAR 255): Journey milestone title
- `description` (TEXT): Detailed description
- `display_order` (INTEGER): Display order in timeline
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

## 5. Projects

### Project 1: Online Quran
```json
{
  "title": "Online Quran",
  "description": "Aplikasi pembacaan Al-Quran online dengan fitur pencarian, tafsir, dan terjemahan.",
  "category": "Web App",
  "image": "/images/quranjs.jpg",
  "technologies": ["React", "W3.CSS", "Al-Quran API"],
  "links": {
    "github": "https://github.com/codenamezaxx/ReactJs-Online-Quran",
    "live": "https://alquran.codenamezaxx.my.id"
  }
}
```

### Project 2: SI-PORSI GERMAS
```json
{
  "title": "SI-PORSI GERMAS",
  "description": "Platform terpadu untuk mengelola pelaporan, evaluasi, dan arsip program GERMAS di tatanan tempat kerja di Provinsi Jawa Timur. Dibangun saat mengikuti program internship di Dinas Kesehatan Provinsi Jawa Timur.",
  "category": "Web App",
  "image": "/images/germas.png",
  "technologies": ["React", "Laravel", "MySQL", "PHP", "TypeScript", "Tailwind"],
  "links": {
    "github": "https://github.com/codenamezaxx/siporsi-germas",
    "live": "https://demo.com"
  }
}
```

### Project 3: Cyberurnner
```json
{
  "title": "Cyberurnner",
  "description": "Game platformer 2D dengan tema cyberpunk. Pemain mengendalikan karakter yang harus berlari dan melompat melewati rintangan serta serangan musuh sambil mengumpulkan koin dan gems.",
  "category": "Game Dev",
  "image": "https://img.itch.zone/aW1nLzkwNzYzNTEuanBn/315x250%23c/uI6egT.jpg",
  "technologies": ["Godot Engine", "GDScript", "Photoshop", "Aseprite"],
  "links": {
    "itchio": "https://codenamezaxx.itch.io/cyberunner-demo"
  }
}
```

### Project 4: Diamond Hunter: The Rivals
```json
{
  "title": "Diamond Hunter: The Rivals",
  "description": "Kumpulkan berlian sebanyak mungkin dan hindari serangan musuh pada game 2D yang sederhana namun seru dan menantang.",
  "category": "Game Dev",
  "image": "https://img.itch.zone/aW1nLzkxMDI0MDgucG5n/315x250%23c/HWbGq1.png",
  "technologies": ["Construct 2", "Photoshop"],
  "links": {
    "itchio": "https://codenamezaxx.itch.io/diamond-hunter-the-rivals",
    "live": "https://diamond-hunter.netlify.app"
  }
}
```

**Database Table**: `projects`  
**Record Count**: 4  
**Fields**:
- `title` (VARCHAR 255): Project title
- `description` (TEXT): Project description
- `category` (VARCHAR 100): Project category (Web App, Game Dev, etc.)
- `image_url` (VARCHAR 500): Project image/screenshot URL
- `technologies` (TEXT[]): Array of technologies used
- `github_link` (VARCHAR 500): GitHub repository URL
- `live_link` (VARCHAR 500): Live demo URL
- `demo_link` (VARCHAR 500): Alternative demo/itch.io URL
- `display_order` (INTEGER): Display order in portfolio
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

## 6. Achievements & Certificates

### Achievement 1
```json
{
  "title": "Memulai Pemrograman dengan Python",
  "category": "Kursus Online",
  "issuer": "Dicoding Indonesia",
  "year": 2025,
  "pdfUrl": "/certificates/cert-1.pdf",
  "externalLink": "https://www.dicoding.com/certificates/98XWOL0DLZM3"
}
```

### Achievement 2
```json
{
  "title": "Belajar Dasar AI",
  "category": "Kursus Online",
  "issuer": "Dicoding Indonesia",
  "year": 2025,
  "pdfUrl": "/certificates/cert-2.pdf",
  "externalLink": "https://www.dicoding.com/certificates/98XWOL0DLZM3"
}
```

### Achievement 3
```json
{
  "title": "Participant of Mercu Buana Yogyakarta International Youth Forum (MIYF) 2024",
  "category": "International Forum",
  "issuer": "Mercu Buana University Yogyakarta",
  "year": 2024,
  "pdfUrl": "/certificates/cert-3.pdf"
}
```

### Achievement 4
```json
{
  "title": "Public Speaking With Trainer",
  "category": "Webinar Online",
  "issuer": "KT&G SangSang University",
  "year": 2024,
  "pdfUrl": "/certificates/cert-4.pdf"
}
```

### Achievement 5
```json
{
  "title": "Building Persona and Image",
  "category": "Webinar Online",
  "issuer": "KT&G SangSang University",
  "year": 2024,
  "pdfUrl": "/certificates/cert-5.pdf"
}
```

### Achievement 6
```json
{
  "title": "Youth Leadership Camps",
  "category": "Webinar Online",
  "issuer": "PT. Seasia Intelektual Akademis",
  "year": 2024,
  "pdfUrl": "/certificates/cert-6.pdf"
}
```

### Achievement 7
```json
{
  "title": "Public Speaking Training Course",
  "category": "Seminar Pelatihan",
  "issuer": "Accelerate Hub & Young People Talks Indonesia",
  "year": 2024,
  "pdfUrl": "/certificates/cert-7.pdf"
}
```

### Achievement 8
```json
{
  "title": "Belajar HTML",
  "category": "Kursus Online",
  "issuer": "Always Ngoding",
  "year": 2022,
  "pdfUrl": "/certificates/cert-8.pdf"
}
```

### Achievement 9
```json
{
  "title": "Game Development with JavaScript",
  "category": "Kursus Online",
  "issuer": "Sololearn",
  "year": 2022,
  "pdfUrl": "/certificates/cert-9.pdf"
}
```

### Achievement 10
```json
{
  "title": "Python Core",
  "category": "Kursus Online",
  "issuer": "Sololearn",
  "year": 2021,
  "pdfUrl": "/certificates/cert-10.pdf"
}
```

### Achievement 11
```json
{
  "title": "Python Course Completion",
  "category": "Kursus Online",
  "issuer": "Mimo",
  "year": 2023,
  "pdfUrl": "/certificates/cert-11.pdf"
}
```

**Database Table**: `achievements`  
**Record Count**: 11  
**Fields**:
- `title` (VARCHAR 255): Achievement/certificate title
- `category` (VARCHAR 100): Category (Kursus Online, Webinar, etc.)
- `issuer` (VARCHAR 255): Issuing organization
- `year` (INTEGER): Year obtained
- `pdf_url` (VARCHAR 500): PDF certificate URL
- `external_link` (VARCHAR 500): External verification link (optional)
- `display_order` (INTEGER): Display order in gallery
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

## Data Summary

| Category | Count | Status |
|----------|-------|--------|
| Profile | 1 | ✓ Exported |
| Contact Info | 1 | ✓ Exported |
| Tech Stack | 12 | ✓ Exported |
| Journey Items | 8 | ✓ Exported |
| Projects | 4 | ✓ Exported |
| Achievements | 11 | ✓ Exported |
| **TOTAL** | **37** | **✓ Complete** |

---

## Data Transformation Rules

### Field Mapping

| Original Field | Database Field | Transformation |
|---|---|---|
| `icon` (TechItem) | `icon_url` | Direct mapping |
| `pdfPath` (Achievement) | `pdf_url` | Direct mapping |
| `tech` (Project) | `technologies` | Array mapping |
| `links.github` (Project) | `github_link` | Direct mapping |
| `links.demo` (Project) | `live_link` | Direct mapping |
| `links.itchio` (Project) | `demo_link` | Direct mapping |
| `socials.email` (Profile) | `email` | Remove "mailto:" prefix |
| N/A | `display_order` | Auto-generated from array index |
| N/A | `updated_at` | Current timestamp |

### Data Types

- **VARCHAR(n)**: String fields with max length
- **TEXT**: Long text fields (descriptions, taglines)
- **INTEGER**: Numeric fields (year, display_order)
- **TIMESTAMP**: Date/time fields
- **TEXT[]**: Array of strings (technologies)
- **JSONB**: Complex objects (future use)

---

## Validation Rules

### Profile
- ✓ Name: Required, non-empty
- ✓ Role: Required, non-empty
- ✓ Tagline: Required, non-empty

### Contact Info
- ✓ At least one contact method required
- ✓ URLs must be valid format
- ✓ Email must be valid format

### Tech Stack
- ✓ Name: Required, non-empty
- ✓ Icon URL: Required, valid URL
- ✓ Display order: Auto-generated

### Journey Items
- ✓ Year: Required, non-empty
- ✓ Title: Required, non-empty
- ✓ Description: Required, non-empty

### Projects
- ✓ Title: Required, non-empty
- ✓ Description: Required, non-empty
- ✓ Category: Required, non-empty
- ✓ Technologies: Required, non-empty array
- ✓ At least one link required

### Achievements
- ✓ Title: Required, non-empty
- ✓ Category: Required, non-empty
- ✓ Issuer: Required, non-empty
- ✓ Year: Required, valid integer
- ✓ PDF URL: Required, valid URL

---

## Migration Status

### Completed ✓
- [x] Data extracted from portfolio.ts
- [x] Data structure documented
- [x] Transformation rules defined
- [x] Validation rules established
- [x] Migration script created (`scripts/migrate-data.ts`)
- [x] Backup mechanism implemented
- [x] Verification script created (`scripts/verify-migration.ts`)

### Next Steps
1. Run migration script: `npx ts-node scripts/migrate-data.ts`
2. Verify migration: `npx ts-node scripts/verify-migration.ts`
3. Update application to fetch from database
4. Test public portfolio with database data
5. Deploy to production

---

## Files Reference

### Source Files
- **Portfolio Data**: `/data/portfolio.ts` (Vite React Portfolio)
- **Type Definitions**: `/types/index.ts` (Vite React Portfolio)

### Migration Files
- **Migration Script**: `nextjs-app/scripts/migrate-data.ts`
- **Verification Script**: `nextjs-app/scripts/verify-migration.ts`
- **Test Suite**: `nextjs-app/scripts/migrate-data.test.ts`
- **Backup Location**: `nextjs-app/backups/portfolio-backup-{timestamp}.json`

### Documentation
- **Migration Guide**: `nextjs-app/DATA_MIGRATION.md`
- **Phase Summary**: `nextjs-app/PHASE_4_4_SUMMARY.md`
- **This Document**: `nextjs-app/DATA_EXPORT.md`

---

## Notes

- All URLs use HTTPS for security
- Icon URLs use Devicon CDN for consistency
- PDF paths are relative to public directory
- Display order is auto-generated from array index
- Timestamps are in ISO 8601 format
- All text is in Indonesian (Bahasa Indonesia) as per original
- Email is stored without "mailto:" prefix for database compatibility

---

**Export Completed**: 2024-01-15  
**Total Records Exported**: 37  
**Status**: ✅ Ready for Migration
