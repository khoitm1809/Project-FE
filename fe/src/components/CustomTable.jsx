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
import { openAddModal, openEditModal } from '../store/helper/helperSlice';
import { DeleteButton, EditButton, Row } from './commonStyled';
import CardStatus from './CardStatus';

// --- Helper Functions ---
/**
 * Lấy giá trị theo đường dẫn (Path). KHÔNG xử lý logic sắp xếp/định dạng array tại đây.
 * Thay đổi: Để xử lý array linh hoạt hơn (ví dụ: lấy toàn bộ mảng records)
 */
const getValueByPath = (obj, path) => {
    if (!obj || !path) return null;

    const parts = path.split('.');

    // Nếu path là "pig_growth_records.weight", ta sẽ chỉ lấy mảng pig_growth_records
    // và để logic xử lý cân nặng (map, sort) cho formatValue.
    if (path.startsWith("pig_growth_records.")) {
        return obj.pig_growth_records;
    }

    // Xử lý thông thường cho các path khác
    return parts.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

/**
 * Định dạng giá trị, có xử lý riêng cho mảng pig_growth_records.
 * @param {string} key - key của cột.
 * @param {*} value - Giá trị thô.
 * @param {boolean} isArrayField - Cờ báo hiệu đây là trường array cần xử lý.
 */
const formatValue = (key, value, isArrayField = false) => {
    if (value === null || value === undefined) return "-";

    // --- Logic xử lý MẢNG đặc biệt (Chỉ áp dụng cho các cột được đánh dấu isArray) ---
    if (isArrayField && Array.isArray(value)) {
        // Trường hợp cụ thể: Cân nặng lợn
        if (key === "pig_growth_records.weight" && value.length > 0) {

            // 1. Sắp xếp theo recordDate tăng dần (từ cũ đến mới)
            const sortedRecords = value
                .slice()
                .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

            // 2. Lấy mảng cân nặng và định dạng
            const weights = sortedRecords.map(record => record.weight);
            // Trả về chuỗi định dạng mong muốn: [65kg, 70kg]
            return `[${weights.map(w => `${w}kg`).join(', ')}]`;
        }

        // Trường hợp mảng chung khác (nếu có, có thể cần logic tùy chỉnh khác)
        // Ví dụ: return value.join(', ');
        return value.toString();
    }

    // --- Logic xử lý giá trị đơn giản ---
    if (typeof value === "boolean") return value ? "true" : "false";
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("created_at")) {
        return dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : value;
    }
    return value;
};

const getStatusStyleMui = (value) => {
    // Giá trị đầu vào phải là chuỗi 'true'/'false' hoặc 'active'/'inactive'
    const lowerValue = String(value)?.toLowerCase();
    switch (lowerValue) {
        case "true": case "active": return { background: '#e8f5e9', color: '#388e3c' };
        case "inactive": return { background: '#fff3e0', color: '#f57c00' };
        case "false": return { background: '#ffebee', color: '#d32f2f' };
        default: return { background: (theme) => theme.palette.grey[100], color: (theme) => theme.palette.text.secondary };
    }
};

export default function CustomTable({
    title, // Thêm cấu trúc mới: { key: "...", label: "...", isArray: true }
    data,
    isEdit,
    detailNavigate, // Nếu có click vào row để sang trang chi tiết
    mutationDeleteFunction,
    loading,
    refetch,
    isListUser,
    invoice,
    invoiceSummary
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
                const rawValue = getValueByPath(item, col.key);

                // Sử dụng formatValue để có được giá trị đã định dạng (bao gồm cả chuỗi mảng)
                const value = formatValue(col.key, rawValue, col.isArray);

                // Chuyển đổi giá trị sang chuỗi để tìm kiếm
                return value?.toString()?.toLowerCase()?.includes(lowerSearch);
            })
        );
    }, [data, searchTerm, title]);

    // --- 3. Handle Delete ---
    const handleDelete = async (id) => {
        try {
            // Kiểm tra xem mutationDeleteFunction có tồn tại không
            if (mutationDeleteFunction) {
                await mutationDeleteFunction(id).unwrap();
                // Kiểm tra xem refetch có tồn tại không
                if (refetch) refetch();
            } else {
                console.warn("Delete function (mutationDeleteFunction) is not provided.");
            }
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
            {invoice && <Box marginY={'2rem'} width={'100%'}>
                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                }}>
                    {invoiceSummary?.map((card, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    sm: "1 1 calc(50% - 0.5rem)",
                                },
                                maxWidth: { lg: '50%' }
                            }}
                        >
                            <CardStatus
                                title={card.title}
                                count={card.count}
                                iconKey={card.iconKey}
                            />
                        </Box>
                    ))}
                </Row>

            </Box>}
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
                    // Phải đảm bảo openAddModal được import đúng
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
                            // Hiển thị Skeleton khi đang tải dữ liệu
                            [...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {title?.filter(col => col.key !== "password")?.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton variant="rectangular" width="90%" height={24} sx={{ borderRadius: 1 }} />
                                        </TableCell>
                                    ))}
                                    {isEdit && <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>}
                                </TableRow>
                            ))
                        ) : filteredData?.length > 0 ? (
                            // Hiển thị Dữ liệu
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

                                        // 1. Ép kiểu boolean thành chuỗi 'true'/'false' cho logic status
                                        const isStatusField = col?.key.toLowerCase().includes('status');
                                        const cellRawValue = isStatusField ? String(rawValue) : rawValue;

                                        // 2. Định dạng nội dung hiển thị (sử dụng formatValue và truyền cờ isArray)
                                        const displayContent = formatValue(col?.key, cellRawValue, col.isArray);

                                        // 3. Lấy style cho status
                                        const statusStyles = isStatusField ? getStatusStyleMui(cellRawValue) : {};


                                        return (
                                            <TableCell
                                                key={colIndex}
                                                onClick={() => detailNavigate && navigate(detailNavigate, { state: item?.documentId })}
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
                                                    {displayContent}
                                                </Typography>
                                            </TableCell>
                                        );
                                    })}
                                    {isEdit && (
                                        <TableCell>
                                            {/* Phải đảm bảo Row, EditButton, DeleteButton được import đúng */}
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
                            // Hiển thị thông báo không có dữ liệu
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