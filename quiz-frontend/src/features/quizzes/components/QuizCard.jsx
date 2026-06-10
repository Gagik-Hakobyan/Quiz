import {Link} from "react-router-dom";
import {ArrowRight, FileQuestion} from "lucide-react";
import {Avatar, Button, Card} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import {formatDate} from "@/utils/format.js";
import styles from "./QuizCard.module.css";

export function QuizCard({quiz}) {
    return (
        <Card interactive className={styles.card} padding="md">
            <div className={styles.top}>
                <span className={styles.date}>{formatDate(quiz.createdDate)}</span>
            </div>

            <Link to={PATHS.quizDetail(quiz.id)} className={styles.titleLink}>
                <h3 className={styles.title}>{quiz.title}</h3>
            </Link>
            <p className={styles.desc}>
                {quiz.description.length > 120 ? `${quiz.description.slice(0, 120).trimEnd()}…` : quiz.description}
            </p>

            <div className={styles.stats}>
        <span className={styles.stat}>
          <FileQuestion size={15}/> {quiz.questionCount ?? "—"} questions
        </span>
            </div>

            <div className={styles.footer}>
        <span className={styles.author}>
          <Avatar name={quiz.createdBy?.name} size="sm"/>
          <span className={styles.authorName}>{quiz.createdBy?.name ?? "Unknown"}</span>
        </span>
                <Link to={PATHS.quizDetail(quiz.id)}>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={15}/>}>
                        View
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
