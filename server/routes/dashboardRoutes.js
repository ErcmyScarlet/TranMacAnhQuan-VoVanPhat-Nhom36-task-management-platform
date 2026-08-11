const express = require("express");
const router = express.Router();
const { getReminders, getStats } = require("../controllers/dashboardController");

router.get("/reminders", getReminders);
router.get("/stats", getStats);

module.exports = router;