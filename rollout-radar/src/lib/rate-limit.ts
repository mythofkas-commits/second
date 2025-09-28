import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

let redis: Redis | null = null;

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

type LimitConfig = {
  limit: number;
  window: string;
};

function createLimiter(config: LimitConfig) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    analytics: env.NODE_ENV !== 'production',
  });
}

export const reportLimiter = createLimiter({ limit: 5, window: '1 m' });
export const checkLimiter = createLimiter({ limit: 30, window: '1 m' });

export async function ensureWithinLimit(
  limiter: Ratelimit | null,
  identifier: string,
) {
  if (!limiter) return true;
  const result = await limiter.limit(identifier);
  return result.success;
}
