import {useState} from "react";
import {Link} from "react-router-dom";
import {User, Mail, Lock, Eye, EyeOff} from "lucide-react";
import {AuthLayout} from "@/features/auth/components/AuthLayout.jsx";
import {Button, FormField, Input} from "@/components/ui";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {VALIDATION} from "@/constants/validation.js";
import {PATHS} from "@/constants/paths.js";
import form from "@/features/auth/components/authForm.module.css";
import {useAuth} from "@/app/AuthContext.jsx";
import toast from "react-hot-toast";

export function RegisterPage() {
    const {register} = useAuth();
    const showPassword = useDisclosure(false);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const values = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim(),
        };

        setSubmitting(true);
        setFieldErrors({});
        try {
            await register(values);
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
            title="Create your account"
            subtitle="Start taking quizzes in minutes."
            footer={
                <span>
                    Already have an account?{" "}
                    <Link to={PATHS.login} className={form.link}>Sign in</Link>
                </span>
            }>
            <form className={form.form} onSubmit={handleSubmit} noValidate>
                <FormField label="Full name" htmlFor="name" required hint="2–50 characters" error={fieldErrors.name}>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Jane Doe"
                        autoComplete="name"
                        minLength={VALIDATION.user.name.min}
                        maxLength={VALIDATION.user.name.max}
                        leftIcon={<User size={18}/>}
                    />
                </FormField>

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

                <FormField label="Password" htmlFor="password" required hint="At least 8 characters"
                           error={fieldErrors.password}>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword.isOpen ? "text" : "password"}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={VALIDATION.user.password.min}
                        maxLength={VALIDATION.user.password.max}
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

                <Button type="submit" size="lg" block loading={submitting} className={form.submit}>
                    Create account
                </Button>
            </form>
        </AuthLayout>
    );
}
