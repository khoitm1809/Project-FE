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


function App() {
    return (
        <div>
            <ThemeProvider theme={TypographyConfig}>
                <Layout>
                    <RouterConfig>
                    </RouterConfig>
                </Layout>
            </ThemeProvider>
        </div>
    )
}

const Layout = ({ children }) => {
    const location = useLocation();
    const drawerWidth = 320;
    const isMobile = useMediaQuery('(max-width:1080px')

    return (
        <Box display="flex">
            {/* Top Bar */}
            {location?.pathname !== ROUTES.LOGIN &&
                <TopBar
                    drawerWidth={drawerWidth}
                    isMobile={isMobile}
                />}
            {/* Sidebar */}
            {location?.pathname !== ROUTES.LOGIN && (
                <Box
                    sx={{
                        width: isMobile ? 0 : drawerWidth,
                        flexShrink: 0,
                    }}>
                    <LeftBar open={true} drawerWidth={drawerWidth} />
                </Box>
            )}
            {/* Content */}
            <Box
                component="main"
                sx={(theme) => ({
                    minHeight: '100vh',
                    height: "100%",
                    background: THEME.THEME_BACKGROUND,
                    flexGrow: 1,
                    pt: location.pathname !== ROUTES.LOGIN ? "64px" : 0,
                    [theme.breakpoints.up(1080)]: {
                        pt: 0,
                    },
                })}><Box>
                </Box>
                {children}
            </Box>
        </Box>
    );
};


export default App