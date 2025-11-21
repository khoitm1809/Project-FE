import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { BoxContainer, Row } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CardInfo from "../../components/CardInfo";
import { useAddAreaMutation, useAddBarnMutation, useDeleteAreaMutation, useDeleteBarnMutation, useEditAreaMutation, useEditBarnMutation, useGetListAreaQuery, useGetListBarnQuery } from "../../store/area/areaAction";
import { ROUTES } from "../../router/routerConstants";
import { ROLES } from "../../utils/rolesConstant";
import { useGetListUserQuery } from "../../store/auth/authAction";

const BarnPage = () => {
    const location = useLocation();
    const areaId = location?.state
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    const [addArea] = useAddBarnMutation();
    const [editArea] = useEditBarnMutation();
    const [deleteArea] = useDeleteBarnMutation();

    const {
        data: listBarn,
        isLoading: loadingBarn,
        refetch
    } = useGetListBarnQuery({
        areaId: areaId,
        UID: role == ROLES.WORKER ? UID : null
    }, { refetchOnMountOrArgChange: true })

    const {
        data: listWorker,
        isLoading: loadingWorker,
    } = useGetListUserQuery({
        role: ROLES.WORKER
    }, {
        skip: role == ROLES.WORKER,
        refetchOnMountOrArgChange: true
    })

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
                    {listBarn?.data?.map((barn, index) => (
                        <Box sx={{
                            flex: {
                                xs: "1 1 50%",
                                sm: "1 1 calc(50% - 1rem)",
                            },
                        }}>
                            <CardInfo
                                name={barn?.name}
                                description={barn?.description}
                                publishedAt={barn?.publishedAt}
                                nameCount={"Số lợn: "}
                                arrayCount={barn?.pigs?.length}
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