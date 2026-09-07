const cron = require("node-cron");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Note = require("../models/Note");
const transporter = require("../config/mailer");
const { startOfTodayVN, formatVN } = require("../utils/vietnamTime");

cron.schedule("* 0 * * *", async () => {
  const now = new Date();
  const startOfToday = startOfTodayVN();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const projects = await Project.find({
      dueDate: { $gte: startOfToday, $lte: in24h },
    }).populate("memberIds", "email name");

    for (const project of projects) {
      for (const member of project.memberIds) {
        if (!member.email) continue;
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: member.email,
          subject: `Nhắc hạn Project: ${project.title}`,
          text: `Project "${project.title}" sắp đến hạn vào ${formatVN(project.dueDate)}.`,
        });
      }
    }

    const tasks = await Task.find({
      dueDate: { $gte: startOfToday, $lte: in24h },
      status: { $ne: "done" },
    }).populate("assigneeId", "email name");

    for (const task of tasks) {
      if (!task.assigneeId?.email) continue;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: task.assigneeId.email,
        subject: `Nhắc hạn Task: ${task.title}`,
        text: `Task "${task.title}" sắp đến hạn vào ${formatVN(task.dueDate)}.`,
      });
    }
    const notes = await Note.find({
      reminderDate: { $gte: startOfToday, $lte: in24h },
      status: "pending",
    }).populate("createdBy", "email name");

    for (const note of notes) {
      if (!note.createdBy?.email) continue;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: note.createdBy.email,
        subject: `Nhắc ghi chú: ${note.title}`,
        text: `Ghi chú "${note.title}" có nhắc hẹn vào ${formatVN(note.reminderDate)}.`,
      });
    }

    console.log(
      `[Cron] Đã kiểm tra nhắc hạn lúc ${now.toLocaleString("vi-VN")} — Project: ${projects.length}, Task: ${tasks.length}, Note: ${notes.length}`
    );
  } catch (err) {
    console.error("[Cron] Lỗi gửi email nhắc hạn:", err.message);
  }
});