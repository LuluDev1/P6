const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
const userRoutes = require("./routes/user-routes");
const sauceRoutes = require("./routes/sauces-router");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const password = process.env.DB_PASSWORD;

app.use(cors()); // Enable CORS

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Correct static folder path

// Database Connection
mongoose
  .connect(`mongodb+srv://devlulu:${password}@cluster0.9g4tbes.mongodb.net/`)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.error("Unable to connect to MongoDB Atlas!", error);
  });


// Route Middleware
app.use("/api/auth", userRoutes);
app.use("/api", sauceRoutes);

module.exports = app;
