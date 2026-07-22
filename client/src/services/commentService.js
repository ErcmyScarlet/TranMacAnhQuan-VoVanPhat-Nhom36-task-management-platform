import api from "../api/axios";

export const createComment = async (data) => {
    const res = await api.post("/comments", data);
    return res.data;
};

export const getComments = async (projectId) => {
    const res = await api.get(`/comments/project/${projectId}`);
    return res.data;
};