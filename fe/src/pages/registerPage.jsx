import { Box, Button,InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import { useDispatch } from "react-redux";
import { useUserRegisterMutation } from "../store/auth/authAction";
import { useForm } from "react-hook-form";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

function RegisterPage() {
    const [registerUser] = useUserRegisterMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // ✅ Submit handler
    const onSubmit = async (data) => {
        try {
            await registerUser(data).unwrap();
            navigate(ROUTES.LOGIN, { state: { registered: true } });
        } catch (err) {
            console.error("Register failed:", err);
        }
    };



    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#dde0ffff",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "50%",
                    maxWidth: 500,
                    p: 4,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    background: "#FFFFFF",
                }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.2rem' }}>
                    <LanguageOutlinedIcon />
                    <Typography>Tiếng Việt</Typography>
                </Box>
                <Box
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <PersonAddAlt1OutlinedIcon sx={{ color: "#fff", width: 32, height: 32 }} />
                </Box>

                {/* Title */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                        Đăng ký tài khoản
                    </Typography>

                    <Typography variant="body2" sx={{ marginTop: "0.5rem", color: "gray" }}>
                        Nhập thông tin để tạo tài khoản mới
                    </Typography>
                </Box>

                {/* FORM */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ width: "70%" }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* FULL NAME */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" color="black">
                                Họ và tên
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Nguyễn Văn A"
                                {...register("name", { required: "Vui lòng nhập họ tên" })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonAddAlt1OutlinedIcon sx={{ color: "gray" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    input: { color: "black" },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "black" },
                                        "&:hover fieldset": { borderColor: "black" },
                                        "&.Mui-focused fieldset": { borderColor: "black" },
                                    },
                                }}
                            />
                        </Box>

                        {/* EMAIL */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" color="black">
                                Tên đăng nhập
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="admin123"
                                {...register("email", { required: "Vui lòng nhập tên đăng nhập" })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon sx={{ color: "gray" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    input: { color: "black" },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "black" },
                                        "&:hover fieldset": { borderColor: "black" },
                                        "&.Mui-focused fieldset": { borderColor: "black" },
                                    },
                                }}
                            />
                        </Box>

                        {/* PASSWORD */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" color="black">
                                Mật khẩu
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="••••••••"
                                type="password"
                                {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: "gray" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    input: { color: "black" },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "black" },
                                        "&:hover fieldset": { borderColor: "black" },
                                        "&.Mui-focused fieldset": { borderColor: "black" },
                                    },
                                }}
                            />
                        </Box>

                        {/* BUTTON */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ mt: 2 }}
                        >
                            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                    </Box>
                </Box>

                {/* GO TO LOGIN */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="body2" color="black">
                        Đã có tài khoản?
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#2563eb",
                            cursor: "pointer",
                            textDecoration: "underline",
                        }}
                        onClick={() => navigate(ROUTES.LOGIN)}
                    >
                        Đăng nhập
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default RegisterPage
