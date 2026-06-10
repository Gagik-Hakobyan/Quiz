import {LogOut, LayoutDashboard, User as UserIcon, ChevronDown, ScanEyeIcon} from "lucide-react";
import {Avatar} from "@/components/ui/Avatar/Avatar.jsx";
import {Badge} from "@/components/ui/Badge/Badge.jsx";
import {useAuth} from "@/app/AuthContext.jsx";
import {useDisclosure} from "@/hooks/useDisclosure.js";
import {PATHS} from "@/constants/paths.js";
import {cn} from "@/utils/cn.js";
import {Link} from "react-router-dom";
import styles from "./UserMenu.module.css";

export function UserMenu() {
    const {user, role, isAdmin, logout} = useAuth();
    const menu = useDisclosure(false);

    return (
        <div className={styles.wrap}>
            <button className={styles.trigger} onClick={menu.toggle} aria-haspopup="menu">
                <Avatar name={user?.name} src={user?.imageName} size="sm"/>
                <span className={styles.meta}>
                     <span className={styles.name}>{user?.name}</span>
                     <span className={styles.email}>{user?.email}</span>
                </span>
                <ChevronDown size={16} className={cn(styles.caret, menu.isOpen && styles.caretOpen)}/>
            </button>

            {menu.isOpen && (
                <div className={styles.dropdown} role="menu">
                    <div className={styles.dropdownHeader}>
                        <Avatar name={user?.name} src={user?.imageName} size="md"/>
                        <div>
                            <p className={styles.name}>{user?.name}</p>
                            <Badge tone={isAdmin ? "primary" : "neutral"} dot>
                                {role}
                            </Badge>
                        </div>
                    </div>
                    <div className={styles.divider}/>
                    {isAdmin ? (
                        <>
                            <Link to={PATHS.adminQuizzes} className={styles.item} role="menuitem" onClick={menu.close}>
                                <UserIcon size={16}/> Quizzes
                            </Link>

                            <Link to={PATHS.adminDashboard} className={styles.item} role="menuitem"
                                  onClick={menu.close}>
                                <LayoutDashboard size={16}/> Console
                            </Link>

                            <Link to={PATHS.adminReviews} className={styles.item} role="menuitem"
                                  onClick={menu.close}>
                                <ScanEyeIcon size={16}/> Review answers
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={PATHS.quizzes} className={styles.item} role="menuitem" onClick={menu.close}>
                                <UserIcon size={16}/> Quizzes
                            </Link>

                            <Link to={PATHS.attempts} className={styles.item} role="menuitem" onClick={menu.close}>
                                <LayoutDashboard size={16}/> My Attempts
                            </Link>
                        </>
                    )}
                    <div className={styles.divider}/>
                    <button className={cn(styles.item, styles.danger)} role="menuitem" onClick={logout}>
                        <LogOut size={16}/> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
