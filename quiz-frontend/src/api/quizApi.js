import {httpClient} from './httpClient.js';
import {API} from '@/constants/api.js';

export const quizApi = {
    getStats() {
        return httpClient.get(API.admin.stats).then((response) => response.data);
    },

    getList(params) {
        return httpClient.get(API.admin.quizzes, {params})
            .then((response) => response.data);
    },

    getById(id) {
        return httpClient.get(API.admin.quiz(id)).then((response) => response.data);
    },

    create(payload) {
        return httpClient.post(API.admin.quizzes, payload)
            .then((response) => response.data);
    },

    changeStatus(id, status) {
        return httpClient.patch(API.admin.quizStatus(id), null, {params: {quizStatus: status}})
            .then((response) => response.data);
    },

    getPublishedList(params) {
        return httpClient.get(API.user.quizzes, {params})
            .then((response) => response.data);
    },

    getPublished(id) {
        return httpClient.get(API.user.quiz(id)).then((response) => response.data);
    },
};
