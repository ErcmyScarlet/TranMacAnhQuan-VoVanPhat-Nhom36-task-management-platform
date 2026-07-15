const Project = require("../models/Project");

   exports.getProjects = async (req, res) => {
     try {
       const projects = await Project.find();
       res.status(200).json({ success: true, data: projects });
     } catch (err) {
       res.status(500).json({ success: false, error: err.message });
     }
   };

   exports.createProject = async (req, res) => {
     try {
       const { title, description } = req.body;
       const project = await Project.create({ title, description, memberIds: [] });
       res.status(201).json({ success: true, data: project });
     } catch (err) {
       res.status(400).json({ success: false, error: err.message });
     }
   };
   const Task = require("../models/Task");

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: "Không tìm thấy project" });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ projectId: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};