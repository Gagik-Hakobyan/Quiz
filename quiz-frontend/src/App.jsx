import {Navigate, Route, Routes} from "react-router-dom";
import {PATHS} from "@/constants/paths.js";
import {HomePage} from "@/features/common/pages/HomePage.jsx";
import {LoginPage} from "@/features/auth/pages/LoginPage.jsx";
import {RegisterPage} from "@/features/auth/pages/RegisterPage.jsx";
import {VerifyPage} from "@/features/auth/pages/VerifyPage.jsx";
import {ForbiddenPage} from "@/features/common/pages/ForbiddenPage.jsx";
import {ProtectedRoute} from "@/app/ProtectedRoute.jsx";
import {AppLayout} from "@/components/layout/AppLayout/AppLayout.jsx";
import {QuizzesPage} from "@/features/quizzes/pages/QuizzesPage.jsx";
import {QuizDetailPage} from "@/features/quizzes/pages/QuizDetailPage.jsx";
import {AttemptResultPage} from "@/features/quizzes/pages/AttemptResultPage.jsx";
import {QuizAttemptPage} from "@/features/quizzes/pages/QuizAttemptPage.jsx";
import {RoleRoute} from "@/app/RoleRoute.jsx";
import {UserRole} from "@/constants/enums.js";
import {AdminLayout} from "@/components/layout/AdminLayout/AdminLayout.jsx";
import {AdminDashboardPage} from "@/features/admin/pages/AdminDashboardPage.jsx";
import {AdminQuizzesPage} from "@/features/admin/pages/AdminQuizzesPage.jsx";
import {AdminQuizDetailPage} from "@/features/admin/pages/AdminQuizDetailPage.jsx";
import {AdminQuestionDetailPage} from "@/features/admin/pages/AdminQuestionDetailPage.jsx";
import {NotFoundPage} from "@/features/common/pages/NotFoundPage.jsx";
import {GuestRoute} from "@/app/GuestRoute.jsx";
import {UserAttemptsPage} from "@/features/quizzes/pages/UserAttemptsPage.jsx";
import {AdminReviewsPage} from "@/features/admin/pages/AdminReviewsPage.jsx";

export default function App() {
    return (
        <Routes>
            <Route path={PATHS.home} element={<HomePage/>}/>

            <Route element={<GuestRoute/>}>
                <Route path={PATHS.login} element={<LoginPage/>}/>
                <Route path={PATHS.register} element={<RegisterPage/>}/>
                <Route path={PATHS.verify} element={<VerifyPage/>}/>
            </Route>

            <Route element={<ProtectedRoute/>}>
                <Route element={<AppLayout/>}>
                    <Route path={PATHS.quizzes} element={<QuizzesPage/>}/>
                    <Route path={PATHS.quizDetail()} element={<QuizDetailPage/>}/>
                    <Route path={PATHS.attemptResult()} element={<AttemptResultPage/>}/>
                    <Route path={PATHS.attempts} element={<UserAttemptsPage/>}/>
                </Route>

                <Route path={PATHS.quizPlay()} element={<QuizAttemptPage/>}/>
            </Route>

            <Route element={<ProtectedRoute/>}>
                <Route element={<RoleRoute allow={UserRole.ADMIN}/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path={PATHS.adminDashboard} element={<AdminDashboardPage/>}/>
                        <Route path={PATHS.adminQuizzes} element={<AdminQuizzesPage/>}/>
                        <Route path={PATHS.adminQuizDetail()} element={<AdminQuizDetailPage/>}/>
                        <Route path={PATHS.adminQuestionDetail()} element={<AdminQuestionDetailPage/>}/>
                        <Route path={PATHS.adminReviews} element={<AdminReviewsPage/>}/>
                    </Route>
                </Route>
            </Route>

            <Route path="/404" element={<NotFoundPage/>}/>
            <Route path={PATHS.notFound} element={<Navigate to="/404" replace/>}/>
            <Route path={PATHS.forbidden} element={<ForbiddenPage/>}/>
        </Routes>
    );
}