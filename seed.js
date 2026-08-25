// loading required npms
require("dotenv").config();
const mongoose = require("mongoose");


// loading required models
const category = require("./models/categoryModel");
const event = require("./models/eventModel");
const user = require("./models/userModel");

// database connection
const connectDB = require("./config/connectDB");

// initialize models by clearing existing data
async function initializeModels(model) {
    try {
        await model.deleteMany({});
        console.log(`Cleared existing ${model.modelName}s...`);
    }
    catch (error) {
        console.error(`Error occurred while deleting ${model.modelName}: ${error.message}`);
    }
};

async function runSeed() {
    try{
        await connectDB();
        await initializeModels(user);
        await initializeModels(category);
        await initializeModels(event);
// seeding users, categories and events     
    const users = await user.create([
        {name: "Ahmed Karim", email: "ahmedkarim@example.com", password: "password1234", role: "admin"},
    ]);
    const categories = await category.create([
        {name: "Sports", description: "Matches and tours at stadiums"},
        {name: "Music", description: "Concerts and festivals"},
        {name: "Tech conferences", description: "Industry events"},
    ]);
    const events = await event.create([
        {title: "Al Ahly vs El Zamalek", description: "Watch the biggest match of the league season as these 2 giants face off for the league title", category: categories[0]._id, date: new Date('2026-9-16'), city: "Cairo", venue: "cairo stadium", capacity : 70000, organizer: users[0]._id},
        {title: "Basketball Super League Finals", description: "Witness the thrilling climax of the national basketball season as the top teams clash for the championship trophy.", category: categories[0]._id, date: new Date('2026-10-20'), city: "Alexandria", venue: "Borg El Arab Sports Hall", capacity: 15000, organizer: users[0]._id},
        {title: "Cairo Jazz Festival 2026", description: "A weekend of soul, funk, and international jazz performances under the stars.", category: categories[1]._id, date: new Date('2026-11-12'), city: "Cairo", venue: "The Greek Campus", capacity: 3000, organizer: users[0]._id },
        {title: "Red Sea Acoustic Sunset", description: "An intimate seaside acoustic concert featuring local indie singers and songwriters.", category: categories[1]._id, date: new Date('2026-12-05'), city: "El Gouna", venue: "Marina Promenade Stage", capacity: 800, organizer: users[0]._id },
        { title: "PyCon Egypt 2026", description: "The premier gathering for Python developers, data scientists, and AI enthusiasts in the region.", category: categories[2]._id, date: new Date('2027-1-8'), city: "Cairo", venue: "Smart Village Conference Center", capacity: 1500, organizer: users[0]._id},
        { title: "Alexandria Hackathon & AI Summit", description: "A 48-hour competitive hackathon focused on building modern web applications and AI solutions.", category: categories[2]._id, date: new Date('2026-11-20'), city: "Alexandria", venue: "Bibliotheca Alexandrina", capacity: 500, organizer: users[0]._id}
    ]);
    console.log(`Seeding successful: ${users.length} users and ${categories.length} categories and ${events.length} events created.`);
}
    catch (error) {
        console.error(`Error occurred while seeding data: ${error.message}`);
    }
    finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
}
runSeed();
