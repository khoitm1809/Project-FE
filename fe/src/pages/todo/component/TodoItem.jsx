import { useEffect, useState } from "react";
import { useGetListUserQuery } from "../../../store/auth/authAction";
import { ROLES } from "../../../utils/rolesConstant";
import {
    Box,
    Card,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Chip,
    IconButton,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

// Định nghĩa trạng thái và màu sắc tương ứng
const todoStatus = [
    { value: "unAssigned", label: "Chưa giao", color: "default", icon: <PendingIcon fontSize="small" /> },
    { value: "assigned", label: "Đã giao", color: "primary", icon: <AssignmentIcon fontSize="small" /> },
    { value: "doing", label: "Đang làm", color: "info", icon: <AccessTimeIcon fontSize="small" /> },
    { value: "done", label: "Đã xong", color: "success", icon: <CheckCircleOutlineIcon fontSize="small" /> },
    { value: "expired", label: "Quá hạn", color: "error", icon: <CancelIcon fontSize="small" /> }
];

// Hàm tìm thông tin trạng thái theo value
const getStatusProps = (statusValue) => {
    return todoStatus.find(s => s.value === statusValue);
};

// Hàm lấy ID người được phân công từ đối tượng todo
const getInitialAssignedUserId = (todo) => {
    // SỬA: Lấy ID từ trường users_permissions_user
    if (todo.users_permissions_user && typeof todo.users_permissions_user === 'object') {
        return todo.users_permissions_user.id || '';
    }
    // Trường này nên được sử dụng nếu user là ID thuần túy (ít phổ biến trong quan hệ)
    return todo.users_permissions_user || ''; 
};

// Hàm lấy tên người được phân công (được sử dụng cho lần render đầu tiên)
const getInitialAssignedUserName = (todo) => {
    // SỬA: Lấy username từ trường users_permissions_user
    if (todo.users_permissions_user && typeof todo.users_permissions_user === 'object') {
        return todo.users_permissions_user.username || 'Người dùng không tên';
    }
    return 'Chưa phân công';
}

export const TodoItem = ({ todo, onChangeStatus, onAssign }) => {
    const [status, setStatus] = useState(todo.toDoStatus);
    // Sử dụng hàm khởi tạo mới để đọc ID
    const [assignedUserId, setAssignedUserId] = useState(getInitialAssignedUserId(todo));
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);

    const {
        data: listUser,
        isLoading: isLoadingUsers,
    } = useGetListUserQuery({
        role: ROLES.WORKER
    }, { refetchOnMountOrArgChange: true });

    // 1. Tìm tên người được phân công trong danh sách worker
    const assignedUser = listUser?.find(user => user.id === assignedUserId);

    // 2. Tên hiển thị: Nếu tìm thấy trong listUser, dùng username. 
    // Nếu chưa tìm thấy (do listUser đang load hoặc ID tồn tại nhưng user không có trong list), dùng tên từ dữ liệu todo ban đầu.
    const assignedUserName = assignedUser
        ? assignedUser.username
        : getInitialAssignedUserName(todo); // Dùng tên ban đầu nếu có

    const currentStatusProps = getStatusProps(status);

    useEffect(() => {
        // Cập nhật state khi prop todo thay đổi (chủ yếu sau khi API gọi thành công)
        setStatus(todo.toDoStatus);
        setAssignedUserId(getInitialAssignedUserId(todo));
    }, [todo]);

    // --- Xử lý trạng thái ---
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        // TRUYỀN todo.documentId (ID thực sự của document) và trạng thái mới
        onChangeStatus(todo.documentId, newStatus);
        setOpenStatusDialog(false);
    };

    // --- Xử lý phân công ---
    const handleAssign = (userId) => {
        setAssignedUserId(userId);
        // TRUYỀN todo.documentId (ID thực sự của document) và userId mới
        onAssign(todo.documentId, userId);
        setOpenAssignDialog(false);
    };

    return (
        <Card
            sx={{
                p: 2,
                borderRadius: '10px',
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                mb: 1.5,
                // Lấy màu từ theme palette
                borderLeft: `5px solid ${currentStatusProps.color === 'default' ? '#ccc' : (theme) => theme.palette[currentStatusProps.color].main}`
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="body1" fontWeight={600} sx={{ flexGrow: 1 }}>{todo.name}</Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" component="div" mb={1}>
                {todo.description}
            </Typography>

            {/* Hiển thị ngày tạo/cập nhật */}
            <Box mb={1}>
                <Typography variant="caption" color="text.hint">
                    Tạo lúc: {new Date(todo.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <Box mt={1.5} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">

                {/* Nút thay đổi Trạng thái */}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenStatusDialog(true)}
                    endIcon={<ArrowDropDownIcon />}
                    color={currentStatusProps.color === 'default' ? 'inherit' : currentStatusProps.color}
                    sx={{ textTransform: 'none', borderRadius: '20px' }}
                >
                    {currentStatusProps.icon}
                    <Box component="span" ml={0.5}>{currentStatusProps.label}</Box>
                </Button>

                {/* Nút Phân công */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={assignedUserId ? <PersonIcon /> : <PersonAddIcon />}
                    onClick={() => setOpenAssignDialog(true)}
                    disabled={isLoadingUsers}
                    color={assignedUserId ? 'primary' : 'secondary'}
                    sx={{ textTransform: 'none', borderRadius: '20px' }}
                >
                    {isLoadingUsers ? <CircularProgress size={18} color="inherit" /> : assignedUserName}
                </Button>
            </Box>

            {/* Dialog Thay đổi Trạng thái (Giữ nguyên) */}
            <Dialog onClose={() => setOpenStatusDialog(false)} open={openStatusDialog}>
                <DialogTitle>
                    Thay đổi Trạng thái
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenStatusDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <List dense>
                        {todoStatus.map((s) => (
                            <ListItem
                                button
                                key={s.value}
                                onClick={() => handleStatusChange(s.value)}
                                selected={status === s.value}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: (theme) => theme.palette[s.color === 'default' ? 'grey' : s.color].light,
                                    },
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette[s.color === 'default' ? 'grey' : s.color].light,
                                        opacity: 0.8
                                    }
                                }}
                            >
                                <Chip
                                    label={s.label}
                                    size="small"
                                    color={s.color === 'default' ? 'default' : s.color}
                                    icon={s.icon}
                                    variant={status === s.value ? 'filled' : 'outlined'}
                                    sx={{ minWidth: 100 }}
                                />
                                <ListItemText primary={status === s.value ? ' (Đang chọn)' : ''} sx={{ ml: 1 }} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>


            {/* Dialog Phân công (Giữ nguyên) */}
            <Dialog onClose={() => setOpenAssignDialog(false)} open={openAssignDialog}>
                <DialogTitle>
                    Chọn người để phân công
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenAssignDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {isLoadingUsers ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List dense>
                            {/* Option 'Chưa phân công' */}
                            <ListItem
                                button
                                onClick={() => handleAssign('')}
                                selected={assignedUserId === ''}
                            >
                                <ListItemText
                                    primary="Chưa phân công"
                                    secondary="Gỡ bỏ phân công"
                                    primaryTypographyProps={{ fontWeight: assignedUserId === '' ? 'bold' : 'normal' }}
                                />
                            </ListItem>
                            {/* Danh sách người dùng */}
                            {listUser?.map((user) => (
                                <ListItem
                                    button
                                    key={user.id}
                                    onClick={() => handleAssign(user.id)}
                                    selected={assignedUserId === user.id}
                                >
                                    <ListItemText
                                        primary={user.username}
                                        primaryTypographyProps={{ fontWeight: assignedUserId === user.id ? 'bold' : 'normal' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
};