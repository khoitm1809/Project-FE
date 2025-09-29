import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useGetListMeditionWarehouseQuery } from "../../store/warehouse/warehouseAction";

const MeditionWarehousePage = () => {
    const title = [
        { key: "name", label: "Tên vacxine" },
        { key: "drug_type", label: "Loại thuốc" },
        { key: "brand", label: "Hãng" },
        { key: "capacity", label: "Dung tích" },
        { key: "date_of_manufacture", label: "Ngày sản xuất" },
        { key: "expiry", label: "Ngày hết hạn" },
        { key: "import_price", label: "Giá nhập" },
        { key: "inventory", label: "Số lượng" },
        { key: "unit", label: "Đơn vị" },
        { key: "usage_type", label: "Cách sử dụng" },
        { key: "Note", label: "Note" },
    ];
    const {
        data: listWareHouse,
        isLoading: loadinglistWareHouse
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
            />
        </BoxContainer>
    )
}

export default MeditionWarehousePage;