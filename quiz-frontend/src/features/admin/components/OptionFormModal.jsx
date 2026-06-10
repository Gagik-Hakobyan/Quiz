import {Modal, Button, FormField, Input, Checkbox} from "@/components/ui";
import {VALIDATION} from "@/constants/validation.js";
import styles from "./forms.module.css";
import {useState} from "react";
import {optionApi} from "@/api/optionApi.js";
import toast from "react-hot-toast";

export function OptionFormModal({open, onClose, quizId, questionId, onSubmit}) {
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        console.log(form.isCorrect.checked)
        const values = {
            body: form.body.value.trim(),
            isCorrect: form.isCorrect.checked,
        };

        try {
            setSubmitting(true);
            setFieldErrors({});
            await optionApi.create(quizId, questionId, values);

            onSubmit();
            onClose();
            toast.success("Option successfully created!");
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
            title="Add option"
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="option-form">
                        {submitting ? "..." : "Add option"}
                    </Button>
                </>
            }>
            <form id="option-form" className={styles.form} onSubmit={handleSubmit} noValidate>
                <FormField
                    label="Option text"
                    htmlFor="opt-body"
                    required
                    error={Array.isArray(fieldErrors.body) ? fieldErrors.body[0] : fieldErrors.body}
                    hint={`${VALIDATION.option.body.min}–${VALIDATION.option.body.max} characters`}
                >
                    <Input
                        id="opt-body"
                        name="body"
                        placeholder="e.g. const"
                        minLength={VALIDATION.option.body.min}
                        maxLength={VALIDATION.option.body.max}
                    />
                </FormField>

                <Checkbox
                    name="isCorrect"
                    label="Correct"
                />
            </form>
        </Modal>
    );
}
