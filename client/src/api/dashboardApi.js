import api from "./axios";

export const getReminders = () => api.get("/dashboard/reminders");
export const getStats = (projectId) => api.get("/dashboard/stats", { params: { projectId } });