const sauceModel = require("../models/sauceSchema");

exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await sauceModel.find({
      userId: req.headers.authorization.split(" ")[1],
    });
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
    console.log(req);

    res.status(201).json({ message: "Sauce added successfully", sauce });
  } catch (error) {
    console.error("Error adding sauce:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
