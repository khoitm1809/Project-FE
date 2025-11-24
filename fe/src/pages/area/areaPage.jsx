import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import { useNavigate } from "react-router";
import { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardInfo from "../../components/CardInfo";
import { useAddAreaMutation, useDeleteAreaMutation, useEditAreaMutation, useGetListAreaQuery } from "../../store/area/areaAction";
import { ROUTES } from "../../router/routerConstants";
import { ROLES } from "../../utils/rolesConstant";

const AreaPage = () => {
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();

    // --- State cho UI và Dữ liệu ---
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingArea, setEditingArea] = useState(null); // Lưu khu vực đang chỉnh sửa
    const [isSubmitting, setIsSubmitting] = useState(false); // Ngăn chặn double click khi submit
    // ---

    // --- RTK Query Mutations ---
    const [addArea] = useAddAreaMutation();
    const [editArea] = useEditAreaMutation();
    const [deleteArea] = useDeleteAreaMutation();
    // ---

    // --- RTK Query Data Fetching ---
    const {
        data: listArea,
        isLoading: loadingArea,
        refetch
    } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true })
    // ---

    const toggleAddDialog = () => setOpenAddDialog(prev => !prev);

    const handleOpenEditDialog = (area) => {
        setEditingArea(area);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingArea(null);
    };
    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const description = formData.get('description');
        const users_permissions_user = formData.get('users_permissions_user');

        try {
            await addArea({ name, description, users_permissions_user: UID }).unwrap();

            toggleAddDialog();
            refetch();
        } catch (error) {
            console.error("Lỗi khi thêm khu vực:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Xử lý Chỉnh sửa Khu vực (Truyền vào prop onEdit của CardInfo)
     */
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        if (!editingArea) return;

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const description = formData.get('description');

        const updateData = {
            id: editingArea.documentId, // Giả định ID nằm trong editingArea
            name,
            description
        };

        try {
            await editArea(updateData).unwrap();

            handleCloseEditDialog();
            refetch(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi sửa khu vực:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (areaId) => {

        try {
            await deleteArea(areaId).unwrap();

            refetch(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi xóa khu vực:", error);
        }
    };

    // Áp dụng tìm kiếm
    const filteredArea = listArea?.data?.filter(area =>
        area?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area?.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        Quản lý khu vực
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
                    <Button
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
                    </Button>
                </Box>

                {/* CardInfor List */}
                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {filteredArea.map((area, index) => (
                        <Box key={area?.id || index}
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    sm: "1 1 calc(50% - 1rem)",
                                },
                            }}
                            onClick={() => navigate(ROUTES.BARN, { state: area?.id })}>
                            <CardInfo
                                name={area?.name}
                                description={area?.description}
                                publishedAt={area?.publishedAt}
                                arrayCount={area?.barns?.length}
                                isOwner={role === ROLES.OWNER}
                                nameCount={"Số chuồng: "}
                                isEdit={true}
                                isAssign={false}
                                isDelete={true}
                                // THÊM PROPS CHO HÀNH ĐỘNG
                                onActionEdit={(e) => {
                                    e.stopPropagation(); // Ngăn chặn sự kiện navigate của Box cha
                                    handleOpenEditDialog(area);
                                }}
                                onActionDelete={() => {
                                    handleDelete(area.documentId);
                                }}
                            />
                        </Box>
                    ))}
                    {!loadingArea && filteredArea.length === 0 && (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Không tìm thấy khu vực nào.</Typography>
                    )}
                    {/* Bạn có thể thêm một loader ở đây nếu cần */}
                </Row>

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

                    <form onSubmit={handleSubmitAdd}>
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
                            <TextField
                                fullWidth
                                placeholder="Tên khu..."
                                name="name"
                                required
                                disabled={isSubmitting}
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

                                        // text style
                                        "& input": {
                                            fontSize: "0.95rem",
                                        },
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "#999",
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Mô tả..."
                                name="description"
                                required
                                multiline
                                rows={3}
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    px: 3,
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang tạo...' : 'Tạo'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* ========================================================= */}
                {/* 2. EDIT ZONE DIALOG (Sử dụng handleSubmitEdit)              */}
                {/* ========================================================= */}
                <Dialog
                    fullWidth
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
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
                        Chỉnh sửa Khu vực: {editingArea?.name}
                    </DialogTitle>

                    {/* Form chỉ được render khi có editingArea để tránh lỗi undefined */}
                    {editingArea && (
                        <form onSubmit={handleSubmitEdit}>
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
                                {/* Input Tên Khu */}
                                <TextField
                                    fullWidth
                                    placeholder="Tên khu..."
                                    name="name"
                                    required
                                    // Sử dụng defaultValue để form được kiểm soát tốt hơn khi chỉnh sửa
                                    defaultValue={editingArea?.name || ''}
                                    disabled={isSubmitting}
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
                                            "& input": { fontSize: "0.95rem" },
                                        },
                                        "& .MuiInputBase-input::placeholder": { color: "#999" },
                                    }}
                                />

                                {/* Input Mô tả */}
                                <TextField
                                    fullWidth
                                    placeholder="Mô tả..."
                                    name="description"
                                    required
                                    multiline
                                    rows={3}
                                    defaultValue={editingArea?.description || ''}
                                    disabled={isSubmitting}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "8px",
                                            "& fieldset": { border: "none" },
                                            "&:hover fieldset": { border: "none" },
                                            "&.Mui-focused fieldset": { border: "none" },
                                            "& textarea": { fontSize: "0.95rem" },
                                        },
                                        "& .MuiInputBase-input::placeholder": { color: "#999" },
                                    }}
                                />
                            </DialogContent>

                            <DialogActions sx={{ p: 2 }}>
                                <Button
                                    onClick={handleCloseEditDialog}
                                    sx={{
                                        textTransform: "none",
                                        color: "#444",
                                        borderRadius: "8px",
                                        px: 2,
                                        "&:hover": { backgroundColor: "#eee" }
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 3,
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Dialog>

            </Box>
        </BoxContainer>
    )
}

export default AreaPage;