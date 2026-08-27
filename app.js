// loading npms
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan  = require('morgan');
const mongoSanitize = require("express-mongo-sanitize");

// loading files
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const AppError = require("./utils/appError");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });
  next();
});
app.use(mongoSanitize());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// sends unhandled routes to the error handler
app.use((req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);


async function start() {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();