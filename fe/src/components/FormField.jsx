import * as React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TextFieldCustom } from './commonStyled'; // Giả định import từ file chung
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const FormField = React.memo(({ field, value, onChange }) => {
    // Giá trị hiện tại, chuyển null/undefined sang chuỗi rỗng để TextField không cảnh báo
    // Đối với trường số, nó có thể là số, nên cần ép về chuỗi rỗng nếu rỗng.
    const displayValue = value === null || value === undefined ? "" : value; 

    return (
        // Chia cột 12 (full width) cho note, 6 (half width) cho các trường khác
        <Grid item xs={12} sm={field.key === "note" ? 12 : 6}>
            
            {field?.isDropDown || field?.isStatus ? (
                /* Case 1: Dropdown / Select */
                <FormControl fullWidth sx={{ minWidth: "200px" }}>
                    <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
                    <Select
                        labelId={`${field.key}-label`}
                        id={field.key}
                        value={displayValue} 
                        onChange={(e) => onChange(field.key, e.target.value)}
                        label={field?.label}
                    >
                        {field?.list?.map((item, index) => (
                            <MenuItem value={item?.value} key={index}>
                                {item?.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            ) : field?.isDateTime ? (
                /* Case 2: DateTime Picker */
                <DateTimePicker
                    sx={{ background: "#e8e7e7ff" }}
                    label={field.label}
                    value={value ? dayjs(value) : null}
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                    }}
                    onChange={(newValue) => onChange(field.key, newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                />

            ) : (
                /* Case 3: Text Field (Bao gồm cả Number Field) */
                <TextFieldCustom
                    fullWidth
                    label={field?.label} 
                    placeholder={field?.label}
                    variant="outlined"
                    // Dùng type="number" nếu isNumber là true
                    type={field.isNumber ? "number" : "text"} 
                    value={displayValue}
                    // Khi thay đổi, giá trị e.target.value luôn là string
                    onChange={(e) => onChange(field.key, e.target.value)} 
                    // Xử lý multiline cho note
                    multiline={field.key === "note"}
                    rows={field.key === "note" ? 3 : 1}
                    // Props bổ sung cho Number fields (như min=0)
                    InputProps={{ inputProps: field.isNumber ? { min: 0 } : {} }} 
                />
            )}
        </Grid>
    );
});

export default FormField;