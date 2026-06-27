const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { taskValidationRules, validate } = require("../middleware/validators");

// GET /api/tasks — fetch all tasks with filtering, sorting, searching
router.get("/", async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortObj = {};
    const allowedSortFields = ["createdAt", "updatedAt", "title", "dueDate", "priority"];
    if (allowedSortFields.includes(sort)) {
      sortObj[sort] = order === "asc" ? 1 : -1;
    } else {
      sortObj["createdAt"] = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tasks,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/stats — aggregate stats for dashboard
router.get("/stats", async (req, res, next) => {
  try {
    const [statusStats, priorityStats] = await Promise.all([
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    ]);

    const total = await Task.countDocuments();
    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.json({
      success: true,
      data: {
        total,
        overdue,
        byStatus: statusStats,
        byPriority: priorityStats,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id — fetch single task
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks — create new task
router.post("/", taskValidationRules, validate, async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, tags });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id — update task
router.put("/:id", taskValidationRules, validate, async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/status — quick status toggle
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["todo", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id — delete task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks — bulk delete by IDs
router.delete("/", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: "Provide an array of IDs" });
    }
    const result = await Task.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
