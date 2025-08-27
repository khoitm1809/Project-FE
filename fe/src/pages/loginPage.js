import React from 'react'
import { Box, Button, TextField, Typography } from "@mui/material";
import { CenterBox, Column, FlexBox } from '../components/commonStyled';



function LoginPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                width: '100%'
            }}>
            <FlexBox sx={{ background: '#EEBABA' }}>
                <CenterBox >
                    Left
                </CenterBox>
            </FlexBox>
            <FlexBox
                sx={{
                    height: '100%',
                    alignContent: 'center'
                }}>
                <CenterBox sx={{ height: '100%' }}>
                    <Column sx={{ gap: '1.2rem' }}>
                        <CenterBox sx={{ justifyContent: 'space-around', height: '100%' }}>
                            <Typography>
                                Welcome Back!
                            </Typography>
                        </CenterBox>
                        <TextField placeholder='Tên đăng nhập' />
                        <TextField placeholder='Mật khẩu' type='password' />
                        <Typography>
                            Quên mật khẩu
                        </Typography>
                        <Button>
                            Đăng nập
                        </Button>
                    </Column>
                </CenterBox>
            </FlexBox>
        </Box>
    )
}

export default LoginPage
