const Task = require("../models/Task");
const Project = require("../models/Project");
const { startOfTodayVN, nowVN } = require("../utils/vietnamTime");

exports.getReminders = async (req, res) => {
  try {
    const now = nowVN();
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Get only projects that the user has access to
    const userProjects = await Project.find({
      $or: [
        { createdBy: userId },
        { memberIds: userId }
      ]
    }).select("_id");

    const projectIds = userProjects.map(p => p._id);

    const tasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $gte: startOfTodayVN(), $lte: in7days },
      status: { $ne: "done" },
    }).sort({ dueDate: 1 });

    const overdueTasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $lt: startOfTodayVN() },
      status: { $ne: "done" },
    }).sort({ dueDate: 1 });

    const projects = await Project.find({
      _id: { $in: projectIds },
      dueDate: { $gte: startOfTodayVN(), $lte: in7days },
    }).sort({ dueDate: 1 });

    const overdueProjects = await Project.find({
      _id: { $in: projectIds },
      dueDate: { $lt: startOfTodayVN() },
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userProjects = await Project.find({
      $or: [
        { createdBy: userId },
        { memberIds: userId }
      ]
    }).select("_id");

    const projectIds = userProjects.map(p => p._id);

    const filter = { projectId: { $in: projectIds } };
    if (req.query.projectId) {
      if (!projectIds.some(id => id.toString() === req.query.projectId.toString())) {
        return res.status(403).json({ success: false, error: "Access denied" });
      }
      filter.projectId = req.query.projectId;
    }

    const byStatus = await Task.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, data: { byStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};