const { saveSubscription } = require("../lib/push");

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

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const payload = parseBody(req);
  if (!payload?.subscription || !Array.isArray(payload.towns)) {
    return res.status(400).json({ error: "subscription_and_towns_required" });
  }

  try {
    const result = await saveSubscription(payload.subscription, payload.towns);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    const code = err.message;
    if (code === "kv_unavailable") return res.status(503).json({ error: code });
    if (code === "invalid_subscription") return res.status(400).json({ error: code });
    return res.status(500).json({ error: "subscribe_failed" });
  }
};
