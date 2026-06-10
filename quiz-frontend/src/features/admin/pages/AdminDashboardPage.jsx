import {Link} from "react-router-dom";
import {ArrowRight, CheckCircle2, FileEdit, ListChecks, Users} from "lucide-react";
import {PageHeader} from "@/components/layout/PageHeader/PageHeader.jsx";
import {StatCard} from "@/features/admin/components/StatCard.jsx";
import {QuizFormModal} from "@/features/admin/components/QuizFormModal.jsx";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {PATHS} from "@/constants/paths.js";
import styles from "./AdminDashboardPage.module.css";
import {useEffect, useState} from "react";
import {quizApi} from "@/api/quizApi.js";
import toast from "react-hot-toast";

export function AdminDashboardPage() {
    const createModal = useDisclosure(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        quizApi.getStats()
            .then(setStats)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false))
    }, []);

    return (
        <div>
            <PageHeader
                title="Dashboard"
                description="Track your quizzes and jump back into authoring."
            />

            <section className={styles.stats}>
                <StatCard icon={<ListChecks size={22}/>} label="Total quizzes"
                          value={loading ? "..." : stats.total} tone="primary"/>
                <StatCard icon={<CheckCircle2 size={22}/>} label="Published"
                          value={loading ? "..." : stats.published} tone="success"/>
                <StatCard icon={<FileEdit size={22}/>} label="Drafts"
                          value={loading ? "..." : stats.drafts} tone="warning"/>
                <StatCard icon={<Users size={22}/>} label="Attempts"
                          value={loading ? "..." : stats.attempts} tone="info"/>
            </section>

            <Link to={PATHS.adminQuizzes} className={styles.viewAll}>
                View all <ArrowRight size={20}/>
            </Link>

            <QuizFormModal open={createModal.isOpen} onClose={createModal.close}/>
        </div>
    );
}
