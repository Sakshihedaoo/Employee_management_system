const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");
const { makeResetToken, hashToken } = require("../utils/password");

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  mustChangePassword: Boolean(row.must_change_password)
});




exports.login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  try {
    const [rows] = await db.execute(
      `SELECT id, name, email, password_hash, role, status
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "This account is disabled."
      });
    }

    if (!user.password_hash) {
      return res.status(500).json({
        message: "Account password is not configured."
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h"
      }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: false
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error while signing in."
    });
  }
};




exports.forgotPassword = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required." });
  try {
    const [rows] = await db.execute("SELECT id, email FROM users WHERE email = ? AND status = 'ACTIVE' LIMIT 1", [email]);
    const genericMessage = "If an active account matches that email, reset instructions have been generated.";
    if (!rows[0]) return res.json({ message: genericMessage });

    const { rawToken, tokenHash } = makeResetToken();
    const minutes = Math.max(5, Number(process.env.RESET_TOKEN_MINUTES || 15));
    await db.execute(
      "UPDATE users SET reset_token_hash = ?, reset_token_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE id = ?",
      [tokenHash, minutes, rows[0].id]
    );

    // Development only: show the link in the API response. In production, send it through a verified email provider instead.
    const developmentResetUrl = process.env.NODE_ENV === "production"
      ? undefined
      : `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${rawToken}`;
    return res.json({ message: genericMessage, ...(developmentResetUrl ? { developmentResetUrl } : {}) });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Could not process the password reset request." });
  }
};

exports.resetPassword = async (req, res) => {
  const token = String(req.body.token || "");
  const password = String(req.body.password || "");
  if (!token || password.length < 8) return res.status(400).json({ message: "A reset token and password of at least 8 characters are required." });
  try {
    const tokenHash = hashToken(token);
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE reset_token_hash = ? AND reset_token_expires_at > NOW() AND status = 'ACTIVE' LIMIT 1",
      [tokenHash]
    );
    if (!rows[0]) return res.status(400).json({ message: "Reset link is invalid or expired. Request a new link." });
    const passwordHash = await bcrypt.hash(password, 12);
    await db.execute(
      "UPDATE users SET password_hash = ?, must_change_password = 0, reset_token_hash = NULL, reset_token_expires_at = NULL, failed_login_attempts = 0, locked_until = NULL WHERE id = ?",
      [passwordHash, rows[0].id]
    );
    return res.json({ message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Could not reset the password." });
  }
};

exports.changePassword = async (req, res) => {
  const oldPassword = String(req.body.oldPassword || "");
  const newPassword = String(req.body.newPassword || "");
  if (newPassword.length < 8) return res.status(400).json({ message: "New password must contain at least 8 characters." });
  if (oldPassword === newPassword) return res.status(400).json({ message: "New password must be different from the current password." });
  try {
    const [rows] = await db.execute("SELECT id, password_hash FROM users WHERE id = ? LIMIT 1", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: "User not found." });
    if (!(await bcrypt.compare(oldPassword, rows[0].password_hash))) return res.status(400).json({ message: "Current password is incorrect." });
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.execute("UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?", [passwordHash, req.user.id]);
    return res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error.message);
    return res.status(500).json({ message: "Could not change the password." });
  }
};

exports.me = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email, role, must_change_password, status FROM users WHERE id = ? LIMIT 1", [req.user.id]);
    if (!rows[0] || rows[0].status !== "ACTIVE") return res.status(401).json({ message: "Account is not available." });
    return res.json({ user: publicUser(rows[0]) });
  } catch (error) {
    return res.status(500).json({ message: "Could not load user profile." });
  }
};
