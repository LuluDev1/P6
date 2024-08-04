const mongoose = require("mongoose");

const sauceModel = new mongoose.Schema({
  sauce: { type: String, required: true },
  image: { type: String, required: true }, // Changed 'File' to 'String'
});

module.exports = mongoose.model("sauces", sauceModel);
