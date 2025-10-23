/* eslint-disable no-undef */
import { Box, Dialog, Typography } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MainButton, SecondaryButton } from './commonStyled';
import { MESSAGE_TYPE } from '../utils/constant';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const ConfirmDialogContext = createContext();

export const ConfirmDialogProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        type: null,
        message: "",
        subMessage: "",
        isHideAction: false,
        customMainText: null,
        customSecondText: null,
        isShowCloseBtn: false,
        actionConfirm: () => { },
        actionCancel: () => { },
    });

    useEffect(() => {
        let timer;
        if (isOpen && dialogConfig.type == "success") {
            timer = setTimeout(() => {
                closeDialog();
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [isOpen, dialogConfig.type]);

    const openDialog = (config) => {
        setDialogConfig(config);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const getIcon = () => {
        switch (dialogConfig.type) {
            case MESSAGE_TYPE.SUCCESS:
                return <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'green' }} />;
            case MESSAGE_TYPE.ERROR:
                return <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'red' }} />;
            case MESSAGE_TYPE.WARNING:
                return <WarningAmberOutlinedIcon sx={{ fontSize: '3.5rem', color: 'orange' }} />;
            default:
                return null;
        }
    };


    return (
        <ConfirmDialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            {isOpen && (
                <Dialog
                    maxWidth={{ xs: "35rem", sm: '45rem', md: "60.8rem" }}
                    minWidth={'30vw'}
                    sx={{
                        zIndex: 9999,
                        borderRadius: "2.4rem",
                        '& .MuiPaper-root': {
                            borderRadius: "2.4rem",
                            // background: currentTheme?.common?.bgColor,
                            // border: currentTheme?.item?.border,
                            backgroundClip: 'unset',
                            backgroundRepeat: 'no-repeat',
                            minWidth: { xs: "65%", md: "35%", xl: '60.8rem' },
                            maxWidth: { xs: "35rem", sm: '45rem', md: "60.8rem" }
                        }
                    }} open={isOpen} onClose={closeDialog}
                >
                    <Box
                        position={'relative'}
                        p={'1.6rem 1.6rem 2.4rem 1.6rem'}
                        display={'flex'} flexDirection={'column'} alignItems={'center'}
                        justifyContent={'space-between'} borderRadius={'2.4rem'}
                        maxWidth={{ xs: "35rem", sm: '45rem', md: "60.8rem" }}
                        minWidth={{ xs: "65%", md: "35%", xl: '60.8rem' }}
                    >
                        {dialogConfig.isShowCloseBtn && <Box
                            sx={{
                                cursor: 'pointer',
                                right: '2rem',
                                position: 'absolute'
                            }}
                            onClick={() => {
                                closeDialog();
                            }}>
                            {/* <CancelOutlinedIcon
                                sx={{ fontSize: "2.4rem" }}
                            ></CancelOutlinedIcon> */}
                        </Box>}
                        {getIcon()}
                        <Typography textAlign={'center'} variant="16700">{dialogConfig?.message}</Typography>
                        <Typography textAlign={'center'} variant="14500" mt={'0.8rem'}>{dialogConfig?.subMessage}</Typography>

                        {
                            (dialogConfig.isHideAction === false || dialogConfig.isHideAction === undefined) &&
                            <Box mt={'1.6rem'} width={'100%'} display={'flex'} flexDirection={'row'}>
                                {<SecondaryButton onClick={() => {
                                    closeDialog();
                                    if (dialogConfig?.actionCancel) {
                                        dialogConfig?.actionCancel();
                                    }
                                }}>
                                    {dialogConfig?.customSecondText ?? t("common.cancel")}
                                </SecondaryButton>}
                                <Box width={16}></Box>
                                <MainButton
                                    onClick={() => {
                                        if (dialogConfig?.actionConfirm) {
                                            dialogConfig?.actionConfirm();
                                        }
                                        closeDialog();
                                    }}
                                >
                                    {dialogConfig?.customMainText ?? t("common.confirm")}
                                </MainButton>
                            </Box>
                        }
                        {
                            dialogConfig.isHideAction === true &&
                            <Box mt={'1.6rem'} width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                                <MainButton sx={{ width: 'auto', minWidth: '100%' }} onClick={() => {
                                    closeDialog();
                                    if (dialogConfig?.actionCancel) {
                                        dialogConfig?.actionCancel();
                                    }
                                }}>
                                    {dialogConfig?.customSecondText ?? t("common.close")}
                                </MainButton>
                            </Box>
                        }
                    </Box>
                </Dialog>
            )
            }
        </ConfirmDialogContext.Provider >
    );
};

export const useConfirmDialog = () => {
    return useContext(ConfirmDialogContext);
};
