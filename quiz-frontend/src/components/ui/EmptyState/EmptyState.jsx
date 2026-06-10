import {Inbox} from "lucide-react";
import {cn} from "@/utils/cn.js";
import styles from "./EmptyState.module.css";

export function EmptyState({icon, title, description, action, className}) {
    return (
        <div className={cn(styles.wrap, className)}>
            <div className={styles.iconWrap}>{icon ?? <Inbox size={26}/>}</div>
            <h3 className={styles.title}>{title}</h3>
            {description && <p className={styles.desc}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
