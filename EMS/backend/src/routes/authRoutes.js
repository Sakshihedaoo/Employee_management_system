const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication requests. Please try again later." }
});

router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required."
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length > 100) {
      return res.status(400).json({
        message: "Name cannot exceed 100 characters."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: "Password must contain 8 to 128 characters."
      });
    }

    if (/\s/.test(password)) {
      return res.status(400).json({
        message: "Password cannot contain spaces."
      });
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9\s]/.test(password)
    ) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number and special character."
      });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `INSERT INTO users
       (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'EMPLOYEE', 'ACTIVE')`,
      [cleanName, cleanEmail, hashedpassword]
    );

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
        role: "EMPLOYEE"
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    return res.status(500).json({
      message: "Unable to create your account. Please try again.",
      ...(process.env.NODE_ENV !== "production"
        ? { detail: error.message }
        : {})
    });
  }
});

router.post("/login", authLimiter, controller.login);
router.post("/forgot-password", authLimiter, controller.forgotPassword);
router.post("/reset-password", authLimiter, controller.resetPassword);
router.post("/change-password", authenticate, controller.changePassword);
router.get("/me", authenticate, controller.me);

module.exports = router;
