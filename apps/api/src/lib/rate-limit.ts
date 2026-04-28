const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const SWEEP_EVERY = 100;

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();
let sweepCounter = 0;

function sweep(now: number) {
  for (const [ip, entry] of store) {
    if (now > entry.resetAt) store.delete(ip);
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  if (++sweepCounter >= SWEEP_EVERY) {
    sweepCounter = 0;
    sweep(now);
  }

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}
