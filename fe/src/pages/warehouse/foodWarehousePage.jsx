import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useGetListFoodWarehouseQuery, useGetListWarehouseQuery } from "../../store/warehouse/warehouseAction";

const FoodWarehousePage = () => {
    const title = [
        { key: "name", label: "Tên hàng hóa" },
        { key: "inventory", label: "Số lượng" },
        { key: "import_price", label: "Giá nhập" },
        { key: "import_date", label: "Ngày nhập" },
        { key: "protein_content", label: "Lượng protein" },
        { key: "weight", label: "Trọng lượng (kg)", isDropDown: true, list: [{ value: 'kg', label: 'kg' }, { value: 'g', label: 'g' }] },
        { key: "energy_content", label: "Năng lượng" },
        { key: "note", label: "Note" },
    ];
    const {
        data: listFoodWareHouse,
        isLoading: loadingListFoodWareHouse
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
            />
        </BoxContainer>
    )
}

export default FoodWarehousePage;