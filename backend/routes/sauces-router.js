const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const saucesCont = require("../controllers/sauces-controller");

router.get("/sauces", auth, saucesCont.getSauces);
router.get("/sauces/:id", auth, saucesCont.getSauce);
router.post("/sauces", auth, upload, saucesCont.addSauce);
router.put("/sauces/:id", auth, upload, saucesCont.modifySauce);
router.delete("/sauces/:id", auth, saucesCont.deleteSauce);
router.post("/sauces/:id/like", auth, saucesCont.adjustLikes);


module.exports = router;
