const crypto = require("crypto");
const {
  STOCK_TABS,
  columnIndexToLetter,
  findHeaderIndexes,
} = require("./stock-core");

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function base64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.client_email && parsed.private_key) {
        return { email: parsed.client_email, privateKey: parsed.private_key };
      }
    } catch {
      return null;
    }
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (email && privateKey) {
    return { email, privateKey: privateKey.replace(/\\n/g, "\n") };
  }
  return null;
}

function isSheetsWriteConfigured() {
  return Boolean(getServiceAccount() && process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now + 60_000) {
    return cachedToken;
  }

  const account = getServiceAccount();
  if (!account) throw new Error("sheets_not_configured");

  const iat = Math.floor(now / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: account.email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat,
      exp: iat + 3600,
    })
  );
  const signInput = `${header}.${claim}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signInput);
  const signature = base64url(
    sign.sign(account.privateKey.replace(/\\n/g, "\n"))
  );
  const jwt = `${signInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || "token_failed");
  }

  cachedToken = data.access_token;
  cachedTokenExpiresAt = now + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("sheets_not_configured");
  return id;
}

async function getSheetTitleByGid(gid, token) {
  const spreadsheetId = getSpreadsheetId();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "sheet_meta_failed");

  const sheets = data.sheets || [];
  if (gid == null) return sheets[0]?.properties?.title;
  const sheet = sheets.find((s) => s.properties.sheetId === Number(gid));
  if (!sheet) throw new Error("sheet_not_found");
  return sheet.properties.title;
}

async function readSheetValues(sheetTitle, token) {
  const spreadsheetId = getSpreadsheetId();
  const range = encodeURIComponent(`${sheetTitle}!A1:Z500`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "sheet_read_failed");
  return data.values || [];
}

async function updateCell(sheetTitle, a1Range, value, token) {
  const spreadsheetId = getSpreadsheetId();
  const range = encodeURIComponent(`${sheetTitle}!${a1Range}`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [[value]] }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "sheet_update_failed");
  return data;
}

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("hu-HU");
}

async function adjustStockInSheet(category, productName, delta) {
  if (!isSheetsWriteConfigured()) throw new Error("sheets_not_configured");
  if (STOCK_TABS[category] === undefined) throw new Error("invalid_category");

  const token = await getAccessToken();
  const gid = STOCK_TABS[category];
  const sheetTitle = await getSheetTitleByGid(gid, token);
  const values = await readSheetValues(sheetTitle, token);
  if (!values.length) throw new Error("empty_sheet");

  const headers = values[0].map((h) => String(h || "").trim());
  const { nameIdx, stockIdx } = findHeaderIndexes(headers);
  if (nameIdx < 0 || stockIdx < 0) throw new Error("missing_columns");

  const target = normalizeName(productName);
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const name = String(row[nameIdx] || "").trim();
    if (normalizeName(name) === target) {
      rowIndex = i;
      break;
    }
  }
  if (rowIndex < 0) throw new Error("product_not_found");

  const currentRaw = String(values[rowIndex][stockIdx] || "0").replace(/\s/g, "");
  const current = Number.parseInt(currentRaw, 10) || 0;
  const next = Math.max(0, current + delta);

  const stockCol = columnIndexToLetter(stockIdx);
  const a1 = `${stockCol}${rowIndex + 1}`;
  await updateCell(sheetTitle, a1, next, token);

  return { product: productName, stock: next, previous: current };
}

module.exports = {
  isSheetsWriteConfigured,
  adjustStockInSheet,
};
