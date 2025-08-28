import { Box, Typography, useMediaQuery } from "@mui/material";
import { Column, MainButton, Row, TextFieldStyle } from '../components/commonStyled';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';
import styled from '@emotion/styled';
import pigFarm from '../assets/pigFarm.avif'


const ChildBox = styled(Box)(({ theme }) => ({
    height: '100vh',
}));

function LoginPage() {
    const isMobile = useMediaQuery('(max-width:1080px')
    const navigate = useNavigate()

    return (
        <Row>
            <ChildBox sx={{ background: '#b0b6b0ff', display: isMobile ? 'none' : 'block', width: '50%' }}>
                <Column sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', gap: '2rem' }}>
                    <Typography variant='18800'>Pig Farm</Typography>
                    <img src={pigFarm} style={{ width: '90%', borderRadius: '1.2rem' }} alt="Pig farm"/>
                </Column>
            </ChildBox>
            <ChildBox sx={{ width: isMobile ? "100%" : "50%" }}>
                <Column sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', gap: '4rem' }}>
                    <Box>
                        <Typography variant='18700'>Welcome Back!</Typography>
                    </Box>
                    <Column sx={{ width: '50%', gap: '1rem' }}>
                        <TextFieldStyle placeholder='Tên đăng nhập' />
                        <TextFieldStyle placeholder='Mật khẩu' type='password' />
                    </Column>
                    <MainButton
                        sx={{ width: '40%' }}
                        onClick={() => navigate(ROUTES.HOME)}>Đăng nhập</MainButton>
                </Column>
            </ChildBox>
        </Row>
    )
}

export default LoginPage
