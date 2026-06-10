import {forwardRef} from "react";
import {cn} from "@/utils/cn.js";
import styles from "./Radio.module.css";

export const Radio = forwardRef(function Radio(
    {label, description, className, ...rest},
    ref,
) {
    return (
        <label className={cn(styles.row, className)}>
      <span className={styles.box}>
        <input ref={ref} type="radio" className={styles.input} {...rest} />
        <span className={styles.visual}>
          <span className={styles.dot}/>
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
