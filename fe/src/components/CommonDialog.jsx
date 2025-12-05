// src/components/ReusableBarnDialog.jsx

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Divider
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CommonDialog = ({
    open, onClose, title, mode, data, onDataChange, onSubmit, isLoading,
    assignProps, equipmentProps, feedProps
}) => {
    // --- Biến kiểm tra validation (đưa ra ngoài để dùng chung cho cả renderContent và Button Submit) ---
    let isOverStock = false;
        console.log(feedProps)
    // Hàm xử lý chung để tìm item và check tồn kho (tránh lặp code)
    const checkStock = (items, formId, formQty) => {
        const selected = items?.find(i => (i.documentId || i.id) === formId);
        const max = selected?.totalLeft || 0;
        const current = Number(formQty);
        return {
            isError: formId && current > max,
            maxQty: max,
            selectedItem: selected
        };
    };

    const renderEquipmentContent = () => {
        if (!equipmentProps) return null;
        const { availableEquipments, formData, onFormChange, currentInstalled, onDelete } = equipmentProps;

        // Tìm thiết bị đang chọn
        const selectedEquipment = availableEquipments?.find(
            (item) => (item.documentId || item.id) === formData.warehouseItemId
        );
        const autoName = selectedEquipment ? selectedEquipment.name : '';

        // --- LOGIC CHECK TỒN KHO ---
        const maxQuantity = selectedEquipment?.totalLeft || 0;
        const currentQuantity = Number(formData.quantity);

        // Nếu đã chọn thiết bị VÀ số lượng nhập > tồn kho => Lỗi
        isOverStock = formData.warehouseItemId && currentQuantity > maxQuantity;
        // ---------------------------

        const handleSelectChange = (e) => {
            const selectedId = e.target.value;
            onFormChange(e);
            const item = availableEquipments?.find(
                (i) => (i.documentId || i.id) === selectedId
            );
            if (item) {
                onFormChange({
                    target: {
                        name: 'name',
                        value: item.name
                    }
                });
            }
        };

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                <DialogContentText>
                    Chọn thiết bị từ kho để thêm mới.
                </DialogContentText>

                {/* --- PHẦN 1: FORM THÊM MỚI (Giữ nguyên) --- */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="equipment-select-label">Chọn thiết bị</InputLabel>
                            <Select
                                labelId="equipment-select-label"
                                name="warehouseItemId"
                                value={formData.warehouseItemId || ''}
                                label="Chọn thiết bị"
                                onChange={handleSelectChange}
                            >
                                {availableEquipments?.length > 0 ? (
                                    availableEquipments.map((item) => (
                                        <MenuItem key={item.documentId || item.id} value={item.documentId || item.id}>
                                            {item.name} (Kho: {item?.totalLeft || 0})
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled><em>Hết hàng</em></MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            size="small"
                            label="Số lượng"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={onFormChange}
                            error={isOverStock}
                            helperText={isOverStock ? `Quá tồn kho (${maxQuantity})` : ""}
                            InputProps={{ inputProps: { min: 1, max: maxQuantity } }}
                        />
                    </Box>
                    {/* TextField Tên tự động (ẩn hoặc để readonly như cũ tùy bạn, ở đây tôi thu gọn lại cho đẹp) */}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* --- PHẦN 2: DANH SÁCH ĐÃ LẮP ĐẶT (Mới) --- */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                        Danh sách thiết bị trong chuồng ({currentInstalled?.length || 0}):
                    </Typography>

                    <Box sx={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        bgcolor: '#fafafa',
                        borderRadius: 1,
                        border: '1px solid #eee'
                    }}>
                        {currentInstalled?.length > 0 ? (
                            <List dense>
                                {currentInstalled.map((item, index) => (
                                    <ListItem
                                        key={item.id || index}
                                        divider={index !== currentInstalled.length - 1}
                                        secondaryAction={
                                            // Nút xóa chỉ hiện khi hover hoặc luôn hiện (ở đây để luôn hiện cho dễ dùng trên mobile)
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => onDelete?.(item)} // Gọi hàm xóa từ cha
                                                sx={{ color: '#d32f2f' }}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`Đã lắp: ${item.quantityInstalled || 0}`}
                                            primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="caption" sx={{ p: 2, display: 'block', color: 'text.disabled', textAlign: 'center' }}>
                                Chưa có thiết bị nào được lắp.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    // --- Render Form Content (Add/Edit) ---
    const renderFormContent = () => (
        <>
            <TextField
                fullWidth
                placeholder="Tên chuồng..."
                name="name"
                onChange={onDataChange}
                value={data?.name || ''}
                required
                disabled={isLoading}
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
                onChange={onDataChange}
                value={data?.description || ''}
                required
                multiline
                rows={3}
                disabled={isLoading}
                sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5", borderRadius: "8px", "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" }, "& textarea": { fontSize: "0.95rem" } },
                    "& .MuiInputBase-input::placeholder": { color: "#999" },
                }}
            />
        </>
    );

    // --- Render Assign Content ---
    const renderAssignContent = () => {
        if (!assignProps) return null;
        const { descriptionText, listWorker, selectedWorkerId, onWorkerSelect } = assignProps;

        return (
            <>
                <DialogContentText sx={{ mb: 2 }}>
                    {descriptionText}
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
                            onChange={onWorkerSelect}
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
            </>
        );
    };

    const renderFeedContent = () => {
        if (!feedProps) return null;
        const { availableFeeds, formData, onFormChange, currentSettings, onDelete } = feedProps;
        // Check tồn kho
        const { isError, maxQty, selectedItem } = checkStock(availableFeeds, formData.warehouseItemId, formData.quantity);
        console.log(currentSettings)
        // Cập nhật biến cờ global
        if (mode === 'feed') isOverStock = isError;

        const handleSelectChange = (e) => {
            const selectedId = e.target.value;
            onFormChange(e);
            const item = availableFeeds?.find(i => (i.documentId || i.id) === selectedId);
            if (item) onFormChange({ target: { name: 'name', value: item.name } });
        };

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                <DialogContentText>Chọn loại thức ăn và nhập định lượng.</DialogContentText>

                {/* Form Thêm */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="feed-select-label">Loại thức ăn</InputLabel>
                            <Select
                                labelId="feed-select-label"
                                name="warehouseItemId"
                                value={formData.warehouseItemId || ''}
                                label="Loại thức ăn"
                                onChange={handleSelectChange}
                            >
                                {availableFeeds?.length > 0 ? (
                                    availableFeeds?.map((item) => (
                                        <MenuItem key={item.documentId || item.id} value={item.documentId || item.id}>
                                            {item.name} (Kho: {item?.totalLeft || 0})
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled><em>Hết hàng</em></MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth size="small" label="Số lượng / Định lượng" type="number"
                            name="quantity" value={formData.quantity} onChange={onFormChange}
                            error={isError}
                            helperText={isError ? `Quá tồn kho (${maxQty})` : ""}
                            InputProps={{ inputProps: { min: 1, max: maxQty } }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Danh sách đã cấu hình */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                        Danh sách thức ăn đã thêm ({currentSettings?.length || 0}):
                    </Typography>
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eee' }}>
                        {currentSettings?.length > 0 ? (
                            <List dense>
                                {currentSettings?.map((item, index) => (
                                    <ListItem
                                        key={item.id || index}
                                        divider={index !== currentSettings.length - 1}
                                        secondaryAction={
                                            <IconButton edge="end" size="small" onClick={() => onDelete?.(item)} sx={{ color: '#d32f2f' }}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={item?.name}
                                            secondary={`Số lượng: ${item?.quantityInstalled || 0}`} // Hoặc item.amount tùy API trả về
                                            primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="caption" sx={{ p: 2, display: 'block', color: 'text.disabled', textAlign: 'center' }}>Chưa có cấu hình thức ăn.</Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    // --- Submit Button Text ---
    const getSubmitButtonText = () => {
        if (isLoading) return 'Đang lưu...';
        switch (mode) {
            case 'add': return 'Tạo';
            case 'edit': return 'Lưu thay đổi';
            case 'assign': return 'Lưu phân công';
            case 'equipment': return 'Thêm thiết bị';
            case 'feed': return 'Thêm thức ăn'; // Thêm text cho nút
            default: return 'Lưu';
        }
    };

    // Gọi hàm render trước để tính toán biến isOverStock
    const content = mode === 'add' || mode === 'edit' ? renderFormContent() :
        mode === 'assign' ? renderAssignContent() :
            mode === 'equipment' ? renderEquipmentContent() :
                mode === 'feed' ? renderFeedContent() : null;

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: "12px", paddingTop: "4px" } }}
        >
            <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: 700, pb: 1.5 }}>
                {title}
            </DialogTitle>

            <form onSubmit={onSubmit}>
                <DialogContent
                    dividers
                    sx={{ border: "none", pt: 2, pb: 1, "& .MuiDialogContent-root": { border: "none" } }}
                >
                    {/* Render nội dung đã được gán vào biến content */}
                    {content}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        sx={{ textTransform: "none", color: "#444", borderRadius: "8px", px: 2, "&:hover": { backgroundColor: "#eee" } }}
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading || ((mode === 'equipment' || mode === 'feed') && isOverStock)}
                        sx={{ textTransform: "none", borderRadius: "8px", px: 3, background: mode === 'assign' ? 'black' : undefined }}
                    >
                        {getSubmitButtonText()}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CommonDialog;