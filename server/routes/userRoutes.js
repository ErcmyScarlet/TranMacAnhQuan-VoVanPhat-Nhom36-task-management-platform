const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    getUsers,
    getAllUsers,
    changePassword
} = require("../controllers/userController");

const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

router.get("/", authMiddleware, getUsers);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);



module.exports = router;