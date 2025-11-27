import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme
} from "@mui/material";
// Import các Icon cần thiết từ Material Icons
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Column, Row } from "./commonStyled"; // Đảm bảo đường dẫn này đúng

// Ví dụ về cách mapping icon theo tên hoặc trạng thái
export const TodoIcons = {
    'tổng công việc': EventNoteOutlinedIcon,
    'chưa làm': PendingActionsOutlinedIcon,
    'chưa giao': AssignmentLateOutlinedIcon,
    'đang làm': AccessTimeOutlinedIcon,
    'đã xong': CheckCircleOutlineOutlinedIcon,
    'quá hạn': ErrorOutlineOutlinedIcon,
};

const CardTodo = ({
    name,
    count,
    children // Thêm children để chứa danh sách công việc chi tiết
}) => {
    // Lấy Icon Component tương ứng. Đảm bảo 'name' khớp với key trong TodoIcons
    const iconKey = name.toLowerCase().replace(/ /g, '');
    const IconComponent = TodoIcons[iconKey] || EventNoteOutlinedIcon;

    return (
        <Column sx={{ gap: '1rem' }}>
            {/* Header Card (Tên và số lượng công việc) */}
            <Card
                sx={{
                    width: '100%',
                    borderRadius: "14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "0.25s ease",
                    "&:hover": {
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)",
                    },
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '7rem',
                    maxHeight: '7rem',
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    {/* Icon */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: '#f2f2f2',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconComponent sx={{ fontSize: 24 }} />
                    </Box>

                    {/* Tên cột */}
                    <Typography color="black" fontWeight={600} variant="h6">
                        {name}
                    </Typography>
                </Box>

                {/* Số lượng */}
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    {count.toLocaleString()}
                </Typography>
            </Card >

            {/* Content (Danh sách công việc chi tiết) */}
            <Column
                gap={1.5}
                sx={{
                    width: '100%',
                    minHeight: '200px', // Cho phép cuộn
                    maxHeight: 'calc(100vh - 400px)',
                    overflowY: 'auto',
                    paddingRight: '4px',
                }}
            >
                {/* Phần tử con (children) sẽ được render ở đây */}
                {children}
            </Column>
        </Column>
    );
};

export default CardTodo;

<Row
    sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1.2rem",

        // MOBILE: xuống 1 cột
        "@media (max-width: 1000px)": {
            flexDirection: "column",
            alignItems: "stretch",
        },
    }}
>
    <Column sx={{
        width: '23%',
        "@media (max-width: 1000px)": {
            width: '100%'
        },
    }}>
        <CardTodo name={"Chưa giao"} count={123} />
    </Column>
</Row>