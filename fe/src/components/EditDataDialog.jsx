import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { BoxBeetwen, CloseButton, CloseIcon, MainButton } from './commonStyled';
import { closeModal } from '../store/helper/helperSlice';
import dayjs from 'dayjs';
import FormField from './FormField';

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

const transformDataForEdit = (selectedData, dialogTitle) => {
    if (!selectedData) return {};

    // Khởi tạo form data bằng dữ liệu gốc
    let transformedData = { ...selectedData };
    
    dialogTitle.forEach(field => {
        // Kiểm tra nếu đây là Dropdown và có mappingKey
        if (field.isDropDown && field.mappingKey) {
            // Lấy ID/Giá trị từ đường dẫn lồng nhau (ví dụ: "role.id")
            const value = getNestedValue(selectedData, field.mappingKey); 
            
            // Đặt giá trị ID này vào key chính của form (ví dụ: key: "role")
            transformedData[field.key] = value;
        }
        
        // Xử lý các trường có thể bị ẩn trong form Edit (ví dụ: password)
        if (field.key === 'password' || field.isHiddenInEdit) {
            delete transformedData[field.key];
        }
        
        // Đảm bảo các giá trị date/time được chuyển thành đối tượng Dayjs
        if (field.isDateTime && transformedData[field.key]) {
            transformedData[field.key] = dayjs(transformedData[field.key]);
        }
    });

    return transformedData;
};


const transformPayload = (formData, dialogTitle) => {
    return Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        const fieldConfig = dialogTitle.find(f => f.key === key);
        
        let finalValue;

        if (dayjs.isDayjs(value)) {
            // 1. Xử lý Date/Time: Chuyển sang ISO string
            finalValue = value.toISOString();
        } else if (fieldConfig?.isNumber) {
            // 2. Xử lý Number:
            const numValue = Number(value);
            // Giá trị rỗng hoặc NaN -> null
            if (value === "" || value === null || isNaN(numValue)) {
                finalValue = null; 
            } else {
                finalValue = numValue;
            }
        } else if (value === "" || value === null) {
            // 3. Xử lý String/Dropdown: Nếu là chuỗi rỗng hoặc null -> null
            finalValue = null;
        } else {
            // 4. Giữ nguyên các giá trị khác
            finalValue = value;
        }

        // LOẠI BỎ LOGIC: Nếu finalValue là null, KHÔNG thêm trường đó vào acc
        if (finalValue !== null) {
            acc[key] = finalValue;
        }
        
        return acc;
    }, {});
};

export default function EditDataDialog({
    dialogTitle,
    mutationEditFunction, // Chỉ cần Edit function
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
    }, [isOpen, selectedData, dialogTitle]); // dialogTitle cần là dependency vì nó chứa mapping config

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            // 1. Lấy dữ liệu form
            const payloadWithId = { ...formData };
            
            // 2. Chuyển đổi payload (loại bỏ null/empty string)
            // Lưu ý: ID của đối tượng (ví dụ: user.id) phải được truyền vào mutationEditFunction
            // Bạn cần đảm bảo ID (ví dụ: key 'id') được giữ lại trong formData
            const finalPayload = transformPayload(payloadWithId, dialogTitle);

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
                        ?.filter(field => !field.isHiddenInEdit) // Lọc bỏ các trường không muốn hiển thị khi Edit
                        .map((field) => (
                        <FormField
                            key={field.key}
                            field={field}
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