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
        
    } catch (error) {
        
    }
}
exports.addSauce = async (req, res, next) => {
    try {
      const existingSauce = await sauceModel.findOne({ name: req.body.name, image: req.body.image });
  
      if (existingSauce) {
        return res.status(409).json({ message: "Sauce already exists" });
      }
  
      const sauce = new sauceModel({
        sauce: req.body.sauce,
        image: req.body.image,
      });
  
      await sauce.save();
  
      res.status(201).json({ message: "Added sauce successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
  