import {httpClient} from "./httpClient.js";
import {API} from "@/constants/api.js";

export const optionApi = {
    getList(quizId, questionId) {
        return httpClient.get(API.admin.questionOptions(quizId, questionId))
            .then((response) => response.data);
    },

    create(quizId, questionId, payload) {
        return httpClient.post(API.admin.questionOptions(quizId, questionId), payload)
            .then((response) => response.data);
    },
};
