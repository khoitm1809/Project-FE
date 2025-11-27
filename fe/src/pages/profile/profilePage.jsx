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
import { useGetCurrentUserQuery } from "../../store/auth/authAction";

// Hàm tiện ích để định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return "Không rõ";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return "Lỗi định dạng ngày";
    }
};

// Hàm tiện ích để tính số lượng Published Items (Hoàn thành)
const countPublished = (data) => {
    let count = 0;
    // Lặp qua tất cả các mảng và đếm những mục có publishedAt
    const arraysToCount = [
        data?.pigs || [],
        data?.areas || [],
        data?.pig_types || [],
        data?.owners || []
    ];

    arraysToCount.forEach(arr => {
        arr.forEach(item => {
            if (item.publishedAt) {
                count++;
            }
        });
    });

    return count;
};

// Hàm tiện ích để tính số lượng nhiệm vụ đang thực hiện (Doing)
const countDoingTodos = (owners) => {
    if (!owners) return 0;
    // Lọc các mục trong 'owners' mà có 'publishedAt' khác null VÀ 'toDoStatus' là 'doing'
    // Hoặc chỉ đếm các mục có 'toDoStatus' là 'doing' tùy theo logic nghiệp vụ của bạn.
    // Tôi sẽ đếm các mục trong 'owners' có 'toDoStatus' là 'doing'
    return owners.filter(owner => owner.toDoStatus === "doing" && owner.publishedAt).length;
};


export function ProfilePage() {
    const UID = localStorage.getItem("UID")
    const {
        data: userData,
        isLoading: loadingUser,
        refetch
    } = useGetCurrentUserQuery(
        { UID },
        { refetchOnMountOrArgChange: true }
    );

    // Xử lý dữ liệu
    const user = userData || {};
    const userName = user.username || "Tên người dùng";
    const userEmail = user.email || "Chưa có email";
    const userRole = user.role?.name || "Chức danh không rõ";
    const joinDate = formatDate(user.createdAt);

    // Tính toán số liệu thống kê
    const completedProjects = countPublished(user); 
    const doingTasks = countDoingTodos(user.owners);
    const averageRating = "4.8";
    const workingHours = "1,240";

    // Nếu đang tải dữ liệu
    if (loadingUser) {
        return <Box p={{ xs: 2, lg: 4 }}><Typography>Đang tải thông tin người dùng...</Typography></Box>;
    }

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

            <Grid spacing={3}> 
                {/* Profile Card */}
                <Grid item xs={12} lg={4} mt={'2rem'}>
                    <Card>
                        <CardContent sx={{ pt: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    src="https://github.com/shadcn.png"
                                    sx={{ width: 120, height: 120 }}
                                />
                                <Box textAlign="center" mt={2}>
                                    <Typography variant="h5">{userName}</Typography>
                                    <Typography color="text.secondary">
                                        {userRole}
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
                                        {userEmail}
                                    </Typography>
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <Phone size={18} />
                                    <Typography color="text.secondary">+84 123 456 789</Typography> {/* Hardcoded - Cần field trong JSON */}
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <MapPin size={18} />
                                    <Typography color="text.secondary">
                                        Hà Nội, Việt Nam
                                    </Typography> {/* Hardcoded - Cần field trong JSON */}
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <Calendar size={18} />
                                    <Typography color="text.secondary">
                                        Tham gia: {joinDate}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Form */}
                <Grid item xs={12} lg={8} mt={'2rem'}>
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Thông tin cá nhân</Typography>}
                        />
                        <CardContent>
                            <Box component="form" display="flex" flexDirection="column" gap={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}> {/* Đổi thành 12 để hiển thị tên đầy đủ nếu không có tách Họ/Tên */}
                                        <TextField
                                            fullWidth
                                            label="Tên người dùng"
                                            defaultValue={userName}
                                            // value={userName} // Sử dụng value nếu có hàm onChange để cập nhật state
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Tên" defaultValue="A" />
                                    </Grid> */}
                                </Grid>

                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    defaultValue={userEmail}
                                    // value={userEmail}
                                    InputLabelProps={{ shrink: true }}
                                    disabled // Thường email là trường không thay đổi được
                                />

                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    defaultValue="+84 123 456 789" // Hardcoded - Cần field trong JSON
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    defaultValue="Hà Nội, Việt Nam" // Hardcoded - Cần field trong JSON
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    label="Giới thiệu"
                                    multiline
                                    rows={4}
                                    defaultValue="Tôi là một quản trị viên hệ thống với nhiều năm kinh nghiệm trong lĩnh vực công nghệ thông tin." // Hardcoded - Cần field trong JSON
                                    InputLabelProps={{ shrink: true }}
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
                <Grid item xs={12} mt={'2rem'}>
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Thống kê hoạt động</Typography>}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#e3f2fd" }}
                                    >
                                        <Typography color="text.secondary">
                                            Dự án hoàn thành
                                        </Typography>
                                        <Typography variant="h4">{completedProjects}</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#e8f5e9" }}
                                    >
                                        <Typography color="text.secondary">
                                            Nhiệm vụ đang thực hiện
                                        </Typography>
                                        <Typography variant="h4">{doingTasks}</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#fff9c4" }}
                                    >
                                        <Typography color="text.secondary">
                                            Đánh giá trung bình
                                        </Typography>
                                        <Typography variant="h4">{averageRating}</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        p={2}
                                        borderRadius={2}
                                        sx={{ backgroundColor: "#f3e5f5" }}
                                    >
                                        <Typography color="text.secondary">Giờ làm việc</Typography>
                                        <Typography variant="h4">{workingHours}</Typography>
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