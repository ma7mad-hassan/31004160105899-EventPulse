const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const announcementController = require("../controllers/announcementController");

router.post("/", requireAuth, requireRole("admin"), announcementController.createAnnouncement);
router.get("/:eventId", announcementController.getAnnouncements);

module.exports = router;