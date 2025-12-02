import { Box, Button, Modal, Slider, styled, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";


const BoxBeetwen = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const Column = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'column'
}))


export default function AvatarCustom({ src, modalOpen, setModalOpen, setPreview }) {
    const [slideValue, setSlideValue] = useState(10);
    const cropRef = useRef(null);

    const handleSave = async () => {
        if (cropRef) {
            const dataUrl = cropRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            setPreview(URL.createObjectURL(blob));
            setModalOpen(false);
        }
    };
    return (
        <Modal
            open={modalOpen}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box sx={{
                width: '300px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <AvatarEditor
                    ref={cropRef}
                    image={src}
                    style={{ width: "100%", height: "100%" }}
                    border={50}
                    borderRadius={150}
                    color={[0, 0, 0, 0.72]}
                    scale={slideValue / 10}
                    rotate={0}
                />
                <Slider
                    min={10}
                    max={50}
                    sx={{
                        margin: "0 auto",
                        width: "80%",
                        color: "black",
                        "& .MuiSlider-thumb": {
                            color: "rgba(255, 141, 76, 1)", // thumb color
                        },
                        "& .MuiSlider-track": {
                            color: "rgba(255, 141, 76, 1)", // filled part
                        },
                        "& .MuiSlider-rail": {
                            color: "white", // unfilled bar
                        },
                    }}
                    size="medium"
                    defaultValue={slideValue}
                    value={slideValue}
                    onChange={(e) => setSlideValue(e.target.value)}
                />
                <Box
                    sx={{
                        display: "flex",
                        padding: "10px",
                        gap: '2.4rem',
                        width: '100%'
                    }}
                >
                    <Button
                        onClick={(e) => setModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
