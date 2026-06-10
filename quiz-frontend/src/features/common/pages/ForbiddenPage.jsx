import {Link} from "react-router-dom";
import {ShieldX} from "lucide-react";
import {Button} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import styles from "./StatusPage.module.css";

export function ForbiddenPage() {
    return (
        <div className={styles.wrap}>
      <span className={styles.icon}>
        <ShieldX size={30}/>
      </span>
            <p className={styles.code}>403</p>
            <h1 className={styles.title}>Access denied</h1>
            <p className={styles.text}>
                You don’t have permission to view this page. It may require an admin account.
            </p>
            <Link to={PATHS.quizzes}>
                <Button size="lg">Back to safety</Button>
            </Link>
        </div>
    );
}
