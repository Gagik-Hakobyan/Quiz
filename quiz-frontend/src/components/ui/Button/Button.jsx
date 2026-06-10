import {cn} from "@/utils/cn.js";
import {Spinner} from "@/components/ui/Spinner/Spinner.jsx";
import styles from "./Button.module.css";

export function Button(
    {
        variant = "primary",
        size = "md",
        block = false,
        loading = false,
        leftIcon,
        rightIcon,
        className,
        children,
        disabled,
        type = "button",
        ...rest
    }) {
    return (
        <button
            type={type}
            className={cn(
                styles.btn,
                styles[variant],
                styles[size],
                block && styles.block,
                loading && styles.loading,
                className,
            )}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && <Spinner size={size === "lg" ? 18 : 15}/>}
            {!loading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            <span className={styles.label}>{children}</span>
            {!loading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </button>
    );
}
