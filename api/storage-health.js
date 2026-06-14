const { getStore, getStorageStatus } = require("../lib/store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const status = getStorageStatus();
  const store = await getStore();

  return res.status(200).json({
    ok: Boolean(store),
    activeBackend: store?.backend ?? null,
    storage: status,
  });
};
