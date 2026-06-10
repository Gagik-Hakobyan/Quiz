import {Card} from "@/components/ui";
import {cn} from "@/utils/cn.js";
import styles from "./StatCard.module.css";

export function StatCard({icon, label, value, tone = "primary"}) {
    return (
        <Card padding="md" className={styles.card}>
            <span className={cn(styles.icon, styles[tone])}>{icon}</span>
            <div>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{value}</p>
            </div>
        </Card>
    );
}
