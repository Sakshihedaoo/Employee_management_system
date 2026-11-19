// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const authRoutes = require("./routes/authRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

// const app = express();
// app.use(helmet());
// app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
// app.use(express.json({ limit: "1mb" }));

// app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "ems-backend" }));
// app.use("/api/auth", authRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// // app.use("/api/organization", require("./routes/organizationRoutes"));

// app.use((err, _req, res, _next) => {
//   console.error("Unhandled error:", err.message);
//   res.status(500).json({ message: "Unexpected server error." });
// });

// module.exports = app;


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "ems-backend"
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/organization", organizationRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);

  res.status(500).json({
    message: "Unexpected server error."
  });
});

module.exports = app;