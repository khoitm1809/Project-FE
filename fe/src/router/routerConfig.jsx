import { Route, Routes, Navigate } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import BarnPage from "../pages/area/barnPage";
import ProtectedRoute from "./ProtectedRoute";
import ListUserPage from "../pages/users/listUserPage";
import { ProfilePage } from "../pages/profile/profilePage";
import PigPage from "../pages/pig/pigPage";
import AreaPage from "../pages/area/areaPage";

export const RouterConfig = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            {/* <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}

            {/* Protected routes */}
            <Route
                path={ROUTES.HOME}
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            {/* Profile page */}
            <Route
                path={ROUTES.PROFILE}
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.AREA}
                element={
                    <ProtectedRoute>
                        <AreaPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.BARN}
                element={
                    <ProtectedRoute>
                        <BarnPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.LIST_USER}
                element={
                    <ProtectedRoute>
                        <ListUserPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.PIG_PAGE}
                element={
                    <ProtectedRoute>
                        <PigPage />
                    </ProtectedRoute>
                }
            />

            {/* Nếu không khớp route nào => quay về Home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
    );
};