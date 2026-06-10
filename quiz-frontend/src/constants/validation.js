export const VALIDATION = {
    user: {
        name: {min: 2, max: 50},
        email: {min: 5, max: 255},
        password: {min: 8, max: 100},
    },
    verifyToken: {length: 6},
    quiz: {
        title: {min: 2, max: 150},
        description: {min: 20, max: 300},
    },
    question: {
        body: {min: 5, max: 500},
        points: {min: 1, max: 100},
    },
    option: {
        body: {min: 1, max: 300},
    },
    answer: {
        textAnswer: {max: 1000},
    },
    paging: {
        page: {min: 0},
        size: {min: 5, max: 20, default: 5},
    },
};
