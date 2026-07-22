import axiosInstance from "./axiosInstance";
export const analyzeJobMatch = (data) => axiosInstance.post("/ai/analyze", data);