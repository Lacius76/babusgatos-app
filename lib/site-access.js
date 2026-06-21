function getSiteAccessPin() {
  return String(process.env.SITE_ACCESS_PIN || "").trim();
}

function isSiteAccessConfigured() {
  return getSiteAccessPin().length >= 4;
}

function verifySiteAccessPin(pin) {
  const expected = getSiteAccessPin();
  if (!expected) return false;
  const given = String(pin || "").trim();
  if (!given || given.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return mismatch === 0;
}

function readSiteAccessPinFromRequest(req) {
  const header = req.headers["x-site-access-pin"];
  if (header) return String(header).trim();
  if (req.body && req.body.pin != null) return String(req.body.pin).trim();
  return "";
}

module.exports = {
  isSiteAccessConfigured,
  verifySiteAccessPin,
  readSiteAccessPinFromRequest,
};
