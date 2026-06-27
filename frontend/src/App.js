import React, { useState, useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import { useToast } from "./context/ToastContext";
import { debounce } from "./utils/helpers";
import "./App.css";

const DEFAULT_FILTERS = {
  status: "all",
  priority: "all",
  sort: "createdAt",
  order: "desc",
  search: "",
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [apiFilters, setApiFilters] = useState(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addToast } = useToast();

  const {
    tasks,
    stats,
    loading,
    error,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  } = useTasks(apiFilters);

  // Corrected: useMemo instead of useCallback
  const debouncedSetApiFilters = useMemo(
    () => debounce((f) => setApiFilters(f), 350),
    []
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    debouncedSetApiFilters(newFilters);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);

    try {
      if (editingTask) {
        await updateTask(editingTask._id, data);
      } else {
        await createTask(data);
      }

      closeModal();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      await deleteTask(deleteTarget);
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const groupedTasks = useMemo(() => {
    if (apiFilters.status !== "all") return null;

    const groups = {
      todo: [],
      "in-progress": [],
      completed: [],
    };

    tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    return groups;
  }, [tasks, apiFilters.status]);

  const activeFiltersCount = Object.entries(apiFilters).filter(
    ([key, value]) =>
      key !== "sort" &&
      key !== "order" &&
      value &&
      value !== "all" &&
      value !== ""
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">✓</div>

            <div>
              <h1>Taskflow</h1>
              <span className="brand-sub">Your work, organized</span>
            </div>
          </div>

          <button className="btn btn-primary btn-add" onClick={openCreate}>
            <span>+</span> New task
          </button>
        </div>
      </header>

      <main className="app-main">
        <StatsBar stats={stats} />

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          taskCount={tasks.length}
        />

        {activeFiltersCount > 0 && (
          <button
            className="clear-filters"
            onClick={() => handleFilterChange(DEFAULT_FILTERS)}
          >
            Clear {activeFiltersCount} filter
            {activeFiltersCount > 1 ? "s" : ""}
          </button>
        )}

        {error && (
          <div className="error-banner">
            <strong>Connection error:</strong> {error}

            <p>
              Make sure your backend is running at{" "}
              <code>{process.env.REACT_APP_API_URL || "/api"}</code>
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>

            <h3>
              {activeFiltersCount > 0
                ? "No tasks match your filters"
                : "No tasks yet"}
            </h3>

            <p>
              {activeFiltersCount > 0
                ? "Try adjusting the filters above"
                : "Create your first task to get started"}
            </p>

            {activeFiltersCount === 0 && (
              <button className="btn btn-primary" onClick={openCreate}>
                Create a task
              </button>
            )}
          </div>
        ) : groupedTasks ? (
          <div className="kanban-board">
            {[
              { key: "todo", label: "To Do", icon: "○" },
              { key: "in-progress", label: "In Progress", icon: "◑" },
              { key: "completed", label: "Done", icon: "●" },
            ].map(({ key, label, icon }) => (
              <div key={key} className={`kanban-col kanban-${key}`}>
                <div className="kanban-col-header">
                  <span className="kanban-icon">{icon}</span>

                  <span className="kanban-label">{label}</span>

                  <span className="kanban-count">
                    {groupedTasks[key].length}
                  </span>
                </div>

                <div className="kanban-cards">
                  {groupedTasks[key].length === 0 ? (
                    <div className="kanban-empty">Nothing here yet</div>
                  ) : (
                    groupedTasks[key].map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                        onStatusChange={updateStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete task?"
        message="This action cannot be undone."
      />
    </div>
  );
}