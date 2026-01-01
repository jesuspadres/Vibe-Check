import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limiter: 3 requests per hour per IP
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "vibe-check-audit",
});

// Alternative in-memory rate limiter for development/testing
// when Redis is not configured
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 3, windowMs: number = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    // Clean up expired entries periodically
    if (Math.random() < 0.1) {
      this.cleanup();
    }

    if (!record || now >= record.resetTime) {
      // New window
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        remaining: this.maxRequests - 1,
        reset: resetTime,
      };
    }

    if (record.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    // Increment count
    record.count += 1;
    this.requests.set(identifier, record);

    return {
      success: true,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now >= value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create fallback in-memory limiter
const inMemoryLimiter = new InMemoryRateLimiter(3, 60 * 60 * 1000);

// Unified rate limit check function
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: Date;
  message?: string;
}> {
  // Check if Redis is configured
  const isRedisConfigured =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    if (isRedisConfigured) {
      // Use Upstash rate limiter
      const { success, remaining, reset } = await rateLimiter.limit(identifier);
      return {
        success,
        remaining,
        reset: new Date(reset),
        message: success
          ? undefined
          : `Rate limit exceeded. You can perform 3 audits per hour. Try again at ${new Date(reset).toLocaleTimeString()}.`,
      };
    } else {
      // Use in-memory rate limiter for development
      const result = await inMemoryLimiter.limit(identifier);
      return {
        success: result.success,
        remaining: result.remaining,
        reset: new Date(result.reset),
        message: result.success
          ? undefined
          : `Rate limit exceeded. You can perform 3 audits per hour. Try again at ${new Date(result.reset).toLocaleTimeString()}.`,
      };
    }
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Fail open in case of errors (allow the request)
    return {
      success: true,
      remaining: 0,
      reset: new Date(),
    };
  }
}

// Helper to extract IP from request headers
export function getClientIp(headers: Headers): string {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default identifier
  return "anonymous";
}
