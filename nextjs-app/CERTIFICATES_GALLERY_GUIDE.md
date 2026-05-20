# Certificates Gallery Page - Quick Reference Guide

## Overview

The certificates gallery page displays all achievements and certifications with filtering, pagination, and PDF preview capabilities.

**URL**: `/certificates`

---

## Features

### 1. Category Filtering
- Click category buttons to filter certificates
- Shows count of certificates per category
- URL updates with filter: `/certificates?category=Kursus Online`

**Available Categories**:
- Kursus Online (Online Courses)
- Webinar Online (Online Webinars)
- Seminar Pelatihan (Training Seminars)
- International Forum (International Forums)

### 2. Pagination
- 12 certificates per page
- Previous/Next buttons
- Page number buttons
- URL updates with page: `/certificates?page=2`

### 3. PDF Preview
- Click "View PDF" button on certificate card
- Opens PDF in modal dialog
- Download button available
- Close button to dismiss

### 4. External Links
- Click external link icon to verify certificate
- Opens in new tab
- Supports Dicoding, Sololearn, and other platforms

---

## File Structure

```
src/app/certificates/
├── page.tsx              # Main gallery page (server component)
├── page.test.tsx         # Unit tests
└── layout.tsx            # (optional) Layout for certificates section

src/components/ui/
├── CertificateCard.tsx   # Certificate card component (client)
└── PDFPreview.tsx        # PDF preview modal (existing)
```

---

## Component Usage

### CertificateCard Component

```typescript
import CertificateCard from '@/components/ui/CertificateCard';

<CertificateCard 
  certificate={{
    id: '1',
    title: 'Certificate Title',
    category: 'Kursus Online',
    issuer: 'Issuer Name',
    year: 2025,
    pdf_url: '/certificates/cert-1.pdf',
    external_link: 'https://example.com/verify'
  }}
/>
```

---

## Data Flow

```
User visits /certificates
    ↓
Server fetches certificates from Supabase
    ↓
Filter by category (if provided in URL)
    ↓
Apply pagination (12 items per page)
    ↓
Render certificate cards
    ↓
User can:
  - Click category filter
  - Navigate pages
  - View PDF
  - Open external link
```

---

## URL Examples

| URL | Description |
|-----|-------------|
| `/certificates` | All certificates, page 1 |
| `/certificates?category=Kursus Online` | Filter by category |
| `/certificates?page=2` | Page 2 of all certificates |
| `/certificates?category=Webinar Online&page=2` | Filter + pagination |

---

## Styling

### Grid Layout
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### Colors
- Background: `bg-slate-800/50`
- Border: `border-slate-700/50`
- Header: `from-blue-600/20 to-purple-600/20`
- Accent: `text-blue-400`

### Spacing
- Gap between cards: `gap-6`
- Padding: `p-4` (cards), `p-6` (content)
- Margin: `mb-8` (sections)

---

## Performance

### ISR (Incremental Static Regeneration)
- Revalidates every 1 hour (3600 seconds)
- Cached on Vercel CDN
- Updates automatically when certificates change

### Optimization
- Server-side rendering
- Lazy loading of PDF preview
- Efficient pagination
- Optimized database queries

---

## Testing

### Run Tests
```bash
npm run test -- src/app/certificates/page.test.tsx
```

### Test Coverage
- Page rendering
- Category filtering
- Pagination
- Empty states
- Error handling

---

## Customization

### Change Items Per Page
Edit `ITEMS_PER_PAGE` in `src/app/certificates/page.tsx`:
```typescript
const ITEMS_PER_PAGE = 12; // Change to desired number
```

### Change Revalidation Time
Edit `revalidate` in `src/app/certificates/page.tsx`:
```typescript
export const revalidate = 3600; // Change to desired seconds
```

### Add New Category
Categories are automatically extracted from database:
```typescript
const categories = Array.from(new Set(certificates.map(c => c.category)));
```

---

## Troubleshooting

### Certificates Not Showing
1. Check Supabase connection
2. Verify `getAchievements()` function
3. Check database for data
4. Review browser console for errors

### PDF Not Opening
1. Verify PDF URL is correct
2. Check PDF file exists in storage
3. Verify CORS settings
4. Check browser console for errors

### Pagination Not Working
1. Verify URL parameters
2. Check total pages calculation
3. Verify page number is valid
4. Check browser console for errors

### Filtering Not Working
1. Verify category name matches database
2. Check URL encoding
3. Verify certificates have category
4. Check browser console for errors

---

## SEO

### Meta Tags
- Title: "Certificates & Achievements | Zakky Ahmad El-Kholily"
- Description: "Explore my certifications, courses, and achievements..."
- Open Graph tags for social sharing

### Structured Data
- JSON-LD schema (inherited from root layout)
- Proper heading hierarchy
- Semantic HTML markup

---

## Accessibility

### Features
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast compliance
- Touch-friendly buttons (44x44px minimum)

### Screen Reader Support
- Proper heading structure
- Alt text for icons
- Descriptive link text
- Form labels

---

## Related Pages

- **Home**: `/` - Main portfolio page
- **Projects**: `/projects` - Projects gallery
- **Project Detail**: `/projects/[id]` - Individual project page

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review test files for usage examples
3. Check Supabase dashboard for data
4. Review Next.js documentation

---

**Last Updated**: 2024-01-16  
**Version**: 1.0  
**Status**: Production Ready

