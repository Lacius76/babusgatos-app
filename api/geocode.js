const SEED_COORDS = {
  Nagycenk: { lat: 47.6071, lng: 16.6913 },
  Sopronkövesd: { lat: 47.5519, lng: 16.6518 },
  Lövő: { lat: 47.4081, lng: 16.7017 },
  Csepreg: { lat: 47.4006, lng: 16.7086 },
  Bük: { lat: 47.3842, lng: 16.7504 },
  Szombathely: { lat: 47.2307, lng: 16.6218 },
  Acsád: { lat: 47.4132, lng: 16.3856 },
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getCache() {
  if (!globalThis.__babusgatosTownCoords) {
    globalThis.__babusgatosTownCoords = { ...SEED_COORDS };
  }
  return globalThis.__babusgatosTownCoords;
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const name = String(req.query?.name || "").trim();
  if (!name) {
    return res.status(400).json({ error: "name_required" });
  }

  const cache = getCache();
  if (cache[name]) {
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).json({ name, ...cache[name] });
  }

  try {
    const q = encodeURIComponent(`${name}, Hungary`);
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=hu&q=${q}`,
      {
        headers: {
          "User-Agent": "BabusgatosVanTracker/1.0",
          Accept: "application/json",
        },
      }
    );

    if (!geoRes.ok) {
      return res.status(502).json({ error: "geocode_failed" });
    }

    const results = await geoRes.json();
    if (!Array.isArray(results) || !results.length) {
      return res.status(404).json({ error: "town_not_found" });
    }

    const lat = Number.parseFloat(results[0].lat);
    const lng = Number.parseFloat(results[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(404).json({ error: "town_not_found" });
    }

    cache[name] = { lat, lng };
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).json({ name, lat, lng });
  } catch {
    return res.status(500).json({ error: "geocode_unavailable" });
  }
};
