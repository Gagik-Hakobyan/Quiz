import {cn} from "@/utils/cn.js";
import styles from "./IconButton.module.css";

export function IconButton(
    {
        size = "md",
        variant = "ghost",
        className,
        children,
        "aria-label": ariaLabel,
        ...rest
    }) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className={cn(styles.btn, styles[size], styles[variant], className)}
            {...rest}
        >
            {children}
        </button>
    );
}
