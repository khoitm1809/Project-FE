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

    const [addWareHouseCategory] = useAddWarehouseCategoryMutation();
    const [editWareHouseCategory] = useEditWarehouseCategoryMutation();
    const [deleteWareHouseCategory] = useDeleteWarehouseCategoryMutation();
    const {
        data: listWareHouseCategory,
        isLoading: loadingListWareHouseCategory,
    } = useGetListWarehouseCategoryQuery({}, { refetchOnMountOrArgChange: true })

    // const titleAdd = [
    //     { key: "pigCode", label: "pigCode" }, //hiện
    //     { key: "weight", label: "weight" }, //hiện
    //     { key: "age", label: "age" }, // hiện
    //     { key: "healthStatus", label: "healthStatus", isDropDown: true, list: status }, // true, false
    //     { key: "barn", label: "barn", isDropDown: true, list: convertToDropdown(listBarn?.data) }, //api list barn 
    //     { key: "type_pig", label: "type_pig", isDropDown: true, list: convertToDropdown(listTypePig?.data) }, //api type pig
    //     { key: "pig_growth_records", label: "pig_growth_records" }, // ẩn trên dialog
    //     { key: "users_permissions_user", label: "users_permissions_user" }, //người tạo
    // ];

    const toggleAddDialog = () => setOpenAddDialog(prev => !prev);
    const handleOpenAssignPigDialog = () => setIsAssignDialogOpen(true);
    const handleAssignEmployees = () => {

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
                    {role == ROLES.OWNER && <Button
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
                                nameCount={"Số lợn: "}
                                // arrayCount={category?.pigs?.length}
                                isOwner={role == ROLES.OWNER}
                                isShowAction={true}
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

                    <form>
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
                                type="submit"
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    px: 3,
                                }}
                            >
                                Tạo
                            </Button>
                        </DialogActions>
                    </form>
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
                            Chọn nhân viên phụ trách:
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
                                    displayEmpty
                                    // value={selectedWorker || ""}
                                    // onChange={(e) => setSelectedWorker(e.target.value)}
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <span style={{ color: "#888" }}>Chọn nhân viên</span>;
                                        }

                                        // const user = listWorker.find(w => w.id === selected);
                                        // return user?.username;
                                    }}
                                    sx={{
                                        height: 44,
                                        borderRadius: 2,
                                    }}
                                >
                                    {/* {listWorker?.map((worker) => (
                                        <MenuItem key={worker.id} value={worker.id}>
                                            {worker.username}
                                        </MenuItem>
                                    ))} */}
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

export default WareHouseCategory;