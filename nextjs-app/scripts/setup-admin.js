/**
 * Setup Admin User Script (JavaScript version)
 * 
 * This script creates or updates an admin user in the database.
 * Run with: node scripts/setup-admin.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables in .env.local:');
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...\n');

    const email = 'admin@example.com';
    const password = 'Admin123';

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user exists
    console.log('🔍 Checking if admin user exists...');
    const { data: existingUser, error: selectError } = await supabase
      .from('admin_users')
      .select('id, email, is_active')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingUser) {
      console.log(`✅ Admin user already exists: ${email}`);
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Active: ${existingUser.is_active}`);

      // Update password and activate if needed
      if (!existingUser.is_active) {
        console.log('\n📝 Activating admin user...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({
            password_hash: passwordHash,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;
        console.log('✅ Admin user activated');
      } else {
        console.log('\n📝 Updating admin user password...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({
            password_hash: passwordHash,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;
        console.log('✅ Admin user password updated');
      }
    } else {
      console.log('📝 Creating new admin user...');
      const { data: newUser, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          email,
          password_hash: passwordHash,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('✅ Admin user created successfully');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
    }

    console.log('\n📋 Admin User Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n✨ Setup complete! You can now login to the admin panel.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin user:');
    console.error(error);
    process.exit(1);
  }
}

setupAdmin();
