import { NextRequest, NextResponse } from 'next/server';
import { createTempToken } from '@/lib/tempLink';

export async function POST(req: NextRequest) {
  const { longUrl } = await req.json().catch(() => ({}));

  if (!longUrl || typeof longUrl !== 'string') {
    return NextResponse.json({ error: 'Long URL is required' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(longUrl);
  } catch {
    return NextResponse.json({ error: 'Long URL is not a valid URL' }, { status: 400 });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only http and https URLs are allowed' }, { status: 400 });
  }

  const { token, expiresAt } = createTempToken(parsed.toString());
  return NextResponse.json({ path: `t/${token}`, expiresAt });
}
