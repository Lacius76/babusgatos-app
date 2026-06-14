const webpush = require("web-push");
const { getRedis } = require("./kv");
const townCoords = require("../data/town-coords.json");

const nagycenkCoords = townCoords.Nagycenk || { lat: 47.6034133, lng: 16.6977433 };
const NAGYCENK_CENTER = { lat: nagycenkCoords.lat, lon: nagycenkCoords.lng ?? nagycenkCoords.lon };
const NAGYCENK_RADIUS_M = 1000;
const NOTIFY_TOWN = "Nagycenk";
const NOTIFY_COOLDOWN_SEC = 60 * 60;
const PUSH_TITLE = "Babusgatós";
const PUSH_BODY =
  "🥖 Megérkezett a Babusgatós furgon! Gyere gyorsan, amíg van készlet!";

function townKey(town) {
  return `subscribers:${encodeURIComponent(String(town || "").trim())}`;
}

function subscriptionKey(endpoint) {
  return `push:sub:${endpoint}`;
}

function lastNotifiedKey(town) {
  return `last_notified:${encodeURIComponent(String(town || "").trim())}`;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function isWithinNagycenk(lat, lon) {
  return distanceMeters(lat, lon, NAGYCENK_CENTER.lat, NAGYCENK_CENTER.lon) <= NAGYCENK_RADIUS_M;
}

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:hello@babusgatos.hu";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

function normalizeTowns(towns) {
  if (!Array.isArray(towns)) return [];
  return [...new Set(towns.map((t) => String(t || "").trim()).filter(Boolean))];
}

function normalizeSubscription(subscription) {
  if (!subscription || typeof subscription !== "object") return null;
  const endpoint = subscription.endpoint;
  const keys = subscription.keys;
  if (!endpoint || !keys?.p256dh || !keys?.auth) return null;
  return { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } };
}

async function saveSubscription(subscription, towns) {
  const redis = await getRedis();
  if (!redis) throw new Error("kv_unavailable");

  const sub = normalizeSubscription(subscription);
  const townList = normalizeTowns(towns);
  if (!sub || !townList.length) throw new Error("invalid_subscription");

  const existing = await redis.get(subscriptionKey(sub.endpoint));
  const oldTowns = existing?.towns || [];

  for (const oldTown of oldTowns) {
    if (!townList.includes(oldTown)) {
      await redis.srem(townKey(oldTown), sub.endpoint);
    }
  }

  for (const town of townList) {
    await redis.sadd(townKey(town), sub.endpoint);
  }

  await redis.set(subscriptionKey(sub.endpoint), {
    subscription: sub,
    towns: townList,
    updatedAt: new Date().toISOString(),
  });

  return { towns: townList };
}

async function removeSubscription(endpoint) {
  const redis = await getRedis();
  if (!redis) throw new Error("kv_unavailable");
  if (!endpoint) throw new Error("invalid_endpoint");

  const record = await redis.get(subscriptionKey(endpoint));
  const towns = record?.towns || [];

  for (const town of towns) {
    await redis.srem(townKey(town), endpoint);
  }

  await redis.del(subscriptionKey(endpoint));
  return { removed: true };
}

async function getTownEndpoints(town) {
  const redis = await getRedis();
  if (!redis) return [];
  const endpoints = await redis.smembers(townKey(town));
  return Array.isArray(endpoints) ? endpoints : [];
}

async function wasRecentlyNotified(town) {
  const redis = await getRedis();
  if (!redis) return true;
  const flag = await redis.get(lastNotifiedKey(town));
  return Boolean(flag);
}

async function markNotified(town) {
  const redis = await getRedis();
  if (!redis) return;
  await redis.set(lastNotifiedKey(town), Date.now(), { ex: NOTIFY_COOLDOWN_SEC });
}

async function sendPushToEndpoint(endpoint, payload) {
  const redis = await getRedis();
  if (!redis || !configureWebPush()) return { ok: false, reason: "not_configured" };

  const record = await redis.get(subscriptionKey(endpoint));
  const subscription = record?.subscription;
  if (!subscription) return { ok: false, reason: "missing_subscription" };

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    const status = err?.statusCode;
    if (status === 404 || status === 410) {
      await removeSubscription(endpoint);
    }
    return { ok: false, reason: String(status || err.message) };
  }
}

async function notifyTownSubscribers(town, payload) {
  const endpoints = await getTownEndpoints(town);
  const results = await Promise.allSettled(
    endpoints.map((endpoint) => sendPushToEndpoint(endpoint, payload))
  );
  return { count: endpoints.length, results };
}

async function maybeNotifyNagycenkArrival(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    console.log("Push kihagyva: no_coords", { lat, lon });
    return { skipped: true, reason: "no_coords" };
  }
  if (!isWithinNagycenk(lat, lon)) {
    console.log("Push kihagyva: outside_radius", { lat, lon, center: NAGYCENK_CENTER, radiusM: NAGYCENK_RADIUS_M });
    return { skipped: true, reason: "outside_radius" };
  }
  if (!configureWebPush()) {
    console.log("Push kihagyva: vapid_missing");
    return { skipped: true, reason: "vapid_missing" };
  }

  const redis = await getRedis();
  if (!redis) {
    console.log("Push kihagyva: kv_unavailable");
    return { skipped: true, reason: "kv_unavailable" };
  }

  if (await wasRecentlyNotified(NOTIFY_TOWN)) {
    console.log("Push kihagyva: cooldown", { town: NOTIFY_TOWN });
    return { skipped: true, reason: "cooldown" };
  }

  const payload = {
    title: PUSH_TITLE,
    body: PUSH_BODY,
    url: "/",
  };

  const sent = await notifyTownSubscribers(NOTIFY_TOWN, payload);
  const anyOk = sent.results.some(
    (result) => result.status === "fulfilled" && result.value?.ok
  );
  if (anyOk) await markNotified(NOTIFY_TOWN);
  console.log("Push feliratkozók:", sent.count, "sikeres:", anyOk);
  return { notified: anyOk, skipped: !anyOk, reason: anyOk ? undefined : "no_delivery", ...sent };
}

module.exports = {
  NAGYCENK_CENTER,
  NAGYCENK_RADIUS_M,
  NOTIFY_TOWN,
  isWithinNagycenk,
  saveSubscription,
  removeSubscription,
  maybeNotifyNagycenkArrival,
  getVapidPublicKey: () => process.env.VAPID_PUBLIC_KEY || null,
};
