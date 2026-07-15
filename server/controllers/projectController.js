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