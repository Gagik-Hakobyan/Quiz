import {forwardRef} from "react";
import {cn} from "@/utils/cn.js";
import styles from "./Textarea.module.css";

export const Textarea = forwardRef(function Textarea(
    {invalid = false, rows = 4, className, ...rest},
    ref,
) {
    return (
        <textarea
            ref={ref}
            rows={rows}
            className={cn(styles.textarea, invalid && styles.invalid, className)}
            aria-invalid={invalid || undefined}
            {...rest}
        />
    );
});
