export const API = {
    auth: {
        register: "/register",
        login: "/login",
        verify: "/verify",
        me: "/me"
    },

    user: {
        quizzes: "/quizzes",
        quiz: (id) => `/quizzes/${id}`,
        quizQuestions: (id) => `/quizzes/${id}/questions`,
        startQuiz: (id) => `/quizzes/${id}/start`,
        submitAttempt: (attemptId) => `/attempts/${attemptId}/submit`,
        attempt: (id) => `/quizzes/${id}/attempts`,
        attempts: "/attempts",
        attemptResult: (id) => `/attempts/${id}`,
    },

    admin: {
        quiz: (id) => `/admin/quizzes/${id}`,
        quizzes: "/admin/quizzes",
        quizStatus: (id) => `/admin/quizzes/${id}`,
        quizQuestions: (id) => `/admin/quizzes/${id}/questions`,
        quizQuestion: (quizId, questionId) => `/admin/quizzes/${quizId}/questions/${questionId}`,
        questionOptions: (quizId, questionId) => `/admin/quizzes/${quizId}/questions/${questionId}/options`,
        reviews: "/admin/reviews",
        gradeAnswer: (id) => `/admin/reviews/${id}`,
        stats: "/admin/stats"
    },
};
