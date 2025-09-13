import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";

const ListAccount = () => {
    const title = [
        "ID",
        "Họ và tên",
        "Email",
        "Số điện thoại",
        "Ngày tạo"
    ];

    const data = [
        {
            id: 1,
            fullName: "Nguyễn Văn A",
            email: "vana@example.com",
            phone: "0987654321",
            createdAt: "2025-09-08",
        },
        {
            id: 2,
            fullName: "Trần Thị B",
            email: "thib@example.com",
            phone: "0912345678",
            createdAt: "2025-09-01",
        },
        {
            id: 3,
            fullName: "Phạm Văn C",
            email: "vanc@example.com",
            phone: "0909090909",
            createdAt: "2025-08-30",
        },
    ];
    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={data}
                isEdit={true}
            />
        </BoxContainer>
    )
}

export default ListAccount;