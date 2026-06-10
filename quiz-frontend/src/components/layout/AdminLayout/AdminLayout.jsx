import {Outlet} from "react-router-dom";
import {UserMenu} from "@/components/layout/UserMenu/UserMenu.jsx";
import {Badge} from "@/components/ui/Badge/Badge.jsx";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
    return (
        <div className={styles.shell}>
            <div className={styles.body}>
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <Badge tone="primary" dot>
                            Admin console
                        </Badge>
                    </div>
                    <UserMenu/>
                </header>
                <main className={styles.main}>
                    <div className={styles.content}>
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
}
