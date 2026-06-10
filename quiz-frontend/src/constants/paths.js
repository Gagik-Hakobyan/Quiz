export const PATHS = {
    home: "/",
    login: "/login",
    register: "/register",
    verify: "/verify",

    quizzes: "/quizzes",
    quizDetail: (id = ":id") => `/quizzes/${id}`,
    quizPlay: (id = ":id") => `/quizzes/${id}/play`,
    attemptResult: (id = ":id") => `/attempts/${id}/result`,
    attempts: "/attempts",

    adminDashboard: "/admin",
    adminQuizzes: "/admin/quizzes",
    adminQuizDetail: (id = ":id") => `/admin/quizzes/${id}`,
    adminQuestionDetail: (quizId = ":quizId", questionId = ":questionId") =>
        `/admin/quizzes/${quizId}/questions/${questionId}`,
    adminReviews: "/admin/reviews",

    forbidden: "/403",
    notFound: "*",
};