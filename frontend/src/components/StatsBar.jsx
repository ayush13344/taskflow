import React from "react";

const StatsBar = ({ stats }) => {
  if (!stats) return null;

  const getCount = (arr, key, val) =>
    (arr || []).find((x) => x._id === val)?.count || 0;

  const todo = getCount(stats.byStatus, "_id", "todo");
  const inProgress = getCount(stats.byStatus, "_id", "in-progress");
  const done = getCount(stats.byStatus, "_id", "completed");

  return (
    <div className="stats-bar">
      <StatPill label="Total" value={stats.total} color="var(--ink)" />
      <StatPill label="To Do" value={todo} color="#6b7280" />
      <StatPill label="In Progress" value={inProgress} color="#3b82f6" />
      <StatPill label="Done" value={done} color="#22c55e" />
      {stats.overdue > 0 && (
        <StatPill label="Overdue" value={stats.overdue} color="#ef4444" alert />
      )}
    </div>
  );
};

const StatPill = ({ label, value, color, alert }) => (
  <div className={`stat-pill ${alert ? "stat-alert" : ""}`}>
    <span className="stat-value" style={{ color }}>{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default StatsBar;
