import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routerConstants";
import { ROLES } from '../utils/rolesConstant'


export default function LeftBar({ open, onClose, drawerWidth }) {
    const navigate = useNavigate();

    const menuItems = [
        //adm
        { text: "Home", icon: null, path: ROUTES.HOME, role: ROLES.ADMIN },
        { text: "Quản lý tài khoản", icon: null, path: ROUTES.SETTINGS, role: ROLES.ADMIN },
        { text: "Quản lý gói dịch vụ", icon: null, path: ROUTES.HOME, role: ROLES.ADMIN },
        { text: "Settings", icon: null, path: ROUTES.HOME, role: ROLES.ADMIN },
        // chu trai
        { text: "Tạo tài khoản cho nhân công", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Quản lý giống và đàn lợn", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Thiết lập thức ăn và dinh dưỡng", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Quản lý hóa đơn nhập hàng", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Quản lý  kho hàng hóa", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Giao việc cho công nhân", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        { text: "Mua gói dịch vụ", icon: null, path: ROUTES.HOME, role: ROLES.OWNER },
        // cong nhan
        { text: "Nhập nguồn gốc giống lợn", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Ghi nhận tốc độ tăng trưởng", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Nhập thông tin sức khỏe toàn truồng và từng cá thể lợn", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Nhập vào kho hàng, vacxin, ", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Theo giõi chu kì động dục của lợn, ", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "Ghi nhận và tính ngày phối giống", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
        { text: "To do list các việc mà chủ trang trại giao", icon: null, path: ROUTES.HOME, role: ROLES.WORKER },
    ];

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={(theme) => ({
                width: drawerWidth,
                flexShrink: 0,

                // ✅ Hide drawer on smaller screens (<1200px)
                [theme.breakpoints.down(1080)]: {
                    display: "none",
                },
                "& .MuiDivider-root": {
                    borderBottomWidth: 0,
                },
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    background: "#cfc0c0ff",
                    borderRight: "none",
                },
            })}>
            <Box sx={{ padding: '2rem' }}>
                <Box sx={{ borderBottom: '1px solid #FFFFFF1A' }}>
                    {/* <img
                        onClick={() => { navigate(ROUTES.HOME) }}
                        src={null}
                        style={{
                            minWidth: '23.2rem',
                            minHeight: '3.9rem',
                            padding: '0rem 0rem 1.6rem 1.2rem',
                            cursor: 'pointer'
                        }} /> */}
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate({
                                        pathname: item.path,
                                        search: item.search
                                    });
                                    // onClose(); // đóng menu khi chọn
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />
        </Drawer>
    );
}
