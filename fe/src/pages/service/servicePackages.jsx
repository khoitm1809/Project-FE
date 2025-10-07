import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { useAddServiceMutation, useDeleteServiceMutation, useEditServiceMutation, useGetListServiceQuery } from "../../store/service/serviceAction";

const ServicePackages = () => {
    const[addService] = useAddServiceMutation();
    const[editService] = useEditServiceMutation();
    const[deleteService] = useDeleteServiceMutation();
    const title = [
            { key: "name", label: "Loại heo" },
            { key: "origin", label: "Xuất xứ" },
            { key: "date_of_entry", label: "Ngày nhập vào", isDateTime: true },
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
            isLoading: loadingListService
        } = useGetListServiceQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                            title={title}
                            data={listOffSpring}
                            isEdit={true}
                            mutationAddFunction={addService}
                            mutationEditFunction={editService}
                            mutationDeleteFunction={deleteService}
                            loading={loadingListService}
                        />
        </BoxContainer>
    )
}

export default ServicePackages;