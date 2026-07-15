const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { register, login } = require("../controllers/authController");

router.get("/", (req, res) => {
    res.json({
        message: "Auth Route Working"
    });
});

router.get("/profile", authMiddleware, (req, res) => {

    res.json({
        message: "Đăng nhập thành công",
        user: req.user
    });

});

router.post("/register", register);
router.post("/login", login);

module.exports = router;