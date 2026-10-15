const buckets = new Map<string, { count: number; resetAt: number }>();

function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function isBlocked(
  key: string,
  max: number,
): { blocked: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) return { blocked: false, retryAfterSec: 0 };
  if (bucket.count >= max) {
    return { blocked: true, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { blocked: false, retryAfterSec: 0 };
}

export function registerFailure(key: string, windowMs: number): void {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "local";
}
