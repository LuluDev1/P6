const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user-routes");
const sauceRoutes = require("./routes/sauces-router");

const app = express();
const password = process.env.DB_PASSWORD;

app.use(express.json());

// Database
mongoose
  .connect(`mongodb+srv://devlulu:${password}@cluster0.9g4tbes.mongodb.net/`)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

// Set the cross-origin resource
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api", sauceRoutes);

module.exports = app;
