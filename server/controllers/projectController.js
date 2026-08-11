const Project = require("../models/Project");
const Task = require("../models/Task");

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const owner = req.user?.id;

        const project = new Project({
            title,
            description,
            owner,
        });

        await project.save();

        res.status(201).json({
            message: "Tạo Project thành công",
            project,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
        });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const owner = req.user.id;
        const projects = await Project.find({ owner }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user.id,
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
            { _id: req.params.id, owner: req.user.id },
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
            owner: req.user.id,
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