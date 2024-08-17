const sauceModel = require("../models/sauceSchema");
const jwt = require("jsonwebtoken");
exports.getSauces = async (req, res, next) => {
  try {
    // Check if authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Use environment variable for the secret
    const userId = decodedToken.userId;

    // Query sauces where userId matches the decoded userId
    const sauces = await sauceModel.find({ userId: userId });

    // Send the sauces as a JSON response
    res.status(200).json(sauces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSauce = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Sauce name is required" });
    }

    const sauce = await sauceModel.findOne({ name });

    if (!sauce) {
      console.log("Sauce not found with name:", name);
      return res.status(404).json({ message: "Sauce not found" });
    }

    // Send the found sauce
    res.status(200).json(sauce);
  } catch (error) {
    // Log and send an error response
    console.error("Error fetching sauce:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addSauce = async (req, res, next) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);

    // Construct the sauce object including the image URL
    const sauce = new sauceModel({
      ...sauceObject,

      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`,
    })
      .save()
      .then(() =>
        res.status(201).json({ message: "Sauce added successfully", sauce })
      )
      .catch((err) => {
        throw new Error(err.message);
      });
  } catch (error) {
    console.error("Error adding sauce:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
