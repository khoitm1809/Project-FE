import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { BoxBeetwen, Column, FilterButton, MainButton, Row, SecondaryButton, TextFieldCustom } from './commonStyled';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { THEME } from '../utils/ThemeConstants';
import Draggable from 'react-draggable';
import { ROLES } from '../utils/rolesConstant';
import dayjs from 'dayjs';

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

export default function CustomTable({ title, data, isEdit, detailNavigate }) {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

    const getValueByPath = (obj, path) => {
        return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    };
    const formatValue = (key, value) => {
        if (!value) return "-";

        if (key.toLowerCase().includes("date") || key.toLowerCase().includes("created_at")) {
            return dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : value;
        }

        return value;
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [formData, setFormData] = React.useState(
        title.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
    );

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        console.log("Form data:", formData);
        handleClose();
    };


    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                PaperProps={{
                    sx: {
                        width: "50%",
                        height: "60%",
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
                            {title.map((field) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={field.key === "note" ? 12 : 6}
                                    key={field.key}
                                >
                                    {field.isDropDown ? (
                                        <FormControl sx={{ minWidth: '200px' }}>
                                            <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={null}
                                                // onChange={handleChange}
                                                autoWidth
                                                label="Age"
                                            >
                                                {field?.list?.map((item, index) => (
                                                    <MenuItem value={item?.value} key={index}>{item?.label}</MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextFieldCustom
                                            fullWidth
                                            label={field.label}
                                            variant="outlined"
                                            value={formData[field.key]}
                                            onChange={(e) =>
                                                handleChange(field.key, e.target.value)
                                            }
                                            multiline={field.key === "note"}
                                            rows={field.key === "note" ? 3 : 1}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSave} variant="contained">
                        Tạo mới
                    </Button>
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
                        {data?.map((item, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {title?.map((col, colIndex) => {
                                    const rawValue = getValueByPath(item, col.key);
                                    return (
                                        <TableCell key={colIndex}
                                            onClick={() => navigate(detailNavigate)}
                                            sx={{ cursor: detailNavigate ? 'pointer' : 'default' }}
                                        >
                                            {formatValue(col.key, rawValue)}
                                        </TableCell>
                                    );
                                })}
                                {isEdit && (
                                    <TableCell>
                                        <IconButton
                                            sx={{
                                                borderRadius: "50%",
                                                width: "2rem",
                                                height: "2rem",
                                                background: "#f0f0f0",
                                                "&:hover": { background: "#ddd" },
                                            }}
                                            onClick={() =>
                                                navigate("/detail-page", { state: { item } })
                                            }
                                        >
                                            <ModeEditOutlineOutlinedIcon
                                                sx={{ color: "#333", fontSize: "1rem" }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}