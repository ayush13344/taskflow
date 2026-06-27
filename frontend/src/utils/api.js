import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => config, Promise.reject);

// Response interceptor — unwrap data
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.errors?.[0] ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  getAll: (params = {}) => api.get("/tasks", { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  getStats: () => api.get("/tasks/stats"),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
  bulkDelete: (ids) => api.delete("/tasks", { data: { ids } }),
};

export default api;
