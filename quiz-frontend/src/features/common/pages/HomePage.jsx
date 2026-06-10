import {Link} from "react-router-dom";
import {ListChecks, PenSquare, Trophy} from 'lucide-react';
import {Container} from "@/components/layout/Container/Container.jsx";
import {Button} from "@/components/ui";
import {PATHS} from "@/constants/paths.js";
import styles from "./LandingPage.module.css";

const FEATURES = [
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

export function HomePage() {
    return (
        <div className={styles.page}>
            <header className={styles.nav}>
                <Container size="lg" className={styles.navInner}>
                    <div className={styles.navActions}>
                        <Link to={PATHS.login}>
                            <Button variant="ghost">Sign in</Button>
                        </Link>
                        <Link to={PATHS.register}>
                            <Button>Get started</Button>
                        </Link>
                    </div>
                </Container>
            </header>

            <section className={styles.hero}>
                <Container size="md" className={styles.heroInner}>
                    <h1 className={styles.title}>
                        take <span>QUIZZES,</span> test your knowledge, and earn points.
                    </h1>


                </Container>
                <div className={styles.heroGlow} aria-hidden/>
            </section>

            <section className={styles.features}>
                <Container size="lg">
                    <div className={styles.grid}>
                        {FEATURES.map(({icon: Icon, title, text}) => (
                            <article key={title} className={styles.feature}>
                                <span className={styles.featureIcon}>
                                     <Icon size={22}/>
                                </span>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>

            <footer className={styles.foot}>
                <Container size="lg" className={styles.footInner}>
                    <span>© {new Date().getFullYear()} Quiz</span>
                </Container>
            </footer>
        </div>
    );
}
