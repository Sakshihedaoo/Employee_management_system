require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

(async () => {
  const name = process.env.ADMIN_NAME || "EMS Admin";
  const email = String(process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "ChangeMe123!") {
    console.error("Set ADMIN_PASSWORD in backend/.env to a private password before running the seed script.");
    process.exit(1);
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    await db.execute(
      `INSERT INTO users (name, email, password_hash, role, status, must_change_password)
       VALUES (?, ?, ?, 'ADMIN', 'ACTIVE', 0)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = 'ADMIN', status = 'ACTIVE'`,
      [name, email, hash]
    );
    console.log(`Admin account ready: ${email}`);
  } catch (error) {
    console.error("Could not create admin. Run database/schema.sql first.", error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();
