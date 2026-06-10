import {useAuth} from "@/app/AuthContext.jsx";
import {Navigate, Outlet} from "react-router-dom";
import {PATHS} from "@/constants/paths.js";

export function GuestRoute() {
    const {isAuthenticated, isAdmin} = useAuth();

    if (isAuthenticated) {
        return <Navigate to={isAdmin ? PATHS.adminQuizzes : PATHS.quizzes} replace/>;
    }

    return <Outlet/>;
}