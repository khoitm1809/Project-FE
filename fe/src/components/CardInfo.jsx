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
    isShowAction,
    onActionAdd

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

                {isOwner && isShowAction && <Box>
                    <Tooltip title="Phân công" >
                        <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            onActionAdd?.();
                        }}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={onEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton size="small" color="error" onClick={onDelete}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
