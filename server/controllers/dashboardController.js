const Task = require("../models/Task");

exports.getStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    const byStatus = await Task.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const overdue = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" },
    });
    res.status(200).json({ success: true, data: { byStatus, overdue } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};