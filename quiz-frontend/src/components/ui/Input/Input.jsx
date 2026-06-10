import {forwardRef} from "react";
import {cn} from "@/utils/cn.js";
import styles from "./Input.module.css";

export const Input = forwardRef(function Input(
    {leftIcon, rightSlot, invalid = false, className, ...rest},
    ref,
) {
    return (
        <div className={cn(styles.wrap, invalid && styles.invalid, className)}>
            {leftIcon && <span className={styles.left}>{leftIcon}</span>}
            <input
                ref={ref}
                className={cn(styles.input, leftIcon && styles.hasLeft, rightSlot && styles.hasRight)}
                aria-invalid={invalid || undefined}
                {...rest}
            />
            {rightSlot && <span className={styles.right}>{rightSlot}</span>}
        </div>
    );
});
