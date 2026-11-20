const buckets = new Map<string, { count: number; reset: number }>();

export function clientAddress(request: Request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

/** Best-effort per-instance limiter. Cloudflare's edge rate limiting should also be enabled in production. */
export function rateLimited(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset <= now) { buckets.set(key, { count: 1, reset: now + windowMs }); return false; }
  current.count += 1;
  return current.count > limit;
}

export const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function verifyMathCaptcha(answer: unknown, question: unknown) {
  const match = clean(question, 30).match(/^(\d{1,2})\s*([+-])\s*(\d{1,2})$/);
  const supplied = clean(answer, 10);
  if (!match || !/^-?\d+$/.test(supplied)) return false;
  const expected = match[2] === '+' ? Number(match[1]) + Number(match[3]) : Number(match[1]) - Number(match[3]);
  return Number(supplied) === expected;
}
