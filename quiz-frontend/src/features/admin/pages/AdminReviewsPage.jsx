import {useEffect, useState} from "react";
import {CheckCircle2} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Button, Card, EmptyState} from "@/components/ui";
import {answerApi} from "@/api/answerApi.js";
import toast from "react-hot-toast";
import styles from "./AdminReviewsPage.module.css";

export function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [points, setPoints] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        answerApi.getReviews().then(setReviews).catch((err) => toast.error(err.message));
    }, []);

    const handleGrade = async (answerId) => {
        setLoading(true);
        try {
            await answerApi.gradeAnswer(answerId, {earnedPoints: points[answerId] ?? 0});
            setReviews(prev => prev.filter(a => a.id !== answerId));
            toast.success("Answer graded successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <PageHeader
                title="Reviews"
                description="Grade manual answers submitted by users."
            />

            {reviews.length === 0 ? (
                <div className={styles.empty}>
                    <EmptyState
                        icon={<CheckCircle2 size={26}/>}
                        title="No answers to review"
                        description="All manual answers have been graded."
                    />
                </div>
            ) : (
                reviews.map(answer => (
                    <Card key={answer.id} padding="lg" className={styles.card}>
                        <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Max points</span>
                                <span className={styles.metaValue}>{answer.questionPoints} pts</span>
                            </div>
                        </div>

                        <div className={styles.question}>
                            <span className={styles.questionLabel}>Question</span>
                            <p className={styles.questionBody}>{answer.questionBody}</p>
                        </div>

                        <div className={styles.answer}>
                            <span className={styles.answerLabel}>User answer</span>
                            <p className={styles.answerText}>{answer.textAnswer}</p>
                        </div>

                        <div className={styles.gradeRow}>
                            <span className={styles.gradeLabel}>Points to award</span>
                            <input
                                className={styles.gradeInput}
                                type="number"
                                min={0}
                                max={answer.questionPoints}
                                value={points[answer.id] ?? 0}
                                onChange={e => setPoints(prev => ({
                                    ...prev,
                                    [answer.id]: Number(e.target.value)
                                }))}
                            />
                            <span className={styles.gradeMax}>/ {answer.questionPoints}</span>
                            <Button onClick={() => handleGrade(answer.id)}>
                                {loading ? "..." : "Grade"}
                            </Button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
}