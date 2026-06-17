function getWebappUrl() {
  return String(process.env.STOCK_WEBAPP_URL || "").trim();
}

function isWebappWriteConfigured() {
  return Boolean(getWebappUrl());
}

async function adjustStockViaWebapp(category, productName, delta, pin) {
  const url = getWebappUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category,
      product: productName,
      delta,
      pin,
    }),
    redirect: "follow",
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("webapp_invalid_response");
  }

  if (data.error) throw new Error(data.error);
  if (!res.ok) throw new Error("webapp_failed");

  return {
    product: productName,
    stock: data.stock,
    previous: data.previous,
  };
}

module.exports = {
  isWebappWriteConfigured,
  adjustStockViaWebapp,
};
