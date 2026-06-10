import {useEffect, useState} from "react";
import {Search, SearchX, SlidersHorizontal} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {EmptyState, Input, Pagination, Select} from "@/components/ui";
import {QuizCard} from "@/features/quizzes/components/QuizCard.jsx";
import {usePagination} from "@/hooks/usePagination.js";
import styles from "./QuizCatalogPage.module.css";
import {quizApi} from "@/api/quizApi.js";
import {OrderDirection} from "@/constants/enums.js";

const SORT_OPTIONS = [
    {value: OrderDirection.DESC, label: "Newest first"},
    {value: OrderDirection.ASC, label: "Oldest first"},
];

export function QuizzesPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [total, setTotal] = useState(0);
    const pagination = usePagination();
    const [filters, setFilters] = useState({
        search: "", orderDirection: "",
        createdFrom: "", createdTo: ""
    });

    useEffect(() => {
        loadQuizzes();
    }, [pagination.page, pagination.size, filters.search, filters.orderDirection, filters.createdFrom, filters.createdTo]);

    const loadQuizzes = () => {
        quizApi.getPublishedList({
            page: pagination.page,
            size: pagination.size,
            title: filters.search || undefined,
            orderDirection: filters.orderDirection || OrderDirection.DESC,
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
                title="Quizzes"
                description="Pick a published quiz and test your knowledge."
            />

            <div className={styles.bar}>
                <div className={styles.search}>
                    <Input
                        placeholder="Search quizzes by title…"
                        leftIcon={<Search size={18}/>}
                        value={filters.search ?? ""}
                        onChange={(e) => setFilter("search", e.target.value)}
                    />
                </div>
                <div className={styles.sort}>
                    <SlidersHorizontal size={16} className={styles.sortIcon}/>
                    <Select
                        options={SORT_OPTIONS}
                        value={filters.orderDirection ?? OrderDirection.DESC}
                        onChange={(e) => setFilter("orderDirection", e.target.value)}
                    />
                </div>
            </div>

            {quizzes.length === 0 ? (
                <EmptyState
                    icon={<SearchX size={26}/>}
                    title="No quizzes found"
                    description="Try adjusting your search or check back later for newly published quizzes."
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {quizzes.map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz}/>
                        ))}
                    </div>
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
        </div>
    );
}
