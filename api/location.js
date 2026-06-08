const STORE_KEY = "babusgatos:van-location";

function memoryStore() {
  if (!globalThis.__babusgatosVanLocation) {
    globalThis.__babusgatosVanLocation = null;
  }
  return globalThis.__babusgatosVanLocation;
}

let redisClient = null;

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  if (!redisClient) {
    const { Redis } = await import("@upstash/redis");
    redisClient = Redis.fromEnv();
  }
  return redisClient;
}

async function loadLocation() {
  const redis = await getRedis();
  if (redis) {
    return redis.get(STORE_KEY);
  }
  return memoryStore();
}

async function saveLocation(record) {
  const redis = await getRedis();
  if (redis) {
    await redis.set(STORE_KEY, record);
    return;
  }
  globalThis.__babusgatosVanLocation = record;
}

function parseBody(req) {
  const body = req.body;
  if (body == null || body === "") return null;
  if (typeof body === "object") return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeOwnTracksPayload(body) {
  if (!body) return null;
  if (Array.isArray(body)) {
    for (let i = body.length - 1; i >= 0; i -= 1) {
      const item = body[i];
      if (item && typeof item === "object") return item;
    }
    return null;
  }
  if (Array.isArray(body.locations)) {
    for (let i = body.locations.length - 1; i >= 0; i -= 1) {
      const item = body.locations[i];
      if (item && typeof item === "object") return item;
    }
  }
  return body;
}

function parseCoordinates(payload) {
  if (!payload || typeof payload !== "object") return null;

  const lat = Number(payload.lat ?? payload.latitude);
  const lon = Number(payload.lon ?? payload.longitude ?? payload.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return { lat, lon };
}

function isAuthorized(req) {
  const secret = process.env.OWNTRACKS_SECRET;
  if (!secret) return true;

  const querySecret = req.query?.secret;
  const headerSecret = req.headers?.["x-owntracks-secret"];
  return querySecret === secret || headerSecret === secret;
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-OwnTracks-Secret");
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    const location = await loadLocation();
    if (!location) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(404).json({ error: "no_location_yet" });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(location);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const payload = normalizeOwnTracksPayload(parseBody(req));
    const coords = parseCoordinates(payload);

    // OwnTracks küld status, lwt, üres stb. üzeneteket is — ezeket 200-zal el kell fogadni,
    // különben az app újraküldi őket és elakad a sor (HTTP 400 a logban).
    if (!coords) {
      return res.status(200).json([]);
    }

    const record = {
      lat: coords.lat,
      lon: coords.lon,
      tst: payload?.tst ?? Math.floor(Date.now() / 1000),
      tid: payload?.tid ?? null,
      type: payload?._type ?? "location",
      updatedAt: new Date().toISOString(),
    };

    await saveLocation(record);

    // OwnTracks HTTP mód üres tömböt vár válaszként
    return res.status(200).json([]);
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ error: "method_not_allowed" });
};
