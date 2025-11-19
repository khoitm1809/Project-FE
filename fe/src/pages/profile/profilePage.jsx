import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export function ProfilePage() {
    return (
        <Box p={{ xs: 2, lg: 4 }} >
            {/* Title */}
            <Box mb={4}>
                <Typography variant="h4" mb={1}>
                    Trang cá nhân
                </Typography>
                <Typography color="text.secondary">
                    Quản lý thông tin cá nhân của bạn
                </Typography>
            </Box>

            <Grid spacing={3} >
                {/* Profile Card */}
                <Grid item xs={12} lg={4} sx={{ marginY: '2rem' }}>
                    <Card>
                        <CardContent sx={{ pt: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    src="https://github.com/shadcn.png"
                                    sx={{ width: 120, height: 120 }}
                                />
                                <Box textAlign="center" mt={2}>
                                    <Typography variant="h5">Nguyễn Văn A</Typography>
                                    <Typography color="text.secondary">
                                        Quản trị viên
                                    </Typography>
                                </Box>

                                <Button fullWidth sx={{ mt: 2 }} variant="contained">
                                    Thay đổi ảnh
                                </Button>
                            </Box>

                            {/* Profile Info */}
                            <Box mt={4} display="flex" flexDirection="column" gap={2}>
                                <Box display="flex" gap={1} alignItems="center">
                                    <Mail size={18} />
                                    <Typography color="text.secondary">
                                        nguyenvana@example.com
                                    </Typography>
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <Phone size={18} />
                                    <Typography color="text.secondary">+84 123 456 789</Typography>
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <MapPin size={18} />
                                    <Typography color="text.secondary">
                                        Hà Nội, Việt Nam
                                    </Typography>
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <Calendar size={18} />
                                    <Typography color="text.secondary">
                                        Tham gia: Tháng 1, 2024
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Form */}
                <Grid item xs={12} lg={8} sx={{ marginY: '2rem' }}>
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Thông tin cá nhân</Typography>}
                        />
                        <CardContent>
                            <Box component="form" display="flex" flexDirection="column" gap={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Họ"
                                            defaultValue="Nguyễn Văn"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Tên" defaultValue="A" />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    defaultValue="nguyenvana@example.com"
                                />

                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    defaultValue="+84 123 456 789"
                                />

                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    defaultValue="Hà Nội, Việt Nam"
                                />

                                <TextField
                                    fullWidth
                                    label="Giới thiệu"
                                    multiline
                                    rows={4}
                                    defaultValue="Tôi là một quản trị viên hệ thống với nhiều năm kinh nghiệm trong lĩnh vực công nghệ thông tin."
                                />

                                <Box display="flex" gap={2} pt={2}>
                                    <Button variant="contained" type="submit">
                                        Lưu thay đổi
                                    </Button>
                                    <Button variant="outlined" type="button">
                                        Hủy
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Statistics Card */}
                <Grid item xs={12} sx={{ marginY: '2rem' }}>
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Thống kê hoạt động</Typography>}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#e3f2fd" }}
                                    >
                                        <Typography color="text.secondary">
                                            Dự án hoàn thành
                                        </Typography>
                                        <Typography variant="h4">24</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#e8f5e9" }}
                                    >
                                        <Typography color="text.secondary">
                                            Nhiệm vụ đang thực hiện
                                        </Typography>
                                        <Typography variant="h4">8</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#fff9c4" }}
                                    >
                                        <Typography color="text.secondary">
                                            Đánh giá trung bình
                                        </Typography>
                                        <Typography variant="h4">4.8</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#f3e5f5" }}
                                    >
                                        <Typography color="text.secondary">Giờ làm việc</Typography>
                                        <Typography variant="h4">1,240</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
