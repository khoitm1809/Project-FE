import React, { useState } from 'react'
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { CenterBox, Column, FlexBox, MainButton, TextFieldStyle } from '../components/commonStyled';
import { useNavigate } from 'react-router';
import { ROUTES } from '../router/routerConstants';



function LoginPage() {
    const [forgotPassword, setForgotPassword] = useState(false)
    const isMobile = useMediaQuery('(max-width:1080px')
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                width: '100%'
            }}>
            <FlexBox sx={{ background: '#EEBABA', display: isMobile ? 'none' : 'block' }}>
                <CenterBox >
                    Left
                </CenterBox>
            </FlexBox>
            <FlexBox
                sx={{
                    width: isMobile ? '100%' : '50%',
                    height: '100%',
                    alignContent: 'center'
                }}>
                <CenterBox sx={{ height: '100%' }}>
                    {forgotPassword ? <Column sx={{ gap: '1.2rem' }}>
                        <CenterBox sx={{ justifyContent: 'space-around', height: '100%' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>
                                Welcome Back!
                            </Typography>
                        </CenterBox>
                        <TextFieldStyle
                            sx={{ width: '30rem' }}
                            placeholder='Tên đăng nhập' />
                        <TextFieldStyle
                            sx={{ width: '30rem' }}
                            placeholder='Mật khẩu' type='password' />
                        <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setForgotPassword(false)}>
                            Quên mật khẩu? 
                        </Typography>
                        <CenterBox sx={{ width: '100%', }}>
                            <MainButton sx={{ width: '50%', }} onClick={() => navigate(ROUTES.HOME)}>
                                Đăng nập
                            </MainButton>
                        </CenterBox>
                    </Column> :
                        <Column sx={{ gap: '1.2rem' }}>
                            <CenterBox sx={{ justifyContent: 'space-around', height: '100%' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '30px' }}>
                                    Forgot Password?
                                </Typography>
                            </CenterBox>
                            <TextFieldStyle
                                sx={{ width: '30rem' }}
                                placeholder='Nhập email' />
                            <TextFieldStyle
                                sx={{ width: '30rem' }}
                                placeholder='Mật khẩu' type='password' />
                            <TextFieldStyle
                                sx={{ width: '30rem' }}
                                placeholder='Nhập lại mật khẩu' type='password' />
                            <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setForgotPassword(true)}>
                                Bạn đã có tài khoản đăng nhập? Đăng nhập
                            </Typography>
                            <CenterBox sx={{ width: '100%', }}>
                                <MainButton sx={{ width: '50%', }} onClick={() => navigate(ROUTES.HOME)}>
                                    {forgotPassword ? "Đăng nhập" : "Đổi lại mật khẩu"}
                                </MainButton>
                            </CenterBox>
                        </Column>}
                </CenterBox>
            </FlexBox>
        </Box>
    )
}

export default LoginPage
