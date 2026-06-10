import {Select} from "@/components/ui";
import {QuizStatus, QUIZ_STATUS_META} from "@/constants/enums.js";

const OPTIONS = Object.values(QuizStatus).map((value) => ({
    value,
    label: QUIZ_STATUS_META[value]?.label ?? value,
}));

export function QuizStatusControl({value, onChange, className}) {
    return (
        <Select
            className={className}
            options={OPTIONS}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
        />
    );
}
