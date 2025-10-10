import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddFoodWarehouseMutation, useDeleteFoodWarehouseMutation, useEditFoodWarehouseMutation, useGetListFoodWarehouseQuery } from "../../store/warehouse/warehouseAction";
import { WEIGHT } from "../../utils/constant";

const FoodWarehousePage = () => {
    const [addFoodWarehouse] = useAddFoodWarehouseMutation();
    const [editFoodWarehouse] = useEditFoodWarehouseMutation();
    const [deleteFoodWarehouse] = useDeleteFoodWarehouseMutation();
    const title = [
        { key: "name", label: "Tên hàng hóa" },
        { key: "inventory", label: "Số lượng" },
        { key: "weight", label: "Trọng lượng (kg)", isDropDown: true, list: WEIGHT },
        { key: "unit", label: "Đơn vị" },
        { key: "protein_content", label: "Lượng protein" },
        { key: "energy_content", label: "Năng lượng" },
        { key: "import_price", label: "Giá nhập" },
        { key: "import_date", label: "Ngày nhập", isDateTime: true },
        { key: "note", label: "Note" },
    ];
    const {
        data: listFoodWareHouse,
        isLoading: loadingListFoodWareHouse,
        refetch
    } = useGetListFoodWarehouseQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listFoodWareHouse}
                isEdit={true}
                mutationAddFunction={addFoodWarehouse}
                mutationEditFunction={editFoodWarehouse}
                mutationDeleteFunction={deleteFoodWarehouse}
                loading={loadingListFoodWareHouse}
                refetch={refetch}
            />
        </BoxContainer>
    )
}

export default FoodWarehousePage;