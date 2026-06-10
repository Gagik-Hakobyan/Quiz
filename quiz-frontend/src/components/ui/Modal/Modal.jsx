import {X} from "lucide-react";
import {cn} from "@/utils/cn.js";
import {IconButton} from "@/components/ui/IconButton/IconButton.jsx";
import styles from "./Modal.module.css";

export function Modal({open, onClose, title, footer, size = "md", children}) {
    if (!open) return null;
    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
            <div className={styles.backdrop} onClick={onClose}/>
            <div className={cn(styles.dialog, styles[size])}>
                <header className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <IconButton aria-label="Close dialog" onClick={onClose}>
                        <X size={18}/>
                    </IconButton>
                </header>
                <div className={styles.body}>{children}</div>
                {footer && <footer className={styles.footer}>{footer}</footer>}
            </div>
        </div>
    );
}
