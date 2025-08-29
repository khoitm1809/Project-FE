import { Box } from "@mui/material";
import CustomTable from "../components/CustomTable";
import { BoxContainer } from "../components/commonStyled";

const Home = () => {
    const title = ["Tài khoản", "Tuổi", "Địa chỉ", "Số điện thoại"];

    const data = [
        {
            name: "user01",
            fullName: "Nguyễn Văn A",
            age: 25,
            address: "Hà Nội",
            phone: "0901234567",
        },
        {
            name: "user02",
            fullName: "Trần Thị B",
            age: 30,
            address: "Đà Nẵng",
            phone: "0912345678",
        },
        {
            name: "user03",
            fullName: "Lê Văn C",
            age: 22,
            address: "Hồ Chí Minh",
            phone: "0987654321",
        },
    ];
    return (
        <BoxContainer>
            <CustomTable title={title} data={data} isEdit={true} />
        </BoxContainer>
    )
}

export default Home;