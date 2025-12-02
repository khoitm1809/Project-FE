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
import { Mail, Phone, MapPin, Calendar, Notebook } from "lucide-react";
import { useEditUserMutation, useGetCurrentUserQuery, useImageUploadMutation } from "../../store/auth/authAction";
import { useRef, useState } from "react";
import AvatarCustom from "../../components/Avatar/AvataCustom";
import PreviewAvatar from "../../components/Avatar/PreviewAvatar";
import { Column, Row } from "../../components/commonStyled";
import { useLocation } from "react-router";

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

// Hàm tiện ích để tính số lượng finished Items (Hoàn thành)
const countPublished = (data) => {
    let count = 0;

    data?.forEach(item => {
        if (item?.toDoStatus == 'done') {
            count++;
        }
    });

    return count;
};

// Hàm tiện ích để tính số lượng nhiệm vụ đang thực hiện (Doing)
const countDoingTodos = (tasks) => {
    if (!tasks) return 0;
    return tasks.filter(task => task?.toDoStatus == "doing")?.length;
};


export function ProfilePage() {
    const UID = localStorage.getItem("UID")
    const location = useLocation();
    const id = location?.state;
    const currentUserName = localStorage.getItem("username");
    const fileInputRef = useRef(null);
    const [src, setSrc] = useState(null);
    const [preview, setPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewAvatar, setViewAvatar] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleClose = () => setViewAvatar(false)
    const [editUser] = useEditUserMutation();
    const [imageUpload] = useImageUploadMutation()

    const {
        data: userData,
        isLoading: loadingUser,
        refetch
    } = useGetCurrentUserQuery(
        { UID: id ? id : UID },
        { refetchOnMountOrArgChange: true }
    );
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // File input change
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSrc(URL.createObjectURL(file));
            setSelectedFile(file);
            setModalOpen(true);
            e.target.value = "";
        }
    };

    const uploadFileToStrapi = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('files', file, file.name);

        try {
            const uploadedFiles = await imageUpload(formData).unwrap();

            if (uploadedFiles && uploadedFiles.length > 0) {
                return uploadedFiles[0].id;
            }
            return null;
        } catch (error) {
            console.error("Lỗi khi upload file:", error);
            alert(`Upload file thất bại: ${error.data?.error?.message || "Lỗi không xác định"}`);
            return null;
        }
    };

    const uploadAvatar = async () => {
        if (!selectedFile) {
            // alert("Vui lòng chọn một file ảnh để upload.");
            return;
        }

        try {
            const fileId = await uploadFileToStrapi(selectedFile);

            if (!fileId) {
                return;
            }

            const updateData = {
                avatar: fileId
            };

            const userIdToUpdate = UID;

            const result = await editUser({
                UID: userIdToUpdate,
                avatar: updateData
            }).unwrap();

            // console.log("Cập nhật user thành công:", result);

            setModalOpen(false);
            setSelectedFile(null);
            setPreview(null);
            refetch();

        } catch (error) {
            console.error("Lỗi trong quá trình cập nhật avatar:", error);
            // alert(`Cập nhật avatar thất bại: ${error.data?.error?.message || "Lỗi không xác định"}`);
        }
    };

    const onSubmit = (data) => {

    }


    // Xử lý dữ liệu
    const user = userData || {};
    const userName = user.username || "Tên người dùng";
    const userEmail = user.email || "Chưa có email";
    const userRole = user.role?.name || "Chức danh không rõ";
    const joinDate = formatDate(user.createdAt);
    const isCurrentUser = currentUserName == userName;

    // Tính toán số liệu thống kê
    const completedProjects = countPublished(user?.todos);
    const doingTasks = countDoingTodos(user?.todos);
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
                {isCurrentUser && <Typography color="text.secondary">
                    Quản lý thông tin cá nhân của bạn
                </Typography>}
            </Box>

            <Grid spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} lg={4} mt={'2rem'}>
                    <Card>
                        <CardContent sx={{ pt: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <AvatarCustom
                                    modalOpen={modalOpen}
                                    src={src}
                                    setPreview={setPreview}
                                    setModalOpen={setModalOpen}
                                />
                                <PreviewAvatar
                                    onClose={handleClose}
                                    modalOpen={viewAvatar}
                                    src={preview} />
                                <Box textAlign="center" mt={2}>
                                    <Typography variant="h5">{userName}</Typography>
                                    <Typography color="text.secondary">
                                        {userRole}
                                    </Typography>
                                </Box>
                                <Column justifyContent={'center'} alignItems={'center'} >
                                    <Box
                                        onClick={() => setViewAvatar(true)}
                                        sx={{
                                            // background: currentTheme?.home?.bgScroll,
                                            borderRadius: '100%',
                                            height: '12.6rem',
                                            width: '12.6rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}>
                                        <Avatar
                                            sx={{ width: '12rem', height: '12rem' }}
                                            src={
                                                preview || (user.avatar && `${process.env.REACT_APP_BASE_URL}${user.avatar.url}`) ||
                                                "https://cdn.tech24.vn/upload/tech24_vn/post/images/2024/06/17/557/kha-banh-meme-3.jpg"
                                            }
                                        />
                                    </Box>
                                    {isCurrentUser && <Column>
                                        <Row mt={'0.6rem'}>
                                            <Box sx={{ cursor: 'pointer', mr: '1.6rem', gap: '1.2rem', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                                                onClick={handleClick}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleImgChange}
                                                    style={{ display: "none" }}
                                                />
                                                <img
                                                // src={currentTheme?.common?.uploadImage} 
                                                />
                                                <Typography variant="14500">Upload Image</Typography>
                                            </Box>
                                            <Box sx={{ cursor: 'pointer', ml: '1.6rem', gap: '1.2rem', justifyContent: 'center', alignItems: 'center', display: 'flex' }} onClick={() => setPreview(null)}>
                                                <img
                                                // src={currentTheme?.common?.trashBin}
                                                />
                                                <Typography variant="14500">Delete Image</Typography>
                                            </Box>
                                        </Row>
                                        <Button variant="contained" sx={{ marginTop: '1.6rem', width: '100%' }} onClick={uploadAvatar}>
                                            Save Change
                                        </Button>
                                    </Column>}
                                </Column>

                            </Box>

                            {/* Profile Info */}
                            <Box mt={4} display="flex" flexDirection="column" gap={2}>
                                <Box display="flex" gap={1} alignItems="center">
                                    <Mail size={18} />
                                    <Typography color="text.secondary">
                                        {userEmail}
                                    </Typography>
                                </Box>

                                {userData?.phoneNumber && <Box display="flex" gap={1} alignItems="center">
                                    <Phone size={18} />
                                    <Typography color="text.secondary">{userData?.phoneNumber}</Typography> {/* Hardcoded - Cần field trong JSON */}
                                </Box>}

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
                                <Box display="flex" gap={1} alignItems="center">
                                    <Notebook size={18} />
                                    <Typography color="text.secondary">
                                        Bio: {userData?.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Form */}
                {isCurrentUser && <Grid item xs={12} lg={8} mt={'2rem'}>
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
                </Grid>}

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