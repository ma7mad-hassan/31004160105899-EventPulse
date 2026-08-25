require("dotenv").config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle runtime disconnections after initial success
    mongoose.connection.on('error', (err) => {
      console.error(`Runtime DB Error: ${err.message}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    // Fatal: cannot proceed without a database
    console.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;