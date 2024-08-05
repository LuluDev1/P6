const express = require("express");
const router = express.Router();
const upload = require("../middleware/auth"); // Ensure the correct path to your upload middleware
const auth = require("../middleware/auth");
const saucesCont = require("../controllers/sauces-controller");

router.get("/sauces", auth, saucesCont.getSauces);
router.get("/sauces/:id", auth, saucesCont.getSauce);
router.post("/sauces", auth, upload, saucesCont.addSauce); // Include upload middleware here

module.exports = router;
