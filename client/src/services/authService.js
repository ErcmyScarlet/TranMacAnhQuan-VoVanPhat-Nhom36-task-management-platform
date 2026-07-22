import api from "../api/axios";

export async function login(data) {
    const response = await api.post("/auth/login", data);
    return response?.data ?? {};
}

export async function register(data) {
    const response = await api.post("/auth/register", data);
    return response?.data ?? {};
}

export async function getProfile() {
    const response = await api.get("/users/profile");
    return response?.data ?? {};
}

const authService = {
    login,
    register,
    getProfile,
};

export default authService;