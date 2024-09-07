const sauceModel = require("../models/sauceSchema");
const path = require("path");
const fs = require("fs");

// Get all sauces
exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await sauceModel.find();
    res.status(200).json(sauces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Get a single sauce by ID
exports.getSauce = async (req, res, next) => {
  try {
    const sauce = await sauceModel.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }
    res.status(200).json(sauce);
  } catch (error) {
    console.error("Error fetching sauce:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new sauce
exports.addSauce = async (req, res, next) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new sauceModel({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`,
    });
    await sauce.save();
    res.status(201).json({ message: "Sauce added successfully", sauce });
  } catch (error) {
    console.error("Error adding sauce:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Modify an existing sauce
exports.modifySauce = async (req, res, next) => {
  try {
    const sauce = JSON.parse(req.body.sauce);
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const sauceObject = { ...sauce };
    const existingSauce = await sauceModel.findById(req.params.id);
    if (!existingSauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }
    if (req.file) {
      const oldImagePath = existingSauce.imageUrl.replace(
        `${req.protocol}://${req.get("host")}`,
        ""
      );
      fs.unlink(path.join(__dirname, "..", oldImagePath), (err) => {
        if (err) console.error("Error deleting old image:", err.message);
      });
      sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    const updatedSauce = await sauceModel.findByIdAndUpdate(
      req.params.id,
      sauceObject,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Sauce updated successfully", sauce: updatedSauce });
  } catch (error) {
    console.error("Error updating sauce:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete a sauce
exports.deleteSauce = async (req, res, next) => {
  try {
    const result = await sauceModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Sauce not found" });
    }
    const imagePath = result.imageUrl.replace("http://localhost:3000", "");
    const localPath = path.join(__dirname, "..", imagePath);
    fs.unlink(localPath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    res.status(200).json({ message: "Sauce deleted successfully" });
  } catch (error) {
    console.error("Error deleting sauce:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Adjust likes for a sauce
exports.adjustLikes = async (req, res, next) => {
  try {
    const { like, userId } = req.body;
    const sauceId = req.params.id;

    if (![1, -1, 0].includes(like)) {
      return res.status(400).json({ message: "Invalid like value." });
    }

    const sauce = await sauceModel.findById(sauceId);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    if (like === 1) {
      if (!sauce.usersLiked.includes(userId)) {
        sauce.usersLiked.push(userId);
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked = sauce.usersDisliked.filter(
            (id) => id !== userId
          );
        }
      }
    } else if (like === -1) {
      if (!sauce.usersDisliked.includes(userId)) {
        sauce.usersDisliked.push(userId);
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
        }
      }
    } else if (like === 0) {
      sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
      sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
    }

    sauce.likes = sauce.usersLiked.length;
    sauce.dislikes = sauce.usersDisliked.length;
    await sauce.save();
    res.status(200).json({ message: "Likes updated successfully", sauce });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
