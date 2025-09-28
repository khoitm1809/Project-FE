import { Route, Routes } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import Settings from "../pages/settings/settingsPage";
import DetailPage from "../pages/DetailPage";
import ListAccount from "../pages/accountControl/listAccount";
import ServicePackages from "../pages/service/servicePackages";
import RegisterPage from "../pages/registerPage";
import HerdBreedPage from "../pages/herdBreedManagement/herdBreedPage";
import BarnPage from "../pages/herdBreedManagement/barnPage";
import OffSpring from "../pages/offSpring/offSpringPage";

export const RouterConfig = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.HERD_BREED_MANAGEMENT} element={<HerdBreedPage />} />
            <Route path={ROUTES.BARN} element={<BarnPage />} />
            <Route path={ROUTES.OFF_SPRING} element={<OffSpring />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.DETAIL_PAGE} element={<DetailPage />} />
            <Route path={ROUTES.LIST_ACCOUNT} element={<ListAccount />} />
            <Route path={ROUTES.SERVICE_PACKAGES} element={<ServicePackages />} />
        </Routes>
    )
}