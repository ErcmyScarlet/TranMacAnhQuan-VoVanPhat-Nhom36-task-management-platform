import api from "./axios";

export const getTasks = (projectId) => api.get("/tasks", { params: { projectId } });
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);