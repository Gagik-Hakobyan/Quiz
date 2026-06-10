import {cn} from "@/utils/cn.js";
import styles from "./Spinner.module.css";

export function Spinner({size = 20, className, label = "Loading"}) {
    return (
        <span
            role="status"
            aria-label={label}
            className={cn(styles.spinner, className)}
            style={{width: size, height: size, borderWidth: Math.max(2, size / 9)}}
        />
    );
}
