import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
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

const BarnPage = () => {
    const location = useLocation();
    const areaId = location?.state;
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    // THÊM STATE CHO CHỨC NĂNG XÓA
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [barnToDelete, setBarnToDelete] = useState(null); // Lưu thông tin chuồng cần xóa (bao gồm ID)
    // Thêm state để lưu ID chuồng đang được chọn và ID nhân viên được chọn
    const [selectedBarnId, setSelectedBarnId] = useState(null);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [newBarnData, setNewBarnData] = useState({
        name: '',
        description: '',
    });

    const [addBarn, { isLoading: isAddingBarn }] = useAddBarnMutation();
    const [editBarn] = useEditBarnMutation();
    const [deleteBarn, { isLoading: isDeletingBarn }] = useDeleteBarnMutation(); // Lấy loading state của delete

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

    const toggleAddDialog = () => {
        setOpenAddDialog(prev => !prev);
        setNewBarnData({ name: '', description: '' });
    };

    // THÊM HÀM MỞ/ĐÓNG VÀ XỬ LÝ XÓA
    const handleOpenDeleteDialog = (barn) => {
        setBarnToDelete(barn);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setBarnToDelete(null);
        setOpenDeleteDialog(false);
    };

    const handleDeleteBarn = async () => {
        if (!barnToDelete?.documentId) return;

        try {
            // Gọi mutation xóa
            await deleteBarn(barnToDelete.documentId).unwrap();

            // Xử lý thành công
            handleCloseDeleteDialog();
            await refetch(); // Lấy lại dữ liệu sau khi xóa thành công
        } catch (error) {
            console.error("Lỗi khi xóa chuồng:", error);
            // Xử lý lỗi (ví dụ: hiển thị thông báo)
        }
    };
    // KẾT THÚC THÊM HÀM XÓA

    const handleOpenAssignPigDialog = () => setIsAssignDialogOpen(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBarnData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // CẬP NHẬT HÀM THÊM CHUỒNG
    const handleAddBarnSubmit = async (e) => {
        e.preventDefault();

        if (!newBarnData.name || !newBarnData.description) {
            return;
        }

        try {
            await addBarn({
                area: areaId,
                ...newBarnData,
            }).unwrap();

            // THÊM: Đóng dialog và refetch sau khi thêm thành công
            toggleAddDialog();
            await refetch();
        } catch (error) {
            console.error("Lỗi khi thêm chuồng:", error);
        }
    };
    // KẾT THÚC CẬP NHẬT HÀM THÊM CHUỒNG

    const handleOpenAssignWorkerDialog = (barnId) => {
        setSelectedBarnId(barnId); // Lưu lại ID chuồng

        // 1. Tìm chuồng hiện tại trong listBarn.data
        const currentBarn = listBarn?.data?.find(barn => barn?.documentId === barnId);

        // 2. Lấy ID của nhân viên đã được phân công (nếu có)
        // users_permissions_user thường là một object hoặc null/undefined.
        // Cần kiểm tra cấu trúc dữ liệu trả về từ API của bạn.
        // Giả sử API trả về user object có trường 'id' hoặc 'documentId'

        const currentWorkerId = currentBarn?.users_permissions_user?.id || null;

        // 3. Cập nhật state selectedWorkerId
        setSelectedWorkerId(currentWorkerId);

        setIsAssignDialogOpen(true);
    };

    const handleWorkerSelect = (event) => {
        setSelectedWorkerId(event.target.value); // Lưu lại ID nhân viên được chọn
    };

    const handleAssignEmployees = async () => {
        if (!selectedBarnId) {
            console.error("Vui lòng chọn chuồng.");
            return;
        }

        // Nếu selectedWorkerId là null hoặc undefined, gán null để xóa liên kết.
        const workerId = selectedWorkerId || null;

        try {
            await editBarn({
                id: selectedBarnId, // <-- Đây là Barn ID để ghép vào URL
                users_permissions_user: workerId // <-- Đây là payload, sẽ được bọc trong { data: ... }
            }).unwrap();
            setIsAssignDialogOpen(false)
            await refetch();
        } catch (error) {
            console.error("Lỗi khi phân công nhân viên:", error);
        }
    };

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

                    {/* SUBTITLE */}
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                    >
                        Quản lý toàn bộ khu vực
                    </Typography>
                </Box>

                {/* SEARCH + BUTTON */}
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={2}
                    mb={2}
                    sx={{
                        width: "100%",
                    }}
                >
                    {/* Search Input */}
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
                            "&:hover": {
                                borderColor: "#999",
                                backgroundColor: "#f7f7f7",
                            },
                        }}
                    >
                        Lọc
                    </Button>

                    {/* Nút Thêm */}
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

                {/* CardInfor */}
                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {loadingBarn ? (
                        <Typography>Đang tải danh sách chuồng...</Typography>
                    ) : listBarn?.data?.length === 0 ? (
                        <Typography>Chưa có chuồng nào trong khu vực này.</Typography>
                    ) : (
                        listBarn?.data?.map((barn, index) => (
                            <Box key={index}
                                onClick={() => navigate(ROUTES.PIG_PAGE, {
                                    state: {
                                        barnId: barn?.id,
                                        areaId: areaId
                                    }
                                })}
                                sx={{
                                    flex: {
                                        xs: "1 1 50%",
                                        sm: "1 1 calc(50% - 1rem)",
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
                                    isDelete={true}
                                    onActionDelete={() => handleOpenDeleteDialog(barn)}
                                />
                            </Box>
                        ))
                    )}
                </Row>

                {/* ADD BARN DIALOG */}
                <Dialog
                    fullWidth
                    open={openAddDialog}
                    onClose={toggleAddDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: "12px",
                            paddingTop: "4px"
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            pb: 1.5,
                        }}
                    >
                        Tạo Chuồng mới
                    </DialogTitle>

                    {/* GÁN HÀM XỬ LÝ SUBMIT CHO FORM */}
                    <form onSubmit={handleAddBarnSubmit}>
                        <DialogContent
                            dividers
                            sx={{
                                border: "none",
                                pt: 2,
                                pb: 1,
                                "& .MuiDialogContent-root": {
                                    border: "none",
                                },
                            }}
                        >
                            {/* TextField Tên chuồng */}
                            <TextField
                                fullWidth
                                placeholder="Tên chuồng..."
                                name="name"
                                onChange={handleInputChange}
                                value={newBarnData.name}
                                required
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "8px",
                                        height: "44px",
                                        paddingLeft: "10px",

                                        "& fieldset": { border: "none" },
                                        "&:hover fieldset": { border: "none" },
                                        "&.Mui-focused fieldset": { border: "none" },

                                        "& input": {
                                            fontSize: "0.95rem",
                                        },
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "#999",
                                    },
                                }}
                            />

                            {/* TextField Mô tả */}
                            <TextField
                                fullWidth
                                placeholder="Mô tả..."
                                name="description"
                                onChange={handleInputChange}
                                value={newBarnData.description}
                                required
                                multiline
                                rows={3}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "8px",

                                        "& fieldset": { border: "none" },
                                        "&:hover fieldset": { border: "none" },
                                        "&.Mui-focused fieldset": { border: "none" },

                                        "& textarea": {
                                            fontSize: "0.95rem",
                                        },
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "#999",
                                    },
                                }}
                            />
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            <Button
                                onClick={toggleAddDialog}
                                sx={{
                                    textTransform: "none",
                                    color: "#444",
                                    borderRadius: "8px",
                                    px: 2,
                                    "&:hover": { backgroundColor: "#eee" }
                                }}
                            >
                                Hủy
                            </Button>

                            <Button
                                variant="contained"
                                type="submit" // QUAN TRỌNG: GÁN type="submit" cho nút trong form
                                disabled={isAddingBarn} // Vô hiệu hóa khi đang load
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    px: 3,
                                }}
                            >
                                {isAddingBarn ? 'Đang tạo...' : 'Tạo'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* DELETE BARN DIALOG (THÊM MỚI) */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    maxWidth="xs"
                >
                    <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>
                        Xác nhận xóa chuồng
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa chuồng **{barnToDelete?.name}** không?
                            <br />
                            Hành động này không thể hoàn tác.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            disabled={isDeletingBarn}
                            sx={{ textTransform: "none" }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDeleteBarn}
                            color="error"
                            variant="contained"
                            disabled={isDeletingBarn}
                            sx={{ textTransform: "none" }}
                        >
                            {isDeletingBarn ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* Phân công */}
                <Dialog
                    open={isAssignDialogOpen}
                    onClose={() => setIsAssignDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Phân công nhân viên</DialogTitle>

                    <DialogContent dividers>
                        <DialogContentText sx={{ mb: 2 }}>
                            Chọn nhân viên phụ trách chuồng **{listBarn?.data?.find(barn => barn.documentId === selectedBarnId)?.name}**:
                        </DialogContentText>

                        {/* LIST NHÂN VIÊN */}
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
                                    value={selectedWorkerId || ''} // Gán giá trị state đã chọn vào Select
                                    onChange={handleWorkerSelect}  // Gán hàm xử lý thay đổi
                                    displayEmpty
                                    sx={{
                                        height: 44,
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="">
                                        <span style={{ color: "#888" }}>Không phân công (Chủ trang trại phụ trách)</span>
                                    </MenuItem>
                                    {/* Đảm bảo listWorker là mảng trước khi map */}
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
                            onClick={() => setIsAssignDialogOpen(false)}
                        >
                            Hủy
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ background: 'black', color: 'white' }}
                            onClick={handleAssignEmployees}
                        >
                            Lưu phân công
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </BoxContainer>
    )
}

export default BarnPage;