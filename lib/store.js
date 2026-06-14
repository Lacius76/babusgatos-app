const { getRedis } = require("./kv");

const BLOB_STORE_PATH = "babusgatos-store.json";

let activeStore = null;

function hasBlobEnv() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID ||
    process.env.VERCEL_OIDC_TOKEN
  );
}

function getBlobEnvStatus() {
  return {
    readWriteToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    storeId: Boolean(process.env.BLOB_STORE_ID),
    oidc: Boolean(process.env.VERCEL_OIDC_TOKEN),
    configured: hasBlobEnv(),
  };
}

function getStorageStatus() {
  const redis = require("./kv").getRedisEnvStatus();
  return {
    redis,
    blob: getBlobEnvStatus(),
    note: "Blob: BLOB_STORE_ID + OIDC (új) vagy BLOB_READ_WRITE_TOKEN (régi)",
  };
}

function createRedisStore(redis) {
  return {
    backend: "redis",
    get: (key) => redis.get(key),
    set: (key, value, options) => redis.set(key, value, options),
    del: (key) => redis.del(key),
    sadd: (key, member) => redis.sadd(key, member),
    srem: (key, member) => redis.srem(key, member),
    smembers: (key) => redis.smembers(key),
  };
}

function createBlobStore() {
  let cache = null;
  let dirty = false;

  async function readStreamText(stream) {
    return new Response(stream).text();
  }

  async function load() {
    if (cache) return cache;
    const { get } = await import("@vercel/blob");
    try {
      const result = await get(BLOB_STORE_PATH, { access: "private" });
      if (!result?.stream || result.statusCode === 404) {
        cache = { values: {}, sets: {} };
        return cache;
      }
      const text = await readStreamText(result.stream);
      cache = JSON.parse(text);
    } catch (err) {
      console.log("Blob load hiba:", err?.message || err);
      cache = { values: {}, sets: {} };
    }
    if (!cache.values) cache.values = {};
    if (!cache.sets) cache.sets = {};
    return cache;
  }

  async function persist() {
    if (!dirty || !cache) return;
    const { put } = await import("@vercel/blob");
    try {
      await put(BLOB_STORE_PATH, JSON.stringify(cache), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      dirty = false;
    } catch (err) {
      console.log("Blob mentés hiba:", err?.message || err);
      throw err;
    }
  }

  function pruneExpired(data) {
    const now = Date.now();
    for (const [key, entry] of Object.entries(data.values)) {
      if (entry && typeof entry === "object" && "expiresAt" in entry) {
        if (entry.expiresAt <= now) delete data.values[key];
      }
    }
  }

  return {
    backend: "blob",
    async get(key) {
      const data = await load();
      pruneExpired(data);
      const entry = data.values[key];
      if (!entry) return null;
      if (entry && typeof entry === "object" && "value" in entry) {
        if (entry.expiresAt && entry.expiresAt <= Date.now()) {
          delete data.values[key];
          dirty = true;
          await persist();
          return null;
        }
        return entry.value;
      }
      return entry;
    },
    async set(key, value, options = {}) {
      const data = await load();
      if (options.ex) {
        data.values[key] = {
          value,
          expiresAt: Date.now() + options.ex * 1000,
        };
      } else {
        data.values[key] = value;
      }
      dirty = true;
      await persist();
    },
    async del(key) {
      const data = await load();
      delete data.values[key];
      dirty = true;
      await persist();
    },
    async sadd(key, member) {
      const data = await load();
      const set = new Set(data.sets[key] || []);
      set.add(member);
      data.sets[key] = [...set];
      dirty = true;
      await persist();
    },
    async srem(key, member) {
      const data = await load();
      const set = new Set(data.sets[key] || []);
      set.delete(member);
      data.sets[key] = [...set];
      dirty = true;
      await persist();
    },
    async smembers(key) {
      const data = await load();
      return Array.isArray(data.sets[key]) ? data.sets[key] : [];
    },
  };
}

async function getStore() {
  if (activeStore) return activeStore;

  const redis = await getRedis();
  if (redis) {
    activeStore = createRedisStore(redis);
    return activeStore;
  }

  if (hasBlobEnv()) {
    activeStore = createBlobStore();
    return activeStore;
  }

  return null;
}

module.exports = { getStore, getStorageStatus, hasBlobEnv };
