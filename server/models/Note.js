const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, default: "" },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        reminderDate: { type: Date, default: null },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
