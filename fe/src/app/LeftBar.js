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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routerConstants";




export default function LeftBar({ open, onClose, drawerWidth }) {
    const navigate = useNavigate();

    const menuItems = [
        { text: "Home", icon: null, path: ROUTES.HOME },
        { text: "Quản lý tài khoản", icon: null, path: ROUTES.HOME },
        { text: "Quản lý gói dịch vụ", icon: null, path: ROUTES.HOME },
        { text: "Settings", icon: null, path: ROUTES.HOME },
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
            })}
        >
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
