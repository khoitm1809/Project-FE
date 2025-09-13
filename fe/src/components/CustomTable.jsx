import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, IconButton, Input, InputAdornment, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { BoxBeetwen, FilterButton, MainButton, Row, SecondaryButton, TextFieldCustom } from './commonStyled';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { THEME } from '../utils/ThemeConstants';


export default function CustomTable({ title, data, isEdit }) {
    const navigate = useNavigate()


    return (
        <Box>
            <Typography variant='14700'>
                Bảng danh sách
            </Typography>
            <BoxBeetwen sx={{ marginY: '1.5rem' }}>
                <Row gap={'0.6rem'}>
                    <MainButton sx={{ padding: '0rem 1.4rem' }} onClick={() => navigate(ROUTES.ADD_NEW_ACCOUNT)}>
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
