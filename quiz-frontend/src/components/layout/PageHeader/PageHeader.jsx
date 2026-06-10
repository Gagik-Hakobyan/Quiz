import {cn} from "@/utils/cn.js";
import styles from "./PageHeader.module.css";

export function PageHeader({title, description, actions, breadcrumbs, className}) {
    return (
        <header className={cn(styles.header, className)}>
            {breadcrumbs && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
            <div className={styles.row}>
                <div className={styles.text}>
                    <h1 className={styles.title}>{title}</h1>
                    {description && <p className={styles.description}>{description}</p>}
                </div>
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </header>
    );
}
