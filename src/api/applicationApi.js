import axiosInstance from "./axiosInstance";

export const createApplication = (data) => axiosInstance.post("/applications", data);
export const getApplications = (params) => axiosInstance.get("/applications", { params });
export const getApplicationById = (id) => axiosInstance.get(`/applications/${id}`);
export const updateApplication = (id, data) => axiosInstance.patch(`/applications/${id}`, data);
export const deleteApplication = (id) => axiosInstance.delete(`/applications/${id}`);
export const getDashboardStats = () => axiosInstance.get("/dashboard/stats");