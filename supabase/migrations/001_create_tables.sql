-- Migration: 001_create_tables.sql
-- Description: Create all 9 tables for the portfolio application
-- This migration is idempotent and can be run multiple times safely

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Stores portfolio owner profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  tagline TEXT NOT NULL,
  hero_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Portfolio owner profile information';
COMMENT ON COLUMN profiles.id IS 'Unique identifier for the profile';
COMMENT ON COLUMN profiles.name IS 'Portfolio owner name';
COMMENT ON COLUMN profiles.role IS 'Professional role/title';
COMMENT ON COLUMN profiles.tagline IS 'Short tagline/bio';
COMMENT ON COLUMN profiles.hero_image_url IS 'URL to hero/profile image';

-- ============================================================================
-- 2. TECH_STACK TABLE
-- ============================================================================
-- Stores technologies and tools used
CREATE TABLE IF NOT EXISTS tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE tech_stack IS 'Technologies and tools';
COMMENT ON COLUMN tech_stack.id IS 'Unique identifier for tech item';
COMMENT ON COLUMN tech_stack.name IS 'Technology name';
COMMENT ON COLUMN tech_stack.icon_url IS 'URL to technology icon';
COMMENT ON COLUMN tech_stack.display_order IS 'Display order in UI';

-- ============================================================================
-- 3. JOURNEY_ITEMS TABLE
-- ============================================================================
-- Stores career timeline/journey milestones
CREATE TABLE IF NOT EXISTS journey_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE journey_items IS 'Career timeline/journey milestones';
COMMENT ON COLUMN journey_items.id IS 'Unique identifier for journey item';
COMMENT ON COLUMN journey_items.year IS 'Year or time period';
COMMENT ON COLUMN journey_items.title IS 'Milestone title';
COMMENT ON COLUMN journey_items.description IS 'Detailed description';
COMMENT ON COLUMN journey_items.display_order IS 'Display order in timeline';

-- ============================================================================
-- 4. PROJECTS TABLE
-- ============================================================================
-- Stores portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_link VARCHAR(500),
  live_link VARCHAR(500),
  demo_link VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Portfolio projects';
COMMENT ON COLUMN projects.id IS 'Unique identifier for project';
COMMENT ON COLUMN projects.title IS 'Project title';
COMMENT ON COLUMN projects.description IS 'Project description';
COMMENT ON COLUMN projects.category IS 'Project category';
COMMENT ON COLUMN projects.image_url IS 'Project thumbnail/image URL';
COMMENT ON COLUMN projects.technologies IS 'Array of technology tags';
COMMENT ON COLUMN projects.github_link IS 'GitHub repository link';
COMMENT ON COLUMN projects.live_link IS 'Live demo link';
COMMENT ON COLUMN projects.demo_link IS 'Demo video or additional demo link';
COMMENT ON COLUMN projects.display_order IS 'Display order in portfolio';

-- ============================================================================
-- 5. ACHIEVEMENTS TABLE
-- ============================================================================
-- Stores certifications and achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  pdf_url VARCHAR(500) NOT NULL,
  external_link VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE achievements IS 'Certifications and achievements';
COMMENT ON COLUMN achievements.id IS 'Unique identifier for achievement';
COMMENT ON COLUMN achievements.title IS 'Achievement/certificate title';
COMMENT ON COLUMN achievements.category IS 'Category (e.g., "Course", "Certification")';
COMMENT ON COLUMN achievements.issuer IS 'Issuing organization';
COMMENT ON COLUMN achievements.year IS 'Year achieved';
COMMENT ON COLUMN achievements.pdf_url IS 'URL to PDF certificate';
COMMENT ON COLUMN achievements.external_link IS 'External link to credential';
COMMENT ON COLUMN achievements.display_order IS 'Display order';

-- ============================================================================
-- 6. CONTACT_INFO TABLE
-- ============================================================================
-- Stores social media and contact links
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  instagram_url VARCHAR(500),
  telegram_url VARCHAR(500),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE contact_info IS 'Social media and contact links';
COMMENT ON COLUMN contact_info.id IS 'Unique identifier for contact info';
COMMENT ON COLUMN contact_info.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN contact_info.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN contact_info.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN contact_info.telegram_url IS 'Telegram contact URL';
COMMENT ON COLUMN contact_info.email IS 'Email address';

-- ============================================================================
-- 7. ADMIN_USERS TABLE
-- ============================================================================
-- Stores admin panel user accounts
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS 'Admin panel user accounts';
COMMENT ON COLUMN admin_users.id IS 'Unique identifier for admin user';
COMMENT ON COLUMN admin_users.email IS 'Admin email address (unique)';
COMMENT ON COLUMN admin_users.password_hash IS 'Bcrypt password hash';
COMMENT ON COLUMN admin_users.is_active IS 'Account active status';
COMMENT ON COLUMN admin_users.last_login IS 'Last login timestamp';

-- ============================================================================
-- 8. AUDIT_LOGS TABLE
-- ============================================================================
-- Stores activity and change tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Activity and change tracking';
COMMENT ON COLUMN audit_logs.id IS 'Unique identifier for audit log';
COMMENT ON COLUMN audit_logs.admin_user_id IS 'Admin user who made the change';
COMMENT ON COLUMN audit_logs.action IS 'Action type (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity modified';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of entity modified';
COMMENT ON COLUMN audit_logs.old_values IS 'Previous values before change';
COMMENT ON COLUMN audit_logs.new_values IS 'New values after change';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of request';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent string';

-- ============================================================================
-- 9. BACKUPS TABLE
-- ============================================================================
-- Stores database backups
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR(255) NOT NULL,
  backup_data JSONB NOT NULL,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE backups IS 'Database backups';
COMMENT ON COLUMN backups.id IS 'Unique identifier for backup';
COMMENT ON COLUMN backups.backup_name IS 'Backup name/identifier';
COMMENT ON COLUMN backups.backup_data IS 'Backup data in JSON format';
COMMENT ON COLUMN backups.created_by IS 'Admin user who created backup';
COMMENT ON COLUMN backups.created_at IS 'Backup creation timestamp';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All 9 tables have been created successfully
-- Next: Run 002_create_indexes.sql to create performance indexes
-- Then: Run 003_create_rls_policies.sql to create Row Level Security policies
