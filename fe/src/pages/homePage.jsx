import React from 'react';
import { 
    Box, Typography, Paper, useTheme, useMediaQuery 
} from '@mui/material';
import { 
    ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, 
    Tooltip, Legend, Area, BarChart, Bar 
} from 'recharts';
import { 
    TrendingUp, Home as HomeIcon, Grid, Layout 
} from 'lucide-react';
import { useMemo, useState } from "react";
import { useGetListPigQuery } from "../store/pig/pigAction";
import { useGetListAreaQuery } from "../store/area/areaAction";




const Home = () => {
    const role = localStorage.getItem("role");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {
        data: listPig,
        isLoading: loadingListPig,
    } = useGetListPigQuery(
        { refetchOnMountOrArgChange: true }
    );

    const {
        data: listArea,
        isLoading: loadingArea,
    } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true })

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

    // B. Dữ liệu cho biểu đồ KHU VỰC (Số lượng chuồng theo khu)
    const areaChartData = useMemo(() => {
        if (!listArea?.data) return []; // API của bạn trả về mảng trực tiếp, không có wrapper .data (theo JSON bạn gửi)

        return listArea?.data.map((area) => ({
            name: area.name,        // Tên khu (Khu 1, Khu 2...)
            barnCount: area.barns?.length || 0, // Đếm số lượng chuồng
            description: area.description
        }));
    }, [listArea]);

    // C. Tính toán số liệu tổng quan
    const totalPigs = listPig?.meta?.pagination?.total || listPig?.data?.length || 0;
    const totalAreas = listArea?.data?.length || 0;
    // Tính tổng số chuồng bằng cách cộng dồn mảng barns trong từng khu
    const totalBarns = listArea?.data?.reduce((acc, area) => acc + (area.barns?.length || 0), 0) || 0;
    return (
        <Box width="100%" p={2}>
            {/* TITLE */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={600} mb={1}>
                    Dashboard Quản Lý
                </Typography>
                <Typography color="text.secondary">
                    Tổng quan trang trại và hiệu suất chăn nuôi
                </Typography>
            </Box>

            {/* --- CARDS THỐNG KÊ (CẬP NHẬT DỮ LIỆU THẬT) --- */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }}
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

                {/* CARD 2: TỔNG SỐ KHU VỰC (Mới) */}
                <Paper elevation={2} sx={{ p: 3 }}>
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
                </Paper>

                {/* CARD 3: TỔNG SỐ CHUỒNG (Mới) */}
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

                {/* CARD 4: TRUNG BÌNH (Ví dụ tính toán) */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="text.secondary" fontSize={14}>Mật độ trung bình</Typography>
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
            </Box>

            {/* --- CHARTS --- */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
                gap={2}
                width="100%"
                mt={3}
            >
                {/* CHART 1: AREA CHART - BIẾN ĐỘNG CÂN NẶNG HEO (Giữ nguyên) */}
                <Paper elevation={2} sx={{ p: 3 }}>
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

                {/* CHART 2: BAR CHART - CƠ CẤU CHUỒNG TRẠI (Dùng Area Data mới) */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>Số lượng chuồng theo khu vực</Typography>
                    <Box width="100%" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={areaChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} /> {/* Số chuồng là số nguyên */}
                                <Tooltip formatter={(value) => [`${value} chuồng`]} />
                                <Legend />
                                <Bar
                                    dataKey="barnCount"
                                    name="Số lượng chuồng"
                                    fill="#82ca9d"
                                    barSize={50}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;