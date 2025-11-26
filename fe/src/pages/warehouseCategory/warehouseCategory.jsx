import { Box, Button, Dialog, DialogActions, DialogContent, TextField, Typography, CircularProgress, DialogTitle } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import { useNavigate } from "react-router";
import { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardInfo from "../../components/CardInfo";
import { useAddWarehouseCategoryMutation, useDeleteWarehouseCategoryMutation, useEditWarehouseCategoryMutation, useGetListWarehouseCategoryQuery } from "../../store/warehouse/warehouseAction";
import { ROUTES } from "../../router/routerConstants";
import { ROLES } from "../../utils/rolesConstant";

// Import cần thiết (Giả định đường dẫn)
import { MESSAGE_TYPE } from "../../utils/constant";
import { useConfirmDialog } from "../../components/confirmDialog";

const WareHouseCategory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    // Lấy hàm openDialog từ hook ConfirmDialog
    const { openDialog } = useConfirmDialog();

    const [addWareHouseCategory, { isLoading: isAdding }] = useAddWarehouseCategoryMutation();
    const [editWareHouseCategory, { isLoading: isEditing }] = useEditWarehouseCategoryMutation();
    const [deleteWareHouseCategory, { isLoading: isDeleting }] = useDeleteWarehouseCategoryMutation();

    const {
        data: listWareHouseCategory,
        isLoading: loadingListWareHouseCategory,
        refetch,
    } = useGetListWarehouseCategoryQuery({}, { refetchOnMountOrArgChange: true });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Mở dialog để THÊM MỚI
    const handleOpenAdd = () => {
        setFormData({ name: '', description: '' }); // Reset form
        setEditingId(null); // Chế độ Add
        setOpenAddDialog(true);
    };

    // Mở dialog để SỬA (nhận item từ CardInfo)
    const handleOpenEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description
        });
        setEditingId(item.documentId); // Chế độ Edit (Lưu ID)
        setOpenAddDialog(true);
    };

    const toggleAddDialog = () => {
        setOpenAddDialog(prev => !prev);
        // Reset form khi đóng
        if (openAddDialog) {
            setFormData({ name: '', description: '' });
            setEditingId(null);
        }
    }

    /**
     * @description Xử lý XÓA danh mục, kiểm tra số lượng mặt hàng liên quan và sử dụng openDialog.
     */
    const handleDelete = async (category) => {
        const itemArray = category?.warehouse_items || [];
        const itemCount = itemArray.length;

        if (itemCount > 0) {
            // Hiển thị cảnh báo nếu danh mục đang chứa mặt hàng
            openDialog({
                type: MESSAGE_TYPE.WARNING,
                message: `Danh mục này đang chứa ${itemCount} mặt hàng. Bạn phải xóa hết các mặt hàng liên quan trước khi xóa danh mục.`,
                isShowCloseBtn: true,
                isHideAction: true,
            });
            return; // Ngăn chặn việc xóa
        }

        // Mở dialog xác nhận xóa
        openDialog({
            type: MESSAGE_TYPE.CONFIRM,
            message: `Bạn có chắc chắn muốn xóa danh mục ?`,
            actionConfirm: async () => {
                try {
                    // category.id là ID để API biết xóa cái nào
                    await deleteWareHouseCategory(category?.documentId).unwrap();
                    refetch();
                } catch (error) {
                    console.error("Lỗi khi xóa danh mục");
                    openDialog({
                        type: MESSAGE_TYPE.ERROR,
                        message: `Lỗi khi xóa danh mục`,
                        isShowCloseBtn: true,
                        isHideAction: true,
                    });
                }
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description) return;

        try {
            if (editingId) {
                // --- LOGIC EDIT ---
                await editWareHouseCategory({
                    id: editingId,
                    ...formData
                }).unwrap();
            } else {
                // --- LOGIC ADD ---
                await addWareHouseCategory(formData).unwrap();
            }
            refetch();

            // Thành công thì đóng dialog và reset
            setOpenAddDialog(false);
            setFormData({ name: '', description: '' });
            setEditingId(null);

        } catch (error) {
            console.error("Lỗi khi lưu:", error);

            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: `Lỗi khi lưu danh mục:`,
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };

    // Logic lọc danh sách theo searchTerm (nếu có)
    const filteredCategories = listWareHouseCategory?.data?.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        📦 Quản lý Danh mục Kho Hàng hóa
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                    >
                        Quản lý toàn bộ danh mục hàng hóa (Thức ăn, Thuốc,...)
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
                        placeholder="Tìm kiếm danh mục..."
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

                    {/* Nút Lọc (Chỉ là placeholder, không có logic) */}
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
                    {role == ROLES.OWNER && <Button
                        variant="contained"
                        startIcon={<AddOutlinedIcon />}
                        onClick={handleOpenAdd}
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
                    justifyContent: 'flex-start'
                }}>
                    {loadingListWareHouseCategory ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                            <CircularProgress size={30} />
                            <Typography color="text.secondary" sx={{ ml: 2 }}>Đang tải danh mục...</Typography>
                        </Box>
                    ) : filteredCategories.length === 0 ? (
                        <Typography color="text.secondary" sx={{ p: 2, width: '100%' }}>Không tìm thấy danh mục nào.</Typography>
                    ) : (
                        filteredCategories.map((category, index) => (
                            <Box key={category?.id || index}
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        sm: "0 0 calc(50% - 1rem)",
                                    },
                                }}
                                onClick={() => navigate(ROUTES.WAREHOUSE_ITEM, { state: category?.id })}>
                                <CardInfo
                                    name={category?.name}
                                    description={category?.description}
                                    publishedAt={category?.publishedAt}
                                    nameCount={"Số mặt hàng: "}
                                    // Giả sử warehouse_items là mảng chứa các mặt hàng
                                    arrayCount={category?.warehouse_items?.length}
                                    isOwner={role == ROLES.OWNER}
                                    isEdit={true}
                                    isDelete={true}
                                    onActionEdit={() => {
                                        handleOpenEdit(category);
                                    }}
                                    onActionDelete={() => {
                                        // Truyền nguyên object category để kiểm tra số lượng item
                                        handleDelete(category);
                                    }}
                                />
                            </Box>
                        ))
                    )}
                </Row>

                {/* ADD/EDIT DIALOG */}
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
                        {editingId ? 'Chỉnh sửa Danh mục' : 'Tạo Danh mục mới'}
                    </DialogTitle>

                    <form onSubmit={handleSubmit}>
                        <DialogContent dividers sx={{ border: "none", pt: 2, pb: 1, "& .MuiDialogContent-root": { border: "none" } }}>
                            <TextField
                                fullWidth
                                label="Tên danh mục"
                                placeholder="Nhập tên danh mục..."
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={isAdding || isEditing}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "8px",
                                        height: "44px",
                                        "& fieldset": { border: "none" }
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Mô tả"
                                placeholder="Nhập mô tả..."
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                multiline
                                rows={3}
                                disabled={isAdding || isEditing}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "8px",
                                        "& fieldset": { border: "none" }
                                    }
                                }}
                            />
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            <Button
                                onClick={toggleAddDialog}
                                disabled={isAdding || isEditing}
                                sx={{ textTransform: "none", color: "#444", borderRadius: "8px", px: 2, "&:hover": { backgroundColor: "#eee" } }}
                            >
                                Hủy
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isAdding || isEditing}
                                sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                            >
                                {editingId
                                    ? (isEditing ? <CircularProgress size={20} color="inherit" /> : 'Lưu thay đổi')
                                    : (isAdding ? <CircularProgress size={20} color="inherit" /> : 'Tạo')
                                }
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box >
        </BoxContainer >
    )
}

export default WareHouseCategory;