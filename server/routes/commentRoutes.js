const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createComment,
    getCommentsByProject,
    deleteComment
} = require("../controllers/commentController");

router.post("/", authMiddleware, createComment);

router.get("/project/:projectId", authMiddleware, getCommentsByProject);

router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;