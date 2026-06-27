import React, { useState } from "react";
import { formatDate, isOverdue, PRIORITY_CONFIG, STATUS_CONFIG } from "../utils/helpers";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [statusChanging, setStatusChanging] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);
  const priority = PRIORITY_CONFIG[task.priority];
  const statusCfg = STATUS_CONFIG[task.status];

  const STATUS_CYCLE = { todo: "in-progress", "in-progress": "completed", completed: "todo" };

  const handleStatusCycle = async () => {
    setStatusChanging(true);
    try {
      await onStatusChange(task._id, STATUS_CYCLE[task.status]);
    } finally {
      setStatusChanging(false);
    }
  };

  return (
    <div className={`task-card priority-${task.priority} ${task.status === "completed" ? "task-done" : ""} ${overdue ? "task-overdue" : ""}`}>
      <div className="task-card-header">
        <button
          className={`status-badge status-${task.status}`}
          onClick={handleStatusCycle}
          disabled={statusChanging}
          title="Click to advance status"
        >
          {statusChanging ? "…" : statusCfg.label}
        </button>
        <span
          className="priority-dot"
          style={{ background: priority.color }}
          title={`${priority.label} priority`}
        />
        <div className="task-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
            <EditIcon />
          </button>
          <button className="icon-btn icon-btn-danger" onClick={() => onDelete(task._id)} title="Delete">
            <TrashIcon />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        {task.dueDate && (
          <span className={`task-due ${overdue ? "overdue" : ""}`}>
            {overdue ? "⚠ " : "📅 "}
            {overdue ? "Overdue · " : ""}
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.tags?.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

export default TaskCard;
