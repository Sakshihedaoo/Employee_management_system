const crypto = require("crypto");

function makeResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
module.exports = { makeResetToken, hashToken };
