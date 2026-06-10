import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "@/app/AuthContext.jsx";
import {PATHS} from "@/constants/paths.js";

export function RoleRoute({allow}) {
    const {role} = useAuth();

    if (role !== allow) {
        return <Navigate to={PATHS.forbidden} replace/>
    }

    return <Outlet/>;
}
