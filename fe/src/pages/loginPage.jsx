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

const ChildBox = styled(Box)(({ theme }) => ({
    height: '100vh',
}));

function LoginPage() {
    const isMobile = useMediaQuery('(max-width:1080px')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const login = () => {
        dispatch(setRole(ROLES.ADMIN));
        navigate(ROUTES.HOME)
    }


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
                        <Typography variant='18700' color={THEME.SECONDARY_TEXT_BUTTON}>Welcome Back!</Typography>
                    </Box>
                    <Column sx={{ width: '50%', gap: '1rem' }}>
                        <TextFieldStyle placeholder='Tên đăng nhập' />
                        <TextFieldStyle placeholder='Mật khẩu' type='password' />
                    </Column>
                    <MainButton
                        sx={{ width: '40%' }}
                        onClick={() => login()}>Đăng nhập</MainButton>
                </Column>
            </ChildBox>
        </Row>
    )
}

export default LoginPage
