import { Route, Routes, Navigate } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import BarnPage from "../pages/area/barnPage";
import ProtectedRoute from "./ProtectedRoute";
import ListUserPage from "../pages/users/listUserPage";
import { ProfilePage } from "../pages/profile/profilePage";
import AreaPage from "../pages/area/areaPage";
import DetailBarnPage from "../pages/area/DetailBarn";
import { PigTypesPage } from "../pages/pig/pigType";
import WareHouseCategory from "../pages/warehouseCategory/warehouseCategory";
import WareHouseItem from "../pages/warehouseCategory/WarehouseItem";
import PigGrowthRecord from "../pages/pig/pigGrowthRecord";
import TodoPage from "../pages/todo/todoPage";
import { DetailPig } from "../pages/pig/detailPig";
import { Invoice } from "../pages/invoice/invoice";

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
                        <DetailBarnPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.PIG_TYPE}
                element={
                    <ProtectedRoute>
                        <PigTypesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.WAREHOUSE_CATEGORY}
                element={
                    <ProtectedRoute>
                        <WareHouseCategory />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.WAREHOUSE_ITEM}
                element={
                    <ProtectedRoute>
                        <WareHouseItem />
                    </ProtectedRoute>
                }
            />


            <Route
                path={ROUTES.PIG_GROWTH_RECORD}
                element={
                    <ProtectedRoute>
                        <PigGrowthRecord />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.TODO}
                element={
                    <ProtectedRoute>
                        <TodoPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.DETAIL_PIG}
                element={
                    <ProtectedRoute>
                        <DetailPig />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.INVOICE}
                element={
                    <ProtectedRoute>
                        <Invoice />
                    </ProtectedRoute>
                }
            />
            {/* Nếu không khớp route nào => quay về Home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
    );
};