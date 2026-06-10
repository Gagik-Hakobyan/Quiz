import {useState} from "react";
import {Link} from "react-router-dom";
import {AuthLayout} from "@/features/auth/components/AuthLayout.jsx";
import {Button, FormField, Input} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import form from "@/features/auth/components/authForm.module.css";
import {useAuth} from "@/app/AuthContext.jsx";
import toast from "react-hot-toast";

export function VerifyPage() {
    const {verify} = useAuth();
    const [token, setToken] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (token.length !== 6) {
            toast.error("Please enter the 6-character code");
            return
        }

        setSubmitting(true);
        setError("");
        try {
            await verify(token);
        } catch (err) {
            setError(err.message)
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Verify your email"
            footer={
                <span>
                    Entered the wrong email?{" "}
                    <Link to={PATHS.register} className={form.link}>Register again</Link>
                </span>
            }>
            <form className={form.form} onSubmit={handleSubmit} noValidate>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        color: "var(--color-primary)",
                        fontWeight: 600,
                        fontSize: "var(--text-sm)",
                    }}>
                </div>

                <FormField label="Verification code" htmlFor="token" required error={error}>
                    <Input
                        id="token"
                        name="token"
                        placeholder="Enter 6-character code"
                        maxLength={6}
                        value={token}
                        onChange={(e) => setToken(e.target.value.trim())}
                    />
                </FormField>

                <Button type="submit" size="lg" block loading={submitting} className={form.submit}>
                    Verify account
                </Button>
            </form>
        </AuthLayout>
    );
}
