const Note = require("../models/Note");

// POST /api/notes — Tạo Note
exports.createNote = async (req, res) => {
    try {
        const { title, content, priority, reminderDate } = req.body;
        const note = await Note.create({
            title,
            content,
            priority,
            reminderDate: reminderDate || null,
            createdBy: req.user.id,
        });
        res.status(201).json({ success: true, data: note });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// GET /api/notes — Lấy tất cả Note của user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user.id }).sort({
            createdAt: -1,
        });
        res.status(200).json({ success: true, data: notes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET /api/notes/:id — Chi tiết Note
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!note) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy Note" });
        }

        res.status(200).json({ success: true, data: note });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// PUT /api/notes/:id — Cập nhật Note
exports.updateNote = async (req, res) => {
    try {
        const { title, content, priority, reminderDate } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { title, content, priority, reminderDate },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy Note" });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật Note thành công",
            data: note,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// DELETE /api/notes/:id — Xóa Note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!note) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy Note" });
        }

        res.status(200).json({
            success: true,
            message: "Xóa Note thành công",
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// PUT /api/notes/:id/complete — Đánh dấu hoàn thành / chưa hoàn thành
exports.toggleComplete = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        });

        if (!note) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy Note" });
        }

        note.status = note.status === "completed" ? "pending" : "completed";
        await note.save();

        res.status(200).json({
            success: true,
            message:
                note.status === "completed"
                    ? "Đã hoàn thành"
                    : "Đánh dấu chưa hoàn thành",
            data: note,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
