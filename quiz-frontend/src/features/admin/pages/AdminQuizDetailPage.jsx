import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, ChevronRight, HelpCircle, Plus, Search} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Badge, Button, Card, EmptyState, IconButton, Input, Pagination, Select, Table,} from "@/components/ui";
import {QuizStatusControl} from "@/features/admin/components/QuizStatusControl.jsx";
import {QuestionFormModal} from "@/features/admin/components/QuestionFormModal.jsx";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {QUESTION_TYPE_META, QuestionType} from "@/constants/enums.js";
import {PATHS} from "@/constants/paths.js";
import {formatDate} from "@/utils/format.js";
import styles from "./AdminQuizDetailPage.module.css";
import {quizApi} from "@/api/quizApi.js";
import {questionApi} from "@/api/questionApi.js";
import {useEffect, useState} from "react";
import {usePagination} from "@/hooks/usePagination.js";
import toast from "react-hot-toast";

const TYPE_FILTER = [
    {value: "", label: "All types"},
    {value: QuestionType.SINGLE, label: "Single choice"},
    {value: QuestionType.MULTIPLE, label: "Multiple choice"},
    {value: QuestionType.MANUAL, label: "Free text"},
];

export function AdminQuizDetailPage() {
    const {id} = useParams();
    const pagination = usePagination();
    const questionModal = useDisclosure(false);
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({type: "", body: ""});

    useEffect(() => {
        quizApi.getById(id).then(setQuiz).catch(() => navigate(PATHS.notFound));
    }, [id]);

    useEffect(() => {
        loadQuestions();
    }, [id, pagination.page, pagination.size, filters.type, filters.body]);

    const loadQuestions = () => {
        questionApi.listAdmin(id, {
            page: pagination.page,
            size: pagination.size,
            body: filters.body || undefined,
            type: filters.type || undefined,
        }).then((data) => {
            setQuestions(data.data);
            setTotal(data.total);
        });
    };

    const onSubmit = async () => {
        await loadQuestions();

        const updatedQuiz = await quizApi.getById(id);
        setQuiz(updatedQuiz);
    };

    const setFilter = (key, value) => {
        pagination.setPage(0);
        setFilters((f) => ({...f, [key]: value}));
    };

    if (!quiz) return null;

    return (
        <div>
            <Link to={PATHS.adminQuizzes} className={styles.back}>
                <ArrowLeft size={16}/> All quizzes
            </Link>

            <PageHeader
                eyebrow={`Quiz #${id}`}
                title={quiz.title}
                description={quiz.description}
                actions={
                    <div className={styles.headerActions}>
                        <QuizStatusControl
                            value={quiz.status}
                            className={styles.status}
                            onChange={(status) => {
                                quizApi.changeStatus(id, status)
                                    .then((data) => {
                                        toast.success("Status changed successfully");
                                        setQuiz(data);
                                    })
                                    .catch((err) => toast.error(err.message));
                            }}
                        />
                        <Button leftIcon={<Plus size={18}/>} onClick={questionModal.open}>
                            Add question
                        </Button>
                    </div>
                }
            />

            <div className={styles.summary}>
                <Card padding="md" className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Questions</span>
                    <span className={styles.summaryValue}>{total}</span>
                </Card>
                <Card padding="md" className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Max points</span>
                    <span className={styles.summaryValue}>
                        {quiz.maxPoints ?? 0}
                    </span>
                </Card>
                <Card padding="md" className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Created</span>
                    <span className={styles.summaryValue}>{formatDate(quiz.createdDate)}</span>
                </Card>
            </div>

            <Card padding="sm" className={styles.toolbar}>
                <Input
                    className={styles.toolbarSearch}
                    placeholder="Search by question…"
                    leftIcon={<Search size={18}/>}
                    value={filters.body}
                    onChange={(e) => setFilter("body", e.target.value.trim())}
                />
                <Select
                    options={TYPE_FILTER}
                    value={filters.type}
                    onChange={(e) => setFilter("type", e.target.value)}
                />
            </Card>

            <Card padding="sm">
                {questions.length === 0 ? (
                    <EmptyState
                        icon={<HelpCircle size={26}/>}
                        title="No questions yet"
                        description="Add questions to build out this quiz before publishing."
                        action={
                            <Button leftIcon={<Plus size={18}/>} onClick={questionModal.open}>
                                Add question
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Th>#</Table.Th>
                                    <Table.Th>Question</Table.Th>
                                    <Table.Th>Type</Table.Th>
                                    <Table.Th>Points</Table.Th>
                                    <Table.Th>Options</Table.Th>
                                    <Table.Th aria-label="Actions"/>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {questions.map((q) => {
                                    const meta = QUESTION_TYPE_META[q.type];
                                    return (
                                        <Table.Row key={q.id} onClick={() =>
                                            navigate(PATHS.adminQuestionDetail(id, q.id))}>
                                            <Table.Td>{q.index}</Table.Td>
                                            <Table.Td>{q.body}</Table.Td>
                                            <Table.Td>{meta && <Badge tone={meta.tone}>{meta.label}</Badge>}</Table.Td>
                                            <Table.Td>{q.points}</Table.Td>
                                            <Table.Td>{q.type === "MANUAL" ? "-" : q.optionCount ?? 0}</Table.Td>
                                            <Table.Td>
                                                <IconButton aria-label="Manage options">
                                                    <ChevronRight size={18}/>
                                                </IconButton>
                                            </Table.Td>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>

                        <div className={styles.pager}>
                            <Pagination
                                page={pagination.page}
                                size={pagination.size}
                                total={total}
                                onPageChange={pagination.setPage}
                            />
                        </div>
                    </>
                )}
            </Card>

            <QuestionFormModal
                open={questionModal.isOpen}
                onClose={questionModal.close}
                quizId={id}
                onSubmit={onSubmit}
            />
        </div>
    );
}