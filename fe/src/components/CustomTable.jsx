import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { BoxBeetwen, Column, FilterButton, MainButton, Row, SecondaryButton, TextFieldCustom, CloseIcon, CloseButton, EditButton, DeleteButton } from './commonStyled';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { THEME } from '../utils/ThemeConstants';
import Draggable from 'react-draggable';
import { ROLES } from '../utils/rolesConstant';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function PaperComponent(props) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

const FormField = React.memo(({ field, value, onChange }) => {
    return (
        <Grid item xs={12} sm={field.key === "note" ? 12 : 6}>
            {(field?.isDropDown || field?.isStatus) ? (
                <FormControl sx={{ minWidth: "200px" }}>
                    <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
                    <Select
                        labelId={`${field.key}-label`}
                        id={field.key}
                        value={value ?? ""}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        autoWidth
                    >
                        {field?.list?.map((item, index) => (
                            <MenuItem value={item?.value} key={index}>
                                {item?.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : field.isDateTime ? (
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
                <TextFieldCustom
                    fullWidth
                    placeholder={field?.label}
                    variant="outlined"
                    value={value ?? ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    multiline={field.key === "note"}
                    rows={field.key === "note" ? 3 : 1}
                />
            )}
        </Grid>
    );
});


export default function CustomTable({ title, data, isEdit, detailNavigate, mutationAddFunction, mutationEditFunction, mutationDeleteFunction, loading, refetch }) {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);
    const [isBtnEdit, setIsBtnEdit] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('');

    const [formData, setFormData] = React.useState(
        title?.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
    );

    const getStatusStyle = (value) => {
        switch (value) {
            case "active":
                return { background: "green", color: "white" };
            case "inactive":
                return { background: "goldenrod", color: "white" };
            case "pending":
                return { background: "red", color: "white" };
            default:
                return { background: "inherit", color: "inherit" };
        }
    };

    const getValueByPath = (obj, path) => {
        return path.split(".")?.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    };
    const formatValue = (key, value) => {
        if (value === null || value === undefined) return "-";

        if (typeof value === "boolean") {
            return value ? "true" : "false";
        }

        if (key.toLowerCase().includes("date") || key.toLowerCase().includes("created_at")) {
            return dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : value;
        }

        return value;
    };

    const filteredData = React.useMemo(() => {
        if (!searchTerm) return data;
        const lowerSearch = searchTerm.toLowerCase();

        return data?.filter((item) =>
            title?.some((col) => {
                const value = getValueByPath(item, col.key);
                return value?.toString()?.toLowerCase()?.includes(lowerSearch);
            })
        );
    }, [data, searchTerm, title]);


    const handleClickOpen = () => {
        setFormData([])
        setOpen(true);
        setIsBtnEdit(false)
    };

    const handleClose = () => {
        setOpen(false);
    };



    const handleChange = React.useCallback((key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }, [setFormData]);

    const handleSave = async () => {
        try {
            if (isBtnEdit) {
                await mutationEditFunction(formData).unwrap();
            } else {
                await mutationAddFunction(formData).unwrap();
            }
            refetch();
            handleClose();
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleOpenEdit = (item) => {
        setFormData(item);
        setOpen(true);
        setIsBtnEdit(true)
    };

    const handleDelete = async (id) => {
        try {
            await mutationDeleteFunction(id).unwrap();
            refetch();
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };


    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                PaperProps={{
                    sx: {
                        background: 'grey',
                        width: "50%",
                        height: "auto",
                        maxWidth: "none",
                    },
                }}
            >
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    <BoxBeetwen>
                        <Typography style={{ fontWeight: "bold" }}>Thêm hàng hóa</Typography>
                        <CloseButton onClick={handleClose}>
                            <CloseIcon />
                        </CloseButton>
                    </BoxBeetwen>
                </DialogTitle>

                <DialogContent style={{ background: "#c0c0c023" }}>
                    <DialogContentText style={{ marginTop: "30px" }} component="div">
                        <Grid container spacing={2}>
                            {title?.map((field) => (
                                <FormField
                                    key={field.key}
                                    field={field}
                                    value={formData[field.key]}
                                    onChange={handleChange}
                                />
                            ))}
                        </Grid>
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ width: '100%', justifyContent: "center" }}>
                    <BoxBeetwen>
                        <MainButton onClick={handleSave} variant="contained">
                            Lưu
                        </MainButton>
                    </BoxBeetwen>
                </DialogActions>
            </Dialog>


            <Box mb={4}>
                {/* TITLE */}
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                >
                    Danh sách sản phẩm
                </Typography>

                {/* SUBTITLE */}
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                >
                    Quản lý toàn bộ sản phẩm 
                </Typography>
            </Box>

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
                <Button
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleClickOpen}
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



            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "100%",
                    overflowX: "auto",
                    display: "block"
                }}
            >
                <Table aria-label="customized table">

                    <TableHead>
                        <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}> 
                            {title?.filter(col => col.key !== "password")?.map((col, i) => (
                                <TableCell
                                    key={i}
                                    sx={{
                                        fontWeight: 600,
                                        color: (theme) => theme.palette.text.primary, 
                                        padding: '12px 16px' 
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                            {isEdit && (
                                <TableCell sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary, padding: '12px 16px' }}>
                                    Hành động
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {title?.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton variant="rectangular" width="90%" height={24} sx={{ borderRadius: 1 }} />
                                        </TableCell>
                                    ))}
                                    {isEdit && (
                                        <TableCell>
                                            <Skeleton variant="circular" width={32} height={32} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : filteredData?.length > 0 ? (
                            // Hiển thị Dữ liệu
                            filteredData?.map((item, rowIndex) => {
                                const getStatusStyleMui = (value) => {
                                    const lowerValue = String(value).toLowerCase();
                                    switch (lowerValue) {
                                        case "active":
                                            return { background: '#e8f5e9', color: '#388e3c' };
                                        case "inactive":
                                            return { background: '#fff3e0', color: '#f57c00' };
                                        case "pending":
                                            return { background: '#ffebee', color: '#d32f2f' };
                                        default:
                                            return { background: (theme) => theme.palette.grey[100], color: (theme) => theme.palette.text.secondary };
                                    }
                                };
                                return (
                                    <TableRow
                                        key={rowIndex}
                                        sx={{
                                            '&:last-child td': { borderBottom: 'none' },
                                            '&:hover': {
                                                backgroundColor: detailNavigate ? (theme) => theme.palette.action.hover : 'inherit'
                                            },
                                        }}
                                    >
                                        {title?.filter(col => col.key !== "password")?.map((col, colIndex) => {
                                            const rawValue = getValueByPath(item, col.key);
                                            const isStatusField = col.key.toLowerCase().includes('status');
                                            const cellContent = formatValue(col.key, rawValue);
                                            const statusStyles = isStatusField ? getStatusStyleMui(rawValue) : {};

                                            return (
                                                <TableCell
                                                    key={colIndex}
                                                    onClick={() => detailNavigate && navigate(detailNavigate)}
                                                    sx={{
                                                        cursor: detailNavigate ? "pointer" : "default",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        component="span"
                                                        sx={{
                                                            ...(isStatusField ? {
                                                                padding: '4px 10px', 
                                                                borderRadius: '16px', 
                                                                fontWeight: 500,
                                                                textTransform: "capitalize",
                                                                ...statusStyles,
                                                                display: 'inline-block',
                                                            } : {}),
                                                            color: isStatusField ? statusStyles.color : (theme) => theme.palette.text.secondary
                                                        }}
                                                    >
                                                        {cellContent}
                                                    </Typography>
                                                </TableCell>
                                            );
                                        })}
                                        {isEdit && (
                                            <TableCell>
                                                <Row gap={'0.5rem'}>
                                                    <EditButton
                                                        onClick={() => handleOpenEdit(item)}
                                                        sx={{ '& svg': { fontSize: '1.1rem' } }}
                                                    >
                                                        <ModeEditOutlineOutlinedIcon />
                                                    </EditButton>
                                                    <DeleteButton
                                                        onClick={() => handleDelete(item?.id)}
                                                        sx={{ '& svg': { fontSize: '1.1rem' } }}
                                                    >
                                                        <DeleteOutlineOutlinedIcon />
                                                    </DeleteButton>
                                                </Row>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            // Trường hợp không có dữ liệu
                            <TableRow>
                                <TableCell colSpan={title?.length + (isEdit ? 1 : 0)} align="center">
                                    <Typography variant="body1" sx={{ color: 'text.secondary', py: 3 }}>
                                        Không có dữ liệu nào phù hợp.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box >
    );
}

