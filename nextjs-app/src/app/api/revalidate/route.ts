/**
 * ISR Revalidation Endpoint
 * Handles on-demand ISR revalidation for portfolio content
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token for revalidation (should be in environment variables)
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'default-secret';

/**
 * POST /api/revalidate
 * Revalidate ISR cache for specific tags
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the secret token
    const secret = request.headers.get('x-revalidate-secret') || 
                   request.nextUrl.searchParams.get('secret');

    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    // Get tags from query params or body
    let tags: string[] = [];
    
    const tagParam = request.nextUrl.searchParams.get('tag');
    if (tagParam) {
      tags = [tagParam];
    } else {
      const body = await request.json().catch(() => ({}));
      tags = body.tags || [];
    }

    if (!tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'No tags provided for revalidation' },
        { status: 400 }
      );
    }

    // Revalidate each tag
    const revalidatedTags: string[] = [];
    for (const tag of tags) {
      try {
        revalidatePath('/', 'layout');
        revalidatedTags.push(tag);
        console.log(`Revalidated tag: ${tag}`);
      } catch (error) {
        console.error(`Error revalidating tag ${tag}:`, error);
      }
    }

    return NextResponse.json(
      {
        revalidated: true,
        tags: revalidatedTags,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revalidate
 * Health check and status endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'ISR revalidation endpoint is running',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
