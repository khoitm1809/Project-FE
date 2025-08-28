import { RouterConfig } from "../router/routerConfig"
import '../utils/index.css';
import { ThemeProvider } from "@mui/material/styles";
import { TypographyConfig } from "./typographyConfig";
import LeftBar from "./LeftBar";
import { Box } from "@mui/material";


function App() {
    return (
        <ThemeProvider theme={TypographyConfig}>
            <Layout>
                <RouterConfig>

                </RouterConfig>
            </Layout>
        </ThemeProvider>
    )
}

const Layout = ({ children }) => {
    const drawerWidth = 320;
    return (
        <Box display="flex" position="relative">
            <Box>
                <LeftBar open={true} drawerWidth={drawerWidth} />
                {children}
            </Box>
        </Box>
    );
};

export default App