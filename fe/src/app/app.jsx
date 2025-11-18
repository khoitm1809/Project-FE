import { RouterConfig } from "../router/routerConfig"
import '../utils/index.css';
import { ThemeProvider } from "@mui/material/styles";
import { TypographyConfig } from "./typographyConfig";
import LeftBar from "./LeftBar";
import { Box, useMediaQuery } from "@mui/material";
import { ROUTES } from "../router/routerConstants";
import { useLocation } from "react-router";
import TopBar from "./TopBar";
import { THEME } from "../utils/ThemeConstants";
import { ConfirmDialogProvider } from "../components/confirmDialog";
import { useTranslation } from 'react-i18next';
import { useState } from "react";


function App() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    return (
        <div>
            <ThemeProvider theme={TypographyConfig}>
                <ConfirmDialogProvider>
                    <Layout>
                        <RouterConfig>
                        </RouterConfig>
                    </Layout>
                </ConfirmDialogProvider>
            </ThemeProvider>
        </div>
    )
}

const Layout = ({ children }) => {
    const location = useLocation();
    const drawerWidth = 320;
    const isMobile = useMediaQuery('(max-width:1080px)');

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

    return (
        <Box display="flex">

            {!isAuthPage && (
                <TopBar
                    drawerWidth={drawerWidth}
                    isMobile={isMobile}
                    onMenuClick={handleDrawerToggle}  
                />
            )}

            {/* Sidebar */}
            {!isAuthPage && (
                <LeftBar
                    open={isMobile ? mobileOpen : true} 
                    onClose={() => setMobileOpen(false)}
                    drawerWidth={drawerWidth}
                    isMobile={isMobile}
                />
            )}

            {/* Content */}
            <Box
                component="main"
                sx={(theme) => ({
                    minHeight: '100vh',
                    background: THEME.THEME_BACKGROUND,
                    flexGrow: 1,

                    pt: !isAuthPage ? "64px" : 0,

                    [theme.breakpoints.up(1080)]: {
                        pt: 0, 
                    },
                })}
            >
                {children}
            </Box>
        </Box>
    );
};

export default App