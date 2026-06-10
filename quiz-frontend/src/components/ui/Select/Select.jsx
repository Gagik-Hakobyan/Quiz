import {forwardRef} from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "@/utils/cn.js";
import styles from "./Select.module.css";

export const Select = forwardRef(function Select(
    {options = [], placeholder, invalid = false, className, ...rest},
    ref,
) {
    return (
        <div className={cn(styles.wrap, invalid && styles.invalid, className)}>
            <select
                ref={ref}
                className={styles.select}
                aria-invalid={invalid || undefined}
                {...rest}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={18} className={styles.chevron}/>
        </div>
    );
});
