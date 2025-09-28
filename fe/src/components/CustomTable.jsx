import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
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
            cancel={'[class*="MuiDialogContent-root"]'}
        >
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
    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <BoxBeetwen>
                        <Typography>Thêm tài khoản</Typography>
                        <Button onClick={handleClose}>
                            <CloseOutlinedIcon></CloseOutlinedIcon>
                        </Button>
                    </BoxBeetwen>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Column>
                            <Row>
                                <TextFieldCustom
                                    label="Họ và tên"
                                    variant="outlined"
                                />
                                <TextFieldCustom
                                    label="Email"
                                    variant="outlined"
                                />
                            </Row>
                            <Row>
                                <TextFieldCustom
                                    label="Tên đăng nhập"
                                    variant="outlined"
                                />
                                <TextFieldCustom
                                    label="Số điện thoại"
                                    variant="outlined"
                                />
                            </Row>
                            <Row>
                                <TextFieldCustom
                                    label="Cơ sở"
                                    variant="outlined"
                                />
                                <Select
                                    label="Quyền"
                                    variant="standard"
                                    sx={{ width: '100%' }}
                                >
                                    {Object.values(ROLES)?.map((role, index) => (
                                        <MenuItem key={index} value={role}>{role}</MenuItem>
                                    ))}
                                    {/* <MenuItem value="admin"></MenuItem> */}
                                    {/* <MenuItem value="owner">Chủ trang trại</MenuItem>
                                    <MenuItem value="worker">Nhân công</MenuItem> */}
                                </Select>
                            </Row>
                        </Column>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Tạo mới</Button>
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