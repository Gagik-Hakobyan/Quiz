import {Link, useParams} from "react-router-dom";
import {ArrowLeft, Check, CircleHelp, Plus, X} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Badge, Button, Card, EmptyState} from "@/components/ui";
import {OptionFormModal} from "@/features/admin/components/OptionFormModal.jsx";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {PATHS} from "@/constants/paths.js";
import {cn} from "@/utils/cn.js";
import styles from "./AdminQuestionDetailPage.module.css";
import {useEffect, useState} from "react";
import {questionApi} from "@/api/questionApi.js";
import {optionApi} from "@/api/optionApi.js";
import {QUESTION_TYPE_META, QuestionType} from "@/constants/enums.js";

export function AdminQuestionDetailPage() {
    const {quizId, questionId} = useParams();
    const optionModal = useDisclosure(false);
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        questionApi.getById(quizId, questionId).then(setQuestion);
    }, [quizId, questionId]);

    useEffect(() => {
        loadOptions();
    }, [quizId, questionId]);

    const loadOptions = () => {
        optionApi.getList(quizId, questionId)
            .then((data) => {
                setOptions(data ?? []);
            });
    };

    if (!question) return null;

    const meta = QUESTION_TYPE_META[question.type];
    const isManual = question.type === QuestionType.MANUAL;

    return (
        <div>
            <Link to={PATHS.adminQuizDetail(quizId)} className={styles.back}>
                <ArrowLeft size={16}/> Back to quiz
            </Link>

            <PageHeader
                eyebrow={`Question #${questionId}`}
                title={question.body}
                actions={
                    !isManual && (
                        <Button leftIcon={<Plus size={18}/>} onClick={optionModal.open}>
                            Add option
                        </Button>
                    )
                }
            />

            <div className={styles.tags}>
                {meta && <Badge tone={meta.tone}>{meta.label}</Badge>}
                <Badge tone="neutral">{question.points} points</Badge>
                <Badge tone="neutral">Index {question.index}</Badge>
            </div>

            {isManual ? (
                <div className={styles.alert}>
                    <div className={styles.content}>
                        <p className={styles.title}>Free-text question</p>
                        <div className={styles.body}>Manual questions are graded by a reviewer
                            and don’t have predefined options.
                        </div>
                    </div>
                </div>
            ) : (
                <Card padding="lg">
                    <h3 className={styles.sectionTitle}>Answer options</h3>

                    {options.length === 0 ? (
                        <EmptyState
                            icon={<CircleHelp size={26}/>}
                            title="No options yet"
                            description="Add at least two options and mark the correct one(s)."
                            action={
                                <Button leftIcon={<Plus size={18}/>} onClick={optionModal.open}>
                                    Add option
                                </Button>
                            }
                        />
                    ) : (
                        <ul className={styles.options} role="list">
                            {options.map((opt, i) => (
                                <li key={opt.id}
                                    className={cn(styles.option, opt.isCorrect && styles.correct)}>
                                    <span className={styles.optionLetter}>
                                         {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className={styles.optionBody}>{opt.body}</span>
                                    <span className={cn(styles.flag, opt.correct ? styles.flagYes : styles.flagNo)}>
                                         {opt.correct ? <Check size={15}/> : <X size={15}/>}
                                        {opt.correct ? "Correct" : "Incorrect"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            )}

            <OptionFormModal
                open={optionModal.isOpen}
                onClose={optionModal.close}
                quizId={quizId}
                questionId={questionId}
                onSubmit={loadOptions}/>
        </div>
    );
}
