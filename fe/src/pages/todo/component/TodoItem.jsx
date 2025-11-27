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

export const TodoItem = ({ todo, onChangeStatus, onAssign, role }) => {
    const [status, setStatus] = useState(todo.toDoStatus);
    const [assignedUserId, setAssignedUserId] = useState(getInitialAssignedUserId(todo));
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);

    const isWorker = role === ROLES.WORKER;
    console.log(isWorker)

    const {
        data: listUser,
        isLoading: isLoadingUsers,
    } = useGetListUserQuery({
        role: ROLES.WORKER
    }, { refetchOnMountOrArgChange: true });

    const assignedUser = listUser?.find(user => user.id === assignedUserId);

    const assignedUserName = assignedUser
        ? assignedUser.username
        : getInitialAssignedUserName(todo); 

    const currentStatusProps = getStatusProps(status);

    useEffect(() => {
        setStatus(todo.toDoStatus);
        setAssignedUserId(getInitialAssignedUserId(todo));
    }, [todo]);

    const handleStatusChange = (newStatus) => {
        if (newStatus === 'unAssigned' && isWorker) {
            console.warn("Worker không được phép thay đổi trạng thái thành 'Chưa giao'.");
            return;
        }

        if (newStatus === 'unAssigned' && assignedUserId) {
            setAssignedUserId('');
            onAssign(todo.documentId, '');
        }

        // 3. Cập nhật trạng thái
        setStatus(newStatus);
        onChangeStatus(todo.documentId, newStatus);
        setOpenStatusDialog(false);
    };

    const handleAssign = (userId) => {
        setAssignedUserId(userId);
        if (userId && status === 'unAssigned') {
            setStatus('assigned');
            onChangeStatus(todo.documentId, 'assigned');
        }

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
                borderLeft: `5px solid ${currentStatusProps.color === 'default' ? '#ccc' : (theme) => theme.palette[currentStatusProps.color].main}`,
                minHeight: '13rem',
                maxHeight: '18rem'
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
                    disabled={isLoadingUsers || isWorker}
                    color={assignedUserId ? 'primary' : 'secondary'}
                    sx={{ textTransform: 'none', borderRadius: '20px' }}
                >
                    {isLoadingUsers ? <CircularProgress size={18} color="inherit" /> : assignedUserName}
                </Button>
            </Box>

            {/* Dialog Thay đổi Trạng thái */}
            <Dialog
                onClose={() => setOpenStatusDialog(false)}
                open={openStatusDialog}
                // NÂNG KÍCH THƯỚC DIALOG LÊN SM
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">Thay đổi Trạng thái</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenStatusDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        {/* ICON TO HƠN */}
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: 300 }}>
                    <List> {/* Bỏ dense để List Items to hơn */}
                        {todoStatus.map((s) => {
                            // LOGIC: Ngăn Worker chuyển về "unAssigned"
                            const isDisabled = isWorker && s.value === 'unAssigned';

                            return (
                                <ListItem
                                    button
                                    key={s.value}
                                    onClick={() => !isDisabled && handleStatusChange(s.value)}
                                    selected={status === s.value}
                                    disabled={isDisabled}
                                    sx={{
                                        py: 1.5, // Tăng padding
                                        '&.Mui-selected': {
                                            backgroundColor: (theme) => theme.palette[s.color === 'default' ? 'grey' : s.color].light,
                                        },
                                        '&:hover': {
                                            backgroundColor: (theme) => theme.palette[s.color === 'default' ? 'grey' : s.color].light,
                                            opacity: 0.8
                                        },
                                        // Thêm kiểu để làm mờ khi bị vô hiệu hóa
                                        ...(isDisabled && { opacity: 0.5, pointerEvents: 'none' })
                                    }}
                                >
                                    <Chip
                                        // NÂNG KÍCH THƯỚC CHIP
                                        label={s.label}
                                        size="medium" // Tăng từ small lên medium
                                        color={s.color === 'default' ? 'default' : s.color}
                                        // Dùng icon lớn hơn nếu cần, nhưng Chip thường giới hạn size icon
                                        icon={s.icon}
                                        variant={status === s.value ? 'filled' : 'outlined'}
                                        sx={{ minWidth: 150, fontSize: '1rem', height: 32 }} // Tăng minWidth và fontSize
                                    />
                                    <ListItemText
                                        // NÂNG KÍCH THƯỚC CHỮ
                                        primary={status === s.value ? ' (Đang chọn)' : (isDisabled ? ' (Worker không được chọn)' : '')}
                                        primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: status === s.value ? 600 : 400 }}
                                        sx={{ ml: 2 }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
            </Dialog>


            {/* Dialog Phân công */}
            <Dialog
                onClose={() => setOpenAssignDialog(false)}
                open={openAssignDialog}
                // NÂNG KÍCH THƯỚC DIALOG LÊN SM
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">Chọn người để phân công</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenAssignDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        {/* ICON TO HƠN */}
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ minHeight: 300 }}>
                    {isLoadingUsers ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress size={40} /> {/* Icon Loading to hơn */}
                        </Box>
                    ) : (
                        <List> {/* Bỏ dense để List Items to hơn */}
                            {/* Option 'Chưa phân công' */}
                            <ListItem
                                button
                                onClick={() => handleAssign('')}
                                selected={assignedUserId === ''}
                                sx={{ py: 1 }} // Tăng padding
                            >
                                <ListItemText
                                    // NÂNG KÍCH THƯỚC CHỮ
                                    primary="Chưa phân công"
                                    secondary="Gỡ bỏ phân công"
                                    primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: assignedUserId === '' ? 'bold' : 'normal' }}
                                    secondaryTypographyProps={{ fontSize: '0.9rem' }}
                                />
                            </ListItem>
                            {/* Danh sách người dùng */}
                            {listUser?.map((user) => (
                                <ListItem
                                    button
                                    key={user.id}
                                    onClick={() => handleAssign(user.id)}
                                    selected={assignedUserId === user.id}
                                    sx={{ py: 1 }} // Tăng padding
                                >
                                    <ListItemText
                                        // NÂNG KÍCH THƯỚC CHỮ
                                        primary={user.username}
                                        primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: assignedUserId === user.id ? 'bold' : 'normal' }}
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