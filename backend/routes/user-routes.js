const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const userCont = require("../controllers/user-controller");

router.post("/signup", userCont.signup);
router.post("/login", userCont.login);



module.exports = router;
