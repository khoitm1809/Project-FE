import {
    Card,
    CardContent,
    IconButton,
    Chip,
    Typography,
    Box,
    Tooltip,
    Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import dayjs from "dayjs";
import { Row } from "./commonStyled";
import { useGetListFeedSettingQuery } from "../store/warehouse/feedSettingsAction";
import { SettingsIcon } from "lucide-react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
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
    const {
        data: listfeedSettings,
    } = useGetListFeedSettingQuery({}, { skip: !feedSetting, refetchOnMountOrArgChange: true })

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
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ fontSize: "1.05rem" }}>
                        {name}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

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
                        {feedSetting && <Tooltip title="Cài đặt Thức ăn">
                            <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                onActionFeedSetting?.();
                            }}>
                                <RestaurantOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}
                        {equipment && <Tooltip title="Cài đặt Vật tư">
                            <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                onActionEquipment?.();
                            }}>
                                <ConstructionOutlinedIcon fontSize="small" />
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
            </Box>
            <Row gap={'0.4rem'} px={2} pb={0}>
                <Typography
                    variant="body2"
                    sx={{ color: "gray", }}>
                    {createBy}
                </Typography>
            </Row>
            <Divider sx={{ marginTop: '1rem' }} />

            <CardContent>
                <Typography
                    variant="body2"
                    sx={{ color: "gray", minHeight: "40px" }}
                >
                    {description}
                </Typography>
                {feedSetting && <Row gap={'0.4rem'} >
                    <Typography
                        variant="body2"
                        sx={{ color: "gray", minHeight: "20px" }}>
                        Feed Setting:
                    </Typography>
                </Row>}
                {equipment && <Row gap={'0.4rem'} mt={"0.4rem"}>
                    <Row
                        sx={{ color: "gray", minHeight: "20px" }}>
                        Equipment Setting: {data?.barn_equipments?.map((item, index) => (
                            <Typography key={index}>{`${item?.name}, `}</Typography>
                        ))}
                    </Row>
                </Row>}
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
                    <Box>
                        <Chip
                            label={nameCount + arrayCount}
                            sx={{
                                bgcolor: "#f2f2f2",
                                fontWeight: 500,
                            }}
                        />
                    </Box>
                    <ChevronRightIcon sx={{ color: "gray" }} />
                </Box>
            </CardContent>


        </Card >
    );
};

export default CardInfo;
