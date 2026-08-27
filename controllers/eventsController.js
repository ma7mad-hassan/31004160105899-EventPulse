const Event = require("../models/eventModel");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/events
exports.getEvents = asyncHandler(async (req, res) => {
    // filtering
    const {category, city, startDate, endDate, search, sortBy, order, page, limit} = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (city) filter.city = city;

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate)   filter.date.$lte = new Date(endDate);
    }

    //sorting
    const allowedSortFields = ['date', 'registrations'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const sortDirection = order === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortDirection };

    // search
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    // Pagination
    const pageNum  = parseInt(page)  || 1;
    const limitNum = parseInt(limit) || 10;
    const skip     = (pageNum - 1) * limitNum;
    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / limitNum);

    const result = await Event.find(filter)
        .populate('category')
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    res.status(200).json({
        status: 'success',
        data: result,
        pagination: {
        totalEvents,
        totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum,
    },
    });
});
// GET /api/events/:id
exports.getEventById = asyncHandler(async (req, res, next)=> {
    const event = await Event.findById(req.params.id)
        .populate('category')
        .populate('organizer');

    if (!event) {
        return next(new AppError('Event not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: event
    });
});
//POST /api/events
exports.createEvent = asyncHandler(async (req, res, next) => {
    //makes sure category exists
    if(req.body.category){
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return next(new AppError("Category not found", 404));
        };
    };
    const event = await Event.create(req.body);
    res.status(201).json({
        status: 'success',
        data: event
    });
});
// PATCH /api/events/:id
exports.updateEvent = asyncHandler(async (req, res, next) => {
        const event = await Event.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true, runValidators: true}
    );
    if (!event) {
        return next(new AppError('Event not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: event
    });
});
// DELETE /api/events/:id
exports.deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
        return next(new AppError('Event not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: null
    });
});