import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router';
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, Link, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import { ROUTES } from '../router/routerConstants';
import { useLazyGetUserRoleQuery, useUserLoginMutation } from "../store/auth/authAction";
import { useConfirmDialog } from "../components/confirmDialog";
import { LOCAL_STORAGE_NAME, MESSAGE_TYPE } from "../utils/constant";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

function LoginPage() {
    const [langSelect, setlangSelect] = useState(localStorage.getItem(LOCAL_STORAGE_NAME.LANGUAGE))
    const { t } = useTranslation();
    const location = useLocation();
    const [loginUser] = useUserLoginMutation();
    const navigate = useNavigate();
    const { openDialog } = useConfirmDialog()
    const [getUserRole] = useLazyGetUserRoleQuery();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        },
    });


    const onSubmit = async (data) => {
        try {
            const res = await loginUser(data).unwrap();

            localStorage.setItem(LOCAL_STORAGE_NAME.TOKEN, res.jwt);

            const roleRes = await getUserRole().unwrap();
            localStorage.setItem("role", roleRes.role.type);

            // 5. Chuyển trang
            navigate(ROUTES.HOME);
        } catch (err) {
            openDialog({
                type: MESSAGE_TYPE.ERROR,
                message: "Lỗi đăng nhập",
                customMainText: "Lỗi đăng nhập",
                isShowCloseBtn: true,
                isHideAction: true,
                customSecondText: "Xác nhận"
            });
        }
    };

    const changeLanguage = (lng) => {
        i18next.changeLanguage(lng);
        localStorage.setItem(LOCAL_STORAGE_NAME.LANGUAGE, lng)
        setlangSelect(lng)
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
            }}>
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
                    background: "#FFFFF",
                }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.2rem' }}>
                    <LanguageOutlinedIcon />
                    <Typography>Tiếng Việt</Typography>
                </Box>
                {/* Icon circle */}
                <Box
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <LockOutlinedIcon sx={{ color: "#fff", width: 32, height: 32 }} />
                </Box>

                {/* Title */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                        Đăng nhập
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ marginTop: "0.5rem" }}
                    >
                        Nhập thông tin để truy cập hệ thống
                    </Typography>
                </Box>

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "70%" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* EMAIL */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" >
                                Email
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="admin@example.com"
                                {...register("identifier", { required: "Vui lòng nhập email" })}
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
                                        "&:hover fieldset": { borderColor: "#black" },
                                        "&.Mui-focused fieldset": { borderColor: "#black" },
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

                        {/* REMEMBER + FORGOT */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <FormControlLabel
                                control={<Checkbox sx={{ color: "black" }} />}
                                label={
                                    <Typography variant="body2" color="black">
                                        Ghi nhớ đăng nhập
                                    </Typography>
                                }
                            />

                            <Link
                                underline="hover"
                                sx={{ color: "#2563eb", cursor: "pointer" }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </Box>

                        {/* BUTTON */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ mt: 2 }}
                        >
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </Box>
                </Box>

                {/* REGISTER */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="body2" color="black">
                        Chưa có tài khoản?
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#2563eb",
                            cursor: "pointer",
                            textDecoration: "underline",
                        }}
                        onClick={() => navigate("/register")}
                    >
                        Đăng ký ngay
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default LoginPage
