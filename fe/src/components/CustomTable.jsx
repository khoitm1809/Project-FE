import * as React from 'react';
import { useDispatch } from 'react-redux'; // REDUX

import { useNavigate } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import dayjs from 'dayjs';
import { Row, EditButton, DeleteButton } from './commonStyled';
import { openAddModal, openEditModal } from '../store/helper/helperSlice';

// --- Helper Functions ---
const getValueByPath = (obj, path) => {
    if (!obj || !path) return null;
    return path.split('.')?.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

const formatValue = (key, value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("created_at")) {
        return dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : value;
    }
    return value;
};

const getStatusStyleMui = (value) => {
    const lowerValue = String(value)?.toLowerCase();
    switch (lowerValue) {
        case "true": case "active": return { background: '#e8f5e9', color: '#388e3c' };
        case "inactive": return { background: '#fff3e0', color: '#f57c00' };
        case "false": return { background: '#ffebee', color: '#d32f2f' };
        default: return { background: (theme) => theme.palette.grey[100], color: (theme) => theme.palette.text.secondary };
    }
};

export default function CustomTable({
    title,
    data,
    isEdit,
    detailNavigate, // Nếu có click vào row để sang trang chi tiết
    mutationDeleteFunction,
    loading,
    refetch,
    isListUser
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Hook để bắn action Redux
    // --- 1. State Search Local ---
    const [searchTerm, setSearchTerm] = React.useState('');

    // --- 2. Logic Filter Dữ liệu ---
    const filteredData = React.useMemo(() => {
        if (!searchTerm) return data;
        const lowerSearch = searchTerm.toLowerCase();

        return data?.filter((item) =>
            title?.some((col) => {
                const value = getValueByPath(item, col.key);
                return value?.toString()?.toLowerCase()?.includes(lowerSearch);
            })
        );
    }, [data, searchTerm, title]);

    // --- 3. Handle Delete ---
    const handleDelete = async (id) => {
        try {
            await mutationDeleteFunction(id).unwrap();
            refetch();
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    return (
        <Box>
            {/* Title Section */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                    Danh sách sản phẩm
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Quản lý toàn bộ sản phẩm
                </Typography>
            </Box>

            {/* --- Toolbar: Search, Filter, Add --- */}
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
                mb={2}
                sx={{ width: "100%" }}
            >
                {/* Ô Tìm kiếm */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchOutlinedIcon sx={{ color: "action.active", mr: 1 }} />
                        ),
                        sx: {
                            backgroundColor: "#f2f2f2",
                            borderRadius: "8px",
                            height: "44px",
                            paddingLeft: "8px",
                            "& fieldset": { border: "none" },
                        },
                    }}
                />

                {/* Nút Lọc */}
                <Button
                    variant="outlined"
                    startIcon={<TuneOutlinedIcon />}
                    sx={{
                        height: "44px",
                        minWidth: { xs: "100%", sm: "auto" },
                        bgcolor: "#fff",
                        borderColor: "#ccc",
                        color: "#333",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#f7f7f7" },
                    }}
                >
                    Lọc
                </Button>

                {/* Nút Thêm mới (Gọi Redux Action) */}
                <Button
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => dispatch(openAddModal())}
                    sx={{
                        height: "44px",
                        width: { xs: "100%", sm: "10rem" },
                        bgcolor: "#000",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { bgcolor: "#222" },
                    }}
                >
                    Thêm mới
                </Button>
            </Box>

            {/* --- Table Section --- */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, width: "100%", overflowX: "auto" }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
                            {title?.filter(col => col.key !== "password")?.map((col, i) => (
                                <TableCell key={i} sx={{ fontWeight: 600, padding: '12px 16px' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            {isEdit && (
                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>
                                    Hành động
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {title?.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton variant="rectangular" width="90%" height={24} sx={{ borderRadius: 1 }} />
                                        </TableCell>
                                    ))}
                                    {isEdit && <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>}
                                </TableRow>
                            ))
                        ) : filteredData?.length > 0 ? (
                            filteredData?.map((item, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    sx={{
                                        '&:last-child td': { borderBottom: 'none' },
                                        '&:hover': { backgroundColor: detailNavigate ? (theme) => theme.palette.action.hover : 'inherit' },
                                    }}
                                >
                                    {title?.filter(col => col.key !== "password")?.map((col, colIndex) => {
                                        const rawValue = getValueByPath(item, col?.key);
                                        const isStatusField = col?.key.toLowerCase().includes('status');
                                        const cellContent = formatValue(col?.key, rawValue);
                                        const statusStyles = isStatusField ? getStatusStyleMui(rawValue) : {};

                                        return (
                                            <TableCell
                                                key={colIndex}
                                                onClick={() => detailNavigate && navigate(detailNavigate)}
                                                sx={{ cursor: detailNavigate ? "pointer" : "default" }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    component="span"
                                                    sx={{
                                                        ...(isStatusField ? {
                                                            padding: '4px 10px',
                                                            borderRadius: '16px',
                                                            fontWeight: 500,
                                                            display: 'inline-block',
                                                            ...statusStyles,
                                                        } : {}),
                                                        color: isStatusField ? statusStyles.color : (theme) => theme.palette.text.secondary
                                                    }}
                                                >
                                                    {cellContent}
                                                </Typography>
                                            </TableCell>
                                        );
                                    })}
                                    {isEdit && (
                                        <TableCell>
                                            <Row gap={'0.5rem'}>
                                                {/* Nút Sửa (Gọi Redux Action, truyền item) */}
                                                <EditButton onClick={() => dispatch(openEditModal(item))} sx={{ '& svg': { fontSize: '1.1rem' } }}>
                                                    <ModeEditOutlineOutlinedIcon />
                                                </EditButton>

                                                {/* Nút Xóa (Xử lý trực tiếp tại đây) */}
                                                <DeleteButton onClick={() => handleDelete(isListUser ? item?.id : item?.documentId ?? item?.id)} sx={{ '& svg': { fontSize: '1.1rem' } }}>
                                                    <DeleteOutlineOutlinedIcon />
                                                </DeleteButton>
                                            </Row>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={title?.length + (isEdit ? 1 : 0)} align="center">
                                    <Typography variant="body1" sx={{ color: 'text.secondary', py: 3 }}>
                                        Không có dữ liệu nào phù hợp.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}