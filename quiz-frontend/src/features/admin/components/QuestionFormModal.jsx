import {Modal, Button, FormField, Input, Textarea, Select} from "@/components/ui";
import {QuestionType} from "@/constants/enums.js";
import {VALIDATION} from "@/constants/validation.js";
import styles from "./forms.module.css";
import {useState} from "react";
import {questionApi} from "@/api/questionApi.js";
import toast from "react-hot-toast";

const TYPE_OPTIONS = [
    {value: QuestionType.SINGLE, label: "Single choice"},
    {value: QuestionType.MULTIPLE, label: "Multiple choice"},
    {value: QuestionType.MANUAL, label: "Free text (manual grading)"},
];

export function QuestionFormModal({open, onClose, quizId, onSubmit}) {
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const values = {
            body: form.body.value.trim(),
            type: form.type.value,
            points: Number(form.points.value),
        };

        try {
            setSubmitting(true);
            setFieldErrors({});
            await questionApi.create(quizId, values);

            onSubmit();
            onClose();
            toast.success("Question successfully created!");
        } catch (err) {
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors);
            } else {
                toast.error(err.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Add question"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="question-form">
                        {submitting ? "..." : "Add question"}
                    </Button>
                </>
            }>

            <form id="question-form" className={styles.form} onSubmit={handleSubmit} noValidate>
                <FormField
                    label="Question"
                    htmlFor="q-body"
                    required
                    error={fieldErrors.body}
                    hint={`${VALIDATION.question.body.min}–${VALIDATION.question.body.max} characters`}
                >
                    <Textarea
                        id="q-body"
                        name="body"
                        rows={3}
                        placeholder="Write the question prompt…"
                        minLength={VALIDATION.question.body.min}
                        maxLength={VALIDATION.question.body.max}
                    />
                </FormField>

                <div className={styles.row}>
                    <FormField label="Type" htmlFor="q-type" required error={fieldErrors.questionType}>
                        <Select id="q-type" name="type" options={TYPE_OPTIONS}/>
                    </FormField>

                    <FormField
                        label="Points"
                        htmlFor="q-points"
                        required
                        error={fieldErrors.points}
                        hint={`${VALIDATION.question.points.min}–${VALIDATION.question.points.max}`}
                    >
                        <Input
                            id="q-points"
                            name="points"
                            type="number"
                            min={VALIDATION.question.points.min}
                            max={VALIDATION.question.points.max}
                            defaultValue={10}
                        />
                    </FormField>
                </div>
            </form>
        </Modal>
    );
}
