const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const eventController = require("../controllers/eventsController");

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/", requireAuth, requireRole("admin"), eventController.createEvent);
router.patch("/:id", requireAuth, requireRole("admin"), eventController.updateEvent);
router.delete("/:id", requireAuth, requireRole("admin"), eventController.deleteEvent);

module.exports = router;