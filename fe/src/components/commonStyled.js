import { Box, Button, styled, TextField } from "@mui/material";

export const BoxContainer = styled(Box)(({ theme }) => ({
    width: '100%',
}));

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


export const TextFieldStyle = styled(TextField)(() => ({
    background: '#EDEDED',
    borderRadius: '1rem',
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
        "&:hover fieldset": {
            border: "none",
        },
        "&.Mui-focused fieldset": {
            border: "none",
        },
    },
}));

export const MainButton = styled(Button)(({ theme }) => ({
    background: '#EDEDED',
    borderRadius: '1rem',
    height: '3rem',

}))
