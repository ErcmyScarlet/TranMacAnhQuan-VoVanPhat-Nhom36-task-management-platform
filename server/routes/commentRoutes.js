const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createComment,
    getCommentsByProject,
    getCommentsByTask,
    getCommentsByNote,
    deleteComment
} = require("../controllers/commentController");

router.post("/", authMiddleware, createComment);

router.get("/project/:projectId", authMiddleware, getCommentsByProject);

router.get("/task/:taskId", authMiddleware, getCommentsByTask);

router.get("/note/:noteId", authMiddleware, getCommentsByNote);

router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;