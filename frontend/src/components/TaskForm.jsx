import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const INITIAL = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  tags: "",
};

const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        tags: (task.tags || []).join(", "),
      });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.trim().length < 2) errs.title = "Title must be at least 2 characters";
    else if (form.title.trim().length > 100) errs.title = "Title cannot exceed 100 characters";
    if (form.description.length > 500) errs.description = "Description cannot exceed 500 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      await onSubmit(payload);
      if (!task) setForm(INITIAL);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{task ? "Edit task" : "New task"}</h2>

      <div className={`field ${errors.title ? "field-error" : ""}`}>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          autoFocus
          maxLength={100}
        />
        {errors.title && <span className="field-msg">{errors.title}</span>}
      </div>

      <div className={`field ${errors.description ? "field-error" : ""}`}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add more details…"
          rows={3}
          maxLength={500}
        />
        <span className="char-count">{form.description.length}/500</span>
        {errors.description && <span className="field-msg">{errors.description}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Done</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          placeholder="design, backend, bug (comma separated)"
        />
      </div>

      {errors.submit && <div className="form-error">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : task ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
