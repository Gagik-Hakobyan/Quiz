import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, CheckCircle2, Clock, FileQuestion, Play, Trophy} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Avatar, Button, Card} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import {formatDate} from "@/utils/format.js";
import styles from "./QuizDetailPage.module.css";
import {useEffect, useState} from "react";
import {quizApi} from "@/api/quizApi.js";
import {attemptApi} from "@/api/attemptApi.js";
import toast from "react-hot-toast";

export function QuizDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentAttempt, setCurrentAttempt] = useState(null);

    useEffect(() => {
        quizApi.getPublished(id).then(setQuiz).catch(() => navigate(PATHS.notFound));
        attemptApi.getById(id).then((data) => {
            setCurrentAttempt(data);
        }).catch(() => {
        });
    }, [id]);

    if (!quiz) return null;

    const handleStart = async () => {
        setLoading(true);
        try {
            const attempt = await attemptApi.start(id);
            navigate(PATHS.quizPlay(id), {state: {attemptId: attempt.id}});
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Link to={PATHS.quizzes} className={styles.back}>
                <ArrowLeft size={16}/> Back to Quizzes
            </Link>

            <PageHeader
                eyebrow="Quiz"
                title={quiz.title}
            />

            <div className={styles.layout}>
                <div className={styles.main}>
                    <Card padding="lg">
                        {quiz.description && (
                            <>
                                <h3 className={styles.sectionTitle}>About this quiz</h3>
                                <p className={styles.description}>{quiz.description}</p>
                            </>
                        )}


                        <div className={styles.alert}>
                            <div className={styles.content}>
                                <div className={styles.body}>
                                    You can attempt this quiz once. Answer every question before submitting —
                                    written answers are reviewed manually.
                                </div>
                            </div>
                        </div>

                        <ul className={styles.checklist} role="list">
                            <li>
                                <CheckCircle2 size={16}/> Mixed question types: single, multiple &amp; free-text
                            </li>
                            <li>
                                <CheckCircle2 size={16}/> Instant scoring for choice questions
                            </li>
                            <li>
                                <CheckCircle2 size={16}/> 24 hours to complete quiz
                            </li>
                        </ul>
                    </Card>
                </div>

                <aside className={styles.aside}>
                    <Card padding="lg" className={styles.startCard}>
                        <dl className={styles.facts}>
                            <div className={styles.fact}>
                                <dt><FileQuestion size={16}/> Questions</dt>
                                <dd>{quiz.questionCount ?? "—"}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt><Trophy size={16}/> Max points</dt>
                                <dd>{quiz.maxPoints ?? "—"}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt><Clock size={16}/> Published</dt>
                                <dd>{formatDate(quiz.createdDate)}</dd>
                            </div>
                        </dl>

                        {currentAttempt && currentAttempt?.status !== "IN_PROGRESS" ? (
                            <Button size="lg" block disabled>
                                Quiz already completed
                            </Button>
                        ) : (
                            <Button size="lg" block leftIcon={<Play size={18}/>} onClick={handleStart}
                                    loading={loading}>
                                {currentAttempt ? "Continue quiz" : "Start quiz"}
                            </Button>
                        )}

                        <div className={styles.author}>
                            <Avatar name={quiz.createdBy?.name} size="sm"/>
                            <div>
                                <p className={styles.authorLabel}>Created by</p>
                                <p className={styles.authorName}>{quiz.createdBy?.name}</p>
                            </div>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
