import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { BoxBeetwen, Column, FilterButton, MainButton, Row, SecondaryButton, TextFieldCustom } from './commonStyled';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
            {field.isDropDown ? (
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


export default function CustomTable({ title, data, isEdit, detailNavigate, mutationAddFunction, mutationEditFunction, mutationDeleteFunction, loading }) {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);
    const [isBtnEdit, setIsBtnEdit] = React.useState(false)
    const [formData, setFormData] = React.useState(
        title?.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
    );
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

    const handleSave = () => {
        if (isBtnEdit) {
            mutationEditFunction(formData)
        } else {
            mutationAddFunction(formData)
        }
        handleClose();
    };

    const handleOpenEdit = (item) => {
        setFormData(item);
        setOpen(true);
        setIsBtnEdit(true)
    };

    const handleDelete = (id) => {
        mutationDeleteFunction(id)
    }



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
                        <Typography>Thêm hàng hóa</Typography>
                        <Button onClick={handleClose}>
                            <CloseOutlinedIcon />
                        </Button>
                    </BoxBeetwen>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText component="div">
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

                <DialogActions sx={{ width: '100%' }}>
                    <BoxBeetwen>
                        <Button onClick={handleSave} variant="contained">
                            Lưu
                        </Button>
                    </BoxBeetwen>
                </DialogActions>
            </Dialog>



            <Typography variant='14700'>
                Bảng danh sách
            </Typography>
            <BoxBeetwen sx={{ marginY: '1.5rem' }}>
                <Row gap={'0.6rem'}>
                    <MainButton sx={{ padding: '0rem 1.4rem' }} onClick={handleClickOpen}>
                        Thêm mới
                    </MainButton>
                </Row>
                <Row gap={'1rem'}>
                    <TextFieldCustom slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            )
                        }
                    }} placeholder='Tìm kiếm...' variant='outlined' />
                    <FilterButton endIcon={<TuneOutlinedIcon />}>Filters</FilterButton>
                </Row>
            </BoxBeetwen>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    {/* Table Head */}
                    <TableHead>
                        <TableRow>
                            {title?.map((col, i) => (
                                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            {isEdit && (
                                <TableCell sx={{ fontWeight: "bold" }}>Sửa</TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {loading ? (
                            // Show skeleton rows while loading
                            [...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {title?.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton variant="text" width="80%" height={20} />
                                        </TableCell>
                                    ))}
                                    {isEdit && (
                                        <TableCell>
                                            <Skeleton variant="circular" width={32} height={32} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : data?.length > 0 ? (
                            data?.map((item, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {title?.map((col, colIndex) => {
                                        const rawValue = getValueByPath(item, col.key);
                                        return (
                                            <TableCell
                                                key={colIndex}
                                                onClick={() => navigate(detailNavigate)}
                                                sx={{ cursor: detailNavigate ? "pointer" : "default" }}
                                            >
                                                {formatValue(col.key, rawValue)}
                                            </TableCell>
                                        );
                                    })}
                                    {isEdit && (
                                        <TableCell>
                                            <Row>
                                                <IconButton
                                                    sx={{
                                                        borderRadius: "50%",
                                                        width: "2rem",
                                                        height: "2rem",
                                                        background: "#f0f0f0",
                                                        "&:hover": { background: "#ddd" },
                                                    }}
                                                    onClick={() => handleOpenEdit(item)}>
                                                    <ModeEditOutlineOutlinedIcon
                                                        sx={{ color: "#333", fontSize: "1rem" }}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    sx={{
                                                        borderRadius: "50%",
                                                        width: "2rem",
                                                        height: "2rem",
                                                        background: "#f0f0f0",
                                                        "&:hover": { background: "#ddd" },
                                                    }}
                                                    onClick={() => handleDelete(item?._id)}>
                                                    <DeleteOutlineOutlinedIcon
                                                        sx={{ color: "#333", fontSize: "1rem" }}
                                                    />
                                                </IconButton>
                                            </Row>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            // No data case
                            <TableRow>
                                <TableCell colSpan={title?.length + (isEdit ? 1 : 0)} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box >
    );
}

