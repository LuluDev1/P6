const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const saucesCont = require("../controllers/sauces-controller");

router.get("/sauces", saucesCont.getSauces);
router.get("/sauces/:id", auth, saucesCont.getSauce);
router.post("/sauces", saucesCont.addSauce);

module.exports = router;
