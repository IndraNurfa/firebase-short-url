import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Url from '@/models/Url';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { longUrl } = await req.json();
  const shortUrl = nanoid(7);

  try {
    const newUrl = await Url.create({ longUrl, shortUrl });
    return NextResponse.json({ shortUrl: newUrl.shortUrl });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
