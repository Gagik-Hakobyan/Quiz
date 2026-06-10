import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "@/app/AuthContext.jsx";
import {PATHS} from "@/constants/paths.js";

export function ProtectedRoute() {
    const {isAuthenticated, isAdmin} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={PATHS.login} replace state={{from: location}}/>;
    }

    if (isAdmin && !location.pathname.startsWith("/admin")) {
        return <Navigate to={PATHS.adminDashboard} replace/>;
    }

    return <Outlet/>;
}
