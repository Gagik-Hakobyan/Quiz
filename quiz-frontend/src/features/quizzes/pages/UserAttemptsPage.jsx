import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ClipboardList} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Badge, Card, EmptyState} from "@/components/ui";
import {ATTEMPT_STATUS_META} from "@/constants/enums.js";
import {PATHS} from "@/constants/paths.js";
import {formatDateTime, formatScore} from "@/utils/format.js";
import {attemptApi} from "@/api/attemptApi.js";
import toast from "react-hot-toast";
import styles from "./UserAttemptsPage.module.css";

export function UserAttemptsPage() {
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        attemptApi.getAllUserAttempts()
            .then(setAttempts)
            .catch((err) => toast.error(err.message));
    }, []);

    return (
        <div>
            <PageHeader
                title="My Attempts"
                description="All your quiz attempts and results."
            />

            <Card padding="lg">
                {attempts.length === 0 ? (
                    <EmptyState
                        icon={<ClipboardList size={26}/>}
                        title="No attempts yet"
                        description="Complete a quiz to see your results here."
                    />
                ) : (
                    <ul className={styles.list} role="list">
                        {attempts.map((attempt) => {
                            const meta = ATTEMPT_STATUS_META[attempt.status];
                            const percent = attempt.maxPoints
                                ? Math.round((attempt.currentPoints / attempt.maxPoints) * 100)
                                : 0;

                            return (
                                <li key={attempt.id} className={styles.item}>
                                    <div className={styles.itemMain}>
                                        <Link
                                            to={PATHS.attemptResult(attempt.id)}
                                            className={styles.itemTitle}
                                        >
                                            Attempt #{attempt.id}
                                        </Link>
                                        <span className={styles.itemMeta}>
                                            {formatDateTime(attempt.startedDate)}
                                        </span>
                                    </div>
                                    <div className={styles.itemRight}>
                                        <span className={styles.itemScore}>
                                            {formatScore(attempt.currentPoints, attempt.maxPoints)} pts
                                            &nbsp;·&nbsp;{percent}%
                                        </span>
                                        {meta && <Badge tone={meta.tone}>{meta.label}</Badge>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Card>
        </div>
    );
}