const SCHEDULE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeqEHVMttUohvursUP7zHn36ppGGIVLPn-KcyK0ADf71ZIXFamqdIkhUhklutdBEQNr9l9sm4xHtK4/pub?output=csv";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseCsvLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}

function parseCsv(text) {
  const lines = text.trim().replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (cells[i] ?? "").trim();
    });
    return row;
  });
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

  try {
    const csvRes = await fetch(SCHEDULE_CSV_URL, { cache: "no-store" });
    if (!csvRes.ok) {
      return res.status(502).json({ error: "schedule_fetch_failed" });
    }

    const rows = parseCsv(await csvRes.text());
    const schedule = {};

    rows.forEach((row) => {
      const town = row["Település"] || row["Telepules"] || "";
      if (!town) return;
      const slot = row["Nap & Időpont"] || row["Nap & Idopont"] || "";
      schedule[town] = slot;
    });

    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(schedule);
  } catch {
    return res.status(500).json({ error: "schedule_unavailable" });
  }
};
