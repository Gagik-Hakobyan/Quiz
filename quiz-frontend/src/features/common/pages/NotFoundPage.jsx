import {Link} from "react-router-dom";
import {Compass} from "lucide-react";
import {Button} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import styles from "./StatusPage.module.css";
import {useAuth} from "@/app/AuthContext.jsx";

export function NotFoundPage() {
    const {isAdmin} = useAuth();

    return (
        <div className={styles.wrap}>
      <span className={styles.icon}>
        <Compass size={30}/>
      </span>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.text}>
                The page you’re looking for doesn’t exist or may have moved.
            </p>
            <Link to={isAdmin ? PATHS.adminQuizzes : PATHS.quizzes}>
                <Button size="lg">Back to quizzes</Button>
            </Link>
        </div>
    );
}
