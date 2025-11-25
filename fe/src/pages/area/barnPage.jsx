import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardInfo from "../../components/CardInfo";
import { useAddBarnMutation, useDeleteBarnMutation, useEditBarnMutation, useGetListBarnQuery } from "../../store/area/areaAction";
import { ROUTES } from "../../router/routerConstants";
import { ROLES } from "../../utils/rolesConstant";
import { useGetListUserQuery } from "../../store/auth/authAction";
import { useConfirmDialog } from "../../components/confirmDialog";
import { MESSAGE_TYPE } from "../../utils/constant";

const BarnPage = () => {
    const location = useLocation();
    const areaId = location?.state;
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();

    // Giả định hàm openDialog từ hook
    const { openDialog } = useConfirmDialog()


    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    // XÓA: [openDeleteDialog, setOpenDeleteDialog] và [barnToDelete, setBarnToDelete]

    const [selectedBarnId, setSelectedBarnId] = useState(null);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);

    // Cần thêm state cho Dialog chỉnh sửa (Edit Dialog)
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingBarn, setEditingBarn] = useState(null); // Lưu chuồng đang chỉnh sửa

    const [newBarnData, setNewBarnData] = useState({
        name: '',
        description: '',
    });

    const [addBarn, { isLoading: isAddingBarn }] = useAddBarnMutation();
    const [editBarn, { isLoading: isEditingBarn }] = useEditBarnMutation();
    const [deleteBarn, { isLoading: isDeletingBarn }] = useDeleteBarnMutation();

    const {
        data: listBarn,
        isLoading: loadingBarn,
        refetch
    } = useGetListBarnQuery({
        areaId: areaId,
        UID: role === ROLES.WORKER ? UID : null
    }, { refetchOnMountOrArgChange: true })

    const {
        data: listWorker,
    } = useGetListUserQuery({
        role: ROLES.WORKER
    }, {
        skip: role === ROLES.WORKER,
        refetchOnMountOrArgChange: true
    })

    // --- DIALOG HANDLERS ---

    // ADD
    const toggleAddDialog = () => {
        setOpenAddDialog(prev => !prev);
        setNewBarnData({ name: '', description: '' });
    };

    // EDIT
    const handleOpenEditDialog = (barn) => {
        setEditingBarn(barn);
        setNewBarnData({ name: barn.name, description: barn.description });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingBarn(null);
        setNewBarnData({ name: '', description: '' });
    };

    // ASSIGN
    const handleCloseAssignDialog = () => {
        setIsAssignDialogOpen(false);
        setSelectedBarnId(null);
        setSelectedWorkerId(null);
    }

    const handleOpenAssignWorkerDialog = (barnId) => {
        setSelectedBarnId(barnId);

        const currentBarn = listBarn?.data?.find(barn => barn?.documentId === barnId);
        // Lưu ý: Tên trường users_permissions_user?.id có thể thay đổi tùy API
        const currentWorkerId = currentBarn?.users_permissions_user?.id || null;

        setSelectedWorkerId(currentWorkerId);
        setIsAssignDialogOpen(true);
    };

    // --- DATA HANDLERS ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBarnData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Cập nhật editingBarn nếu đang chỉnh sửa
        if (openEditDialog) {
            setEditingBarn(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddBarnSubmit = async (e) => {
        e.preventDefault();

        if (isAddingBarn || !newBarnData.name || !newBarnData.description) return;

        try {
            await addBarn({
                area: areaId,
                ...newBarnData,
            }).unwrap();

            toggleAddDialog();
            await refetch();
        } catch (error) {
            console.error("Lỗi khi thêm chuồng:", error);
        }
    };

    // Xử lý chỉnh sửa
    const handleEditBarnSubmit = async (e) => {
        e.preventDefault();
        if (isEditingBarn || !editingBarn) return;

        const updateData = {
            name: editingBarn.name,
            description: editingBarn.description
        };

        try {
            await editBarn({
                id: editingBarn.documentId,
                updateData: updateData
            }).unwrap();

            handleCloseEditDialog();
            await refetch();
        } catch (error) {
            console.error("Lỗi khi sửa chuồng:", error);
        }
    };

    // THAY THẾ LOGIC XÓA CŨ BẰNG HÀM SỬ DỤNG openDialog
    const handleDeleteBarn = async (barnToDelete) => {
        if (!barnToDelete?.documentId || isDeletingBarn) return;

        // 1. KIỂM TRA LỢN TRONG CHUỒNG
        if (barnToDelete.pigs?.length > 0) {
            openDialog({
                type: MESSAGE_TYPE.WARNING,
                message: `Chuồng còn ${barnToDelete.pigs.length} con lợn. Bạn phải xóa hết lợn khỏi chuồng trước khi xóa chuồng này.`,
                isShowCloseBtn: true,
                isHideAction: true,
                customSecondText: "Đã hiểu"
            });
            return;
        }

        // 2. XÁC NHẬN XÓA CHUỒNG
        const confirmDelete = async () => {
            try {
                await deleteBarn(barnToDelete.documentId).unwrap();
                await refetch();
                // Tùy chọn: Hiển thị thông báo thành công
                console.log("Chuồng đã được xóa thành công.");
            } catch (error) {
                console.error("Lỗi khi xóa chuồng:", error);
                // Tùy chọn: Hiển thị thông báo lỗi
            }
        };

        openDialog({
            type: MESSAGE_TYPE.CONFIRM, // Giả định có loại CONFIRM
            message: `Bạn có chắc chắn muốn xóa chuồng **${barnToDelete.name}**? Hành động này không thể hoàn tác.`,
            isShowCloseBtn: true,
            isHideAction: false, // Để nút xác nhận được hiển thị
            customSecondText: "Xóa", // Tên nút xác nhận
            // Sử dụng onConfirm để gọi hàm xóa khi người dùng xác nhận
            onConfirm: confirmDelete,
        });
    };

    const handleWorkerSelect = (event) => {
        setSelectedWorkerId(event.target.value === "" ? null : event.target.value);
    };

    const handleAssignEmployees = async () => {
        const workerId = selectedWorkerId || null;

        try {
            await editBarn({
                id: selectedBarnId,
                users_permissions_user: workerId
            }).unwrap();
            setIsAssignDialogOpen(false)
            await refetch();
        } catch (error) {
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: `Lỗi khi phân công nhân viên`,
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };

    // Áp dụng tìm kiếm
    const filteredBarns = listBarn?.data?.filter(barn =>
        barn?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barn?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <BoxContainer padding={'2rem'}>
            <Box mb={4}>
                <Box sx={{ marginBottom: '2rem' }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        Quản lý Chuồng
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                    >
                        Quản lý toàn bộ chuồng trong khu vực {areaId}
                    </Typography>
                </Box>

                {/* SEARCH + BUTTONS (Giống AreaPage) */}
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={2}
                    mb={2}
                    sx={{ width: "100%" }}
                >
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
                                border: "none",
                                "& fieldset": { border: "none" },
                                "&:hover fieldset": { border: "none" },
                                "&.Mui-focused fieldset": { border: "none" },
                            },
                        }}
                    />

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
                            "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "#f7f7f7",
                            },
                        }}
                    >
                        Lọc
                    </Button>

                    {role === ROLES.OWNER && <Button
                        variant="contained"
                        startIcon={<AddOutlinedIcon />}
                        onClick={toggleAddDialog}
                        sx={{
                            height: "44px",
                            width: { xs: "100%", sm: "10rem" },
                            bgcolor: "#000",
                            color: "#fff",
                            textTransform: "none",
                            "&:hover": {
                                bgcolor: "#222",
                            },
                        }}
                    >
                        Thêm mới
                    </Button>}
                </Box>

                {/* CardInfo List */}
                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {loadingBarn ? (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Đang tải danh sách chuồng...</Typography>
                    ) : filteredBarns.length === 0 ? (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Không tìm thấy chuồng nào.</Typography>
                    ) : (
                        filteredBarns.map((barn, index) => (
                            <Box key={barn?.id || index}
                                onClick={() => navigate(ROUTES.PIG_PAGE, {
                                    state: {
                                        barnId: barn?.id, // Dùng documentId
                                        areaId: areaId
                                    }
                                })}
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        sm: "0 0 calc(50% - 1rem)",
                                    },
                                }}
                            >
                                <CardInfo
                                    name={barn?.name}
                                    description={barn?.description}
                                    publishedAt={barn?.publishedAt}
                                    nameCount={"Số lợn: "}
                                    arrayCount={barn?.pigs?.length}
                                    isOwner={role === ROLES.OWNER}
                                    isAssign={true}
                                    onActionAssign={() => handleOpenAssignWorkerDialog(barn?.documentId)}
                                    isEdit={true}
                                    onActionEdit={(e) => {
                                        handleOpenEditDialog(barn);
                                    }}
                                    isDelete={true}
                                    onActionDelete={(e) => {
                                        handleDeleteBarn(barn);
                                    }}
                                    feedSetting={true}
                                />
                            </Box>
                        ))
                    )}
                </Row>

                {/* ADD BARN DIALOG (Giống AreaPage) */}
                <Dialog
                    fullWidth
                    open={openAddDialog}
                    onClose={toggleAddDialog}
                    PaperProps={{
                        sx: { borderRadius: "12px", paddingTop: "4px" }
                    }}
                >
                    <DialogTitle
                        sx={{ fontSize: "1.25rem", fontWeight: 700, pb: 1.5 }}
                    >
                        Tạo Chuồng mới
                    </DialogTitle>

                    <form onSubmit={handleAddBarnSubmit}>
                        <DialogContent
                            dividers
                            sx={{ border: "none", pt: 2, pb: 1, "& .MuiDialogContent-root": { border: "none" } }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Tên chuồng..."
                                name="name"
                                onChange={handleInputChange}
                                value={newBarnData.name}
                                required
                                disabled={isAddingBarn}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", height: "44px", paddingLeft: "10px", "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" }, "& input": { fontSize: "0.95rem" } },
                                    "& .MuiInputBase-input::placeholder": { color: "#999" },
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Mô tả..."
                                name="description"
                                onChange={handleInputChange}
                                value={newBarnData.description}
                                required
                                multiline
                                rows={3}
                                disabled={isAddingBarn}
                                sx={{
                                    "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" }, "& textarea": { fontSize: "0.95rem" } },
                                    "& .MuiInputBase-input::placeholder": { color: "#999" },
                                }}
                            />
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            <Button
                                onClick={toggleAddDialog}
                                disabled={isAddingBarn}
                                sx={{ textTransform: "none", color: "#444", borderRadius: "8px", px: 2, "&:hover": { backgroundColor: "#eee" } }}
                            >
                                Hủy
                            </Button>

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isAddingBarn}
                                sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                            >
                                {isAddingBarn ? 'Đang tạo...' : 'Tạo'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* EDIT BARN DIALOG (Tạo mới, dựa trên logic của AreaPage) */}
                <Dialog
                    fullWidth
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    PaperProps={{
                        sx: { borderRadius: "12px", paddingTop: "4px" }
                    }}
                >
                    <DialogTitle
                        sx={{ fontSize: "1.25rem", fontWeight: 700, pb: 1.5 }}
                    >
                        Chỉnh sửa Chuồng: {editingBarn?.name}
                    </DialogTitle>

                    {editingBarn && (
                        <form onSubmit={handleEditBarnSubmit}>
                            <DialogContent
                                dividers
                                sx={{ border: "none", pt: 2, pb: 1, "& .MuiDialogContent-root": { border: "none" } }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Tên chuồng..."
                                    name="name"
                                    required
                                    defaultValue={editingBarn.name || ''}
                                    onChange={(e) => handleInputChange(e)} // Dùng lại handleInputChange
                                    disabled={isEditingBarn}
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", height: "44px", paddingLeft: "10px", "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" }, "& input": { fontSize: "0.95rem" } },
                                        "& .MuiInputBase-input::placeholder": { color: "#999" },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    placeholder="Mô tả..."
                                    name="description"
                                    required
                                    multiline
                                    rows={3}
                                    defaultValue={editingBarn.description || ''}
                                    onChange={(e) => handleInputChange(e)} // Dùng lại handleInputChange
                                    disabled={isEditingBarn}
                                    sx={{
                                        "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" }, "& textarea": { fontSize: "0.95rem" } },
                                        "& .MuiInputBase-input::placeholder": { color: "#999" },
                                    }}
                                />
                            </DialogContent>

                            <DialogActions sx={{ p: 2 }}>
                                <Button
                                    onClick={handleCloseEditDialog}
                                    disabled={isEditingBarn}
                                    sx={{ textTransform: "none", color: "#444", borderRadius: "8px", px: 2, "&:hover": { backgroundColor: "#eee" } }}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isEditingBarn}
                                    sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                                >
                                    {isEditingBarn ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Dialog>


                {/* XÓA: DELETE BARN DIALOG đã được xóa */}


                {/* Phân công DIALOG */}
                <Dialog
                    open={isAssignDialogOpen}
                    onClose={handleCloseAssignDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Phân công nhân viên</DialogTitle>

                    <DialogContent dividers>
                        <DialogContentText sx={{ mb: 2 }}>
                            Chọn nhân viên phụ trách chuồng **{listBarn?.data?.find(barn => barn.documentId === selectedBarnId)?.name}**:
                        </DialogContentText>

                        <Box sx={{
                            maxHeight: 350,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            py: 1,
                        }}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedWorkerId || ''}
                                    onChange={handleWorkerSelect}
                                    displayEmpty
                                    sx={{
                                        height: 44,
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="">
                                        <span style={{ color: "#888" }}>Không phân công (Chủ trang trại phụ trách)</span>
                                    </MenuItem>
                                    {listWorker?.map((worker) => (
                                        <MenuItem key={worker.id} value={worker.id}>
                                            {worker.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={handleCloseAssignDialog}
                            disabled={isEditingBarn}
                        >
                            Hủy
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ background: 'black', color: 'white' }}
                            onClick={handleAssignEmployees}
                            disabled={isEditingBarn}
                        >
                            {isEditingBarn ? 'Đang lưu...' : 'Lưu phân công'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </BoxContainer>
    )
}

export default BarnPage;