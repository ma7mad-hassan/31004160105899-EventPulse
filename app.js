const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
// loading npms
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan  = require('morgan');
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");
const { Server } = require("socket.io");

// loading files
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const AppError = require("./utils/appError");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("join-event", (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined room: ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

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
app.use("/api/announcements", announcementRoutes);
app.get('/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: dbStates[mongoose.connection.readyState] || 'unknown',
  });
});

// sends unhandled routes to the error handler
app.use((req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);


async function start() {
  await connectDB();
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

start();
