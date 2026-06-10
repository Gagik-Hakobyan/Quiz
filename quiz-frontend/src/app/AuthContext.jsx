import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {UserRole} from "@/constants/enums.js";
import {tokenStorage} from "@/utils/tokenStorage.js";
import {authApi} from "@/api/authApi.js";
import {useNavigate} from "react-router-dom";
import {PATHS} from "@/constants/paths.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => tokenStorage.get());
    const [loading, setLoading] = useState(!!tokenStorage.get());

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        authApi.me()
            .then(setUser)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    const value = useMemo(() => ({
        user,
        role: user?.role ?? null,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === UserRole.ADMIN,

        async login(payload) {
            const data = await authApi.login(payload);
            tokenStorage.set(data.token);
            setToken(data.token);
            setUser(data.userResponseDto);
            toast.success("Welcome back, " + data.userResponseDto.name);

            if (data.userResponseDto?.role === UserRole.ADMIN) {
                navigate(PATHS.adminDashboard);
            } else {
                navigate(PATHS.quizzes);
            }
        },

        async register(payload) {
            await authApi.register(payload);
            toast.success("Check your email for verification code");
            navigate(PATHS.verify);
        },

        async verify(verifyToken) {
            await authApi.verify(verifyToken);
            toast.success("Successfully verified");
            navigate(PATHS.login);
        },

        logout() {
            tokenStorage.clear();
            setToken(null);
            setUser(null);
            navigate(PATHS.login);
        },
    }), [user, token, navigate]);

    if (loading) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within <AuthProvider>");
    }
    return context;
}
