import { Route, Routes } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import Settings from "../pages/settings/settingsPage";
import DetailPage from "../pages/DetailPage";

export const RouterConfig = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.DETAIL_PAGE} element={<DetailPage />} />
        </Routes>
    )
}