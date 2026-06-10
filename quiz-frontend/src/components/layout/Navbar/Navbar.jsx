import {NavLink} from "react-router-dom";
import {UserMenu} from "@/components/layout/UserMenu/UserMenu.jsx";
import {Container} from "@/components/layout/Container/Container.jsx";
import {useAuth} from "@/app/AuthContext.jsx";
import {PATHS} from "@/constants/paths.js";
import {cn} from "@/utils/cn.js";
import styles from "./Navbar.module.css";

export function Navbar() {
    const {isAdmin} = useAuth();

    return (
        <header className={styles.navbar}>
            <Container size="lg" className={styles.inner}>
                <div className={styles.left}>
                    <nav className={styles.links}>
                        {isAdmin && (
                            <NavLink
                                to={PATHS.adminDashboard}
                                className={({isActive}) => cn(styles.link, isActive && styles.active)}
                            >
                                Admin
                            </NavLink>
                        )}
                    </nav>
                </div>
                <UserMenu/>
            </Container>
        </header>
    );
}
