import { Box, Typography, useMediaQuery } from "@mui/material";
import { Column, MainButton, Row, TextFieldStyle } from '../components/commonStyled';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import styled from '@emotion/styled';
import pigFarm from '../assets/pigFarm.avif'
import { setRole } from "../store/auth/authSlice";
import { useDispatch } from "react-redux";
import { ROLES } from "../utils/rolesConstant";
import { THEME } from "../utils/ThemeConstants";
import { useUserRegisterMutation } from "../store/auth/authAction";
import { useState } from "react";

const ChildBox = styled(Box)(({ theme }) => ({
    height: '100vh',
}));

function RegisterPage() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [registerUser] = useUserRegisterMutation();
    const isMobile = useMediaQuery('(max-width:1080px')
    const navigate = useNavigate()
    const register = () => {
        registerUser({ name, email, password })
            .unwrap()
            .then((res) => {
                navigate(ROUTES.LOGIN, { state: { registered: true } });
            })
            .catch((err) => {
                console.error("Register failed:", err);
            });
    };



    return (
        <Row>
            <ChildBox sx={{ background: THEME.MENU_BACKGROUND, display: isMobile ? 'none' : 'block', width: '50%' }}>
                <Column sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', gap: '2rem' }}>
                    <Typography variant='18800' color={THEME.MAIN_TEXT_BUTTON}>Pig Farm</Typography>
                    <img src={pigFarm} style={{ width: '90%', borderRadius: '1.2rem' }} alt="Pig farm" />
                </Column>
            </ChildBox>
            <ChildBox sx={{ width: isMobile ? "100%" : "50%" }}>
                <Column sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', gap: '4rem' }}>
                    <Box>
                        <Typography variant='18700' color={THEME.SECONDARY_TEXT_BUTTON}>Đăng ký tài khoản</Typography>
                    </Box>
                    <Column sx={{ width: '50%', gap: '1rem' }}>
                        <TextFieldStyle placeholder='Họ và tên' value={name} onChange={(e) => setName(e.target.value)} />
                        <TextFieldStyle placeholder='Tên đăng nhập' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextFieldStyle placeholder='Mật khẩu' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        {/* <TextFieldStyle placeholder='Xác nhận mật khẩu' type='password' value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                        <Row sx={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Typography variant='12400' color={THEME.SECONDARY_TEXT_BUTTON}>Đã có tài khoản?</Typography>
                            <Typography
                                variant='12400'
                                sx={{ color: THEME.SECONDARY_TEXT_BUTTON, cursor: 'pointer' }}
                                onClick={() => navigate(ROUTES.LOGIN)}>Đăng nhập</Typography>
                        </Row>

                    </Column>
                    <MainButton
                        sx={{ width: '40%' }}
                        onClick={() => register()}>Đăng ký</MainButton>
                </Column>
            </ChildBox>
        </Row>
    )
}

export default RegisterPage
