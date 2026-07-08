/**
 * GET /api/portfolio/resume
 * 
 * Fetch resume/CV URL from profile
 * Public endpoint - no authentication required
 * 
 * Returns the resume URL stored in the profiles table.
 * Reads the locale cookie to serve the correct language version.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Determine locale: query param overrides cookie (admin preview needs both)
    const localeParam = request.nextUrl.searchParams.get('locale');
    const cookieLocale = request.cookies.get('locale')?.value;
    const locale = localeParam || cookieLocale;

    // Fetch both resume URLs from profile
    const { data, error } = await supabase
      .from('profiles')
      .select('resume_url, resume_url_en')
      .single();

    if (error) {
      console.error('Resume fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resume' },
        { status: 500 }
      );
    }

    // Pick resume based on locale, fallback to the other language
    const resumeUrl = locale === 'en'
      ? (data?.resume_url_en || data?.resume_url)
      : (data?.resume_url || data?.resume_url_en);

    if (!resumeUrl) {
      return NextResponse.json(
        { error: 'Resume not available' },
        { status: 404 }
      );
    }

    return buildResponse(request, resumeUrl);
  } catch (error) {
    console.error('Resume API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function buildResponse(request: NextRequest, resumeUrl: string) {
  const shouldDownload = request.nextUrl.searchParams.get('download') === 'true';
  const shouldView = request.nextUrl.searchParams.get('view') === 'true';

  if (shouldDownload || shouldView) {
    try {
      const fileResponse = await fetch(resumeUrl, { cache: 'no-store' });
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from storage: ${fileResponse.statusText}`);
      }

      const fileBuffer = await fileResponse.arrayBuffer();

      const response = new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': shouldView ? 'inline' : 'attachment; filename="CV - Zakky Ahmad El-Kholily.pdf"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
      return response;
    } catch (streamError) {
      console.error('⚠️ Failed to stream CV download, falling back to redirect:', streamError);
      return NextResponse.redirect(resumeUrl);
    }
  }

  const response = NextResponse.json({
    resume_url: resumeUrl,
  });

  response.headers.set('Cache-Control', 'no-store, max-age=0');

  return response;
}
