const sauceModel = require("../models/sauceSchema");

exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await sauceModel.find();
    res.json(sauces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSauce = async (req, res, next) => {
  try {
    const sauce = await sauceModel.findOne({
      userId: req.headers.authorization.split(" ")[1],
      name: req.body.name,
    });
    res.status(200).send(sauce);
  } catch (error) {}
};
exports.addSauce = async (req, res, next) => {
  try {
    // Check for existing sauce based on userId and name
    const existingSauce = await sauceModel.findOne({
      userId: req.headers.authorization.split(" ")[1],
      name: req.body.name,
    });

    if (existingSauce) {
      return res.status(409).json({ message: "Sauce already exists" });
    }

    // Create and save new sauce
    const sauce = new sauceModel({
      userId: req.headers.authorization.split(" ")[1],
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    });

    await sauce.save();

    res.status(201).json({ message: "Added sauce successfully" });
  } catch (error) {
    console.error("Error adding sauce:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
