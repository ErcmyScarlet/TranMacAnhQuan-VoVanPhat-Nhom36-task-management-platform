const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

console.log("AUTH ROUTES LOADED");

router.get("/", (req, res) => {
    res.json({ message: "GET OK" });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;