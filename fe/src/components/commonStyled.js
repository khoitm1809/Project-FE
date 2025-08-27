import { Box, styled } from "@mui/material";


export const FlexBox = styled(Box)(({ theme }) => ({
    width: '50%',
    height: '100%'
}))

export const CenterBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

export const BoxBeetwen = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

export const Row = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: 'center'
}))

export const Column = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'column'
}))
