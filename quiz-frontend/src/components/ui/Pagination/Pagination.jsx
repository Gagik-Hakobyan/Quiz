import {ChevronLeft, ChevronRight} from "lucide-react";
import {cn} from "@/utils/cn.js";
import styles from "./Pagination.module.css";

export function Pagination({page = 0, size = 5, total = 0, onPageChange, className}) {
    const pageCount = Math.max(1, Math.ceil(total / size));
    const from = total === 0 ? 0 : page * size + 1;
    const to = Math.min(total, (page + 1) * size);

    const windowPages = [];
    const start = Math.max(0, Math.min(page - 1, pageCount - 3));
    const end = Math.min(pageCount, start + 3);
    for (let i = start; i < end; i += 1) windowPages.push(i);

    return (
        <div className={cn(styles.bar, className)}>
      <span className={styles.summary}>
        {from}–{to} of {total}
      </span>
            <div className={styles.controls}>
                <button
                    className={styles.arrow}
                    disabled={page <= 0}
                    onClick={() => onPageChange?.(page - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18}/>
                </button>
                {windowPages.map((p) => (
                    <button
                        key={p}
                        className={cn(styles.page, p === page && styles.active)}
                        onClick={() => onPageChange?.(p)}
                        aria-current={p === page ? "page" : undefined}
                    >
                        {p + 1}
                    </button>
                ))}
                <button
                    className={styles.arrow}
                    disabled={page >= pageCount - 1}
                    onClick={() => onPageChange?.(page + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight size={18}/>
                </button>
            </div>
        </div>
    );
}
