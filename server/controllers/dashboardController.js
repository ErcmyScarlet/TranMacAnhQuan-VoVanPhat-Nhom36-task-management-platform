const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getReminders = async (req, res) => {
  try {
    const now = new Date();
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: in7days },
      status: { $ne: "done" },
    }).sort({ dueDate: 1 });

    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: "done" },
    }).sort({ dueDate: 1 });

    const projects = await Project.find({
      dueDate: { $gte: now, $lte: in7days },
    }).sort({ dueDate: 1 });

    const overdueProjects = await Project.find({
      dueDate: { $lt: now },
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: { tasks, overdueTasks, projects, overdueProjects },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;

    const byStatus = await Task.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, data: { byStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};