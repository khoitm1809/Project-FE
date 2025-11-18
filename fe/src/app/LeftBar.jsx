import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Button,
    IconButton,
    Typography,
    Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routerConstants";
import { ROLES } from '../utils/rolesConstant'
import { useSelector } from "react-redux";

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
import { THEME } from "../utils/ThemeConstants";
import { useEffect, useState } from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import { LANGUAGE_CODE_EN, LANGUAGE_CODE_VI, LOCAL_STORAGE_NAME } from "../utils/constant";
import i18next from "i18next";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';


export default function LeftBar({ open, onClose, drawerWidth }) {
    const navigate = useNavigate();
    const [langSelect, setlangSelect] = useState(localStorage.getItem(LOCAL_STORAGE_NAME.LANGUAGE))
    const role = localStorage.getItem("role");
    const changeLanguage = (lng) => {
        i18next.changeLanguage(lng);
        localStorage.setItem(LOCAL_STORAGE_NAME.LANGUAGE, lng)
        setlangSelect(lng)
    };
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
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={(theme) => ({
                width: drawerWidth,
                flexShrink: 0,
                [theme.breakpoints.down(1080)]: { display: "none" },
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    background: THEME.MENU_BACKGROUND,
                    borderRight: "none",
                },
            })}
        >
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Language switch */}
                {/* <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, cursor: "pointer" }}
                    onClick={() =>
                        changeLanguage(
                            langSelect === LANGUAGE_CODE_EN ? LANGUAGE_CODE_VI : LANGUAGE_CODE_EN
                        )
                    }
                >
                    <TranslateIcon />
                    <Typography>{langSelect === LANGUAGE_CODE_EN ? "Tiếng Anh" : "Tiếng Việt"}</Typography>
                </Box> */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                    p={2}
                    sx={{
                        backgroundColor: "grey.50",
                        borderRadius: 2,
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        src="https://github.com/shadcn.png"
                        alt="Nguyễn Văn A"
                        sx={{ width: 48, height: 48 }}
                    >
                        NV
                    </Avatar>

                    {/* Info */}
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="body1"
                            noWrap
                            sx={{ fontWeight: 500 }}
                        >
                            Nguyễn Văn A
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            admin@example.com
                        </Typography>
                    </Box>
                </Box>


                <Divider sx={{ mb: 2 }} />

                {/* Menu Items */}
                <List sx={{ flexGrow: 1 }}>
                    {menuItems
                        .filter((item) => item.role === role)
                        .map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        navigate({
                                            pathname: item.path,
                                            search: item.search,
                                        })
                                    }
                                >
                                    <ListItemIcon sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>

                <Divider sx={{ my: 2 }} />
                {/* Language switch */}
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    onClick={() =>
                        changeLanguage(
                            langSelect === LANGUAGE_CODE_EN ? LANGUAGE_CODE_VI : LANGUAGE_CODE_EN
                        )}>
                    <IconButton sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>
                        <LanguageOutlinedIcon />
                    </IconButton>
                    <Typography sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>Tiếng Việt</Typography>
                </Box>
                {/* Logout */}
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate({ pathname: ROUTES.LOGIN });
                    }}
                >
                    <IconButton sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>
                        <LogoutOutlinedIcon />
                    </IconButton>
                    <Typography sx={{ color: THEME.SECONDARY_TEXT_BUTTON }}>Đăng xuất</Typography>
                </Box>
            </Box>
        </Drawer>
    );
}
