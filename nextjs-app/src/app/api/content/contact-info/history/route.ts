/**
 * GET /api/content/contact-info/history
 * 
 * Fetch version history for contact information.
 * 
 * Query Parameters:
 * - limit: Number of records to fetch (default: 50)
 * - offset: Number of records to skip (default: 0)
 * 
 * Authentication: Required (admin user)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = verifySession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch version history
    const { data, error, count } = await supabase
      .from('contact_info_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Version history fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch version history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Version history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
