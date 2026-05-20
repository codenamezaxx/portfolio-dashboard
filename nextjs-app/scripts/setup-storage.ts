/**
 * Setup Supabase Storage Buckets Script
 * 
 * This script creates the required storage buckets if they don't exist.
 * Required buckets:
 * - portfolio-images (Public, 5MB limit, images only)
 * - portfolio-pdfs (Public, 10MB limit, PDFs only)
 * 
 * Run with: npx ts-node scripts/setup-storage.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (Required to manage storage)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('🔧 Setting up Supabase Storage buckets...\n');

    const buckets = [
      {
        name: 'portfolio-images',
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      },
      {
        name: 'portfolio-pdfs',
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      },
    ];

    for (const bucketConfig of buckets) {
      console.log(`📦 Checking bucket: ${bucketConfig.name}...`);
      
      const { data: bucket, error: getError } = await supabase.storage.getBucket(bucketConfig.name);

      if (getError && getError.message.includes('not found')) {
        console.log(`   ✨ Creating bucket: ${bucketConfig.name}...`);
        const { error: createError } = await supabase.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          allowedMimeTypes: bucketConfig.allowedMimeTypes,
          fileSizeLimit: bucketConfig.fileSizeLimit,
        });

        if (createError) {
          console.error(`   ❌ Failed to create bucket ${bucketConfig.name}:`, createError.message);
        } else {
          console.log(`   ✅ Bucket ${bucketConfig.name} created successfully.`);
        }
      } else if (getError) {
        console.error(`   ❌ Error checking bucket ${bucketConfig.name}:`, getError.message);
      } else {
        console.log(`   ✅ Bucket ${bucketConfig.name} already exists.`);
        
        // Update bucket configuration just in case
        console.log(`   🔄 Updating configuration for ${bucketConfig.name}...`);
        const { error: updateError } = await supabase.storage.updateBucket(bucketConfig.name, {
          public: bucketConfig.public,
          allowedMimeTypes: bucketConfig.allowedMimeTypes,
          fileSizeLimit: bucketConfig.fileSizeLimit,
        });

        if (updateError) {
          console.warn(`   ⚠️ Warning: Could not update bucket configuration:`, updateError.message);
        } else {
          console.log(`   ✅ Configuration updated.`);
        }
      }
      console.log('');
    }

    console.log('✨ Storage setup complete!');
    console.log('💡 Note: Make sure your RLS policies allow authenticated users to upload to these buckets.');
    console.log('   You can configure these in the Supabase Dashboard under Storage -> Policies.');
  } catch (error) {
    console.error('❌ Unexpected error during storage setup:');
    console.error(error);
    process.exit(1);
  }
}

setupStorage();
