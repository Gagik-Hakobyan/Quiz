import {httpClient} from "./httpClient.js";
import {API} from "@/constants/api.js";

export const questionApi = {
    listAdmin(quizId, params) {
        return httpClient.get(API.admin.quizQuestions(quizId), {params})
            .then((response) => response.data);
    },

    getById(quizId, questionId) {
        return httpClient.get(API.admin.quizQuestion(quizId, questionId))
            .then((response) => response.data);
    },

    create(quizId, payload) {
        return httpClient.post(API.admin.quizQuestions(quizId), payload)
            .then((response) => response.data);
    },

    getPublishedList(quizId) {
        return httpClient.get(API.user.quizQuestions(quizId))
            .then((response) => response.data);
    },
};
