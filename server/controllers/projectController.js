const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user.id },
                { memberIds: req.user.id },
            ],
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const project = await Project.create({
            title,
            description,
            dueDate,
            createdBy: req.user?.id,
            memberIds: req.user?.id ? [req.user.id] : [],
        });
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy Project",
            });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { title, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy Project",
            });
        }

        res.status(200).json({
            message: "Cập nhật Project thành công",
            project,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy Project",
            });
        }

        await Task.deleteMany({ projectId: req.params.id });

        res.status(200).json({
            message: "Xóa Project thành công",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
        });
    }
};