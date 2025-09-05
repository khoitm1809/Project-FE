import { Route, Routes } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import Settings from "../pages/settings/settingsPage";
import DetailPage from "../pages/DetailPage";
import ListAccount from "../pages/accountControl/listAccount";
import ServicePackages from "../pages/service/servicePackages";
import AddNewAccount from "../pages/accountControl/addNewAccount";

export const RouterConfig = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.DETAIL_PAGE} element={<DetailPage />} />
            <Route path={ROUTES.LIST_ACCOUNT} element={<ListAccount />} />
            <Route path={ROUTES.SERVICE_PACKAGES} element={<ServicePackages />} />
            <Route path={ROUTES.ADD_NEW_ACCOUNT} element={<AddNewAccount />} />
        </Routes>
    )
}