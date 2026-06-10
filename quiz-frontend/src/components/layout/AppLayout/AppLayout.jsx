import {Outlet} from "react-router-dom";
import {Navbar} from "@/components/layout/Navbar/Navbar.jsx";
import {Container} from "@/components/layout/Container/Container.jsx";
import styles from "./AppLayout.module.css";

export function AppLayout() {
    return (
        <div className={styles.shell}>
            <Navbar/>
            <main className={styles.main}>
                <Container size="lg" className={styles.content}>
                    <Outlet/>
                </Container>
            </main>
        </div>
    );
}
