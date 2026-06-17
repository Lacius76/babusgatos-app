const { verifyDriverPin, readPinFromRequest } = require("../lib/driver-auth");
const { fetchDriverStockCategory } = require("../lib/stock-core");
const { isStockWriteConfigured, adjustStock } = require("../lib/stock-write");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Driver-Pin");
}

function requirePin(req, res) {
  const pin = readPinFromRequest(req);
  if (!verifyDriverPin(pin)) {
    res.status(401).json({ error: "invalid_pin" });
    return false;
  }
  return true;
}

function parseCategory(value) {
  const category = String(value || "").trim();
  if (category === "bread" || category === "pastry") return category;
  return null;
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!requirePin(req, res)) return;

  if (req.method === "GET") {
    const category = parseCategory(req.query?.category);
    if (!category) {
      return res.status(400).json({ error: "invalid_category" });
    }

    try {
      const items = await fetchDriverStockCategory(category);
      return res.status(200).json({
        category,
        items,
        writable: isStockWriteConfigured(),
      });
    } catch (err) {
      const code = err?.message === "invalid_category" ? 400 : 502;
      return res.status(code).json({ error: err?.message || "stock_unavailable" });
    }
  }

  if (req.method === "POST") {
    if (!isStockWriteConfigured()) {
      return res.status(503).json({ error: "sheets_not_configured" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const category = parseCategory(body.category);
    const product = String(body.product || "").trim();
    const delta = Number.parseInt(String(body.delta ?? ""), 10);
    const pin = readPinFromRequest(req);

    if (!category) {
      return res.status(400).json({ error: "invalid_category" });
    }
    if (!product) {
      return res.status(400).json({ error: "missing_product" });
    }
    if (!Number.isFinite(delta) || delta === 0 || Math.abs(delta) > 50) {
      return res.status(400).json({ error: "invalid_delta" });
    }

    try {
      const result = await adjustStock(category, product, delta, pin);
      return res.status(200).json({ ok: true, ...result });
    } catch (err) {
      const message = err?.message || "update_failed";
      const status =
        message === "product_not_found"
          ? 404
          : message === "invalid_category"
            ? 400
            : message === "sheets_not_configured"
              ? 503
              : 502;
      return res.status(status).json({ error: message });
    }
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ error: "method_not_allowed" });
};
