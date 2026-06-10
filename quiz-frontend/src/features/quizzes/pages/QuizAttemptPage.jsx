import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ChevronLeft, ChevronRight, Send, X} from "lucide-react";
import {Button, IconButton, Modal} from "@/components/ui";
import {QuestionCard} from "@/features/quizzes/components/QuestionCard.jsx";
import {PATHS} from "@/constants/paths.js";
import styles from "./QuizAttemptPage.module.css";
import toast from "react-hot-toast";
import {attemptApi} from "@/api/attemptApi.js";
import {questionApi} from "@/api/questionApi.js";

export function QuizAttemptPage() {
    const {id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();
    const attemptId = state?.attemptId;

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!attemptId) {
            navigate(PATHS.quizDetail(id));
            return;
        }

        questionApi.getPublishedList(id)
            .then(data => setQuestions(data ?? []))
            .catch(() => navigate(PATHS.quizDetail(id)));
    }, [id]);

    const total = questions.length;
    const question = questions[current];
    const isLast = current === total - 1;
    const answeredCount = Object.keys(answers).length;

    const setAnswer = (a) =>
        setAnswers((prev) => ({...prev, [a.questionId]: a}));

    const goNext = () =>
        setCurrent((i) => Math.min(total - 1, i + 1));

    const goPrev = () =>
        setCurrent((i) => Math.max(0, i - 1));

    const handleSubmit = async () => {
        if (answeredCount < total) {
            toast.error("Please answer all questions before submitting");
            return;
        }

        setLoading(true);
        try {
            await attemptApi.submit(attemptId, Object.values(answers));
            navigate(PATHS.attemptResult(attemptId));
        } catch (err) {
            if (err.fieldErrors) {
                setFieldErrors(err.fieldErrors);
                Object.values(fieldErrors).forEach(error => {
                    toast.error(error);
                });
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.shell}>
            <header className={styles.topbar}>
                <div className={styles.progress}>
                    <span className={styles.progressLabel}>
                        Question {current + 1} of {total}
                    </span>
                </div>

                <IconButton aria-label="Exit quiz" onClick={() => setIsModalOpen(true)}>
                    <X size={18}/>
                </IconButton>
            </header>

            <main className={styles.main}>
                <div className={styles.stage}>
                    {question && (
                        <QuestionCard
                            question={question}
                            answer={answers[question.id]}
                            onAnswer={setAnswer}
                        />
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <Button
                    variant="secondary"
                    leftIcon={<ChevronLeft size={18}/>}
                    onClick={goPrev}
                    disabled={current === 0}>
                    Previous
                </Button>

                <div className={styles.dots}>
                    {questions.map((q, i) => (
                        <button
                            key={q.id}
                            className={`${styles.dot} ${
                                i === current ? styles.dotActive : ""
                            } ${
                                answers[q.id] ? styles.dotDone : ""
                            }`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to question ${i + 1}`}
                        />
                    ))}
                </div>

                {isLast ? (
                    <Button leftIcon={<Send size={17}/>} onClick={handleSubmit} loading={loading}>
                        Submit quiz
                    </Button>
                ) : (
                    <Button rightIcon={<ChevronRight size={18}/>} onClick={goNext}>
                        Next
                    </Button>
                )}
            </footer>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Leave quiz?"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>

                        <Button onClick={() => {
                            setIsModalOpen(false);
                            navigate(PATHS.quizDetail(id));
                        }}>
                            Yes, leave
                        </Button>
                    </>
                }>
                <p>
                    Are you sure you want to leave this quiz. If you leave now, your progress will be lost
                </p>
            </Modal>
        </div>
    );
}