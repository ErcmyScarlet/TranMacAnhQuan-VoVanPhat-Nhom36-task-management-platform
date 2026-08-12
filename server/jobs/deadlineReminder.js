const cron = require("node-cron");
const Task = require("../models/Task");
const Project = require("../models/Project");
const transporter = require("../config/mailer");

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: in24h },
      status: { $ne: "done" },
    }).populate("assigneeId", "email name");

    for (const task of tasks) {
      if (!task.assigneeId?.email) continue;
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: task.assigneeId.email,
        subject: `Nhắc hạn Task: ${task.title}`,
        text: `Task "${task.title}" sắp đến hạn vào ${task.dueDate}.`,
      });
    }
    const projects = await Project.find({
      dueDate: { $gte: now, $lte: in24h },
    }).populate("memberIds", "email name");

    for (const project of projects) {
      for (const member of project.memberIds) {
        if (!member.email) continue;
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: member.email,
          subject: `Nhắc hạn Project: ${project.title}`,
          text: `Project "${project.title}" sắp đến hạn vào ${project.dueDate}.`,
        });
      }
    }

    console.log(`[Cron] Đã kiểm tra nhắc hạn lúc ${now.toLocaleString("vi-VN")}`);
  } catch (err) {
    console.error("[Cron] Lỗi gửi email nhắc hạn:", err.message);
  }
});