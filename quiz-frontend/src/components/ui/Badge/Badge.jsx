import {cn} from "@/utils/cn.js";
import styles from "./Badge.module.css";

export function Badge({tone = "neutral", dot = false, className, children}) {
    return (
        <span className={cn(styles.badge, styles[tone], className)}>
            {dot && <span className={styles.dot}/>}
            {children}
        </span>
    );
}
