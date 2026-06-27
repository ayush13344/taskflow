import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../utils/api";
import { useToast } from "../context/ToastContext";

export const useTasks = (filters) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await taskApi.getAll(filters);
      setTasks(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      setStats(res.data);
    } catch (err) {
      // Ignore stats errors
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const createTask = useCallback(
    async (data) => {
      const res = await taskApi.create(data);

      setTasks((prev) => [res.data, ...prev]);

      await fetchStats();

      addToast("Task created!", "success");

      return res.data;
    },
    [addToast, fetchStats]
  );

  const updateTask = useCallback(
    async (id, data) => {
      const res = await taskApi.update(id, data);

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );

      await fetchStats();

      addToast("Task updated!", "success");

      return res.data;
    },
    [addToast, fetchStats]
  );

  const updateStatus = useCallback(
    async (id, status) => {
      const res = await taskApi.updateStatus(id, status);

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );

      await fetchStats();

      addToast(`Moved to ${status.replace("-", " ")}`, "info");

      return res.data;
    },
    [addToast, fetchStats]
  );

  const deleteTask = useCallback(
    async (id) => {
      await taskApi.delete(id);

      setTasks((prev) => prev.filter((task) => task._id !== id));

      await fetchStats();

      addToast("Task deleted", "success");
    },
    [addToast, fetchStats]
  );

  return {
    tasks,
    stats,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  };
};