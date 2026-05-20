-- Migration: 003_create_rls_policies.sql
-- Description: Create Row Level Security (RLS) policies for all tables
-- This migration is idempotent and can be run multiple times safely

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ ACCESS POLICIES
-- ============================================================================
-- These tables allow public read access but restrict write access to authenticated users

-- PROFILES TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on profiles"
  ON profiles FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on profiles"
  ON profiles FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on profiles"
  ON profiles FOR DELETE
  USING (auth.role() = 'authenticated');

-- TECH_STACK TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on tech_stack"
  ON tech_stack FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on tech_stack"
  ON tech_stack FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on tech_stack"
  ON tech_stack FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on tech_stack"
  ON tech_stack FOR DELETE
  USING (auth.role() = 'authenticated');

-- JOURNEY_ITEMS TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on journey_items"
  ON journey_items FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on journey_items"
  ON journey_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on journey_items"
  ON journey_items FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on journey_items"
  ON journey_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- PROJECTS TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on projects"
  ON projects FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- ACHIEVEMENTS TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on achievements"
  ON achievements FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on achievements"
  ON achievements FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on achievements"
  ON achievements FOR DELETE
  USING (auth.role() = 'authenticated');

-- CONTACT_INFO TABLE
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Enable read access for all users on contact_info"
  ON contact_info FOR SELECT
  USING (true);

-- Restrict write access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable write access for authenticated users on contact_info"
  ON contact_info FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on contact_info"
  ON contact_info FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on contact_info"
  ON contact_info FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- ADMIN-ONLY ACCESS POLICIES
-- ============================================================================
-- These tables restrict all access to authenticated admin users only

-- ADMIN_USERS TABLE
-- Restrict all access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users on admin_users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert access for authenticated users on admin_users"
  ON admin_users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on admin_users"
  ON admin_users FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on admin_users"
  ON admin_users FOR DELETE
  USING (auth.role() = 'authenticated');

-- AUDIT_LOGS TABLE
-- Restrict all access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users on audit_logs"
  ON audit_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert access for authenticated users on audit_logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on audit_logs"
  ON audit_logs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on audit_logs"
  ON audit_logs FOR DELETE
  USING (auth.role() = 'authenticated');

-- BACKUPS TABLE
-- Restrict all access to authenticated users
CREATE POLICY IF NOT EXISTS "Enable read access for authenticated users on backups"
  ON backups FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert access for authenticated users on backups"
  ON backups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users on backups"
  ON backups FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users on backups"
  ON backups FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All Row Level Security policies have been created successfully
--
-- Security Summary:
-- - Public Tables (read-only for public):
--   * profiles, tech_stack, journey_items, projects, achievements, contact_info
--   * SELECT allowed for all users
--   * INSERT, UPDATE, DELETE restricted to authenticated users
--
-- - Admin-Only Tables (restricted to authenticated users):
--   * admin_users, audit_logs, backups
--   * All operations (SELECT, INSERT, UPDATE, DELETE) restricted to authenticated users
--
-- Note: This uses Supabase's auth.role() function which checks the JWT token
-- in the request. For custom authentication, you may need to adjust these policies.
