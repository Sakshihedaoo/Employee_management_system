const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");

const organizationController = require("../controllers/organizationController");

function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only administrators can manage organization settings.",
    });
  }

  next();
}

router.use(authenticate, adminOnly);

router.get("/:type", organizationController.list);
router.post("/:type", organizationController.create);
router.put("/:type/:id", organizationController.update);
router.delete("/:type/:id", organizationController.remove);

module.exports = router;