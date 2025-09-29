import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { useAddOffSpringMutation, useGetListOffSpringQuery } from "../../store/offSpring/offSpringAction";

const OffSpring = () => {
    const [addOffSpring] = useAddOffSpringMutation();
    const title = [
        { key: "name", label: "Loại heo" },
        { key: "origin", label: "Xuất xứ" },
        { key: "date_of_entry", label: "Ngày nhập vào" },
        { key: "type", label: "Loại" },
        { key: "sex", label: "Giới tính" },
        { key: "weight_at_import", label: "Cân nặng lúc nhập" },
        { key: "health", label: "Sức khỏe" },
        { key: "vaccination", label: "Tiêm chủng" },
        { key: "inventory", label: "Số lượng" },
        // { key: "invoice.payment_status", label: "Trạng thái thanh toán" },
    ];
    const {
        data: listOffSpring,
        isLoading: loadingListOffSpring
    } = useGetListOffSpringQuery({}, { refetchOnMountOrArgChange: true })


    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listOffSpring}
                isEdit={true}
                mutationFunction={addOffSpring}
            />
        </BoxContainer>
    )
}

export default OffSpring;