import { createHmac, timingSafeEqual } from 'crypto';

export const TEMP_LINK_TTL_MS = 5 * 60 * 1000;

type Payload = { u: string; e: number };

export type VerifyResult =
  | { longUrl: string; error?: undefined }
  | { longUrl?: undefined; error: 'invalid' | 'expired' };

function getSecret(): string {
  const secret = process.env.TEMP_LINK_SECRET;
  if (!secret) {
    throw new Error(
      'Please define the TEMP_LINK_SECRET environment variable inside .env.local'
    );
  }
  return secret;
}

function sign(payload: string): Buffer {
  return createHmac('sha256', getSecret()).update(payload).digest();
}

export function createTempToken(longUrl: string, ttlMs = TEMP_LINK_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;
  const payload = Buffer.from(
    JSON.stringify({ u: longUrl, e: expiresAt } satisfies Payload)
  ).toString('base64url');
  const signature = sign(payload).toString('base64url');
  return { token: `${payload}.${signature}`, expiresAt };
}

export function verifyTempToken(token: string): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 2) return { error: 'invalid' };
  const [payload, signature] = parts;

  const expected = sign(payload);
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { error: 'invalid' };
  }

  let data: Payload;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { error: 'invalid' };
  }
  if (typeof data.u !== 'string' || typeof data.e !== 'number') {
    return { error: 'invalid' };
  }

  if (Date.now() >= data.e) return { error: 'expired' };
  return { longUrl: data.u };
}
