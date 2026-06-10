import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ListChecks, Plus, Search} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {Badge, Button, Card, EmptyState, Input, Pagination, Select, Table,} from "@/components/ui";
import {QuizFormModal} from "@/features/admin/components/QuizFormModal.jsx";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {usePagination} from "@/hooks/usePagination.js";
import {QUIZ_STATUS_META, QuizStatus} from "@/constants/enums.js";
import {PATHS} from "@/constants/paths.js";
import {formatDateTime} from "@/utils/format.js";
import styles from "./AdminQuizzesPage.module.css";
import {quizApi} from "@/api/quizApi.js";

const STATUS_FILTER = [
    {value: "", label: "All statuses"},
    {value: QuizStatus.UNPUBLISHED, label: "Unpublished"},
    {value: QuizStatus.PUBLISHED, label: "Published"},
    {value: QuizStatus.FINISHED, label: "Finished"},
];

export function AdminQuizzesPage() {
    const createModal = useDisclosure(false);
    const pagination = usePagination();
    const [filters, setFilters] = useState({
        search: "", status: "",
        createdFrom: "", createdTo: ""
    });
    const [quizzes, setQuizzes] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadQuizzes();
    }, [pagination.page, pagination.size, filters.search, filters.status, filters.createdFrom, filters.createdTo]);

    const loadQuizzes = () => {
        quizApi.getList({
            page: pagination.page,
            size: pagination.size,
            title: filters.search || undefined,
            status: filters.status || undefined,
            createdFrom: filters.createdFrom || undefined,
            createdTo: filters.createdTo || undefined
        })
            .then((data) => {
                setQuizzes(data.data);
                setTotal(data.total);
            })
    };

    const setFilter = (key, value) => {
        pagination.setPage(0);
        setFilters((f) => ({...f, [key]: value}));
    };

    return (
        <div>
            <PageHeader
                eyebrow="Library"
                title="Quizzes"
                description="Create, filter and manage every quiz."
                actions={
                    <Button leftIcon={<Plus size={18}/>} onClick={createModal.open}>
                        New quiz
                    </Button>
                }
            />

            <Card padding="sm" className={styles.toolbar}>
                <div className={styles.search}>
                    <Input
                        placeholder="Search by title…"
                        leftIcon={<Search size={18}/>}
                        value={filters.search}
                        onChange={(e) => setFilter("search", e.target.value.trim())}
                    />
                    <Input
                        type="datetime-local"
                        value={filters.createdFrom}
                        onChange={(e) => setFilter("createdFrom", e.target.value)}
                    />
                    <Input
                        type="datetime-local"
                        value={filters.createdTo}
                        onChange={(e) => setFilter("createdTo", e.target.value)}
                    />
                </div>
                <Select
                    className={styles.statusSelect}
                    options={STATUS_FILTER}
                    value={filters.status}
                    onChange={(e) => setFilter("status", e.target.value)}
                />
            </Card>

            <Card padding="sm">
                {quizzes.length === 0 ? (
                    <EmptyState
                        icon={<ListChecks size={26}/>}
                        title="No quizzes yet"
                        description="Create your first quiz to get started."
                        action={
                            <Button leftIcon={<Plus size={18}/>} onClick={createModal.open}>
                                New quiz
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Questions</Table.Th>
                                    <Table.Th>Created</Table.Th>
                                    <Table.Th>Author</Table.Th>
                                    <Table.Th>Id</Table.Th>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {quizzes.map((quiz) => {
                                    const meta = QUIZ_STATUS_META[quiz.status];
                                    return (
                                        <Table.Row key={quiz.id} onClick={() =>
                                            navigate(PATHS.adminQuizDetail(quiz.id))}>
                                            <Table.Td>{quiz.title}</Table.Td>
                                            <Table.Td>{meta && <Badge tone={meta.tone}>{meta.label}</Badge>}</Table.Td>
                                            <Table.Td>{quiz.questionCount ?? 0}</Table.Td>
                                            <Table.Td>{formatDateTime(quiz.createdDate)}</Table.Td>
                                            <Table.Td>{quiz.createdBy?.name ?? "—"}</Table.Td>
                                            <Table.Td>{quiz.id ?? "—"}</Table.Td>
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

            <QuizFormModal open={createModal.isOpen} onClose={createModal.close} onSubmit={loadQuizzes}/>
        </div>
    );
}
