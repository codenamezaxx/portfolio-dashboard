/**
 * API Route: PUT /api/admin/profile/avatar
 * 
 * Updates the current admin user's avatar URL.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { updateAdminUser, createAuditLog } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    // Verify session
    const session = verifySession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { avatarUrl } = await request.json();

    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Avatar URL is required' },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await updateAdminUser(session.userId, {
      avatar_url: avatarUrl,
    });

    // Create audit log
    await createAuditLog({
      adminUserId: session.userId,
      action: 'UPDATE',
      entityType: 'ADMIN_USER',
      entityId: session.userId,
      newValues: { avatarUrl },
    });

    return NextResponse.json({
      data: {
        user: updatedUser,
      },
      message: 'Avatar updated successfully',
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
