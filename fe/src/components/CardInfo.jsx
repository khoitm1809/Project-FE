import React from 'react';
import {
    Card,
    CardContent,
    IconButton,
    Chip,
    Typography,
    Box,
    Tooltip,
    Divider,
    Avatar,
    Stack,
    useTheme,
    alpha
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Thêm icon lịch
import dayjs from "dayjs";
import { useGetListFeedSettingQuery } from "../store/warehouse/feedSettingsAction";

const CardInfo = ({
    name,
    data,
    description,
    nameCount,
    publishedAt,
    arrayCount,
    createBy,
    isOwner,
    onClick,
    isEdit,
    isAssign,
    isDelete,
    onActionAssign,
    onActionEdit,
    onActionDelete,
    feedSetting,
    equipment,
    onActionFeedSetting,
    onActionEquipment
}) => {
    const theme = useTheme();
    // Logic query giữ nguyên

    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: "16px", // Bo tròn mềm mại hơn
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.02)", // Shadow mặc định rất nhẹ
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: 'relative',
                overflow: 'visible', // Để hiệu ứng hover không bị cắt
                "&:hover": {
                    borderColor: "primary.light", // Đổi màu viền khi hover
                    boxShadow: "0px 12px 24px -4px rgba(0,0,0,0.1)", // Nổi khối rõ hơn
                    transform: "translateY(-4px)",
                },
            }}
        >
            {/* HEADER SECTION */}
            <Box p={2.5} pb={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: "1.1rem",
                                lineHeight: 1.3,
                                color: "text.primary",
                                mb: 0.5
                            }}
                        >
                            {name}
                        </Typography>

                        {/* Người tạo */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary" }}>
                            <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={500}>
                                {createBy}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Action Buttons Group */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                            backgroundColor: alpha(theme.palette.grey[200], 0.5),
                            padding: '4px',
                            borderRadius: '10px'
                        }}
                    >
                        {isOwner && (
                            <>
                                {isAssign && (
                                    <Tooltip title="Phân công">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onActionAssign?.(); }}>
                                            <AddIcon fontSize="small" sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {isEdit && (
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onActionEdit?.(); }}>
                                            <EditIcon fontSize="small" sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {feedSetting && (
                                    <Tooltip title="Cài đặt Thức ăn">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onActionFeedSetting?.(); }}>
                                            <RestaurantOutlinedIcon fontSize="small" sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {equipment && (
                                    <Tooltip title="Cài đặt Vật tư">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onActionEquipment?.(); }}>
                                            <ConstructionOutlinedIcon fontSize="small" sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {isDelete && (
                                    <Tooltip title="Xóa">
                                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onActionDelete?.(); }}>
                                            <DeleteIcon fontSize="small" sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </Stack>
                </Stack>
            </Box>

            <Divider dashed />

            {/* BODY SECTION */}
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        minHeight: "40px",
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Giới hạn 2 dòng nếu quá dài
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {description || "Chưa có mô tả"}
                </Typography>

                <Stack spacing={2}>
                    {/* Feed Setting Section - Đã cập nhật logic render */}
                    {feedSetting && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <RestaurantOutlinedIcon fontSize='inherit' color="action" /> Cấu hình thức ăn
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {/* Kiểm tra mảng barn_feed_settings (hoặc tên field tương ứng từ API của bạn) */}
                                {data?.barn_feed_settings?.length > 0 ? (
                                    data.barn_feed_settings.map((item) => {
                                        // Giả định cấu trúc data item: { id, feed: { name }, amount/quantity }
                                        // Bạn cần điều chỉnh feedName và amount theo đúng API trả về
                                        const feedName = item?.feed?.name || item?.name || "N/A";
                                         const quantity = item?.quantityInstalled ?? 0;

                                        return (
                                            <Chip
                                                key={item?.id || Math.random()}
                                                label={feedName}
                                                avatar={
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: theme.palette.success.main, // Dùng màu xanh lá cho thức ăn để khác biệt
                                                            color: '#fff !important',
                                                            width: 30,
                                                            height: 30,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {quantity}
                                                    </Avatar>
                                                }
                                                size="medium"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.success.main, 0.08),
                                                    color: theme.palette.success.dark,
                                                    fontWeight: 500,
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.success.main, 0.2),
                                                    '& .MuiChip-label': { paddingRight: '8px' }
                                                }}
                                            />
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Chưa có cấu hình
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Equipment Setting Section */}
                    {equipment && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ConstructionOutlinedIcon fontSize='inherit' color="action" /> Vật tư & Thiết bị
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {data?.barn_equipments?.length > 0 ? (
                                    data.barn_equipments.map((item) => {
                                        const quantity = item?.quantityInstalled ?? 0;
                                        return (
                                            <Chip
                                                key={item?.id}
                                                label={item?.name}
                                                avatar={
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: theme.palette.primary.main,
                                                            color: '#fff !important',
                                                            width: 30,
                                                            height: 30,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {quantity}
                                                    </Avatar>
                                                }
                                                size="medium"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    color: theme.palette.primary.dark,
                                                    fontWeight: 500,
                                                    border: '1px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    '& .MuiChip-label': { paddingRight: '8px' }
                                                }}
                                            />
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        Chưa có vật tư
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Stack>

                {/* FOOTER META INFO */}
                <Box mt={3} pt={2} borderTop="1px dashed" borderColor="divider" display="flex" justifyContent="space-between" alignItems="center">
                    {/* Ngày tạo */}
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.disabled" }}>
                        <CalendarTodayIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                            {publishedAt ? dayjs(publishedAt).format("DD/MM/YYYY") : "N/A"}
                        </Typography>
                    </Stack>

                    {/* Badge Count */}
                    <Chip
                        label={nameCount + arrayCount}
                        size="small"
                        deleteIcon={<ChevronRightIcon />}
                        onDelete={onClick} // Hack để hiện icon bên phải
                        sx={{
                            height: 24,
                            bgcolor: "action.hover",
                            color: "text.primary",
                            fontWeight: 600,
                            cursor: 'pointer',
                            '& .MuiChip-deleteIcon': {
                                color: "text.secondary",
                                fontSize: 18,
                                margin: '0 4px 0 -4px'
                            },
                            '&:hover': {
                                bgcolor: "action.selected"
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardInfo;