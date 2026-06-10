import {useState} from "react";
import {Link} from "react-router-dom";
import {Mail, Lock, Eye, EyeOff} from "lucide-react";
import {AuthLayout} from "@/features/auth/components/AuthLayout.jsx";
import {Button, FormField, Input} from "@/components/ui";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {PATHS} from "@/constants/paths.js";
import form from "@/features/auth/components/authForm.module.css";
import {useAuth} from "@/app/AuthContext.jsx";
import toast from "react-hot-toast";

export function LoginPage() {
    const {login} = useAuth();
    const showPassword = useDisclosure(false);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const values = {
            email: form.email.value.trim(),
            password: form.password.value.trim(),
        };

        setSubmitting(true);
        setFieldErrors({});
        try {
            await login(values);
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
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to your quizzes."
            footer={
                <span>
          New to Quiz?{" "}
                    <Link to={PATHS.register} className={form.link}>
            Create an account
          </Link>
        </span>
            }>
            <form className={form.form} onSubmit={handleSubmit} noValidate>
                <FormField label="Email" htmlFor="email" required error={fieldErrors.email}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        leftIcon={<Mail size={18}/>}
                    />
                </FormField>

                <FormField label="Password" htmlFor="password" required error={fieldErrors.password}>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword.isOpen ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        leftIcon={<Lock size={18}/>}
                        rightSlot={
                            <button
                                type="button"
                                onClick={showPassword.toggle}
                                aria-label={showPassword.isOpen ? "Hide password" : "Show password"}
                                style={{display: "inline-flex", color: "var(--color-text-faint)"}}
                            >
                                {showPassword.isOpen ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        }
                    />
                </FormField>

                <div className={form.options}>
                    <span/>
                    <Link to={PATHS.verify} className={form.forgot}>
                        Verify account
                    </Link>
                </div>

                <Button type="submit" size="lg" block loading={submitting} className={form.submit}>
                    Sign in
                </Button>
            </form>
        </AuthLayout>
    );
}
