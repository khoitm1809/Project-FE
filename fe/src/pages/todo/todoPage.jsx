import { useState, useEffect } from 'react';
import { BoxContainer, Column, Row } from "../../components/commonStyled";
import { useAddTodoMutation, useEditTodoMutation, useGetListTodoQuery } from "../../store/todo/todoAction";
import { Button, TextField, Typography, Box, CircularProgress, Alert } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardTodo from "../../components/CardTodo";
import CardStatus from "../../components/CardStatus";
import { TodoItem } from './component/TodoItem';
import { AddTodoDialog } from './component/AddTodoDialog';
import { ROLES } from '../../utils/rolesConstant';


// Cố định danh sách trạng thái
export const todoStatus = [
    { value: "unAssigned", label: "Chưa giao" },
    { value: "assigned", label: "Đã giao" },
    { value: "doing", label: "Đang làm" },
    { value: "done", label: "Đã xong" },
    { value: "expired", label: "Quá hạn" }
];

const OWNER_COLUMN_STATUS = ['unAssigned', 'assigned', 'doing', 'done', 'expired'];
const OTHER_COLUMN_STATUS = ['assigned', 'doing', 'done', 'expired'];

const TodoPage = () => {
    const UID = localStorage.getItem("UID");
    const role = localStorage.getItem("role");
    const columnsToDisplay = role === ROLES.OWNER ? OWNER_COLUMN_STATUS : OTHER_COLUMN_STATUS;

    const [addTodo, { isLoading: isAddingTodo }] = useAddTodoMutation();
    const [editTodo] = useEditTodoMutation();
    const {
        data: listDoto,
        isLoading: loadingListTodo,
        refetch
    } = useGetListTodoQuery({
        UID: role == ROLES.OWNER ? null : UID
    },
        { refetchOnMountOrArgChange: true }
    );

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [error, setError] = useState(null); // State để hiển thị thông báo lỗi
    const toggleAddDialog = () => setIsAddDialogOpen(!isAddDialogOpen);


    // --- LOGIC PHÂN LOẠI CÔNG VIỆC ---
    const classifiedTodos = OWNER_COLUMN_STATUS?.reduce((acc, status) => {
        acc[status] = [];
        return acc;
    }, { expired: [] });

    let totalCount = 0;

    if (listDoto?.data) {
        listDoto.data.forEach(todo => {
            const status = todo.toDoStatus;
            if (classifiedTodos.hasOwnProperty(status)) {
                classifiedTodos[status].push(todo);
            } else if (status === 'expired') {
                classifiedTodos.expired.push(todo);
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
            setError('Không thể thêm công việc mới. Vui lòng thử lại.');
        }
    };

    // --- HANDLER THAY ĐỔI TRẠNG THÁI ---
    const handleChangeStatus = async (todoId, newStatus) => {
        setError(null); // Reset lỗi

        // Tìm đối tượng công việc hiện tại
        const currentTodo = listDoto?.data.find(todo => todo.documentId === todoId);

        // [FIX LOGIC] Ngăn cản việc chuyển trạng thái nếu công việc đang ở 'unAssigned'
        // và trạng thái mới không phải là 'unAssigned' (ép buộc dùng handleAssign).
        if (currentTodo?.toDoStatus === 'unAssigned' && newStatus !== 'unAssigned') {
            setError('Công việc chưa được phân công. Vui lòng sử dụng chức năng "Phân công" để giao việc, trạng thái sẽ tự động chuyển sang "Đã giao".');
            return;
        }

        try {
            await editTodo({ id: todoId, toDoStatus: newStatus }).unwrap();
            refetch();
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái cho todo ${todoId}:`, error);
            setError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        }
    };

    // --- HANDLER PHÂN CÔNG ---
    const handleAssign = async (todoId, userId) => {
        setError(null); // Reset lỗi
        try {
            // Nếu có userId, chuyển trạng thái sang 'assigned'. Nếu không (gỡ phân công), chuyển sang 'unAssigned'.
            const newStatus = userId ? 'assigned' : 'unAssigned';
            await editTodo({
                id: todoId,
                users_permissions_user: userId || null,
                toDoStatus: newStatus
            }).unwrap();
            refetch();
        } catch (error) {
            console.error(`Lỗi khi phân công cho todo ${todoId}:`, error);
            setError('Phân công thất bại. Vui lòng thử lại.');
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

                {/* Hiển thị lỗi chung (nếu có) */}
                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}


                {/* Thẻ thống kê tổng quan */}
                <Row
                    sx={{
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: '0.8rem',
                    }}>
                    {/* ... (TodoData mapping giữ nguyên) ... */}
                    {todoData.map((item, index) => (
                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    sm: "1 1 calc(50% - 0.8rem)",
                                    md: "1 1 calc(33.33% - 0.8rem)",
                                    lg: "1 1 calc(16.66% - 0.8rem)",
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

                {/* Thanh tìm kiếm, lọc và thêm mới (Giữ nguyên) */}
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={2}
                    mb={3}
                    mt={3}
                    sx={{ width: "100%" }}>
                    <TextField
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

                    {role == ROLES.OWNER && <Button
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
                    </Button>}
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
                            alignItems: "flex-start",
                        }}
                    >
                        {/* Lặp qua 4 cột trạng thái chính */}
                        {columnsToDisplay.map(statusKey => {
                            const statusLabel = todoStatus.find(s => s.value === statusKey)?.label || statusKey;
                            const totalColumns = columnsToDisplay.length;

                            const percentage = 100 / totalColumns;

                            const calculatedBasis = `calc(${percentage}% - 1.2rem)`;

                            return (
                                <Column
                                    key={statusKey}
                                    sx={{
                                        width: '100%',
                                        flex: '0 0 100%',

                                        '@media (min-width: 1250px)': {
                                            width: calculatedBasis,
                                            flex: `0 0 ${calculatedBasis}`,
                                        },

                                        '@media (min-width: 900px) and (max-width: 1249px)': {
                                            width: '100%',
                                            flex: '0 0 100%',
                                        },

                                        minHeight: '200px',
                                    }}
                                >
                                    <CardTodo name={statusLabel} count={classifiedTodos[statusKey]?.length || 0}>
                                        {classifiedTodos[statusKey]?.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onChangeStatus={handleChangeStatus}
                                                onAssign={handleAssign}
                                                role={role}
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