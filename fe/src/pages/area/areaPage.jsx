// src/pages/AreaPage.jsx

import { Box, Button, TextField, Typography } from "@mui/material";
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
import { MESSAGE_TYPE } from "../../utils/constant";
import { useConfirmDialog } from "../../components/confirmDialog";
import CommonDialog from "../../components/CommonDialog";

const AreaPage = () => {
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();

    const { openDialog } = useConfirmDialog()

    const [searchTerm, setSearchTerm] = useState('');

    const [dialogState, setDialogState] = useState({
        open: false,
        mode: null, // 'add', 'edit'
        editingArea: null,
    });

    const [newAreaData, setNewAreaData] = useState({
        name: '',
        description: '',
    });

    const [addArea, { isLoading: isAddingArea }] = useAddAreaMutation();
    const [editArea, { isLoading: isEditingArea }] = useEditAreaMutation();
    const [deleteArea, { isLoading: isDeletingArea }] = useDeleteAreaMutation();

    const {
        data: listArea,
        isLoading: loadingArea,
        refetch
    } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true })

    const handleCloseDialog = () => {
        setDialogState({ open: false, mode: null, editingArea: null });
        setNewAreaData({ name: '', description: '' });
    };

    const handleOpenAddDialog = () => {
        setDialogState({ open: true, mode: 'add', editingArea: null });
        setNewAreaData({ name: '', description: '' });
    };

    const handleOpenEditDialog = (area) => {
        setDialogState({ open: true, mode: 'edit', editingArea: area });
        setNewAreaData({ name: area.name, description: area.description });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAreaData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (dialogState.mode === 'edit') {
            setDialogState(prev => ({
                ...prev,
                editingArea: {
                    ...prev.editingArea,
                    [name]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            switch (dialogState.mode) {
                case 'add':
                    if (isAddingArea || !newAreaData.name) return;
                    await addArea({
                        ...newAreaData,
                        users_permissions_user: UID
                    }).unwrap();
                    break;
                case 'edit':
                    if (isEditingArea || !dialogState.editingArea) return;
                    await editArea({
                        id: dialogState.editingArea.documentId,
                        updateData: {
                            name: dialogState.editingArea.name,
                            description: dialogState.editingArea.description
                        }
                    }).unwrap();
                    break;
                default:
                    return;
            }

            handleCloseDialog();
            await refetch();
        } catch (error) {
            const errorMessage = error.data?.message || error.error || "Vui lòng thử lại.";
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: `Lỗi khi ${dialogState.mode === 'add' ? 'thêm' : 'sửa'} khu vực: ${errorMessage}`,
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };

    const handleDelete = async (areaId) => {
        const areaToDelete = listArea?.data?.find(area => area.documentId === areaId);
        const barnCount = areaToDelete?.barns?.length || 0;

        if (isDeletingArea) return;

        if (barnCount > 0) {
            openDialog({
                type: MESSAGE_TYPE.WARNING,
                message: `Bạn phải xóa ${barnCount} chuồng mới được xóa khu này`,
                isShowCloseBtn: true,
                isHideAction: true,
                customSecondText: "Xác nhận"
            });
        } else {
            const confirmDelete = async () => {
                try {
                    await deleteArea(areaId).unwrap();
                    await refetch();
                } catch (error) {
                    openDialog({
                        type: MESSAGE_TYPE.ERROR,
                        message: `Lỗi khi xóa khu vực`,
                        isShowCloseBtn: true,
                        isHideAction: true,
                    });
                }
            };

            openDialog({
                type: MESSAGE_TYPE.CONFIRM,
                message: `Bạn có chắc chắn muốn xóa khu vực **${areaToDelete?.name}**?`,
                isShowCloseBtn: true,
                isHideAction: false,
                customSecondText: "Xóa",
                actionConfirm: confirmDelete,
            });
        }
    };

    const filteredArea = listArea?.data?.filter(area =>
        area?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    let dialogProps = {};
    switch (dialogState.mode) {
        case 'add':
            dialogProps = {
                title: 'Tạo Khu vực mới',
                data: newAreaData,
                onDataChange: handleInputChange,
                isLoading: isAddingArea,
            };
            break;
        case 'edit':
            dialogProps = {
                title: `Chỉnh sửa Khu vực: ${dialogState.editingArea?.name || ''}`,
                data: dialogState.editingArea,
                onDataChange: handleInputChange,
                isLoading: isEditingArea,
            };
            break;
        default:
            dialogProps = {};
    }

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
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                    >
                        Quản lý toàn bộ khu vực
                    </Typography>
                </Box>

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

                    <Button
                        variant="contained"
                        startIcon={<AddOutlinedIcon />}
                        onClick={handleOpenAddDialog}
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

                <Row sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: '2rem',
                }}>
                    {loadingArea ? (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Đang tải danh sách khu vực...</Typography>
                    ) : filteredArea.length === 0 ? (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>Không tìm thấy khu vực nào.</Typography>
                    ) : (
                        filteredArea.map((area, index) => (
                            <Box key={area?.id || index}
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        sm: "0 0 calc(50% - 1rem)",
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
                                    createBy={`Người tạo: ${area?.users_permissions_user?.username}`}
                                    isEdit={true}
                                    isAssign={false}
                                    isDelete={true}
                                    equipment={false}
                                    onActionEdit={() => {
                                        handleOpenEditDialog(area);
                                    }}
                                    onActionDelete={() => {
                                        handleDelete(area.documentId);
                                    }}
                                />
                            </Box>
                        ))
                    )}
                </Row>

                {dialogState.mode && (
                    <CommonDialog
                        open={dialogState.open}
                        onClose={handleCloseDialog}
                        mode={dialogState.mode}
                        onSubmit={handleSubmit}
                        {...dialogProps}
                    />
                )}

            </Box>
        </BoxContainer>
    )
}

export default AreaPage;