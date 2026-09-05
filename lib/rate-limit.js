import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter;

function getLimiter() {
  if (limiter) return limiter;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(40, "20 s"),
    prefix: "memopad",
  });
  return limiter;
}

export async function rateLimit(req, res) {
  const limiter = getLimiter();
  if (!limiter) return true;

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || "anonymous";

  try {
    const { success } = await limiter.limit(ip);
    if (!success) {
      res.statusCode = 429;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ message: "Too many requests, please try again later." }));
      return false;
    }
  } catch (error) {
    console.error("Rate limiter error:", error);
  }
  return true;
}
