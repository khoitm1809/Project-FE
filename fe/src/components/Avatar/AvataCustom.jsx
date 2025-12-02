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


export default function AvatarCustom({ src, modalOpen, setModalOpen, onCropSave }) {
    const [slideValue, setSlideValue] = useState(10);
    const cropRef = useRef(null);

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const handleSave = () => {
        if (cropRef.current) {
            const dataUrl = cropRef.current.getImage().toDataURL('image/png');

            const croppedFile = dataURLtoFile(dataUrl, `cropped_avatar_${Date.now()}.png`);

            onCropSave(croppedFile);

            setModalOpen(false);
        }
    };
    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)} // Thêm onClose cho Modal
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box sx={{
                width: '300px',
                height: '380px', // Tăng chiều cao để chứa slider và nút
                backgroundColor: 'white', // Thêm nền để dễ nhìn trong Modal
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <AvatarEditor
                    ref={cropRef}
                    image={src}
                    width={250} // Kích thước khung crop
                    height={250}
                    border={25}
                    borderRadius={150} // Tạo hình tròn
                    color={[0, 0, 0, 0.72]}
                    scale={slideValue / 10}
                    rotate={0}
                />
                <Slider
                    min={10}
                    max={50}
                    sx={{
                        margin: "15px auto",
                        width: "80%",
                        color: "black",
                        "& .MuiSlider-thumb": { color: "rgba(255, 141, 76, 1)" },
                        "& .MuiSlider-track": { color: "rgba(255, 141, 76, 1)" },
                        "& .MuiSlider-rail": { color: "white" },
                    }}
                    size="medium"
                    value={slideValue}
                    onChange={(e, newValue) => setSlideValue(newValue)}
                />
                <Box
                    sx={{
                        display: "flex",
                        padding: "10px",
                        gap: '2.4rem',
                        width: '100%',
                        justifyContent: 'space-around'
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => setModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
