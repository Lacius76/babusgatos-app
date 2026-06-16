const { sendTestPush } = require("../lib/push");

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
  const endpoint = payload?.endpoint || payload?.subscription?.endpoint;
  if (!endpoint) {
    return res.status(400).json({ error: "endpoint_required" });
  }

  try {
    await sendTestPush(endpoint, payload.subscription, payload.towns, payload.body);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log("push-test hiba:", err?.message || err);
    const code = err.message;
    if (code === "vapid_missing") return res.status(503).json({ error: code });
    if (code === "missing_subscription") return res.status(404).json({ error: code });
    return res.status(500).json({ error: "test_failed", detail: code });
  }
};
