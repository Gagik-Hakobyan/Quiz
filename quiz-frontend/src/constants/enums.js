export const UserRole = Object.freeze({
    USER: "USER",
    ADMIN: "ADMIN",
});

export const QuizStatus = Object.freeze({
    UNPUBLISHED: "UNPUBLISHED",
    PUBLISHED: "PUBLISHED",
    FINISHED: "FINISHED",
});

export const QuestionType = Object.freeze({
    SINGLE: "SINGLE",
    MULTIPLE: "MULTIPLE",
    MANUAL: "MANUAL",
});

export const AttemptStatus = Object.freeze({
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CHECKED: "CHECKED",
});

export const OrderDirection = Object.freeze({
    ASC: "ASC",
    DESC: "DESC",
});

export const QUIZ_STATUS_META = {
    [QuizStatus.UNPUBLISHED]: {label: "Draft", tone: "neutral"},
    [QuizStatus.PUBLISHED]: {label: "Published", tone: "success"},
    [QuizStatus.FINISHED]: {label: "Finished", tone: "info"},
};

export const QUESTION_TYPE_META = {
    [QuestionType.SINGLE]: {label: "Single choice", tone: "info"},
    [QuestionType.MULTIPLE]: {label: "Multiple choice", tone: "primary"},
    [QuestionType.MANUAL]: {label: "Free text", tone: "warning"},
};

export const ATTEMPT_STATUS_META = {
    [AttemptStatus.IN_PROGRESS]: {label: "In Progress", tone: "info"},
    [AttemptStatus.COMPLETED]: {label: "Completed", tone: "success"},
    [AttemptStatus.CHECKED]: {label: "Checked", tone: "success"},
};
