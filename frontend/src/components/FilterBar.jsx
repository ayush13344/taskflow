import React from "react";

const FilterBar = ({ filters, onChange, taskCount }) => {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="filter-bar">
      <div className="filter-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search || ""}
          onChange={(e) => set("search", e.target.value)}
        />
        {filters.search && (
          <button className="clear-search" onClick={() => set("search", "")}>×</button>
        )}
      </div>

      <div className="filter-controls">
        <select value={filters.status || "all"} onChange={(e) => set("status", e.target.value)}>
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Done</option>
        </select>

        <select value={filters.priority || "all"} onChange={(e) => set("priority", e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={`${filters.sort || "createdAt"}-${filters.order || "desc"}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split("-");
            onChange({ ...filters, sort, order });
          }}>
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="dueDate-asc">Due date (soonest)</option>
          <option value="priority-asc">Priority (high→low)</option>
          <option value="title-asc">Title A–Z</option>
        </select>
      </div>

      {taskCount !== undefined && (
        <span className="task-count">{taskCount} task{taskCount !== 1 ? "s" : ""}</span>
      )}
    </div>
  );
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default FilterBar;
