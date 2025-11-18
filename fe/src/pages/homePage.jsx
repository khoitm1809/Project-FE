import { Box, Grid, Typography, Card, CardContent, CardHeader, Avatar, useTheme, useMediaQuery, Paper } from "@mui/material";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";

import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const revenueData = [
    { month: "T1", revenue: 45000000, orders: 120 },
    { month: "T2", revenue: 52000000, orders: 145 },
    { month: "T3", revenue: 48000000, orders: 130 },
    { month: "T4", revenue: 61000000, orders: 168 },
    { month: "T5", revenue: 55000000, orders: 152 },
    { month: "T6", revenue: 67000000, orders: 189 },
];


const Home = () => {
    const role = localStorage.getItem("role");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Box width="100%" p={2}>
            {/* TITLE */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={600} mb={1}>
                    Báo cáo
                </Typography>
                <Typography color="text.secondary">
                    Phân tích doanh thu và hiệu suất kinh doanh
                </Typography>
            </Box>

            {/* 4 CARDS WIDE FULL WIDTH */}
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    sm: "1fr 1fr",
                    lg: "repeat(4, 1fr)",
                }}
                gap={2}
                width="100%"
            >
                {/* CARD 1 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>
                                Tổng doanh thu
                            </Typography>
                            <Typography variant="h5" mt={1}>
                                328 triệu
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "green.100",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <DollarSign color="#16a34a" />
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={2} color="green.600">
                        <TrendingUp size={18} />
                        <Typography fontSize={14}>+12.5%</Typography>
                    </Box>
                </Paper>

                {/* CARD 2 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>
                                Đơn hàng
                            </Typography>
                            <Typography variant="h5" mt={1}>
                                904
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "blue.100",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ShoppingBag color="#2563eb" />
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={2} color="green.600">
                        <TrendingUp size={18} />
                        <Typography fontSize={14}>+8.2%</Typography>
                    </Box>
                </Paper>

                {/* CARD 3 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>
                                Giá trị TB
                            </Typography>
                            <Typography variant="h5" mt={1}>
                                36.3 triệu
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "purple.100",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <DollarSign color="#7e22ce" />
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={2} color="green.600">
                        <TrendingUp size={18} />
                        <Typography fontSize={14}>+3.8%</Typography>
                    </Box>
                </Paper>

                {/* CARD 4 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>
                                Tỷ lệ hoàn thành
                            </Typography>
                            <Typography variant="h5" mt={1}>
                                94.2%
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "orange.100",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TrendingUp color="#fb923c" />
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={2} color="red.600">
                        <TrendingDown size={18} />
                        <Typography fontSize={14}>-1.2%</Typography>
                    </Box>
                </Paper>
            </Box>

            {/* CHARTS FULL WIDTH */}
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    lg: "1fr 1fr",
                }}
                gap={2}
                width="100%"
                mt={3}
            >
                {/* CHART 1 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Doanh thu theo tháng
                    </Typography>

                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    fill="#93c5fd"
                                    name="Doanh thu"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* CHART 2 */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Số lượng đơn hàng
                    </Typography>

                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Đơn hàng"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;