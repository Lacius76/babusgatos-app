const { adjustStockInSheet, isSheetsWriteConfigured } = require("./google-sheets");
const { adjustStockViaWebapp, isWebappWriteConfigured } = require("./stock-webapp");

function isStockWriteConfigured() {
  return isWebappWriteConfigured() || isSheetsWriteConfigured();
}

async function adjustStock(category, productName, delta, pin) {
  if (isWebappWriteConfigured()) {
    return adjustStockViaWebapp(category, productName, delta, pin);
  }
  return adjustStockInSheet(category, productName, delta);
}

module.exports = {
  isStockWriteConfigured,
  adjustStock,
};
