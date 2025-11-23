import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { BoxBeetwen, CloseButton, CloseIcon, MainButton } from './commonStyled';
import { closeModal } from '../store/helper/helperSlice';
import dayjs from 'dayjs';
import FormField from './FormField';

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
            if (value === "" || isNaN(numValue)) {
                finalValue = null; // Gán tạm là null
            } else {
                finalValue = numValue;
            }
        } else if (value === "" || value === null) {
            // 3. Xử lý String/Dropdown: Nếu là chuỗi rỗng -> Gán tạm là null
            finalValue = null;
        } else {
            // 4. Giữ nguyên các giá trị khác
            finalValue = value;
        }

        // LOẠI BỎ LOGIC QUAN TRỌNG: Nếu finalValue là null, KHÔNG thêm trường đó vào acc
        if (finalValue !== null) {
            acc[key] = finalValue;
        }
        
        return acc;
    }, {});
};

export default function AddDataDialog({
    dialogTitle,
    mutationAddFunction, 
    refetch
}) {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.helper); 

    const [formData, setFormData] = React.useState({});

    // EFFECT: Khởi tạo form khi modal mở
    React.useEffect(() => {
        if (isOpen) {
            const defaults = dialogTitle.reduce((acc, f) => {
                acc[f.key] = "";
                return acc;
            }, {});
            setFormData(defaults);
        }
    }, [isOpen, dialogTitle]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const finalPayload = transformPayload(formData, dialogTitle);
            
            await mutationAddFunction(finalPayload).unwrap(); 

            refetch();
            dispatch(closeModal()); 
        } catch (error) {
            console.error("Save (Add) error:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => dispatch(closeModal())} maxWidth="md" fullWidth>
            <DialogTitle>
                <BoxBeetwen>
                    <Typography fontWeight="bold">Thêm mới</Typography>
                    <CloseButton onClick={() => dispatch(closeModal())}><CloseIcon /></CloseButton>
                </BoxBeetwen>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {dialogTitle?.map((field) => (
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