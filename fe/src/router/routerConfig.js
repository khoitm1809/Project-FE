import { Route, Routes } from "react-router";
import { ROUTES } from "./routerConstants";
import Home from "../pages/home";

export const RouterConfig = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
        </Routes>
    )
}