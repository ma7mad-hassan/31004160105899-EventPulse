const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const eventController = require("../controllers/eventsController");
const { param, body } = require('express-validator');
const validate = require('../middleware/validate');

const createValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').isMongoId().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Please provide a valid date'),
    body('capacity').isInt({ gt: 0 }).withMessage('Capacity must be a positive number'),
    validate,
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid event ID format'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('category').optional().isMongoId().withMessage('Category must be a valid MongoId'),
  body('date').optional().isISO8601().toDate().withMessage('Please provide a valid date'),
  body('capacity').optional().isInt({ gt: 0 }).withMessage('Capacity must be a positive number'),
  validate,
];
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/", requireAuth, requireRole("admin"), createValidation, eventController.createEvent);
router.patch("/:id", requireAuth, requireRole("admin"), updateValidation, eventController.updateEvent);
router.delete("/:id", requireAuth, requireRole("admin"), eventController.deleteEvent);

module.exports = router;