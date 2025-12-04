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
    InputLabel
} from "@mui/material";


const CommonDialog = ({
    open,
    onClose,
    title,
    mode,
    data,
    onDataChange,
    onSubmit,
    isLoading,
    assignProps,
    equipmentProps
}) => {

    const renderEquipmentContent = () => {
        if (!equipmentProps) return null;
        const { availableEquipments, formData, onFormChange } = equipmentProps;

        // --- LOGIC MỚI: Tìm tên thiết bị dựa trên ID đã chọn ---
        const selectedEquipment = availableEquipments?.find(
            (item) => (item.documentId || item.id) === formData.warehouseItemId
        );
        const autoName = selectedEquipment ? selectedEquipment.name : '';
        // -------------------------------------------------------

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                <DialogContentText>
                    Chọn thiết bị từ kho và nhập số lượng cần lắp đặt.
                </DialogContentText>

                {/* Select chọn Thiết bị */}
                <FormControl fullWidth>
                    <InputLabel id="equipment-select-label">Chọn thiết bị</InputLabel>
                    <Select
                        labelId="equipment-select-label"
                        id="equipment-select"
                        name="warehouseItemId"
                        value={formData.warehouseItemId || ''}
                        label="Chọn thiết bị"
                        onChange={onFormChange}
                    >
                        {availableEquipments?.length > 0 ? (
                            availableEquipments.map((item) => (
                                <MenuItem key={item.documentId || item.id} value={item.documentId || item.id}>
                                    {item.name} (Tồn kho: {item.quantity || 0})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="" disabled>
                                <em>Không có thiết bị khả dụng trong kho</em>
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>

                {/* --- FIELD MỚI: Tên thiết bị (Disabled & Auto-filled) --- */}
                <TextField
                    fullWidth
                    label="Tên thiết bị (Tự động)"
                    name="name"
                    value={autoName} // Giá trị tự động lấy từ logic ở trên
                    disabled // Disable field này
                    InputLabelProps={{ shrink: true }} // Đảm bảo label không bị đè lên text
                    sx={{
                        "& .MuiOutlinedInput-root": { 
                            borderRadius: "8px", 
                            backgroundColor: "#e0e0e0" // Màu nền xám đậm hơn chút để rõ là disabled
                        },
                         "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#333", // Giữ màu chữ đậm cho dễ đọc dù bị disable
                        },
                    }}
                />

                {/* Input nhập Số lượng */}
                <TextField
                    fullWidth
                    label="Số lượng lắp đặt"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onFormChange}
                    InputProps={{ inputProps: { min: 1 } }}
                    required
                    placeholder="Nhập số lượng..."
                    sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                    }}
                />
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

    // --- Submit Button Text ---
    const getSubmitButtonText = () => {
        if (isLoading) return 'Đang lưu...';
        switch (mode) {
            case 'add': return 'Tạo';
            case 'edit': return 'Lưu thay đổi';
            case 'assign': return 'Lưu phân công';
            case 'equipment': return 'Thêm thiết bị';
            default: return 'Lưu';
        }
    };

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
                    {mode === 'add' || mode === 'edit' ? renderFormContent() :
                        mode === 'assign' ? renderAssignContent() :
                            mode === 'equipment' ? renderEquipmentContent() :
                                null}
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
                        disabled={isLoading}
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