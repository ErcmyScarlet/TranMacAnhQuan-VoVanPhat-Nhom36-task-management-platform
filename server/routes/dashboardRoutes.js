const express = require("express");
const router = express.Router();
const { getReminders, getStats } = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");

router.get("/reminders", protect, getReminders);
router.get("/stats", protect, getStats);

module.exports = router;