import { useState, useEffect, useCallback, useRef } from "react";
import { taskApi } from "../utils/api";
import { useToast } from "../context/ToastContext";

export const useTasks = (filters) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const abortRef = useRef(null);

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
  }, [JSON.stringify(filters)]); // eslint-disable-line

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      setStats(res.data);
    } catch {
      // stats are non-critical
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  const createTask = useCallback(async (data) => {
    const res = await taskApi.create(data);
    setTasks((prev) => [res.data, ...prev]);
    setStats(null);
    fetchStats();
    addToast("Task created!", "success");
    return res.data;
  }, [addToast, fetchStats]);

  const updateTask = useCallback(async (id, data) => {
    const res = await taskApi.update(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    fetchStats();
    addToast("Task updated!", "success");
    return res.data;
  }, [addToast, fetchStats]);

  const updateStatus = useCallback(async (id, status) => {
    const res = await taskApi.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    fetchStats();
    addToast(`Moved to ${status.replace("-", " ")}`, "info");
    return res.data;
  }, [addToast, fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await taskApi.delete(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    fetchStats();
    addToast("Task deleted", "success");
  }, [addToast, fetchStats]);

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
