import { Box, Modal, Slider, styled, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";



const BoxBeetwen = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const Column = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'column'
}))

const Row = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: 'center'
}))


export default function PreviewAvatar({ src, modalOpen, onClose }) {

    return (
        <Modal
            open={modalOpen}
            onClose={onClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box sx={{
                width: '400px',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <img style={{ height: '100%', width: '100%' }} src={src} />
            </Box>
        </Modal>
    )
}
