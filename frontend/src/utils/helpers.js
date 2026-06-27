import { format, isValid, isPast, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return null;
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return null;
  return format(d, "MMM d, yyyy");
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "completed") return false;
  const d = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  return isValid(d) && isPast(d);
};

export const priorityOrder = { high: 0, medium: 1, low: 2 };

export const PRIORITY_CONFIG = {
  high: { label: "High", color: "#ef4444", bg: "#fef2f2", dot: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" },
  low: { label: "Low", color: "#22c55e", bg: "#f0fdf4", dot: "#22c55e" },
};

export const STATUS_CONFIG = {
  todo: { label: "To Do", color: "#6b7280", bg: "#f9fafb" },
  "in-progress": { label: "In Progress", color: "#3b82f6", bg: "#eff6ff" },
  completed: { label: "Done", color: "#22c55e", bg: "#f0fdf4" },
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
