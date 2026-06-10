import {env} from "@/config/env.js";

export const tokenStorage = {
    get() {
        try {
            return localStorage.getItem(env.authTokenKey);
        } catch {
            return null;
        }
    },
    set(token) {
        try {
            localStorage.setItem(env.authTokenKey, token);
        } catch {
            // -
        }
    },
    clear() {
        try {
            localStorage.removeItem(env.authTokenKey);
        } catch {
            // -
        }
    },
};
