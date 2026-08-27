const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { body } = require('express-validator');

const registrationValidation = [
  body('eventId').isMongoId().withMessage('eventId must be a valid MongoId'),
  validate,
];

router.use(requireAuth);
router.post("/", registrationValidation, registrationController.registerationForEvents);
router.get("/my", registrationController.getRegistrations);
router.delete("/:id", registrationController.deleteRegistration);

module.exports = router;
