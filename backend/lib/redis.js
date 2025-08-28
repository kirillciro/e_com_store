import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error("Missing UPSTASH_REDIS_URL in environment variables.");
}

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {}, // Required by Upstash (TLS connection)
  retryStrategy(times) {
    const delay = Math.min(times * 100, 2000);
    console.log(`[Redis] Reconnecting attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
});

// Optional logging
redis.on("error", (err) => {
  console.error("[Redis Error]", err);
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});
