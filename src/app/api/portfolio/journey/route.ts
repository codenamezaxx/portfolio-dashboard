/**
 * GET /api/portfolio/journey
 * 
 * Fetch all journey timeline items.
 * Public endpoint - no authentication required.
 * 
 * Returns journey items sorted by display order with caching headers for ISR.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

function applyLocale<T extends Record<string, unknown>>(data: T, locale: string): T {
  if (locale !== 'en') return data;
  const result: Record<string, unknown> = { ...data };
  if (result['title_en'] != null) result['title'] = result['title_en'];
  if (result['description_en'] != null) result['description'] = result['description_en'];
  if (result['name_en'] != null) result['name'] = result['name_en'];
  if (result['role_en'] != null) result['role'] = result['role_en'];
  if (result['tagline_en'] != null) result['tagline'] = result['tagline_en'];
  if (result['status_label_en'] != null) result['status_label'] = result['status_label_en'];
  if (result['issuer_en'] != null) result['issuer'] = result['issuer_en'];
  delete result['name_en'];
  delete result['role_en'];
  delete result['tagline_en'];
  delete result['status_label_en'];
  delete result['title_en'];
  delete result['description_en'];
  delete result['issuer_en'];
  return result as T;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch journey items
    const { data, error } = await supabase
      .from('journey_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Journey fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch journey items' },
        { status: 500 }
      );
    }

    const locale = request.cookies.get('locale')?.value || 'id';

    const localized = (data || []).map(item => applyLocale(item, locale));

    // Set caching headers for ISR
    const response = NextResponse.json({
      data: localized,
    });

    // Cache for 1 hour, revalidate in background
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return response;
  } catch (error) {
    console.error('Journey API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
