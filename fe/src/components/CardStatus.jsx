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

// Ví dụ về cách mapping icon theo tên hoặc trạng thái
export const TodoIcons = {
    'tổng công việc': EventNoteOutlinedIcon,
    'chưa làm': PendingActionsOutlinedIcon,
    'chưa giao': AssignmentLateOutlinedIcon,
    'đang làm': AccessTimeOutlinedIcon,
    'đã xong': CheckCircleOutlineOutlinedIcon,
    'quá hạn': ErrorOutlineOutlinedIcon,
};

// Map màu sắc tương ứng (Tùy chọn, nên sử dụng theme colors)
const StatusColors = {
    'tổng công việc': '#3F51B5', // Indigo
    'chưa làm': '#FF9800', // Amber
    'chưa giao': '#F44336', // Red
    'đang làm': '#2196F3', // Blue
    'đã xong': '#4CAF50', // Green
    'quá hạn': '#E91E63', // Pink/Red đậm
};


const CardStatus = ({
    title = "Tiêu đề",
    count = 0,
    iconKey = 'tổng công việc'
}) => {
    const theme = useTheme();
    const IconComponent = TodoIcons[iconKey.toLowerCase()] || EventNoteOutlinedIcon;
    const cardColor = StatusColors[iconKey.toLowerCase()] || theme.palette.primary.main;
    const countColor = cardColor;

    return (
        <Card
            sx={{
                minHeight: '10rem',
                maxHeight: '10rem',
                borderRadius: "14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "0.25s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                },
            }}>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                >
                    {/* Icon */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: `${cardColor}1A`, // Màu icon nhạt hơn
                            color: cardColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <IconComponent sx={{ fontSize: 24 }} />
                    </Box>

                    {/* Số lượng */}
                    <Typography
                        variant="h3" // Số lượng lớn
                        fontWeight={700}
                        sx={{ color: countColor }}
                    >
                        {count.toLocaleString()}
                    </Typography>
                </Box>

                {/* Tiêu đề */}
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        fontSize: '1rem',
                    }}
                >
                    {title}
                </Typography>
            </CardContent>
        </Card >
    );
};

export default CardStatus;