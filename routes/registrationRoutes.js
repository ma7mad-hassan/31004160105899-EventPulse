const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
router.post("/", registrationController.registerationForEvents);
router.get("/my", registrationController.getRegistrations);
router.delete("/:id", registrationController.deleteRegistration);

module.exports = router;
