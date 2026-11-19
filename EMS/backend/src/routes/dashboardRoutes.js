const express = require("express");
const controller = require("../controllers/dashboardController");
const {
  authenticate,
  allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/admin", allowRoles("ADMIN"), controller.adminDashboard);

router.get("/manager", allowRoles("MANAGER"), controller.managerDashboard);

router.get(
  "/employee",
  allowRoles("EMPLOYEE", "MANAGER", "ADMIN"),
  controller.employeeDashboard
);

module.exports = router;

