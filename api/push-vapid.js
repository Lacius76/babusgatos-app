const { getVapidPublicKey } = require("../lib/push");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return res.status(503).json({ error: "vapid_not_configured" });
  }

  return res.status(200).json({ publicKey });
};
