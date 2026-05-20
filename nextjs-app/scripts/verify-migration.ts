/**
 * Data Migration Verification Script
 * Verifies that all data was migrated correctly to Supabase
 * 
 * Usage: npx ts-node scripts/verify-migration.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
// Try to load from process.env first (set via command line or .env.local)
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// If not found, try to read from .env.local file directly
if (!supabaseUrl || !supabaseKey) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          if (trimmedLine.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = trimmedLine.substring('NEXT_PUBLIC_SUPABASE_URL='.length).trim();
          }
          if (trimmedLine.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
            supabaseKey = trimmedLine.substring('SUPABASE_SERVICE_ROLE_KEY='.length).trim();
          }
        }
      });
    }
  } catch (error) {
    console.error('Warning: Could not read .env.local file:', error);
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('\nFound values:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Not set');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Set' : '✗ Not set');
  console.error('\nPlease ensure .env.local contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface VerificationResult {
  table: string;
  expected: number;
  actual: number;
  status: 'pass' | 'fail';
  details?: string;
}

const results: VerificationResult[] = [];

async function verifyTable(tableName: string, expectedCount: number) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: false });

    if (error) throw error;

    const actualCount = count || 0;
    const status = actualCount >= expectedCount ? 'pass' : 'fail';

    results.push({
      table: tableName,
      expected: expectedCount,
      actual: actualCount,
      status,
      details: status === 'pass' 
        ? `✓ Found ${actualCount} records (expected ${expectedCount})`
        : `✗ Found ${actualCount} records (expected ${expectedCount})`
    });

    console.log(`${status === 'pass' ? '✓' : '✗'} ${tableName}: ${actualCount}/${expectedCount}`);
  } catch (error) {
    console.error(`✗ Error verifying ${tableName}:`, error);
    results.push({
      table: tableName,
      expected: expectedCount,
      actual: 0,
      status: 'fail',
      details: `Error: ${error}`
    });
  }
}

async function verifyProfiles() {
  console.log('\n📋 Verifying Profiles...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;

    if (data) {
      console.log(`  ✓ Name: ${data.name}`);
      console.log(`  ✓ Role: ${data.role}`);
      console.log(`  ✓ Tagline: ${data.tagline?.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error('  ✗ Error verifying profile:', error);
  }
}

async function verifyContactInfo() {
  console.log('\n📋 Verifying Contact Info...');
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error) throw error;

    if (data) {
      console.log(`  ✓ GitHub: ${data.github_url ? '✓' : '✗'}`);
      console.log(`  ✓ LinkedIn: ${data.linkedin_url ? '✓' : '✗'}`);
      console.log(`  ✓ Instagram: ${data.instagram_url ? '✓' : '✗'}`);
      console.log(`  ✓ Telegram: ${data.telegram_url ? '✓' : '✗'}`);
      console.log(`  ✓ Email: ${data.email ? '✓' : '✗'}`);
    }
  } catch (error) {
    console.error('  ✗ Error verifying contact info:', error);
  }
}

async function verifySampleRecords() {
  console.log('\n📋 Verifying Sample Records...');

  // Verify tech stack
  try {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .limit(3);

    if (error) throw error;
    console.log(`  ✓ Tech Stack samples:`);
    data?.forEach(item => {
      console.log(`    - ${item.name} (order: ${item.display_order})`);
    });
  } catch (error) {
    console.error('  ✗ Error verifying tech stack:', error);
  }

  // Verify journey
  try {
    const { data, error } = await supabase
      .from('journey_items')
      .select('*')
      .limit(3);

    if (error) throw error;
    console.log(`  ✓ Journey samples:`);
    data?.forEach(item => {
      console.log(`    - ${item.year}: ${item.title}`);
    });
  } catch (error) {
    console.error('  ✗ Error verifying journey:', error);
  }

  // Verify projects
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(2);

    if (error) throw error;
    console.log(`  ✓ Projects samples:`);
    data?.forEach(item => {
      console.log(`    - ${item.title} (${item.category})`);
    });
  } catch (error) {
    console.error('  ✗ Error verifying projects:', error);
  }

  // Verify achievements
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .limit(3);

    if (error) throw error;
    console.log(`  ✓ Achievements samples:`);
    data?.forEach(item => {
      console.log(`    - ${item.title} (${item.issuer})`);
    });
  } catch (error) {
    console.error('  ✗ Error verifying achievements:', error);
  }
}

async function runVerification() {
  console.log('🔍 Starting data verification...\n');

  try {
    // Verify table counts
    console.log('📊 Verifying Record Counts:');
    console.log('─'.repeat(40));
    
    await verifyTable('profiles', 1);
    await verifyTable('contact_info', 1);
    await verifyTable('tech_stack', 12);
    await verifyTable('journey_items', 8);
    await verifyTable('projects', 4);
    await verifyTable('achievements', 11);

    // Verify detailed data
    await verifyProfiles();
    await verifyContactInfo();
    await verifySampleRecords();

    // Summary
    console.log('\n📊 Verification Summary:');
    console.log('─'.repeat(40));
    
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;

    results.forEach(result => {
      console.log(`${result.status === 'pass' ? '✓' : '✗'} ${result.table}: ${result.actual}/${result.expected}`);
    });

    console.log(`\n${passCount} passed, ${failCount} failed`);

    if (failCount === 0) {
      console.log('\n✅ All data verified successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some verifications failed. Please check the data.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

// Run verification
runVerification();
