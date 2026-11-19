import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Url from '@/models/Url';
import { nanoid } from 'nanoid';

// Regex for valid custom URLs: alphanumeric, hyphens, underscores, 3-20 chars
const CUSTOM_URL_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export async function POST(req: NextRequest) {
  await dbConnect();

  const { longUrl, customUrl } = await req.json();

  // Validate required fields
  if (!longUrl) {
    return NextResponse.json({ error: 'Long URL is required' }, { status: 400 });
  }

  let shortUrl: string;
  let isCustom = false;

  // If custom URL is provided, validate and use it
  if (customUrl && customUrl.trim() !== '') {
    const trimmedCustomUrl = customUrl.trim().toLowerCase();

    // Validate format
    if (!CUSTOM_URL_REGEX.test(trimmedCustomUrl)) {
      return NextResponse.json(
        { error: 'Custom URL must be 3-20 characters and contain only letters, numbers, hyphens, and underscores' },
        { status: 400 }
      );
    }

    // Check if custom URL already exists
    const existingUrl = await Url.findOne({ shortUrl: trimmedCustomUrl });
    if (existingUrl) {
      return NextResponse.json(
        { error: 'This custom URL is already taken. Please try a different one.' },
        { status: 409 }
      );
    }

    shortUrl = trimmedCustomUrl;
    isCustom = true;
  } else {
    // Generate a random short URL
    shortUrl = nanoid(7);
  }

  try {
    const newUrl = await Url.create({ longUrl, shortUrl, isCustom });
    return NextResponse.json({ shortUrl: newUrl.shortUrl, isCustom: newUrl.isCustom });
  } catch (err) {
    console.error('Error creating short URL:', err);
    return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
  }
}
