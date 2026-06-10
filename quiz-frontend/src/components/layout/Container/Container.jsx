import {cn} from "@/utils/cn.js";
import styles from "./Container.module.css";

export function Container({size = "lg", className, children, ...rest}) {
    return (
        <div className={cn(styles.container, styles[size], className)} {...rest}>
            {children}
        </div>
    );
}
