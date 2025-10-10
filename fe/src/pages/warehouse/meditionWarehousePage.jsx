import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddMeditionWarehouseMutation, useDeleteMeditionWarehouseMutation, useGetListMeditionWarehouseQuery } from "../../store/warehouse/warehouseAction";

const MeditionWarehousePage = () => {
    const [addMeditionWarehouse] = useAddMeditionWarehouseMutation();
    const [editMeditionWarehouse] = useAddMeditionWarehouseMutation();
    const [deleteMeditionWarehouse] = useDeleteMeditionWarehouseMutation();
    const title = [
        { key: "name", label: "Tên vacxine" },
        { key: "brand", label: "Hãng" },
        { key: "drug_type", label: "Loại thuốc" },
        { key: "usage_type", label: "Cách sử dụng" },
        { key: "inventory", label: "Số lượng" },
        { key: "unit", label: "Đơn vị" },
        { key: "capacity", label: "Dung tích" },
        { key: "import_price", label: "Giá nhập" },
        { key: "date_of_manufacture", label: "Ngày sản xuất", isDateTime: true },
        { key: "expiry", label: "Ngày hết hạn", isDateTime: true },
        { key: "Note", label: "Note" },
    ];
    const {
        data: listWareHouse,
        isLoading: loadinglistWareHouse,
        refetch
    } = useGetListMeditionWarehouseQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listWareHouse}
                isEdit={true}
                mutationAddFunction={addMeditionWarehouse}
                mutationEditFunction={editMeditionWarehouse}
                mutationDeleteFunction={deleteMeditionWarehouse}
                loading={loadinglistWareHouse}
                refetch={refetch}
            />
        </BoxContainer>
    )
}

export default MeditionWarehousePage;