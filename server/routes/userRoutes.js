const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    getAllUsers,
    changePassword
} = require("../controllers/userController");

const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

module.exports = router;