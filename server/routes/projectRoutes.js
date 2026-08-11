const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

router.route("/").get(protect, getProjects).post(protect, createProject);
router.route("/:id").get(protect, getProjectById).put(protect, updateProject).delete(protect, deleteProject);
router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProjectById);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;