import api from "../api/axios";

export const createComment = async (data) => {
    const res = await api.post("/comments", data);
    return res.data;
};

export const getComments = async (projectId) => {
    const res = await api.get(`/comments/project/${projectId}`);
    return res.data;
};

export const getTaskComments = async (taskId) => {
    const res = await api.get(`/comments/task/${taskId}`);
    return res.data;
};

export const getNoteComments = async (noteId) => {
    const res = await api.get(`/comments/note/${noteId}`);
    return res.data;
};

export const deleteComment = async (commentId) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
};