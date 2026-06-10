import {httpClient} from "./httpClient.js";
import {API} from "@/constants/api.js";

export const attemptApi = {
    getById(id) {
        return httpClient.get(API.user.attempt(id)).then((response) => response.data);
    },

    getAllUserAttempts() {
        return httpClient.get(API.user.attempts).then((response) => response.data);
    },

    start(quizId) {
        return httpClient.get(API.user.startQuiz(quizId)).then((response) => response.data);
    },

    submit(attemptId, answers) {
        return httpClient.post(API.user.submitAttempt(attemptId), {answers}).then(r => r.data);
    },

    getResult(attemptId) {
        return httpClient.get(API.user.attemptResult(attemptId)).then((response) => response.data);
    },
};
