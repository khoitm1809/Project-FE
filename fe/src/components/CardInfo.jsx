import {
    Card,
    CardContent,
    IconButton,
    Chip,
    Typography,
    Box,
    Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";

const CardInfo = ({
    name,
    description,
    nameCount,
    publishedAt,
    arrayCount,
    isOwner,
    onEdit,
    onDelete,
    onClick,
    isEdit,
    isAssign,
    isDelete,
    onActionAssign,
    onActionEdit,
    onActionDelete

}) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: "14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "0.25s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                pb={0}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ fontSize: "1.05rem" }}
                >
                    {name}
                </Typography>

                {isOwner && <Box>
                    {isAssign && <Tooltip title="Phân công" >
                        <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            onActionAssign?.();
                        }}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>}
                    {isEdit && <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            onActionEdit?.();
                        }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>}
                    {isDelete && <Tooltip title="Xóa">
                        <IconButton size="small" color="error" onClick={(e) => {
                            e.stopPropagation();
                            onActionDelete?.();
                        }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>}
                </Box>}
            </Box>

            <CardContent>
                <Typography
                    variant="body2"
                    sx={{ color: "gray", minHeight: "40px" }}
                >
                    {description}
                </Typography>
                {publishedAt && (
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", mt: 1, display: "block" }}
                    >
                        Ngày tạo: {dayjs(publishedAt).format("DD/MM/YYYY")}
                    </Typography>
                )}
                <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Chip
                        label={`${nameCount}${arrayCount}`}
                        sx={{
                            bgcolor: "#f2f2f2",
                            fontWeight: 500,
                        }}
                    />
                    <ChevronRightIcon sx={{ color: "gray" }} />
                </Box>
            </CardContent>


        </Card>
    );
};

export default CardInfo;
