import { Box, Button, styled, TextField, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { THEME } from "../utils/ThemeConstants";

export const BoxContainer = styled(Box)(({ theme }) => ({
    width: "100%",
}));

export const FlexBox = styled(Box)(({ theme }) => ({
    width: "50%",
    height: "100%",
}));

export const CenterBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

export const BoxBeetwen = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

export const Row = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
}));

export const Column = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

export const ButtonBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1.5rem",
}));

export const TextFieldStyle = styled(TextField)(() => ({
    background: "#EDEDED",
    borderRadius: "1rem",
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
    background: THEME.MAIN_BUTTON,
    color: THEME.MAIN_TEXT_BUTTON,
    borderRadius: "1rem",
    height: "3rem",
    textTransform: "none",
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
    background: THEME.SECONDARY_BUTTON,
    color: THEME.SECONDARY_TEXT_BUTTON,
    borderRadius: "1rem",
    height: "3rem",
    textTransform: "none",
}));

export const FilterButton = styled(Button)(({ theme }) => ({
    background: THEME.MENU_BACKGROUND,
    color: THEME.MENU_TEXT,
    borderRadius: "1rem",
    height: "3rem",
    textTransform: "none",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
    fontSize: "0.8rem",
    fontWeight: 500,
}));

export const TextFieldCustom = styled(TextField)(() => ({
    background: "#e8e7e7ff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-input": {
        padding: "12px 12px",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
        "&.Mui-focused fieldset": {
            border: "none",
        },
        "&:hover fieldset": {
            border: "none",
        },
    },
}));

export const CloseButton = styled(IconButton)(() => ({
    position: "absolute",
    right: 6,
    top: 6,
    color: "black",
    padding: 4,
    "&:hover": {
        backgroundColor: "transparent",
    },
    "&:focus": {
        outline: "none",
    },
    "&:focus-visible": {
        outline: "none",
    },
}));

export const CloseIcon = () => <CloseOutlinedIcon fontSize="medium" />;

export const ActionButton = styled(IconButton)(() => ({
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    borderRadius: "50%",
    width: '30px',
    height: '30px',
    marginLeft: '3px',
    transition: "all 0.2s ease",
    "&:hover": {
        backgroundColor: "#f5f5f5",
    },
}));

export const EditButton = styled(ActionButton)(() => ({
    color: "#2a2a91",
}));

export const DeleteButton = styled(ActionButton)(() => ({
    color: "#e53935",
}));