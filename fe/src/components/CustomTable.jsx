import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, InputAdornment, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { BoxBeetwen, Column, FilterButton, MainButton, Row, SecondaryButton, TextFieldCustom } from './commonStyled';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { THEME } from '../utils/ThemeConstants';
import Draggable from 'react-draggable';

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

export default function CustomTable({ title, data, isEdit }) {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

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
                        <Typography>Thêm khu</Typography>
                    </BoxBeetwen>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Column>
                            <Row>
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                            </Row>
                            <Row>
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                            </Row>
                            <Row>
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                                <TextFieldCustom
                                    label="Tên khu"
                                    variant="outlined"
                                />
                            </Row>
                        </Column>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose}>Subscribe</Button>
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
                                    {col}
                                </TableCell>
                            ))}
                            {isEdit && <TableCell sx={{ fontWeight: "bold" }}>Sửa</TableCell>}
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {data?.map((item, rowIndex) => {
                            const values = Object.values(item); // lấy tất cả value theo thứ tự key
                            return (
                                <TableRow key={rowIndex}>
                                    {title?.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            {values[colIndex]}
                                        </TableCell>
                                    ))}
                                    {isEdit && (
                                        <TableCell>
                                            <IconButton
                                                sx={{
                                                    borderRadius: "50%",
                                                    width: "2rem",
                                                    height: "2rem",
                                                    background: THEME.THEME_BACKGROUND,
                                                    "&:hover": { background: THEME.THEME_BACKGROUND },
                                                }}
                                                onClick={() =>
                                                    navigate(`${ROUTES.DETAIL_PAGE}`, { state: { item } })
                                                }
                                            >
                                                <ModeEditOutlineOutlinedIcon
                                                    sx={{ color: THEME.SECONDARY_TEXT_BUTTON, fontSize: "1rem" }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
