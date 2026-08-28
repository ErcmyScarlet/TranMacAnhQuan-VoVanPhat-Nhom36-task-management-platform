const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        },

        note: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Comment", commentSchema);