const express = require("express");
const app = express();

app.use(express.json());

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

app.post("/api/auth/signup", (req, res) => {
  // Log the request body (parsed JSON data)
  console.log(req.body);

  // Send a response back to the client
  res.status(201).json({ message: "User signed up successfully!" });
});
app.post("/api/auth/login", (req, res) => {
  // Log the request body (parsed JSON data)
  console.log(req.body);

  // Send a response back to the client
  res.status(201).json({ message: "User Logged in!" });
});

module.exports = app;
