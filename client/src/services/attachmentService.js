import api from "../api/axios";

export const uploadFile = async (formData) => {
    const res = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return res.data;
};

export const getAttachments = async (projectId) => {
    const res = await api.get(`/upload/attachments/${projectId}`);
    return res.data;
};