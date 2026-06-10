import axios from "axios";
import {env} from "@/config/env.js";
import {tokenStorage} from "@/utils/tokenStorage.js";
import {PATHS} from "@/constants/paths.js";

export const httpClient = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {"Content-Type": "application/json"},
    timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
    const token = tokenStorage.get();

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

httpClient.interceptors.response.use((response) => response, (error) => {
        if (error.response?.status === 401) {
            tokenStorage.clear();
            window.location.href = PATHS.login;
        }

        const data = error.response?.data;
        let message;
        let fieldErrors = null;

        if (data && typeof data === "object" && !Array.isArray(data) && !data.message) {
            fieldErrors = data;
            message = "Validation error('s)";
        } else if (data?.message) {
            message = data.message;
        } else {
            message = "Something went wrong";
        }

        const err = new Error(message);
        err.fieldErrors = fieldErrors;
        return Promise.reject(err)
    }
);
