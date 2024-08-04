const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

const userRoutes = require("./routes/user-routes");

app.use((req, res, next) => {
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

// const user = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;

// mongoose
//   .connect(`mongodb+srv://devlulu:${password}@cluster0.9g4tbes.mongodb.net/`)
//   .then(() => {
//     console.log("Successfully connected to MongoDB Atlas!");
//   })
//   .catch((error) => {
//     console.log("Unable to connect to MongoDB Atlas!");
//     console.error(error);
//   });

// app.post("/api/auth/signup", (req, res) => {
//   // Log the request body (parsed JSON data)
//   console.log(req.body);

//   // Send a response back to the client
//   res.status(201).json({ message: "User signed up successfully!" });
// });
// app.post("/api/auth/login", (req, res) => {
//   // Log the request body (parsed JSON data)
//   console.log(req.body);

//   // Send a response back to the client
//   res.status(201).json({ message: "User Logged in!" });
// });

module.exports = app;
