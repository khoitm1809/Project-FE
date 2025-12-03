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


export default function LeftBar({ open, onClose, drawerWidth, isMobile }) {
    const user = useSelector((state) => state.auth.user);
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
        // chu trai
        { text: "Home", icon: <HomeOutlinedIcon />, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Tạo tài khoản cho nhân công", icon: <GroupAddOutlinedIcon />, path: ROUTES.LIST_USER, role: ROLES.OWNER },
        { text: "Quản lý khu vực", icon: <GroupAddOutlinedIcon />, path: ROUTES.AREA, role: ROLES.OWNER },
        { text: "Quản lý giống và đàn lợn", icon: <AgricultureOutlinedIcon />, path: ROUTES.PIG_TYPE, role: ROLES.OWNER },
        { text: "Quản lý  kho hàng hóa", icon: <WarehouseOutlinedIcon />, path: ROUTES.WAREHOUSE_CATEGORY, role: ROLES.OWNER },
        // { text: "Nhập vào kho hàng, vacxin ", icon: <WarehouseOutlinedIcon />, path: ROUTES.WAREHOUSE_ITEM, role: ROLES.OWNER },
        { text: "Giao việc cho công nhân", icon: <ContactMailOutlinedIcon />, path: ROUTES.TODO, role: ROLES.OWNER },
        { text: "Xuất chuồng", icon: <ContactMailOutlinedIcon />, path: ROUTES.INVOICE, role: ROLES.OWNER },
        // cong nhan
        { text: "Home", icon: <HomeOutlinedIcon />, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Khu vực của tôi", icon: <GroupAddOutlinedIcon />, path: ROUTES.BARN, role: ROLES.WORKER },

        // { text: "Nhập nguồn gốc giống lợn", icon: <UploadFileOutlinedIcon />, path: ROUTES.PIG_PAGE, role: ROLES.WORKER },
        { text: "Ghi nhận tốc độ tăng trưởng", icon: <AreaChartOutlinedIcon />, path: ROUTES.PIG_GROWTH_RECORD, role: ROLES.WORKER },
        { text: "Nhập vào kho hàng, vacxin ", icon: <WarehouseOutlinedIcon />, path: ROUTES.WAREHOUSE_CATEGORY, role: ROLES.WORKER },
        // { text: "To do list các việc mà chủ trang trại giao", icon: <ChecklistOutlinedIcon />, path: ROUTES.TODO, role: ROLES.WORKER },
        // { text: "Thiết lập thức ăn và dinh dưỡng", icon: <SoupKitchenOutlinedIcon />, path: ROUTES.WAREHOUSE_ITEM, role: ROLES.WORKER },
        { text: "Giao việc cho công nhân", icon: <ContactMailOutlinedIcon />, path: ROUTES.TODO, role: ROLES.WORKER },


    ];

    return (
        <Drawer
            variant={isMobile ? "temporary" : "persistent"}
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                width: drawerWidth,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    background: THEME.MENU_BACKGROUND,
                    boxSizing: "border-box",
                },
            }}
        >
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%", cursor: 'pointer' }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                    p={2}
                    onClick={() => navigate(ROUTES.PROFILE)}
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
                            {user?.username}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            {user?.email}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary">
                            {role}
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
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("role");
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
