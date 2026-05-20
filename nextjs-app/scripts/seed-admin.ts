/**
 * Seed Script: Create Development Admin User
 * 
 * This script creates a development admin user in Supabase.
 * Run with: npx ts-node scripts/seed-admin.ts
 * 
 * Default credentials:
 *   Email: dev@example.com
 *   Password: DevPassword123!
 */

import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const DEV_ADMIN_EMAIL = 'dev@example.com';
const DEV_ADMIN_PASSWORD = 'DevPassword123!';

async function seedAdminUser() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
    process.exit(1);
  }

  try {
    console.log('🔐 Seeding development admin user...\n');

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Hash password
    console.log('🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(DEV_ADMIN_PASSWORD, 10);

    // Check if admin user already exists
    console.log('🔍 Checking if admin user already exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', DEV_ADMIN_EMAIL)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Database error: ${checkError.message}`);
    }

    if (existingUser) {
      console.log(`⚠️  Admin user already exists: ${existingUser.email}`);
      console.log('   Skipping creation.\n');
      return;
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: newUser, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: DEV_ADMIN_EMAIL,
        password_hash: passwordHash,
        is_active: true,
      })
      .select('id, email, is_active, created_at')
      .single();

    if (insertError) {
      throw new Error(`Failed to create admin user: ${insertError.message}`);
    }

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Admin User Details:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Active: ${newUser.is_active}`);
    console.log(`   Created: ${newUser.created_at}\n`);

    console.log('🔑 Login Credentials:');
    console.log(`   Email: ${DEV_ADMIN_EMAIL}`);
    console.log(`   Password: ${DEV_ADMIN_PASSWORD}\n`);

    console.log('💡 Next Steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Navigate to: http://localhost:3000/login');
    console.log(`   3. Login with the credentials above`);
    console.log('   4. Access admin dashboard at: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error seeding admin user:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the seed script
seedAdminUser();
