/**
 * Migration Script: Add resume_url column to profiles table
 * 
 * This script adds a resume_url column to the profiles table to store
 * the URL of the user's resume/CV file in Supabase Storage.
 * 
 * Run with: npx ts-node scripts/add-resume-column.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addResumeColumn() {
  try {
    console.log('Adding resume_url column to profiles table...');

    // Execute SQL to add the column
    const { error } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE profiles
        ADD COLUMN IF NOT EXISTS resume_url TEXT;
        
        COMMENT ON COLUMN profiles.resume_url IS 'URL to the user resume/CV file stored in Supabase Storage';
      `
    });

    if (error) {
      // If rpc doesn't work, try direct SQL approach
      console.log('Attempting alternative approach...');
      
      // Note: This is a fallback - in production, use Supabase migrations
      console.log('Please run this SQL in Supabase SQL Editor:');
      console.log(`
        ALTER TABLE profiles
        ADD COLUMN IF NOT EXISTS resume_url TEXT;
        
        COMMENT ON COLUMN profiles.resume_url IS 'URL to the user resume/CV file stored in Supabase Storage';
      `);
      return;
    }

    console.log('✅ Successfully added resume_url column to profiles table');
  } catch (error) {
    console.error('Error adding column:', error);
    process.exit(1);
  }
}

addResumeColumn();
