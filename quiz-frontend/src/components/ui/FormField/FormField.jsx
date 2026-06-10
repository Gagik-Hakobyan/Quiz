import {cn} from "@/utils/cn.js";
import styles from "./FormField.module.css";

export function FormField(
    {
        label,
        htmlFor,
        required = false,
        hint,
        error,
        counter,
        className,
        children,
    }) {
    return (
        <div className={cn(styles.field, error && styles.hasError, className)}>
            {label && (
                <div className={styles.labelRow}>
                    <label htmlFor={htmlFor} className={styles.label}>
                        {label}
                        {required && <span className={styles.required} aria-hidden> *</span>}
                    </label>
                    {counter && <span className={styles.counter}>{counter}</span>}
                </div>
            )}
            {children}
            {(error || hint) && (
                <p className={cn(styles.message, error ? styles.error : styles.hint)}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}
