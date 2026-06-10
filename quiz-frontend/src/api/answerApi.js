import {httpClient} from "./httpClient.js";
import {API} from "@/constants/api.js";

export const answerApi = {
    getReviews() {
        return httpClient.get(API.admin.reviews).then((response) => response.data);
    },
    gradeAnswer(answerId, payload) {
        return httpClient.patch(API.admin.gradeAnswer(answerId), payload)
            .then((response) => response.data);
    },
};
