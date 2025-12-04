import { Box, Button, TextField, Typography } from "@mui/material";
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
import CommonDialog from "../../components/CommonDialog";
import { useAddEquipmentMutation, useDeleteEquipmentMutation, useEditEquipmentMutation } from "../../store/warehouse/equipmentsAction";
import { useAddFeedSettingMutation, useDeleteFeedSettingMutation, useEditFeedSettingMutation } from "../../store/warehouse/feedSettingsAction";
import { useGetListWarehouseItemQuery, useLazyGetListWarehouseItemQuery } from "../../store/warehouse/warehouseItemAction";

const BarnPage = () => {
    const location = useLocation();
    const areaId = location?.state;
    const role = localStorage.getItem("role");
    const UID = localStorage.getItem("UID");
    const navigate = useNavigate();

    const { openDialog } = useConfirmDialog()

    const [searchTerm, setSearchTerm] = useState('');

    const [dialogState, setDialogState] = useState({
        open: false,
        mode: null,
        editingBarn: null,
        selectedBarnId: null,
        warehouseItems: [],
    });

    const [newBarnData, setNewBarnData] = useState({
        name: '',
        description: '',
    });

    const [selectedWorkerId, setSelectedWorkerId] = useState(null);

    const [addBarn, { isLoading: isAddingBarn }] = useAddBarnMutation();
    const [editBarn, { isLoading: isEditingBarn }] = useEditBarnMutation();
    const [deleteBarn, { isLoading: isDeletingBarn }] = useDeleteBarnMutation();

    const [addEquipment, { isLoading: isAddingEquipment }] = useAddEquipmentMutation();
    const [editEquipment, { isLoading: isEditingEquipment }] = useEditEquipmentMutation();
    const [deleteEquipment, { isLoading: isDeletingEquipment }] = useDeleteEquipmentMutation();

    const [addFeedSetting, { isLoading: isAddingFeedSetting }] = useAddFeedSettingMutation();
    const [editFeedSetting, { isLoading: isEditingFeedSetting }] = useEditFeedSettingMutation();
    const [deleteFeedSetting, { isLoading: isDeletingFeedSetting }] = useDeleteFeedSettingMutation();


    const [equipmentForm, setEquipmentForm] = useState({
        warehouseItemId: null,
        quantity: null,
        name: null,
    });

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

    const [getList, { isLoading: isLoadingWarehouse }] = useLazyGetListWarehouseItemQuery();

    const handleCloseDialog = () => {
        setDialogState({ open: false, mode: null, editingBarn: null, selectedBarnId: null, warehouseItems: [] });
        setNewBarnData({ name: '', description: '' });
        setSelectedWorkerId(null);
    };

    const handleOpenAddDialog = () => {
        setDialogState({ open: true, mode: 'add', editingBarn: null, selectedBarnId: null, warehouseItems: [] });
        setNewBarnData({ name: '', description: '' });
    };

    const handleOpenEditDialog = (barn) => {
        setDialogState({ open: true, mode: 'edit', editingBarn: barn, selectedBarnId: null, warehouseItems: [] });
        setNewBarnData({ name: barn.name, description: barn.description });
    };

    const handleOpenAssignWorkerDialog = (barnId) => {
        const currentBarn = listBarn?.data?.find(barn => barn?.documentId === barnId);
        const currentWorkerId = currentBarn?.users_permissions_user?.id || null;

        setDialogState({ open: true, mode: 'assign', editingBarn: null, selectedBarnId: barnId, warehouseItems: [] });
        setSelectedWorkerId(currentWorkerId);
    };

    const handleOpenFeedDialog = async (barn) => {
        // try {
        const result = await getList({ itemType: 'feed' }).unwrap();
        setDialogState({
            open: true,
            mode: 'feed',
            editingBarn: barn,
            selectedBarnId: barn.documentId,
            warehouseItems: result.data || []
        });
        // } catch (error) {
        //     console.error("Lỗi khi lấy danh sách thức ăn:", error);
        //     openDialog({
        //         type: MESSAGE_TYPE.ERROR,
        //         message: "Không thể tải danh sách thức ăn",
        //         isShowCloseBtn: true,
        //         isHideAction: true,
        //     });
        // }
    };

    const handleOpenEquipmentDialog = async (barn) => {
        // try {
        const result = await getList({ itemType: 'equipment' }).unwrap();
        setDialogState({
            open: true,
            mode: 'equipment',
            editingBarn: barn,
            selectedBarnId: barn.documentId,
            warehouseItems: result.data || []
        });
        // } catch (error) {
        //     console.error("Lỗi khi lấy danh sách thiết bị:", error);
        //     openDialog({
        //         type: MESSAGE_TYPE.ERROR,
        //         message: "Không thể tải danh sách thiết bị",
        //         isShowCloseBtn: true,
        //         isHideAction: true,
        //     });
        // }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBarnData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (dialogState.mode === 'edit') {
            setDialogState(prev => ({
                ...prev,
                editingBarn: {
                    ...prev.editingBarn,
                    [name]: value
                }
            }));
        }
    };

    const handleWorkerSelect = (event) => {
        setSelectedWorkerId(event.target.value === "" ? null : event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            switch (dialogState.mode) {
                case 'add':
                    if (isAddingBarn || !newBarnData.name || !newBarnData.description) return;
                    await addBarn({
                        area: areaId,
                        ...newBarnData,
                    }).unwrap();
                    break;
                case 'edit':
                    if (isEditingBarn || !dialogState.editingBarn) return;
                    await editBarn({
                        id: dialogState.editingBarn.documentId,
                        name: dialogState.editingBarn.name,
                        description: dialogState.editingBarn.description
                    }).unwrap();
                    break;
                case 'assign':
                    if (isEditingBarn || !dialogState.selectedBarnId) return;
                    const workerId = selectedWorkerId || null;
                    await editBarn({
                        id: dialogState.selectedBarnId,
                        users_permissions_user: workerId
                    }).unwrap();
                    break;
                case 'feed':
                    await addFeedSetting({

                    })

                    break;
                case 'equipment':
                    // Validate dữ liệu
                    // if (!equipmentForm.warehouseItemId || !equipmentForm.quantity) {
                    //     openDialog({
                    //         type: MESSAGE_TYPE.WARNING,
                    //         message: "Vui lòng chọn thiết bị và nhập số lượng",
                    //         isShowCloseBtn: true,
                    //         isHideAction: true,
                    //     });
                    //     return;
                    // }
                   
                    await addEquipment({
                        barn: dialogState.selectedBarnId,
                        warehouse_item: equipmentForm.warehouseItemId, // ID thiết bị chọn từ list
                        quantityInstalled: Number(equipmentForm.quantity), // Số lượng nhập vào,
                        name: null
                    }).unwrap();
                    break;
                default:
                    return;
            }

            handleCloseDialog();
            await refetch();
        } catch (error) {
            console.error(`Lỗi khi thực hiện hành động ${dialogState.mode}:`, error);
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: `Đã xảy ra lỗi`,
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };
    console.log(dialogState.selectedBarnId, '????')
    const handleDeleteBarn = async (barnToDelete) => {
        if (!barnToDelete?.documentId || isDeletingBarn) return;

        if (barnToDelete.pigs?.length > 0) {
            openDialog({
                type: MESSAGE_TYPE.WARNING,
                message: `Chuồng còn ${barnToDelete.pigs.length} con lợn. Bạn phải xóa hết lợn khỏi chuồng trước khi xóa chuồng này.`,
                isShowCloseBtn: true,
                isHideAction: true,
                customSecondText: "Đã hiểu",
            });
            return;
        }

        const confirmDelete = async () => {
            try {
                await deleteBarn(barnToDelete.documentId).unwrap();
                await refetch();
            } catch (error) {
            }
        };

        openDialog({
            type: MESSAGE_TYPE.CONFIRM,
            message: `Bạn có chắc chắn muốn xóa chuồng **${barnToDelete.name}**? Hành động này không thể hoàn tác.`,
            isShowCloseBtn: true,
            isHideAction: false,
            customSecondText: "Xóa",
            actionConfirm: confirmDelete,
        });
    };

    const filteredBarns = listBarn?.data?.filter(barn =>
        barn?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barn?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleEquipmentFormChange = (e) => {
        const { name, value } = e.target;
        setEquipmentForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    let dialogProps = {};
    const barnToAssignName = listBarn?.data?.find(barn => barn.documentId === dialogState.selectedBarnId)?.name;

    switch (dialogState.mode) {
        case 'add':
            dialogProps = {
                title: 'Tạo Chuồng mới',
                data: newBarnData,
                onDataChange: handleInputChange,
                isLoading: isAddingBarn,
            };
            break;
        case 'edit':
            dialogProps = {
                title: `Chỉnh sửa Chuồng: ${dialogState.editingBarn?.name || ''}`,
                data: dialogState.editingBarn,
                onDataChange: handleInputChange,
                isLoading: isEditingBarn,
            };
            break;
        case 'assign':
            dialogProps = {
                title: 'Phân công nhân viên',
                isLoading: isEditingBarn,
                assignProps: {
                    descriptionText: `Chọn nhân viên phụ trách chuồng **${barnToAssignName || ''}**:`,
                    listWorker: listWorker,
                    selectedWorkerId: selectedWorkerId,
                    onWorkerSelect: handleWorkerSelect,
                },
            };
            break;
        case 'feed':
            dialogProps = {
                title: `Cấu hình thức ăn: ${dialogState.editingBarn?.name || ''}`,
                isLoading: isAddingFeedSetting || isEditingFeedSetting || isDeletingFeedSetting || isLoadingWarehouse,
                feedProps: {
                    availableFeeds: dialogState.warehouseItems,
                    currentSettings: dialogState.editingBarn?.feed_settings || [],
                },
            };
            break;
        case 'equipment':
            dialogProps = {
                title: `Quản lý thiết bị: ${dialogState.editingBarn?.name || ''}`,
                isLoading: isAddingEquipment || isEditingEquipment || isDeletingEquipment || isLoadingWarehouse,
                equipmentProps: {
                    availableEquipments: dialogState.warehouseItems, // List lấy từ API
                    formData: equipmentForm,                         // State form
                    onFormChange: handleEquipmentFormChange,         // Hàm change
                },
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
                        Quản lý Chuồng
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                    >
                        Quản lý toàn bộ chuồng trong khu vực {areaId}
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

                    {role === ROLES.OWNER && <Button
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
                    </Button>}
                </Box>

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
                                        barnId: barn?.id,
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
                                    data={barn}
                                    description={barn?.description}
                                    publishedAt={barn?.publishedAt}
                                    nameCount={"Số lợn: "}
                                    arrayCount={barn?.pigs?.length}
                                    isOwner={role === ROLES.OWNER}
                                    createBy={`Người phụ trách: ${barn?.users_permissions_user?.username || 'Chủ trang trại'}`}
                                    isAssign={true}
                                    onActionAssign={() => handleOpenAssignWorkerDialog(barn?.documentId)}
                                    isEdit={true}
                                    equipment={true}
                                    feedSetting={true}
                                    feeedSettingData={barn?.feed_settings}
                                    onActionFeedSetting={(e) => {
                                        handleOpenFeedDialog(barn);
                                    }}
                                    onActionEquipment={(e) => {
                                        handleOpenEquipmentDialog(barn);
                                    }}
                                    onActionEdit={(e) => {
                                        handleOpenEditDialog(barn);
                                    }}
                                    isDelete={true}
                                    onActionDelete={(e) => {
                                        handleDeleteBarn(barn);
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

export default BarnPage;