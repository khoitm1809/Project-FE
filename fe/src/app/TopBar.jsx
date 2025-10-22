import { useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Tooltip, } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import SoupKitchenOutlinedIcon from '@mui/icons-material/SoupKitchenOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AreaChartOutlinedIcon from '@mui/icons-material/AreaChartOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { ROLES } from "../utils/rolesConstant";
import { ROUTES } from "../router/routerConstants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { THEME } from "../utils/ThemeConstants";

export default function TopBar({
    isLeftBarOpen = true,
    drawerWidth,
    isMobile
}) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    useEffect(() => {

    }, [role])
    const menuItems = [
        //adm
        { text: "Home", icon: <HomeOutlinedIcon />, path: ROUTES.HOME, role: ROLES.ADMIN },
        { text: "Quản lý tài khoản", icon: <PhotoCameraFrontOutlinedIcon />, path: ROUTES.LIST_ACCOUNT, role: ROLES.ADMIN },
        { text: "Quản lý gói dịch vụ", icon: <HomeRepairServiceOutlinedIcon />, path: ROUTES.SERVICE_PACKAGES, role: ROLES.ADMIN },
        { text: "Settings", icon: <SettingsOutlinedIcon />, path: ROUTES.SETTINGS, role: ROLES.ADMIN },
        // chu trai
        { text: "Home", icon: <HomeOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Tạo tài khoản cho nhân công", icon: <GroupAddOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Quản lý giống và đàn lợn", icon: <AgricultureOutlinedIcon />, path: ROUTES.OFF_SPRING, role: ROLES.OWNER },
        { text: "Quản lý khu và chuồng nuôi", icon: <AgricultureOutlinedIcon />, path: ROUTES.HERD_BREED_MANAGEMENT, role: ROLES.OWNER },
        { text: "Thiết lập thức ăn và dinh dưỡng", icon: <SoupKitchenOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Quản lý hóa đơn nhập hàng", icon: <InventoryOutlinedIcon />, path: ROUTES.INVOICE, role: ROLES.OWNER },
        { text: "Quản lý  kho hàng hóa", icon: <WarehouseOutlinedIcon />, path: ROUTES.FOOD_WAREHOUSE, role: ROLES.OWNER },
        { text: "Giao việc cho công nhân", icon: <ContactMailOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Mua gói dịch vụ", icon: <HomeRepairServiceOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        // cong nhan
        { text: "Home", icon: <HomeOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Nhập nguồn gốc giống lợn", icon: <UploadFileOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Ghi nhận tốc độ tăng trưởng", icon: <AreaChartOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Nhập thông tin sức khỏe toàn truồng và từng cá thể lợn", icon: <FeedOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Nhập vào kho hàng, vacxin, ", icon: <WarehouseOutlinedIcon />, path: ROUTES.MEDITION_WAREHOUSE, role: ROLES.WORKER },
        { text: "Theo giõi chu kì động dục của lợn, ", icon: <PreviewOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Ghi nhận và tính ngày phối giống", icon: <CalendarMonthOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "To do list các việc mà chủ trang trại giao", icon: <ChecklistOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
    ];

    return (
        <AppBar
            position="fixed"
            sx={(theme) => ({
                background: THEME.MENU_BACKGROUND,
                zIndex: theme.zIndex.drawer + 1,
                transition: "margin 0.3s ease, width 0.3s ease",

                // Default: Adjust width if left bar open
                marginLeft: isLeftBarOpen ? `${drawerWidth}px` : 0,
                width: isLeftBarOpen
                    ? `calc(100% - ${drawerWidth}px)`
                    : "100%",

                // On small screens (<=1260px): Always full width
                [theme.breakpoints.up(1080)]: {
                    // marginLeft: 0,
                    // width: "100%",
                    display: 'none'
                },
                [theme.breakpoints.down(1080)]: {
                    marginLeft: 0,
                    width: "100%",
                },
            })}
        >
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>H</Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '0.4rem' }}>
                        {/* <Typography variant="10500">
                            Welcome
                        </Typography> */}
                        <Typography variant="12500">
                            {"Huy Phan"}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="row" alignItems="center">
                    {isMobile &&
                        menuItems
                            .filter((item) => item?.role == role)
                            .map((item) => (
                                <Box
                                    key={item.text}
                                    onClick={() => {
                                        navigate({
                                            pathname: item.path,
                                            search: item.search,
                                        });
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        gap: '0.4rem',
                                    }}
                                >
                                    <Tooltip title={item.text} arrow>
                                        <IconButton sx={{ ml: 1, color: THEME.SECONDARY_TEXT_BUTTON }}>
                                            {item.icon}
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Typography variant="12400" sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>{item.text}</Typography> */}
                                </Box>
                            ))}

                    {/* Đăng xuất luôn hiển thị, bất kể isMobile */}
                    <Box
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate({ pathname: ROUTES.LOGIN });
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '0.4rem',
                        }}
                    >
                        <IconButton sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>
                            {/* Có thể thay icon logout */}
                        </IconButton>
                        <Typography variant="12400" sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>Đăng xuất</Typography>
                    </Box>

                </Box>
            </Toolbar>
        </AppBar >
    );
}
