import { useState, useEffect } from 'react';
import { BoxContainer, Column, Row } from "../../components/commonStyled";
import { useAddTodoMutation, useEditTodoMutation, useGetListTodoQuery } from "../../store/todo/todoAction"; // useDeleteTodoMutation đã xóa
import { Button, TextField, Typography, Box, Card, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material"; // CircularProgress thêm vào cho loading
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardTodo from "../../components/CardTodo";
import CardStatus from "../../components/CardStatus";
import { useGetListUserQuery } from '../../store/auth/authAction';
import { ROLES } from '../../utils/rolesConstant';
import { TodoItem } from './component/TodoItem';
import { AddTodoDialog } from './component/AddTodoDialog';


// Cố định danh sách trạng thái
export const todoStatus = [
    { value: "unAssigned", label: "Chưa giao" },
    { value: "assigned", label: "Đã giao" },
    { value: "doing", label: "Đang làm" },
    { value: "done", label: "Đã xong" },
    { value: "expired", label: "Quá hạn" }
];

// Định nghĩa cột hiển thị chính
const COLUMN_STATUS = ['unAssigned', 'assigned', 'doing', 'done'];

const TodoPage = () => {
    const UID = localStorage.getItem("UID");
    const [addTodo, { isLoading: isAddingTodo }] = useAddTodoMutation();
    const [editTodo] = useEditTodoMutation();
    const {
        data: listDoto,
        isLoading: loadingListTodo,
        refetch
    } = useGetListTodoQuery({},
        { refetchOnMountOrArgChange: true }
    );

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const toggleAddDialog = () => setIsAddDialogOpen(!isAddDialogOpen);


    // --- LOGIC PHÂN LOẠI CÔNG VIỆC ---
    const classifiedTodos = COLUMN_STATUS.reduce((acc, status) => {
        acc[status] = [];
        return acc;
    }, { expired: [] }); // Vẫn giữ expired cho thống kê

    let totalCount = 0;

    if (listDoto?.data) {
        listDoto.data.forEach(todo => {
            const status = todo.toDoStatus;
            if (classifiedTodos.hasOwnProperty(status)) {
                classifiedTodos[status].push(todo);
            } else if (status === 'expired') {
                classifiedTodos.expired.push(todo); // Đưa expired vào để tính count
            }
            totalCount++;
        });
    }

    // --- CẬP NHẬT DỮ LIỆU THỐNG KÊ TỔNG QUAN ---
    const todoData = [
        { title: 'Tổng công việc', count: totalCount, iconKey: 'tổng công việc' },
        { title: 'Đã giao', count: classifiedTodos.assigned.length, iconKey: 'chưa làm' },
        { title: 'Chưa giao', count: classifiedTodos.unAssigned.length, iconKey: 'chưa giao' },
        { title: 'Đang làm', count: classifiedTodos.doing.length, iconKey: 'đang làm' },
        { title: 'Đã xong', count: classifiedTodos.done.length, iconKey: 'đã xong' },
        { title: 'Quá hạn', count: classifiedTodos.expired.length, iconKey: 'quá hạn' },
    ];

    // --- HANDLER THÊM MỚI ---
    const handleAddTodo = async ({ name, description }) => {
        try {
            await addTodo({ name, description, toDoStatus: 'unAssigned', create_by: UID }).unwrap();
            toggleAddDialog();
            refetch();
        } catch (error) {
            console.error('Lỗi khi thêm mới công việc:', error);
            // Thêm thông báo lỗi cho người dùng ở đây
        }
    };

    // --- HANDLER THAY ĐỔI TRẠNG THÁI ---
    const handleChangeStatus = async (todoId, newStatus) => {
        try {
            await editTodo({ id: todoId, toDoStatus: newStatus }).unwrap();
            refetch();
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái cho todo ${todoId}:`, error);
        }
    };

    // --- HANDLER PHÂN CÔNG ---
    const handleAssign = async (todoId, userId) => {
        try {
            // Nếu có phân công, chuyển trạng thái sang 'assigned' (trừ khi là null/empty, thì chuyển sang 'unAssigned')
            const newStatus = userId ? 'assigned' : 'unAssigned';
            await editTodo({ id: todoId, users_permissions_user: userId || null, toDoStatus: newStatus }).unwrap();
            refetch();
        } catch (error) {
            console.error(`Lỗi khi phân công cho todo ${todoId}:`, error);
        }
    };


    return (
        <BoxContainer padding={'2rem'}>
            <Box mb={4}>
                {/* Tiêu đề & Mô tả */}
                <Box sx={{ marginBottom: '2rem' }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        Quản lý công việc 📋
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary">
                        Quản lý và phân công công việc cho đội ngũ
                    </Typography>
                </Box>

                {/* Thẻ thống kê tổng quan */}
                <Row
                    sx={{
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: '0.8rem',
                    }}>
                    {todoData.map((item, index) => (
                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 100%", // Mobile
                                    sm: "1 1 calc(50% - 0.8rem)", // Tablet
                                    md: "1 1 calc(33.33% - 0.8rem)", // PC
                                    lg: "1 1 calc(16.66% - 0.8rem)", // Lớn hơn
                                },
                            }}
                            key={index}>
                            <CardStatus
                                title={item.title}
                                count={item.count}
                                iconKey={item.iconKey}
                            />
                        </Box>
                    ))}
                </Row>

                {/* Thanh tìm kiếm, lọc và thêm mới */}
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={2}
                    mb={3}
                    mt={3}
                    sx={{ width: "100%" }}>
                    <TextField
                        // ... style cho search field (giữ nguyên)
                        fullWidth
                        placeholder="Tìm kiếm..."
                        InputProps={{
                            startAdornment: (
                                <SearchOutlinedIcon sx={{ color: "action.active", mr: 1 }} />
                            ),
                            sx: {
                                backgroundColor: "#f2f2f2",
                                borderRadius: "8px",
                                height: "44px",
                                paddingLeft: "8px",
                                border: "none",
                                "& fieldset": { border: "none" },
                                "&:hover fieldset": { border: "none" },
                                "&.Mui-focused fieldset": { border: "none" },
                            },
                        }}
                    />

                    <Button
                        startIcon={<TuneOutlinedIcon />}
                        sx={{
                            color: 'black',
                            background: 'white',
                            height: "44px",
                            minWidth: { xs: "100%", sm: "auto" },
                            textTransform: "none",
                        }}
                    >
                        Lọc
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddOutlinedIcon />}
                        onClick={toggleAddDialog}
                        sx={{
                            color: 'white',
                            background: 'black',
                            height: "44px",
                            width: { xs: "100%", sm: "10rem" },
                            textTransform: "none",
                        }}
                    >
                        Thêm mới
                    </Button>
                </Box>

                {/* HIỂN THỊ CÁC CỘT CÔNG VIỆC */}
                {loadingListTodo ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                        <Typography ml={2}>Đang tải danh sách công việc...</Typography>
                    </Box>
                ) : (
                    <Row
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1.2rem",
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignItems: "flex-start", // Quan trọng cho bố cục cột

                            "@media (max-width: 1000px)": {
                                flexDirection: "column",
                                alignItems: "stretch",
                            },
                        }}
                    >
                        {/* Lặp qua 4 cột trạng thái chính */}
                        {COLUMN_STATUS.map(statusKey => {
                            const statusLabel = todoStatus.find(s => s.value === statusKey)?.label || statusKey;

                            return (
                                <Column
                                    key={statusKey}
                                    sx={{
                                        width: { xs: '23%', sm: '100%', md: '100%', lg: '23%' }, // 4 cột cho md trở lên
                                        minHeight: '200px', // Đảm bảo cột có chiều cao
                                    }}
                                >
                                    <CardTodo name={statusLabel} count={classifiedTodos[statusKey]?.length || 0}>
                                        {classifiedTodos[statusKey]?.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onChangeStatus={handleChangeStatus}
                                                onAssign={handleAssign}
                                            />
                                        ))}
                                    </CardTodo>
                                </Column>
                            );
                        })}
                    </Row>
                )}

            </Box>

            {/* Component Dialog thêm mới */}
            <AddTodoDialog
                open={isAddDialogOpen}
                handleClose={toggleAddDialog}
                handleAddTodo={handleAddTodo}
                isLoading={isAddingTodo}
            />
        </BoxContainer>
    );
}

export default TodoPage;