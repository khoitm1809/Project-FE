import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

export default function CustomTable({ title, data, isEdit }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                {/* Table Head */}
                <TableHead>
                    <TableRow>
                        {title.map((col, i) => (
                            <TableCell key={i} sx={{ fontWeight: "bold" }}>
                                {col}
                            </TableCell>
                        ))}
                        {isEdit && <TableCell sx={{ fontWeight: "bold" }}>Sửa</TableCell>}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {data.map((item, rowIndex) => {
                        const values = Object.values(item); // lấy tất cả value theo thứ tự key
                        return (
                            <TableRow key={rowIndex}>
                                {title.map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {values[colIndex]}
                                    </TableCell>
                                ))}
                                {isEdit && (
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => console.log("Edit:", item)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
