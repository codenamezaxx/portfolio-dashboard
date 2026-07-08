/**
 * API Route: PUT /api/content/profile-resume
 * 
 * Updates the resume URL in the profile.
 * Supports bilingual CVs: resume_url (ID) and resume_url_en (EN).
 * Requires authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const session = verifySession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { resume_url, resume_url_en } = await request.json();

    if (!resume_url && !resume_url_en) {
      return NextResponse.json(
        { error: 'At least one resume URL is required' },
        { status: 400 }
      );
    }

    // Update profile with resume URL(s)
    const { data: existingProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (fetchError || !existingProfiles?.[0]) {
      console.error('Profile fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, string> = {};
    if (resume_url !== undefined) updateData.resume_url = resume_url;
    if (resume_url_en !== undefined) updateData.resume_url_en = resume_url_en;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', existingProfiles[0].id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: `Failed to update profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Resume updated successfully',
      data,
    });
  } catch (error) {
    console.error('Resume update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
