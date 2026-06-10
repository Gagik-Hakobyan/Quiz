import {Radio, Checkbox, Textarea, Badge, FormField} from "@/components/ui";
import {QuestionType, QUESTION_TYPE_META} from "@/constants/enums.js";
import {VALIDATION} from "@/constants/validation.js";
import styles from "./QuestionCard.module.css";

export function QuestionCard({question, answer = {}, onAnswer}) {
    const meta = QUESTION_TYPE_META[question.type];

    return (
        <article className={styles.card}>
            <div className={styles.head}>
                <div className={styles.headMeta}>
                    {meta && <Badge tone={meta.tone}>{meta.label}</Badge>}
                    <span className={styles.points}>{question.points} pts</span>
                </div>
            </div>

            <h2 className={styles.body}>{question.body}</h2>

            <div className={styles.options}>
                {question.type === QuestionType.SINGLE &&
                    question.options.map((opt) => (
                        <div key={opt.id} className={styles.option}>
                            <Radio
                                name={`q-${question.id}`}
                                label={opt.body}
                                checked={answer?.optionIds?.[0] === opt.id}
                                onChange={() => onAnswer?.({
                                    questionId: question.id,
                                    optionIds: [opt.id]
                                })}
                            />
                        </div>
                    ))}

                {question.type === QuestionType.MULTIPLE &&
                    question.options.map((opt) => {
                        const selected = answer?.optionIds?.includes(opt.id) ?? false;
                        return (
                            <div key={opt.id} className={styles.option}>
                                <Checkbox
                                    label={opt.body}
                                    checked={selected}
                                    onChange={() => {
                                        const prev = answer?.optionIds ?? [];
                                        const next = selected
                                            ? prev.filter(id => id !== opt.id)
                                            : [...prev, opt.id];
                                        onAnswer?.({questionId: question.id, optionIds: next});
                                    }}
                                />
                            </div>
                        );
                    })}

                {question.type === QuestionType.MANUAL && (
                    <FormField
                        label="Your answer"
                        htmlFor={`answer-${question.id}`}
                        hint={`Up to ${VALIDATION.answer.textAnswer.max} characters`}
                    >
                        <Textarea
                            id={`answer-${question.id}`}
                            rows={5}
                            maxLength={VALIDATION.answer.textAnswer.max}
                            placeholder="Type your response…"
                            value={answer.textAnswer ?? ""}
                            onChange={(e) =>
                                onAnswer?.({questionId: question.id, textAnswer: e.target.value})
                            }
                        />
                    </FormField>
                )}
            </div>
        </article>
    );
}