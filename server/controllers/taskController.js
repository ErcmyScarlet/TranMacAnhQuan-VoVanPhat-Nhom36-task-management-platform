const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Get projects the user has access to
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
        return res.status(403).json({ success: false, error: "Access denied to this project" });
      }
      filter.projectId = req.query.projectId;
    }
    if (req.query.status) filter.status = req.query.status;

    const tasks = await Task.find(filter).populate("assigneeId", "name email");
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId, assigneeId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Verify user has access to this project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: userId },
        { memberIds: userId }
      ]
    });

    if (!project) {
      return res.status(403).json({ success: false, error: "Access denied to this project" });
    }

    // If assigneeId is provided, verify they are part of the project members
    if (assigneeId) {
      if (!project.memberIds.some(id => id.toString() === assigneeId.toString()) && project.createdBy.toString() !== assigneeId.toString()) {
        return res.status(400).json({ success: false, error: "Assignee is not a member of this project" });
      }
    }

    const task = await Task.create({
      ...req.body,
      createdBy: userId
    });

    const populatedTask = await Task.findById(task._id).populate("assigneeId", "name email");
    res.status(201).json({ success: true, data: populatedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { assigneeId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Verify user has access to the project
    const project = await Project.findOne({
      _id: task.projectId,
      $or: [
        { createdBy: userId },
        { memberIds: userId }
      ]
    });

    if (!project) {
      return res.status(403).json({ success: false, error: "Access denied to this project" });
    }

    // If assigneeId is provided, verify they are part of the project members
    if (assigneeId) {
      if (!project.memberIds.some(id => id.toString() === assigneeId.toString()) && project.createdBy.toString() !== assigneeId.toString()) {
        return res.status(400).json({ success: false, error: "Assignee is not a member of this project" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("assigneeId", "name email");
    res.status(200).json({ success: true, data: updatedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Verify user has access to the project
    const project = await Project.findOne({
      _id: task.projectId,
      $or: [
        { createdBy: userId },
        { memberIds: userId }
      ]
    });

    if (!project) {
      return res.status(403).json({ success: false, error: "Access denied to this project" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};