import {Modal, Button, FormField, Input, Textarea} from "@/components/ui";
import {VALIDATION} from "@/constants/validation.js";
import styles from "./forms.module.css";
import {quizApi} from "@/api/quizApi.js";
import {useState} from "react";
import toast from "react-hot-toast";

export function QuizFormModal({open, onClose, onSubmit}) {
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const values = {
            title: form.title.value.trim(),
            description: form.description.value.trim() || null,
        };

        try {
            setSubmitting(true);
            setFieldErrors({});
            await quizApi.create(values);

            onSubmit?.();
            onClose();
            toast.success("Quiz successfully created!");
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
            title="Create quiz"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="quiz-form">
                        {submitting ? "..." : "Create quiz"}
                    </Button>
                </>
            }
        >
            <form id="quiz-form" className={styles.form} onSubmit={handleSubmit} noValidate>
                <FormField
                    label="Title"
                    htmlFor="quiz-title"
                    required
                    error={fieldErrors.title}
                    hint={`${VALIDATION.quiz.title.min}–${VALIDATION.quiz.title.max} characters`}
                >
                    <Input
                        id="quiz-title"
                        name="title"
                        placeholder="e.g. JavaScript Fundamentals"
                        minLength={VALIDATION.quiz.title.min}
                        maxLength={VALIDATION.quiz.title.max}
                    />
                </FormField>

                <FormField
                    label="Description"
                    htmlFor="quiz-description"
                    error={fieldErrors.description}
                    hint={`Optional, ${VALIDATION.quiz.description.min}–${VALIDATION.quiz.description.max} characters when present`}
                >
                    <Textarea
                        id="quiz-description"
                        name="description"
                        rows={4}
                        placeholder="What is this quiz about?"
                        maxLength={VALIDATION.quiz.description.max}
                    />
                </FormField>
            </form>
        </Modal>
    );
}
