const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Note = require("../models/Note");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
    try {
        const { project: projectId, task: taskId, note: noteId, content } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({
                message: "Vui lòng cung cấp nội dung bình luận"
            });
        }

        let finalProjectId = projectId;
        let finalTaskId = taskId;

        if (taskId) {
            // Find task to get the project ID
            const taskObj = await Task.findById(taskId);
            if (!taskObj) {
                return res.status(404).json({
                    message: "Task không tồn tại"
                });
            }
            finalProjectId = taskObj.projectId;
        }

        if (noteId) {
            // Verify note exists and belongs to user
            const noteObj = await Note.findOne({
                _id: noteId,
                createdBy: req.user.id
            });
            if (!noteObj) {
                return res.status(404).json({
                    message: "Note không tồn tại hoặc bạn không có quyền truy cập"
                });
            }
        } else {
            if (!finalProjectId) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp Project, Task hoặc Note hợp lệ"
                });
            }

            // Verify project access
            const existingProject = await Project.findOne({
                _id: finalProjectId,
                $or: [
                    { createdBy: req.user.id },
                    { memberIds: req.user.id }
                ]
            });

            if (!existingProject) {
                return res.status(403).json({
                    message: "Project không tồn tại hoặc bạn không có quyền truy cập"
                });
            }
        }

        const comment = await Comment.create({
            content: content.trim(),
            project: finalProjectId || undefined,
            task: finalTaskId || undefined,
            note: noteId || undefined,
            author: req.user.id
        });

        const populatedComment = await Comment.findById(comment._id).populate("author", "name email");

        res.status(201).json({
            message: "Thêm bình luận thành công",
            comment: populatedComment
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
        const project = await Project.findOne({
            _id: req.params.projectId,
            $or: [
                { createdBy: req.user.id },
                { memberIds: req.user.id }
            ]
        });

        if (!project) {
            return res.status(403).json({
                message: "Bạn không có quyền xem bình luận của project này"
            });
        }

        const comments = await Comment.find({
            project: req.params.projectId,
            $or: [{ task: { $exists: false } }, { task: null }]
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

const getCommentsByTask = async (req, res) => {
    try {
        const taskObj = await Task.findById(req.params.taskId);
        if (!taskObj) {
            return res.status(404).json({
                message: "Task không tồn tại"
            });
        }

        const project = await Project.findOne({
            _id: taskObj.projectId,
            $or: [
                { createdBy: req.user.id },
                { memberIds: req.user.id }
            ]
        });

        if (!project) {
            return res.status(403).json({
                message: "Bạn không có quyền xem bình luận của task này"
            });
        }

        const comments = await Comment.find({
            task: req.params.taskId
        })
        .populate("author", "name email")
        .sort({ createdAt: 1 }); // Oldest first for chronological conversation

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

const getCommentsByNote = async (req, res) => {
    try {
        const noteObj = await Note.findOne({
            _id: req.params.noteId,
            createdBy: req.user.id
        });
        if (!noteObj) {
            return res.status(404).json({
                message: "Note không tồn tại hoặc bạn không có quyền truy cập"
            });
        }

        const comments = await Comment.find({
            note: req.params.noteId
        })
        .populate("author", "name email")
        .sort({ createdAt: 1 }); // Oldest first for chronological conversation

        res.status(200).json(comments);

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
    getCommentsByTask,
    getCommentsByNote,
    deleteComment
};