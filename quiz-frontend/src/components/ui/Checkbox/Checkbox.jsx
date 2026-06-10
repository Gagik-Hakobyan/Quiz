import {forwardRef} from "react";
import {Check} from "lucide-react";
import {cn} from "@/utils/cn.js";
import styles from "./Checkbox.module.css";

export const Checkbox = forwardRef(function Checkbox(
    {label, description, className, ...rest},
    ref,
) {
    return (
        <label className={cn(styles.row, className)}>
      <span className={styles.box}>
        <input ref={ref} type="checkbox" className={styles.input} {...rest} />
        <span className={styles.visual}>
          <Check size={14} strokeWidth={3} className={styles.tick}/>
        </span>
      </span>
            {(label || description) && (
                <span className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
                    {description && <span className={styles.desc}>{description}</span>}
        </span>
            )}
        </label>
    );
});
