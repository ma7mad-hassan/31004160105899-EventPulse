const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/messageModel");``

// POST /api/announcements
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
    const { eventId, text } = req.body;
    if (!eventId || !text) {
        return next(new AppError('Please provide both eventId and text', 400));
    }

    const message = await Message.create({
        event: eventId,
        sender: req.user.userId,
        text,
    });
    const io = req.app.get('io');

    io.to(eventId).emit('announcement', message);

    res.status(201).json({
        status: 'success',
        data: message,
    });

});
//GET /api/announcements/:eventId
exports.getAnnouncements = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    if (!eventId) {
        return next(new AppError('Please provide an event ID', 400));
    }
    const announcements = await Message.find({ event: eventId })
        .sort({ createdAt: 1 })
        .populate("sender", "name email");
    res.status(200).json({
        status: "success",
        results: announcements.length,
        data: announcements,
    });
});