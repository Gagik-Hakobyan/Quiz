import {Link, useParams} from "react-router-dom";
import {Clock, LayoutDashboard, RotateCcw, Trophy} from "lucide-react";
import {Button, Card} from "@/components/ui";
import {AttemptStatus} from "@/constants/enums.js";
import {PATHS} from "@/constants/paths.js";
import {formatDateTime, formatScore} from "@/utils/format.js";
import styles from "./AttemptResultPage.module.css";
import {useEffect, useState} from "react";
import {attemptApi} from "@/api/attemptApi.js";
import toast from "react-hot-toast";

export function AttemptResultPage() {
    const {id} = useParams();
    const [attempt, setAttempt] = useState(null);

    useEffect(() => {
        attemptApi.getResult(id).then(setAttempt).catch((err) => toast.error(err.message));
    }, [id]);

    if (!attempt) return null;

    const percent = Math.round((attempt.currentPoints / attempt.maxPoints) * 100);
    const pending = attempt.status === AttemptStatus.CHECKED;

    return (
        <div className={styles.wrap}>
            <Card padding="lg" className={styles.card}>
        <span className={styles.trophy}>
            <Trophy size={28}/>
        </span>
                <h1 className={styles.title}>
                    {pending ? "Submitted for Review" : "Here’s how you did"}
                </h1>

                <div className={styles.score}
                     style={{"--pct": `${percent}`}}
                     role="img"
                     aria-label={`Score ${percent} percent`}
                >
                    <div className={styles.scoreInner}>
                        <span className={styles.scorePct}>{percent}%</span>
                        <span className={styles.scorePts}>
              {formatScore(attempt.currentPoints, attempt.maxPoints)} pts
            </span>
                    </div>
                </div>

                {pending && (
                    <div className={styles.alert}>
                        <div className={styles.content}>
                            <div className={styles.body}>
                                This quiz includes free-text questions.
                                Your final score may change once an admin reviews those answers.
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.meta}>
                    <Clock size={15}/> Started {formatDateTime(attempt.startedDate)}
                </div>

                <div className={styles.actions}>
                    <Link to={PATHS.attempts}>
                        <Button variant="secondary" leftIcon={<LayoutDashboard size={17}/>}>
                            My Attempts
                        </Button>
                    </Link>
                    <Link to={PATHS.quizzes}>
                        <Button leftIcon={<RotateCcw size={17}/>}>Another Quizzes</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
