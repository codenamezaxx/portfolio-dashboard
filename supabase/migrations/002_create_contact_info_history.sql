-- Migration: 002_create_contact_info_history.sql
-- Description: Create contact_info_history table for version tracking
-- This migration creates a table to track all changes to contact information

-- ============================================================================
-- CONTACT_INFO_HISTORY TABLE
-- ============================================================================
-- Stores version history for contact information changes
CREATE TABLE IF NOT EXISTS contact_info_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_info_id UUID REFERENCES contact_info(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  instagram_url VARCHAR(500),
  telegram_url VARCHAR(500),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE contact_info_history IS 'Version history for contact information';
COMMENT ON COLUMN contact_info_history.id IS 'Unique identifier for history record';
COMMENT ON COLUMN contact_info_history.contact_info_id IS 'Reference to contact_info record';
COMMENT ON COLUMN contact_info_history.admin_user_id IS 'Admin user who made the change';
COMMENT ON COLUMN contact_info_history.github_url IS 'GitHub URL at this version';
COMMENT ON COLUMN contact_info_history.linkedin_url IS 'LinkedIn URL at this version';
COMMENT ON COLUMN contact_info_history.instagram_url IS 'Instagram URL at this version';
COMMENT ON COLUMN contact_info_history.telegram_url IS 'Telegram URL at this version';
COMMENT ON COLUMN contact_info_history.email IS 'Email at this version';
COMMENT ON COLUMN contact_info_history.created_at IS 'Timestamp of this version';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_info_history_contact_id 
  ON contact_info_history(contact_info_id);

CREATE INDEX IF NOT EXISTS idx_contact_info_history_created_at 
  ON contact_info_history(created_at DESC);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- contact_info_history table created successfully
