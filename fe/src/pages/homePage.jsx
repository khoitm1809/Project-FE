import React from 'react';
import {
    Box, Typography, Paper, useTheme, useMediaQuery
} from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Layout, Home as HomeIcon, Grid, ListChecks, Activity, Package } from 'lucide-react'
import { useMemo, useState } from "react";
import { useGetListPigQuery } from "../store/pig/pigAction";
import { useGetListAreaQuery } from "../store/area/areaAction";
import { useGetListTodoQuery } from '../store/todo/todoAction';
import { useGetListInvoiceQuery } from '../store/invoice/invoiceApi';
import { ROLES } from '../utils/rolesConstant';
import { useGetListWarehouseCategoryQuery } from '../store/warehouse/warehouseAction';


const PIE_CHART_COLORS = {
    'done': '#10b981',
    'doing': '#3b82f6',
    'unAssigned': '#fb923c',
    'pending': '#f59e0b',
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};


const Home = () => {
    const UID = localStorage.getItem("UID");
    const role = localStorage.getItem("role");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { data: listPig, isLoading: loadingListPig } = useGetListPigQuery({ refetchOnMountOrArgChange: true });
    const { data: listArea, isLoading: loadingArea } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true });
    const { data: listTodo, isLoading: loadingListTodo } = useGetListTodoQuery({ UID: role == ROLES.OWNER ? null : UID }, { refetchOnMountOrArgChange: true });
    const { data: invoice, isLoading: loadingInvoice } = useGetListInvoiceQuery({}, { skip: role == ROLES.WORKER, refetchOnMountOrArgChange: true });

    const {
        data: listWareHouseCategory,
    } = useGetListWarehouseCategoryQuery({}, { refetchOnMountOrArgChange: true });

    const pigChartData = useMemo(() => {
        if (!listPig?.data) return [];
        const sortedData = [...listPig.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return sortedData.map((pig) => ({
            date: new Date(pig.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            fullDate: new Date(pig.createdAt).toLocaleDateString('vi-VN'),
            weight: pig.weight,
            pigCode: pig.pigCode
        }));
    }, [listPig]);

    const areaChartData = useMemo(() => {
        if (!listArea?.data) return [];
        return listArea?.data.map((area) => ({
            name: area.name,
            barnCount: area.barns?.length || 0,
            description: area.description
        }));
    }, [listArea]);

    const totalPigs = listPig?.meta?.pagination?.total || listPig?.data?.length || 0;
    const totalAreas = listArea?.data?.length || 0;
    const totalBarns = listArea?.data?.reduce((acc, area) => acc + (area.barns?.length || 0), 0) || 0;

    const todoStatusChartData = useMemo(() => {
        if (!listTodo?.data) return [];
        const statusCounts = listTodo.data.reduce((acc, todo) => {
            const status = todo.toDoStatus || 'unAssigned';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(statusCounts).map(status => ({
            name: status,
            value: statusCounts[status],
            color: PIE_CHART_COLORS[status] || '#94a3b8'
        }));
    }, [listTodo]);

    const totalTodos = listTodo?.data?.length || 0;
    const doingTodos = todoStatusChartData.find(item => item.name === 'doing')?.value || 0;

    const totalRevenue = useMemo(() => {
        if (!invoice?.data) return 0;
        return invoice.data.reduce((acc, inv) => {
            const price = Number(inv.price) || 0;
            return acc + price;
        }, 0);
    }, [invoice]);


    const { totalWarehouseItems, warehouseCategoryChartData } = useMemo(() => {
        if (!listWareHouseCategory?.data) {
            return { totalWarehouseItems: 0, warehouseCategoryChartData: [] };
        }

        let totalItems = 0;
        const chartData = listWareHouseCategory.data.map((category) => {
            const categoryTotalQuantity = category.warehouse_items?.reduce((sum, item) => {
                const quantity = Number(item.quantity) || 0;
                return sum + quantity;
            }, 0) || 0;

            totalItems += categoryTotalQuantity;

            return {
                name: category.name,
                quantity: categoryTotalQuantity,
            };
        });

        return { totalWarehouseItems: totalItems, warehouseCategoryChartData: chartData };
    }, [listWareHouseCategory]);


    return (
        <Box width="100%" p={2}>
            {/* TITLE */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={600} mb={1}>
                    Dashboard Quản Lý 🐷
                </Typography>
                <Typography color="text.secondary">
                    Tổng quan trang trại và hiệu suất chăn nuôi
                </Typography>
            </Box>

            {/* --- CARDS THỐNG KÊ (CẬP NHẬT DỮ LIỆU THẬT) --- */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)", lg: "repeat(7, 1fr)" }} // Thay đổi layout
                gap={2}
                width="100%"
            >
                {/* CARD 1: TỔNG SỐ HEO */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng số heo</Typography>
                            <Typography variant="h5" mt={1}>{totalPigs}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "green.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TrendingUp color="#16a34a" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Dữ liệu từ nhập kho</Typography>
                </Paper>

                {/* CARD 2: TỔNG SỐ KHU VỰC */}
                {role == ROLES.OWNER && <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng khu vực</Typography>
                            <Typography variant="h5" mt={1}>{totalAreas}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "blue.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Layout color="#2563eb" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Khu chăn nuôi chính</Typography>
                </Paper>}

                {/* CARD 3: TỔNG SỐ CHUỒNG */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng số chuồng</Typography>
                            <Typography variant="h5" mt={1}>{totalBarns}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "orange.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <HomeIcon color="#fb923c" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Sức chứa toàn trại</Typography>
                </Paper>

                {/* CARD 4: MẬT ĐỘ TRUNG BÌNH */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Mật độ TB</Typography>
                            <Typography variant="h5" mt={1}>
                                {totalBarns > 0 ? (totalPigs / totalBarns).toFixed(1) : 0}
                            </Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "purple.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Grid color="#7e22ce" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Heo / Chuồng</Typography>
                </Paper>

                {/* CARD 5: TỔNG CÔNG VIỆC */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng công việc</Typography>
                            <Typography variant="h5" mt={1}>{totalTodos}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "pink.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ListChecks color="#db2777" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">{doingTodos} đang thực hiện</Typography>
                </Paper>

                {/* CARD 6: TỔNG DOANH THU */}
                {role == ROLES.OWNER && <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng doanh thu</Typography>
                            <Typography variant="h5" mt={1}>{formatCurrency(totalRevenue)}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "red.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Activity color="#dc2626" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Từ hóa đơn xuất chuồng</Typography>
                </Paper>}

                {/* CARD 7: TỔNG HÀNG TRONG KHO (MỚI) */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Tổng hàng trong kho</Typography>
                            <Typography variant="h5" mt={1}>{totalWarehouseItems}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, bgcolor: "amber.100", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package color="#f59e0b" />
                        </Box>
                    </Box>
                    <Typography fontSize={12} mt={2} color="text.secondary">Tổng số lượng tồn</Typography>
                </Paper>
            </Box>

            <hr style={{ margin: '24px 0' }} />

            {/* --- CHARTS --- */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", lg: "repeat(3, 1fr)" }}
                gap={2}
                width="100%"
                mt={3}
            >
                {/* CHART 1: AREA CHART - BIẾN ĐỘNG CÂN NẶNG HEO (Giữ nguyên) */}
                <Paper elevation={2} sx={{ p: 3, gridColumn: { xs: "span 1", lg: "span 2" } }}>
                    <Typography variant="h6" mb={2}>Biến động cân nặng nhập kho</Typography>
                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pigChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip labelFormatter={(label, p) => p?.[0] ? `Ngày: ${p[0].payload.fullDate}` : label} formatter={(value, name, props) => [`${value} kg`, `Mã: ${props.payload.pigCode}`]} />
                                <Legend />
                                <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="#93c5fd" name="Cân nặng (kg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* CHART 2: PIE CHART - TÌNH TRẠNG CÔNG VIỆC (Giữ nguyên) */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>Tình trạng công việc</Typography>
                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={todoStatusChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={isMobile ? 80 : 120}
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {todoStatusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} công việc`, name]} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* BAR CHART - SỐ LƯỢNG HÀNG TỒN THEO DANH MỤC KHO (NEW) */}
                <Paper elevation={2} sx={{ p: 3, gridColumn: { xs: "span 1", lg: "span 3" } }}>
                    <Typography variant="h6" mb={2}>Số lượng hàng tồn theo Danh mục Kho</Typography>
                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={warehouseCategoryChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={50} />
                                <YAxis allowDecimals={false} />
                                <Tooltip formatter={(value) => [`${value} đơn vị`]} />
                                <Legend />
                                <Bar
                                    dataKey="quantity"
                                    name="Tổng số lượng tồn"
                                    fill="#f59e0b"
                                    barSize={isMobile ? 20 : 50}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* BAR CHART - SỐ LƯỢNG CHUỒNG THEO KHU VỰC (Đẩy xuống dưới nếu là Owner) */}
                {role == ROLES.OWNER &&
                    <Paper elevation={2} sx={{ p: 3, gridColumn: { xs: "span 1", lg: "span 3" } }}>
                        <Typography variant="h6" mb={2}>Số lượng chuồng theo khu vực</Typography>
                        <Box width="100%" height={350}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={areaChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip formatter={(value) => [`${value} chuồng`]} />
                                    <Legend />
                                    <Bar
                                        dataKey="barnCount"
                                        name="Số lượng chuồng"
                                        fill="#82ca9d"
                                        barSize={isMobile ? 20 : 50}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>}

            </Box>
        </Box >
    );
}
export default Home;