const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new userModel({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User created successfully",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
        });
      });
  });
};

exports.login = (req, res, next) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({ error: "Incorrect password" });
          }
          const token = jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
