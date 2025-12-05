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
import { useEditWarehouseItemMutation, useGetListWarehouseItemQuery, useLazyGetListWarehouseItemQuery } from "../../store/warehouse/warehouseItemAction";

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
    const [deleteEquipment, { isLoading: isDeletingEquipment }] = useDeleteEquipmentMutation();

    const [addFeedSetting, { isLoading: isAddingFeedSetting }] = useAddFeedSettingMutation();
    const [deleteFeedSetting, { isLoading: isDeletingFeedSetting }] = useDeleteFeedSettingMutation();

    const [editWareHouseItem] = useEditWarehouseItemMutation();

    const [feedForm, setFeedForm] = useState({
        warehouseItemId: null,
        quantity: null,
        name: null,
    });

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
            warehouseItems: result.data || [],
            currentSettings: barn.barn_feed_settings || barn.feed_settings || []
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

    const handleFeedFormChange = (e) => {
        const { name, value } = e.target;
        setFeedForm(prev => ({
            ...prev,
            [name]: value,
        }));
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
                    const qtyFeed = Number(feedForm.quantity);
                    const currentFeedId = feedForm.warehouseItemId;

                    // Check tồn kho
                    const selectedFeedItem = dialogState.warehouseItems.find(
                        item => (item.documentId || item.id) === currentFeedId
                    );

                    if (selectedFeedItem && (selectedFeedItem.totalLeft || 0) < qtyFeed) {
                        openDialog({
                            type: MESSAGE_TYPE.ERROR,
                            message: `Số lượng tồn kho không đủ! (Còn: ${selectedFeedItem.totalLeft})`,
                            isShowCloseBtn: true,
                            isHideAction: true,
                        });
                        return;
                    }

                    // Gọi API thêm Feed Setting
                    await addFeedSetting({
                        barn: dialogState.selectedBarnId,
                        warehouse_item: currentFeedId,
                        quantityInstalled: qtyFeed, // Lưu ý tên trường trong API feed_settings (quantity hay quantityInstalled?)
                        name: feedForm.name,
                    }).unwrap();

                    // Trừ tồn kho
                    if (selectedFeedItem) {
                        const newTotalLeft = (selectedFeedItem.totalLeft || 0) - qtyFeed;
                        await editWareHouseItem({
                            id: currentFeedId,
                            totalLeft: newTotalLeft < 0 ? 0 : newTotalLeft
                        }).unwrap();
                    }
                    break;

                    break;
                case 'equipment':
                    const qtyInstalled = Number(equipmentForm.quantity);
                    const currentItemId = equipmentForm.warehouseItemId;

                    // 1. Tìm thiết bị đang chọn trong danh sách để lấy totalLeft hiện tại
                    const selectedItem = dialogState.warehouseItems.find(
                        item => (item.documentId || item.id) === currentItemId
                    );


                    // 2. Thêm thiết bị vào chuồng (API cũ)
                    await addEquipment({
                        barn: dialogState.selectedBarnId,
                        warehouse_item: currentItemId,
                        quantityInstalled: qtyInstalled,
                        name: equipmentForm.name,
                    }).unwrap();

                    // 3. Cập nhật trừ tồn kho (API mới)
                    // Logic: totalLeft Mới = totalLeft Cũ - Số lượng lắp
                    if (selectedItem) {
                        const newTotalLeft = (selectedItem.totalLeft || 0) - qtyInstalled;

                        await editWareHouseItem({
                            id: currentItemId, // Hoặc documentId tùy vào API của bạn yêu cầu gì
                            totalLeft: newTotalLeft < 0 ? 0 : newTotalLeft
                        }).unwrap();
                    }
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

    const handleDeleteInstalledEquipment = async (installedItem) => {
        if (!installedItem) return;

        try {
            const qtyReturn = Number(installedItem.quantityInstalled);
            const warehouseItemId = installedItem.warehouse_item?.id || installedItem.warehouse_item; // Tùy cấu trúc API trả về object hay ID

            // 2. Gọi API xóa thiết bị khỏi chuồng
            await deleteEquipment(installedItem.documentId || installedItem.id).unwrap();

            // 3. Trả lại số lượng vào kho (Nếu tìm thấy ID kho)
            if (warehouseItemId) {
                // Tìm item trong list warehouseItems hiện có để lấy totalLeft hiện tại
                // Hoặc gọi API get detail nếu cần chính xác tuyệt đối. 
                // Ở đây giả sử lấy từ list đã load:
                const warehouseItem = dialogState.warehouseItems.find(
                    item => (item.documentId || item.id) === warehouseItemId
                );

                if (warehouseItem) {
                    const newTotalLeft = (warehouseItem.totalLeft || 0) + qtyReturn;

                    await editWareHouseItem({
                        id: warehouseItemId,
                        totalLeft: newTotalLeft
                    }).unwrap();
                }
            }

            refetch();

            // Cập nhật lại state editingBarn để Dialog hiển thị list mới nhất ngay lập tức
            const updatedBarn = listBarn?.data?.find(b => b.documentId === dialogState.selectedBarnId);
            if (updatedBarn) {
                setDialogState(prev => ({
                    ...prev,
                    editingBarn: updatedBarn
                }));
            }

        } catch (error) {
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: "Không thể xóa thiết bị",
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };

    const handleDeleteFeedSetting = async (feedItem) => {
        if (!feedItem) return;

        // Confirm (tùy chọn)
        // const confirm = window.confirm(`Bạn muốn xóa cấu hình thức ăn này?`);
        // if (!confirm) return;

        try {
            const qtyReturn = Number(feedItem.quantity || 0); // Lưu ý field quantity bên feed setting tên là gì (giả sử là quantity)
            const warehouseItemId = feedItem.warehouse_item?.id || feedItem.warehouse_item;

            // Gọi API xóa
            await deleteFeedSetting(feedItem.documentId || feedItem.id).unwrap();

            // Trả lại tồn kho
            if (warehouseItemId) {
                const warehouseItem = dialogState.warehouseItems.find(
                    item => (item.documentId || item.id) === warehouseItemId
                );

                if (warehouseItem) {
                    const newTotalLeft = (warehouseItem.totalLeft || 0) + qtyReturn;
                    await editWareHouseItem({
                        id: warehouseItemId,
                        totalLeft: newTotalLeft
                    }).unwrap();
                }
            }

            await refetch();

            // Cập nhật lại list trong dialog
            const updatedBarn = listBarn?.data?.find(b => b.documentId === dialogState.selectedBarnId);
            if (updatedBarn) {
                setDialogState(prev => ({ ...prev, editingBarn: updatedBarn }));
            }

        } catch (error) {
            console.error("Lỗi xóa feed:", error);
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: "Không thể xóa cấu hình thức ăn",
                isShowCloseBtn: true,
                isHideAction: true,
            });
        }
    };

    const filteredBarns = listBarn?.data?.filter(barn =>
        barn?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barn?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleEquipmentFormChange = (e) => {
        const { name, value } = e.target;

        setEquipmentForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    let dialogProps = {};
    const barnToAssignName = listBarn?.data?.find(barn => barn.documentId === dialogState.selectedBarnId)?.name;
    // console.log(dialogState,'"???')
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
                isLoading: isAddingFeedSetting || isDeletingFeedSetting || isLoadingWarehouse,
                feedProps: { // Đổi tên prop cho khớp logic mới
                    availableFeeds: dialogState.warehouseItems,
                    formData: feedForm,
                    onFormChange: handleFeedFormChange,
                    currentSettings: dialogState.editingBarn?.barn_feed_settings || dialogState.editingBarn?.feed_settings || [],
                    onDelete: handleDeleteFeedSetting // Hàm xóa
                },
            };
            break;
        case 'equipment':
            dialogProps = {
                title: `Quản lý thiết bị: ${dialogState.editingBarn?.name || ''}`,
                isLoading: isAddingEquipment || isDeletingEquipment || isLoadingWarehouse,
                equipmentProps: {
                    availableEquipments: dialogState.warehouseItems, // List lấy từ API
                    formData: equipmentForm,                         // State form
                    onFormChange: handleEquipmentFormChange,         // Hàm change
                    onDelete: handleDeleteInstalledEquipment,
                    currentInstalled: dialogState.editingBarn?.barn_equipments || [], // List đã lắp
                    onDelete: handleDeleteInstalledEquipment
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