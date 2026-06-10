import {ListChecks, PenSquare, Trophy} from "lucide-react";
import styles from "./AuthLayout.module.css";

const HIGHLIGHTS = [
    {
        icon: ListChecks,
        title: "Take quizzes",
        text: "Answer single-choice, multiple-choice and text questions across different topics."
    },
    {
        icon: PenSquare,
        title: "Track your results",
        text: "See your scores, completed attempts and overall progress."
    },
    {
        icon: Trophy,
        title: "Learn and improve",
        text: "Test your knowledge, discover weak areas and improve with every attempt."
    }
];

export function AuthLayout({title, subtitle, children, footer}) {
    return (
        <div className={styles.wrap}>
            <aside className={styles.aside}>
                <div className={styles.asideTop}>
                </div>
                <div className={styles.asideBody}>
                    <h2 className={styles.tagline}>
                        <span>Quiz</span>
                    </h2>
                    <p className={styles.asideLead}>
                        take QUIZZES test your knowledge, and earn points.
                    </p>
                    <ul className={styles.highlights} role="list">
                        {HIGHLIGHTS.map(({icon: Icon, title: title, text}) => (
                            <li key={title} className={styles.highlight}>
                                 <span className={styles.highlightIcon}>
                                   <Icon size={18}/>
                                 </span>
                                <span>

                                <strong>{title}</strong>
                                   <span className={styles.highlightText}>{text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.glow} aria-hidden/>
            </aside>

            <main className={styles.main}>
                <div className={styles.card}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{title}</h1>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </header>
                    {children}
                    {footer && <div className={styles.footer}>{footer}</div>}
                </div>
            </main>
        </div>
    );
}
