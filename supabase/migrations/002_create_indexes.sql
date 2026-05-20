-- Migration: 002_create_indexes.sql
-- Description: Create all performance indexes for frequently queried fields
-- This migration is idempotent and can be run multiple times safely

-- ============================================================================
-- DISPLAY ORDER INDEXES
-- ============================================================================
-- These indexes optimize sorting by display_order in the UI

-- Index for tech_stack display order
CREATE INDEX IF NOT EXISTS idx_tech_stack_display_order 
  ON tech_stack(display_order ASC);

COMMENT ON INDEX idx_tech_stack_display_order IS 'Index for sorting tech stack by display order';

-- Index for journey_items display order
CREATE INDEX IF NOT EXISTS idx_journey_items_display_order 
  ON journey_items(display_order ASC);

COMMENT ON INDEX idx_journey_items_display_order IS 'Index for sorting journey items by display order';

-- Index for projects display order
CREATE INDEX IF NOT EXISTS idx_projects_display_order 
  ON projects(display_order ASC);

COMMENT ON INDEX idx_projects_display_order IS 'Index for sorting projects by display order';

-- Index for achievements display order
CREATE INDEX IF NOT EXISTS idx_achievements_display_order 
  ON achievements(display_order ASC);

COMMENT ON INDEX idx_achievements_display_order IS 'Index for sorting achievements by display order';

-- ============================================================================
-- CATEGORY/TYPE INDEXES
-- ============================================================================
-- These indexes optimize filtering by category

-- Index for projects category filtering
CREATE INDEX IF NOT EXISTS idx_projects_category 
  ON projects(category);

COMMENT ON INDEX idx_projects_category IS 'Index for filtering projects by category';

-- Index for achievements category filtering
CREATE INDEX IF NOT EXISTS idx_achievements_category 
  ON achievements(category);

COMMENT ON INDEX idx_achievements_category IS 'Index for filtering achievements by category';

-- ============================================================================
-- TIME-BASED INDEXES
-- ============================================================================
-- These indexes optimize temporal queries

-- Index for journey_items year filtering
CREATE INDEX IF NOT EXISTS idx_journey_items_year 
  ON journey_items(year);

COMMENT ON INDEX idx_journey_items_year IS 'Index for filtering journey items by year';

-- Index for achievements year filtering
CREATE INDEX IF NOT EXISTS idx_achievements_year 
  ON achievements(year);

COMMENT ON INDEX idx_achievements_year IS 'Index for filtering achievements by year';

-- Index for audit_logs created_at (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
  ON audit_logs(created_at DESC);

COMMENT ON INDEX idx_audit_logs_created_at IS 'Index for time-based audit log queries';

-- Index for backups created_at (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_backups_created_at 
  ON backups(created_at DESC);

COMMENT ON INDEX idx_backups_created_at IS 'Index for time-based backup queries';

-- ============================================================================
-- FOREIGN KEY INDEXES
-- ============================================================================
-- These indexes optimize relationship queries

-- Index for admin_users email lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email 
  ON admin_users(email);

COMMENT ON INDEX idx_admin_users_email IS 'Unique index for admin user email lookups';

-- Index for audit_logs admin_user_id (foreign key)
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_user_id 
  ON audit_logs(admin_user_id);

COMMENT ON INDEX idx_audit_logs_admin_user_id IS 'Index for filtering audit logs by admin user';

-- Index for backups created_by (foreign key)
CREATE INDEX IF NOT EXISTS idx_backups_created_by 
  ON backups(created_by);

COMMENT ON INDEX idx_backups_created_by IS 'Index for filtering backups by creator';

-- ============================================================================
-- COMPOSITE INDEXES
-- ============================================================================
-- These indexes optimize complex queries with multiple conditions

-- Composite index for audit logs (entity_type + created_at)
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_created_at 
  ON audit_logs(entity_type, created_at DESC);

COMMENT ON INDEX idx_audit_logs_entity_type_created_at IS 'Composite index for filtering audit logs by entity type and date';

-- Composite index for projects (category + display_order)
CREATE INDEX IF NOT EXISTS idx_projects_category_display_order 
  ON projects(category, display_order ASC);

COMMENT ON INDEX idx_projects_category_display_order IS 'Composite index for filtering and sorting projects';

-- Composite index for achievements (category + year)
CREATE INDEX IF NOT EXISTS idx_achievements_category_year 
  ON achievements(category, year DESC);

COMMENT ON INDEX idx_achievements_category_year IS 'Composite index for filtering achievements by category and year';

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES
-- ============================================================================
-- These indexes optimize full-text search on content

-- Full-text search index for projects
CREATE INDEX IF NOT EXISTS idx_projects_fts 
  ON projects USING GIN(to_tsvector('english', title || ' ' || description));

COMMENT ON INDEX idx_projects_fts IS 'Full-text search index for projects';

-- Full-text search index for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_fts 
  ON achievements USING GIN(to_tsvector('english', title || ' ' || issuer));

COMMENT ON INDEX idx_achievements_fts IS 'Full-text search index for achievements';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All performance indexes have been created successfully
-- These indexes optimize:
-- - Display order sorting (UI rendering)
-- - Category filtering (content management)
-- - Time-based queries (audit logs, backups)
-- - Foreign key relationships (data integrity)
-- - Full-text search (content discovery)
--
-- Next: Run 003_create_rls_policies.sql to create Row Level Security policies
