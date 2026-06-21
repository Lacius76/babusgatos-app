const {
  isSiteAccessConfigured,
  verifySiteAccessPin,
  readSiteAccessPinFromRequest,
} = require("../lib/site-access");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Site-Access-Pin");
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!isSiteAccessConfigured()) {
    return res.status(503).json({ error: "access_not_configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const pin = readSiteAccessPinFromRequest(req) || String(body.pin || "").trim();

  if (!verifySiteAccessPin(pin)) {
    return res.status(401).json({ error: "invalid_pin" });
  }

  return res.status(200).json({ ok: true });
};
