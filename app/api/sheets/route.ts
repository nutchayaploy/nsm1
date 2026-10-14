import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // Security check: Only allow docs.google.com and google.com domains
    if (!targetUrl.includes('google.com')) {
      return NextResponse.json({ success: false, error: 'Only Google domains are allowed' }, { status: 403 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Google Sheets returned status ${response.status}. กรุณาตรวจสอบว่าได้ตั้งค่าแชร์ชีตเป็น "Anyone with the link can view" หรือ "Publish to web" แล้ว` },
        { status: 502 }
      );
    }

    const csvText = await response.text();
    return NextResponse.json({ success: true, csv: csvText });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
