const sauceModel = require("../models/sauceSchema");
const path = require("path");
const fs = require("fs");
exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await sauceModel.find();
    res.status(200).json(sauces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSauce = async (req, res, next) => {
  try {
    const sauce = await sauceModel.findById(req.params.id);

    if (!sauce) {
      console.log("Sauce not found with name:", sauce);
      return res.status(404).json({ message: "Sauce not found" });
    }

    // Send the found sauce
    res.status(200).json(sauce);
  } catch (error) {
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

exports.modifySauce = async (req, res, next) => {
  try {
    // Parse the sauce object from the request body
    const sauce = JSON.parse(req.body.sauce);

    // Check if the user is authorized to modify the sauce
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const sauceObject = { ...sauce }; // Use parsed sauce object

    // Fetch the existing sauce from the database
    const existingSauce = await sauceModel.findById(req.params.id);

    if (!existingSauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    // Handle image upload if a new file is provided
    if (req.file) {
      // Construct the path to the old image
      const oldImagePath = existingSauce.imageUrl.replace(
        `${req.protocol}://${req.get("host")}`,
        ""
      );

      // Delete the old image file
      fs.unlink(path.join(__dirname, "..", oldImagePath), (err) => {
        if (err) {
          console.error("Error deleting old image:", err.message);
        } else {
          console.log("Old image deleted:", oldImagePath);
        }
      });

      // Update the sauce object with the new image URL
      sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // Update the sauce in the database
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

exports.deleteSauce = async (req, res, next) => {
  try {
    const result = await sauceModel.findByIdAndDelete(req.params.id);
    let imagepath = result.imageUrl;
    let localPath = path.join(
      __dirname,
      "..",
      imagepath.replace("http://localhost:3000", "")
    );
    const newpath = localPath.replace("--", "--original-");

    fs.unlink(localPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Deleted file:", localPath);
      }
    });
    fs.unlink(newpath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Deleted file:", localPath);
      }
    });

    if (!result) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    console.log("Deleted sauce:", result);

    // Respond with a success message
    res.status(200).json({ message: "Sauce deleted successfully" });
  } catch (error) {
    // Log and respond with an error message
    console.error("Error deleting sauce:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.adjustLikes = async (req, res, next) => {
  try {
    const { like, userId } = req.body;
    const sauceId = req.params.id;

    console.log(like);
    // Validate the like value
    if (![1, -1, 0].includes(like)) {
      return res.status(400).json({
        message: "Invalid like value.",
      });
    }

    // Find the sauce by ID
    const sauce = await sauceModel.findById(sauceId);

    // Check if the sauce exists
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    if (like === 1) {
      if (sauce.usersLiked.includes(userId)) {
        // User already liked this sauce, so remove the like
        // sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
      } else {
        // User has not liked this sauce yet, so add the like
        sauce.usersLiked.push(userId);

        // If the user has disliked the sauce, remove the dislike
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked = sauce.usersDisliked.filter(
            (id) => id !== userId
          );
        }
      }
    }

    // Handling the "dislike" action
    else if (like === -1) {
      if (sauce.usersDisliked.includes(userId)) {
        // User already disliked this sauce, so remove the dislike
        // sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
      } else {
        // User has not disliked this sauce yet, so add the dislike
        sauce.usersDisliked.push(userId);

        // If the user has liked the sauce, remove the like
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
        }
      }
    } else if (like === 0) {
      // If the user has liked the sauce, remove the like
      if (sauce.usersLiked.includes(userId)) {
        sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
      }

      // If the user has disliked the sauce, remove the dislike
      if (sauce.usersDisliked.includes(userId)) {
        sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
      }
    }
    // Update counts
    sauce.likes = sauce.usersLiked.length;
    sauce.dislikes = sauce.usersDisliked.length;

    // Save the updated sauce
    await sauce.save();

    // Respond with the updated sauce
    res.status(200).json({ message: "Likes updated successfully", sauce });
  } catch (error) {
    // Log and respond with an error message
    console.error("Error updating likes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
