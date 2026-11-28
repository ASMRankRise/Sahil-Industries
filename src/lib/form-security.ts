import { getD1Client } from "@/lib/d1-client";

const buckets = new Map<string, { count: number; reset: number }>();

export function clientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function memoryRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

/**
 * Persistent D1-backed rate limiter for serverless runtimes (Vercel),
 * with automatic in-memory fallback if D1 is unavailable or not yet migrated.
 */
export async function rateLimited(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): Promise<boolean> {
  const now = Date.now();
  try {
    const db = getD1Client();
    const row = await db
      .prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?")
      .bind(key)
      .first<{ count: number; reset_at: number }>();

    if (!row || Number(row.reset_at) <= now) {
      await db
        .prepare(
          "INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at",
        )
        .bind(key, now + windowMs)
        .run();
      return false;
    }

    const nextCount = Number(row.count) + 1;
    await db
      .prepare("UPDATE rate_limits SET count = ? WHERE key = ?")
      .bind(nextCount, key)
      .run();

    return nextCount > limit;
  } catch {
    return memoryRateLimited(key, limit, windowMs);
  }
}

export const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .trim()
    .slice(0, max);
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function verifyMathCaptcha(answer: unknown, question: unknown) {
  const match = clean(question, 30).match(/^(\d{1,2})\s*([+-])\s*(\d{1,2})$/);
  const supplied = clean(answer, 10);
  if (!match || !/^-?\d+$/.test(supplied)) return false;
  const expected =
    match[2] === "+"
      ? Number(match[1]) + Number(match[3])
      : Number(match[1]) - Number(match[3]);
  return Number(supplied) === expected;
}
