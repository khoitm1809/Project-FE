import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { BoxBeetwen, CloseButton, CloseIcon, MainButton } from './commonStyled';
import { closeModal } from '../store/helper/helperSlice';
import dayjs from 'dayjs';
import FormField from './FormField';

// Hàm lấy giá trị lồng nhau (không cần sửa)
const getNestedValue = (obj, path) => {
    if (!obj || typeof obj !== 'object' || !path) return null;

    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
        if (current && current[part] !== undefined) {
            current = current[part];
        } else {
            return null;
        }
    }
    return current;
};

// Đã sửa: Làm sạch dữ liệu và chuyển đổi trường quan hệ sang ID
const transformDataForEdit = (selectedData, dialogTitle) => {
    if (!selectedData) return {};

    // Khởi tạo transformedData CHỈ với các trường cần thiết, tránh copy metadata
    const transformedData = {};

    // 1. Lặp qua cấu hình form để chỉ lấy các trường liên quan
    dialogTitle.forEach(field => {
        const fieldKey = field.key;
        let fieldValue = selectedData[fieldKey]; // Giá trị gốc

        if (field.mappingKey) {
            // Trường có mappingKey (ví dụ: barn.id)
            fieldValue = getNestedValue(selectedData, field.mappingKey);
        } else if (typeof fieldValue === 'object' && fieldValue !== null && (fieldValue.documentId || fieldValue.id)) {
            // Trường quan hệ không có mappingKey (ví dụ: pig_type, users_permissions_user)
            fieldValue = fieldValue.id; // Lấy ID số nguyên của quan hệ
        }

        // Đặt giá trị vào transformedData
        if (fieldValue !== undefined) {
            transformedData[fieldKey] = fieldValue;
        }

        // Xử lý giá trị mặc định cho các trường bị disabled/không có giá trị
        if (field.isDisable && transformedData[fieldKey] === undefined && field.defaultValue !== undefined) {
            transformedData[fieldKey] = field.defaultValue;
        }
    });

    // 2. Xử lý các trường thời gian
    Object.keys(transformedData).forEach(key => {
        const field = dialogTitle.find(f => f.key === key);
        if (field?.isDateTime && transformedData[key]) {
            transformedData[key] = dayjs(transformedData[key]);
        }
    });

    // 3. (QUAN TRỌNG) Loại bỏ các trường ID/documentId bị rò rỉ nếu chúng có mặt
    // Mặc dù ta đã cố gắng không copy, nhưng đây là lớp bảo vệ cuối cùng.
    // Lưu ý: selectedData.id (ID số nguyên của Strapi) cần được giữ lại trong selectedData
    // để dùng trong API call, KHÔNG phải trong formData.
    delete transformedData.documentId;
    delete transformedData.createdAt;
    delete transformedData.updatedAt;
    delete transformedData.publishedAt;
    delete transformedData.id; // Đảm bảo ID số nguyên không được gửi trong body

    return transformedData;
};


// Đã sửa: Logic chuyển đổi payload (không cần sửa thêm)
const transformPayload = (formData, dialogTitle) => {
    return Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        const fieldConfig = dialogTitle.find(f => f.key === key);

        // Bỏ qua trường 'id' nếu nó được truyền vào formData
        if (key === 'id') {
            return acc;
        }

        let finalValue;
        if (dayjs.isDayjs(value)) {
            finalValue = value.toISOString();
        } else if (fieldConfig?.isNumber) {
            const numValue = Number(value);
            if (value === "" || value === null || isNaN(numValue)) {
                finalValue = null;
            } else {
                finalValue = numValue;
            }
        } else if (value === "" || value === null) {
            finalValue = null;
        } else {
            finalValue = value;
        }

        // Chỉ thêm vào payload nếu giá trị không phải là null
        if (finalValue !== null) {
            acc[key] = finalValue;
        }

        return acc;
    }, {});
};

export default function EditDataDialog({
    dialogTitle,
    mutationEditFunction,
    refetch
}) {
    const dispatch = useDispatch();
    const { isOpen, selectedData } = useSelector((state) => state.helper);

    const [formData, setFormData] = React.useState({});

    React.useEffect(() => {
        if (isOpen && selectedData) {
            const prefilledData = transformDataForEdit(selectedData, dialogTitle);
            setFormData(prefilledData);
        }
    }, [isOpen, selectedData, dialogTitle]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const finalPayloadData = transformPayload(formData, dialogTitle);

            const finalPayload = {
                id: selectedData?.documentId,
                ...finalPayloadData
            };

            // 3. THỰC HIỆN CHỈNH SỬA
            await mutationEditFunction(finalPayload).unwrap();

            refetch();
            dispatch(closeModal());
        } catch (error) {
            console.error("Save (Edit) error:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => dispatch(closeModal())} maxWidth="md" fullWidth>
            <DialogTitle>
                <BoxBeetwen>
                    <Typography fontWeight="bold">Cập nhật</Typography>
                    <CloseButton onClick={() => dispatch(closeModal())}><CloseIcon /></CloseButton>
                </BoxBeetwen>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {dialogTitle
                        ?.filter(field => !field.isHiddenInEdit)
                        .map((field) => (
                            <FormField
                                key={field.key}
                                field={field}
                                disabled={field.isDisable}
                                value={formData[field.key]}
                                onChange={handleChange}
                            />
                        ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <MainButton onClick={handleSave} variant="contained">Lưu</MainButton>
            </DialogActions>
        </Dialog>
    );
}