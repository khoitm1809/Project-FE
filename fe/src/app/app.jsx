import { RouterConfig } from "../router/routerConfig"
import '../utils/index.css';
import { ThemeProvider } from "@mui/material/styles";
import { TypographyConfig } from "./typographyConfig";
import LeftBar from "./LeftBar";
import { Box, useMediaQuery } from "@mui/material";
import { ROUTES } from "../router/routerConstants";
import { useLocation } from "react-router";


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
                sx={{
                    flexGrow: 1,
                }}><Box>
                </Box>
                {children}
            </Box>
        </Box>
    );
};


export default App