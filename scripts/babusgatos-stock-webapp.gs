/**
 * Babusgatós — sofőr készlet írás (Google Apps Script)
 *
 * Beállítás (egyszer):
 * 1. Nyisd meg a készlet Google Sheetet
 * 2. Bővítmények → Apps Script
 * 3. Töröld a sablont, illeszd be ezt a teljes fájlt
 * 4. Futtatás → doPost választása NEM kell — helyette:
 *    Telepítés → Új telepítés → Típus: Webalkalmazás
 *    - Futtatás mint: Én
 *    - Ki férhet hozzá: Bárki
 * 5. A kapott URL-t másold a Vercel STOCK_WEBAPP_URL env-be
 * 6. (Opcionális) Projekt beállítások → Script tulajdonságok → DRIVER_PIN = 3435
 *
 * Nem kell sablont keresni a galériában — ez egy egyedi mini API a táblázathoz.
 */

var SHEET_GIDS = {
  bread: null,
  pastry: 1011203089,
};

var NAME_HEADERS = ["Termék", "Termek", "Product", "Produkt"];
var STOCK_HEADERS = ["Készlet", "Keszlet", "Stock", "Bestand"];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var pin = String(data.pin || "");
    var expected =
      PropertiesService.getScriptProperties().getProperty("DRIVER_PIN") || "3435";
    if (pin !== expected) {
      return json_({ error: "invalid_pin" });
    }

    var category = String(data.category || "");
    if (!SHEET_GIDS.hasOwnProperty(category)) {
      return json_({ error: "invalid_category" });
    }

    var product = String(data.product || "").trim();
    if (!product) {
      return json_({ error: "missing_product" });
    }

    var delta = parseInt(String(data.delta), 10);
    if (!delta || Math.abs(delta) > 50) {
      return json_({ error: "invalid_delta" });
    }

    var result = adjustStock_(category, product, delta);
    return json_({ ok: true, product: product, stock: result.stock, previous: result.previous });
  } catch (err) {
    return json_({ error: String(err.message || err) });
  }
}

function adjustStock_(category, productName, delta) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetByGid_(ss, SHEET_GIDS[category]);
  if (!sheet) throw new Error("sheet_not_found");

  var range = sheet.getDataRange();
  var values = range.getValues();
  if (!values.length) throw new Error("empty_sheet");

  var headers = values[0].map(function (h) {
    return String(h || "").trim();
  });
  var nameIdx = findHeaderIndex_(headers, NAME_HEADERS);
  var stockIdx = findHeaderIndex_(headers, STOCK_HEADERS);
  if (nameIdx < 0 || stockIdx < 0) throw new Error("missing_columns");

  var target = normalizeName_(productName);
  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    var name = String(values[i][nameIdx] || "").trim();
    if (normalizeName_(name) === target) {
      rowIndex = i;
      break;
    }
  }
  if (rowIndex < 0) throw new Error("product_not_found");

  var current = parseInt(String(values[rowIndex][stockIdx] || "0").replace(/\s/g, ""), 10) || 0;
  var next = Math.max(0, current + delta);
  sheet.getRange(rowIndex + 1, stockIdx + 1).setValue(next);

  return { stock: next, previous: current };
}

function getSheetByGid_(ss, gid) {
  var sheets = ss.getSheets();
  if (gid == null) return sheets[0];
  var id = Number(gid);
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === id) return sheets[i];
  }
  return null;
}

function findHeaderIndex_(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    if (aliases.indexOf(headers[i]) >= 0) return i;
  }
  return -1;
}

function normalizeName_(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("hu-HU");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
