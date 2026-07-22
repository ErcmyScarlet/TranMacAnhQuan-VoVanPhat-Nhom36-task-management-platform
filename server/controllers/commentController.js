const Comment = require("../models/Comment");
const Project = require("../models/Project");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
    try {
        const { project, content } = req.body;

        if (!project || !content?.trim()) {
            return res.status(400).json({
                message: "Vui lòng cung cấp công việc và nội dung bình luận"
            });
        }

        const normalizedProject = project.toString().trim();

        if (mongoose.isValidObjectId(normalizedProject)) {
            const existingProject = await Project.findById(normalizedProject);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Project không tồn tại"
                });
            }
        }

        const comment = await Comment.create({
            content: content.trim(),
            project: normalizedProject,
            author: req.user.id
        });

        res.status(201).json({
            message: "Thêm bình luận thành công",
            comment
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

const getCommentsByProject = async (req, res) => {
    try {

        const comments = await Comment.find({
            project: req.params.projectId
        })
        .populate("author", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });

    }
};
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Bạn không có quyền xóa bình luận này"
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Xóa bình luận thành công"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

module.exports = {
    createComment,
    getCommentsByProject,
    deleteComment
};