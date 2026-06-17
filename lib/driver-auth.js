function getDriverPin() {
  return String(process.env.DRIVER_PIN || "3435").trim();
}

function verifyDriverPin(pin) {
  const expected = getDriverPin();
  const given = String(pin || "").trim();
  if (!given || given.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return mismatch === 0;
}

function readPinFromRequest(req) {
  const header = req.headers["x-driver-pin"];
  if (header) return String(header).trim();
  if (req.body && req.body.pin != null) return String(req.body.pin).trim();
  if (req.query && req.query.pin != null) return String(req.query.pin).trim();
  return "";
}

module.exports = {
  verifyDriverPin,
  readPinFromRequest,
};
