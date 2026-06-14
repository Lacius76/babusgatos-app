let redisClient = null;

function hasRedisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

function getRedisEnvStatus() {
  return {
    upstashUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    upstashToken: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    kvUrl: Boolean(process.env.KV_REST_API_URL),
    kvToken: Boolean(process.env.KV_REST_API_TOKEN),
    configured: hasRedisEnv(),
  };
}

async function getRedis() {
  if (!hasRedisEnv()) return null;
  if (!redisClient) {
    const { Redis } = await import("@upstash/redis");
    redisClient = Redis.fromEnv();
  }
  return redisClient;
}

module.exports = { getRedis, hasRedisEnv, getRedisEnvStatus };
