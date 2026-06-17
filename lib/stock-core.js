const STOCK_PUBLISH_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRnimU6TVZDlbAO1F8ESK6lLAn2As8R1AJYuFaE97aamFCNuCGbVpLV2jVdxuLaPwU8HhlH4XcObRo/pub";

const STOCK_TABS = {
  bread: null,
  pastry: "1011203089",
};

const STOCK_FIELD_ALIASES = {
  name: ["Termék", "Termek", "Product", "Produkt"],
  weight: ["Súly", "Suly", "Weight", "Gewicht"],
  stock: ["Készlet", "Keszlet", "Stock", "Bestand"],
  price: ["Ár", "Ar", "Price", "Preis"],
  available: ["Elérhető", "Elerheto", "Available", "Verfügbar", "Verfugbar"],
};

function pickRowField(row, aliases) {
  for (const key of aliases) {
    const value = row[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function buildStockCsvUrl(gid) {
  if (gid) return `${STOCK_PUBLISH_BASE}?gid=${gid}&single=true&output=csv`;
  return `${STOCK_PUBLISH_BASE}?output=csv`;
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

function isProductAvailable(flag) {
  const v = (flag || "").trim().toLowerCase();
  return !v || v === "igen" || v === "yes" || v === "ja" || v === "true" || v === "1";
}

function rowsToStockItems(rows) {
  const items = [];
  rows.forEach((row) => {
    const name = pickRowField(row, STOCK_FIELD_ALIASES.name);
    if (!name) return;
    items.push({
      name,
      weight: pickRowField(row, STOCK_FIELD_ALIASES.weight),
      stock:
        Number.parseInt(
          String(pickRowField(row, STOCK_FIELD_ALIASES.stock) || "0").replace(/\s/g, ""),
          10
        ) || 0,
      price: pickRowField(row, STOCK_FIELD_ALIASES.price),
      available: isProductAvailable(pickRowField(row, STOCK_FIELD_ALIASES.available)),
    });
  });
  return items;
}

async function fetchStockCsvRows(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
    throw new Error("not_published");
  }
  return parseCsv(text);
}

async function fetchDriverStockCategory(category) {
  const gid = STOCK_TABS[category];
  if (gid === undefined) throw new Error("invalid_category");
  const url = buildStockCsvUrl(gid);
  const rows = await fetchStockCsvRows(url);
  return rowsToStockItems(rows);
}

function columnIndexToLetter(index) {
  let n = index + 1;
  let letters = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

function findHeaderIndexes(headers) {
  const nameIdx = headers.findIndex((h) => STOCK_FIELD_ALIASES.name.includes(h));
  const stockIdx = headers.findIndex((h) => STOCK_FIELD_ALIASES.stock.includes(h));
  return { nameIdx, stockIdx };
}

module.exports = {
  STOCK_PUBLISH_BASE,
  STOCK_TABS,
  STOCK_FIELD_ALIASES,
  pickRowField,
  buildStockCsvUrl,
  parseCsv,
  rowsToStockItems,
  fetchStockCsvRows,
  fetchDriverStockCategory,
  columnIndexToLetter,
  findHeaderIndexes,
};
