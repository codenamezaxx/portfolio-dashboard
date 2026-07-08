# Admin Panel User Guide

## Access

1. Navigate to `/login` on the site
2. Enter your admin email and password
3. Upon successful authentication, you'll be redirected to `/admin`

**Session:** 24-hour expiry. After expiry, you'll need to log in again.

---

## Dashboard (`/admin`)

The dashboard shows key statistics:
- Total projects, achievements, tech stack items
- Journey entries count
- Recent activity log entries

---

## Content Management

### Hero Section (`/admin/hero`)
Edit profile content displayed on the home page hero section:
- **Status Label:** Small badge text (e.g. "Open to work")
- **Full Name:** Your display name
- **Professional Role:** Job title
- **Tagline / Introduction:** Brief professional summary
- **English fields:** All fields have English-language counterparts for bilingual mode
- **Hero Image:** Upload a featured presentation image

### Tech Stack (`/admin/tech-stack`)
Manage technology icons displayed in the tech grid:
- **Add:** Enter technology name, icon URL, and category
- **Reorder:** Drag and drop to rearrange display order
- **Edit/Delete:** Modify or remove existing items

### Journey (`/admin/journey`)
Manage career/education timeline entries:
- **Title & Description:** Entry content (bilingual)
- **Year/Period:** Time period string
- **Category:** Education, Work, or Organization

### Projects (`/admin/projects`)
Full project management:
- **Title & Description:** Project details (bilingual)
- **Category:** Group projects by type
- **Image:** Upload project thumbnail
- **Links:** GitHub, Live Demo, and Game Demo URLs
- **Technologies:** Add tech tags
- **Reorder:** Drag and drop to rearrange

### Achievements (`/admin/achievements`)
Manage certificates and awards:
- **Title & Issuer:** Achievement details (bilingual title)
- **Category:** Group by type
- **Year:** Year achieved
- **PDF Upload:** Upload certificate PDF
- **External Link:** Verification link
- **Reorder:** Drag and drop to rearrange

### Contact Info (`/admin/contact`)
Manage contact information and social links:
- **Type:** email, phone, social, or location
- **Label:** Display label
- **Value:** Contact value
- **Primary:** Mark primary contacts
- **Reorder:** Drag and drop to rearrange

---

## User Management (`/admin/users`)

Manage admin panel user accounts:
- **Create:** Add new admin users (email, password, name)
- **Edit:** Update existing users
- **Disable:** Deactivate accounts without deleting
- **Password Change:** Set new passwords

---

## Activity Log (`/admin/activity-log`)

Track all changes made in the admin panel:
- View action type (CREATE, UPDATE, DELETE)
- Filter by entity type and action
- See which admin performed the action
- View detailed change information

---

## Backups (`/admin/backups`)

Database backup management:
- **Create:** Take a full database backup
- **Verify:** Check backup integrity
- **Restore:** Restore from a backup
- **Download:** Download backup files
- **Cleanup:** Remove old backups

---

## Localization

The admin panel supports bilingual content management:
- Each content item has Indonesian (default) and English fields
- Fill in English fields to enable bilingual display
- Visitors toggle language via the globe icon in the navigation bar
- The locale preference is stored in a cookie (`locale=id` or `locale=en`)

---

## Security Best Practices

1. **Always log out** when finished using the admin panel
2. **Use strong passwords** (min 8 characters, alphanumeric)
3. **Review audit logs** periodically for unauthorized changes
4. **Back up data** before making bulk changes
5. **Sessions expire** after 24 hours of inactivity
