import {httpClient} from "./httpClient.js";
import {API} from "@/constants/api.js";

export const authApi = {
    register(payload) {
        return httpClient.post(API.auth.register, payload).then((response) => response.data);
    },

    verify(verifyToken) {
        return httpClient.post(API.auth.verify, null, {params: {token: verifyToken}})
            .then((response) => response.data);
    },

    login(payload) {
        return httpClient.post(API.auth.login, payload).then((response) => response.data);
    },

    me() {
        return httpClient.get(API.auth.me).then((response) => response.data);
    }
};
