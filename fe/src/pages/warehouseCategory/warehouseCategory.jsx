import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import { ROUTES } from "../../router/routerConstants";
import { convertToDropdown } from "../../components/convertToDropdown";
import { useAddWarehouseCategoryMutation, useDeleteWarehouseCategoryMutation, useEditWarehouseCategoryMutation, useGetListWarehouseCategoryQuery } from "../../store/warehouse/warehouseAction";
import { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardInfo from "../../components/CardInfo";
import { ROLES } from "../../utils/rolesConstant";
import { useNavigate } from "react-router";

export const status = [
    { value: "true", label: "Khỏe" },
    { value: "false", label: "yếu" },
];


const WareHouseCategory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null); // Nếu có ID => đang Edit, null => đang Add


    const [addWareHouseCategory, { isLoading: isAdding }] = useAddWarehouseCategoryMutation();
    const [editWareHouseCategory, { isLoading: isEditing }] = useEditWarehouseCategoryMutation();
    const [deleteWareHouseCategory] = useDeleteWarehouseCategoryMutation();

    const {
        data: listWareHouseCategory,
        isLoading: loadingListWareHouseCategory,
        refetch,
    } = useGetListWarehouseCategoryQuery({}, { refetchOnMountOrArgChange: true });

    // Xử lý khi nhập liệu
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
        setEditingId(item.id); // Chế độ Edit (Lưu ID)
        setOpenAddDialog(true);
    };

    const toggleAddDialog = () => setOpenAddDialog(prev => !prev);
    const handleOpenAssignPigDialog = () => setIsAssignDialogOpen(true);

    // Xử lý SUBMIT (Chung cho cả Add và Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate đơn giản
        if (!formData.name || !formData.description) return;

        try {
            if (editingId) {
                // --- LOGIC EDIT ---
                await editWareHouseCategory({
                    id: editingId, // ID để API biết sửa cái nào
                    ...formData    // Dữ liệu cần sửa (name, description)
                    // Lưu ý: Nếu API của bạn yêu cầu bọc trong { data: ... } thì RTK query thường đã xử lý, 
                    // hoặc bạn sửa lại thành: { id: editingId, data: formData } tùy cấu hình mutation.
                }).unwrap();
            } else {
                // --- LOGIC ADD ---
                await addWareHouseCategory(formData).unwrap();
            }
            refetch();
            // Thành công thì đóng dialog
            setOpenAddDialog(false);
            setFormData({ name: '', description: '' });
            setEditingId(null);

        } catch (error) {
            console.error("Lỗi khi lưu:", error);
        }
    };

    const handleAssignEmployees = () => { };
    return (
        <BoxContainer padding={'2rem'}>
            <Box mb={4}>
                <Box sx={{ marginBottom: '2rem' }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        Quản lý kho hàng hóa
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

                {/* CardInfor */}
                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {listWareHouseCategory?.data?.map((category, index) => (
                        <Box key={index}
                            sx={{
                                flex: {
                                    xs: "1 1 50%",
                                    sm: "1 1 calc(50% - 1rem)",
                                },
                            }}
                            onClick={() => navigate(ROUTES.WAREHOUSE_ITEM, { state: category?.id })}>
                            <CardInfo
                                name={category?.name}
                                description={category?.description}
                                publishedAt={category?.publishedAt}
                                nameCount={"Số lượng: "}
                                arrayCount={category?.warehouse_items?.length}
                                isOwner={role == ROLES.OWNER}
                                isEdit={true}
                                isDelete={true}
                                onActionEdit={() => {
                                    handleOpenEdit(category);
                                }}
                                onActionAdd={handleOpenAssignPigDialog}
                            />
                        </Box>
                    ))}
                </Row>

                {/* ADD ZONE DIALOG */}
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
                        Tạo khu mới
                    </DialogTitle>

                    <form onSubmit={handleSubmit}>
                        <DialogContent dividers sx={{ border: "none", pt: 2, pb: 1, "& .MuiDialogContent-root": { border: "none" } }}>
                            <TextField
                                fullWidth
                                placeholder="Tên danh mục..."
                                name="name"
                                value={formData.name}       // Binding value
                                onChange={handleInputChange} // Binding onChange
                                required
                                sx={{ mb: 2, "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", height: "44px", "& fieldset": { border: "none" } } }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Mô tả..."
                                name="description"
                                value={formData.description} // Binding value
                                onChange={handleInputChange} // Binding onChange
                                required
                                multiline
                                rows={3}
                                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", "& fieldset": { border: "none" } } }}
                            />
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={toggleAddDialog} sx={{ textTransform: "none", color: "#444", borderRadius: "8px", px: 2, "&:hover": { backgroundColor: "#eee" } }}>
                                Hủy
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isAdding || isEditing} // Disable khi đang loading
                                sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
                            >
                                {/* Đổi text nút bấm */}
                                {editingId
                                    ? (isEditing ? 'Đang lưu...' : 'Lưu thay đổi')
                                    : (isAdding ? 'Đang tạo...' : 'Tạo')
                                }
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </BoxContainer>
    )
}

export default WareHouseCategory;