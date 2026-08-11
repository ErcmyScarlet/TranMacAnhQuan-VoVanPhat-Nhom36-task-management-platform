const express = require("express");
const router = express.Router();
const {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    toggleComplete,
} = require("../controllers/noteController");
const protect = require("../middleware/authMiddleware");

router.route("/").get(protect, getNotes).post(protect, createNote);
router
    .route("/:id")
    .get(protect, getNoteById)
    .put(protect, updateNote)
    .delete(protect, deleteNote);
router.put("/:id/complete", protect, toggleComplete);

module.exports = router;
