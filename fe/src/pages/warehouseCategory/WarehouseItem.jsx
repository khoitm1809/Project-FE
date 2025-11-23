import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { convertToDropdown } from "../../components/convertToDropdown";
import { useAddWarehouseItemMutation, useDeleteWarehouseItemMutation, useEditWarehouseItemMutation, useGetListWarehouseItemQuery } from "../../store/warehouse/warehouseItemAction";
import { useSelector } from "react-redux";
import EditDataDialog from "../../components/EditDataDialog";
import AddDataDialog from "../../components/AddDataDialog";
import { useLocation } from "react-router";
import { useGetListWarehouseCategoryQuery } from "../../store/warehouse/warehouseAction";

const WareHouseItem = () => {
    const location = useLocation();
    const warehouseCategoryID = location?.state;
    const UID = localStorage.getItem("UID");
    const [addWareHouseItem] = useAddWarehouseItemMutation();
    const [editWareHouseItem] = useEditWarehouseItemMutation();
    const [deleteWareHouseItem] = useDeleteWarehouseItemMutation();
    const { modalType } = useSelector((state) => state.helper);

    const {
        data: listWareHouseItem,
        isLoading: loadingWareHouseItem,
        refetch
    } = useGetListWarehouseItemQuery({
        warehouseCategoryID: warehouseCategoryID,
        UID: UID
    }, { refetchOnMountOrArgChange: true })

    const {
        data: listWareHouseCategory,
    } = useGetListWarehouseCategoryQuery({
        warehouseCategoryID: warehouseCategoryID,
    }, { refetchOnMountOrArgChange: true })

    const title = [
        { key: "name", label: "Tên vật phẩm" },
        { key: "quantity", label: "Số lượng" },
        { key: "unit", label: "Đơn vị" },
        { key: "warehouse_category.name", label: "Danh mục" },
        { key: "users_permissions_user.username", label: "Người tạo" },
        { key: "createdAt", label: "Ngày tạo" },
    ];

    const dialogTitle = [ 
        { key: "name", label: "Tên vật phẩm" },
        { key: "quantity", label: "Số lượng", isNumber: true },
        { key: "unit", label: "Đơn vị" },

        {
            key: "warehouse_category",
            label: "Danh mục",
            isDropDown: true,
            list: convertToDropdown(listWareHouseCategory?.data),
            mappingKey: "warehouse_category.id" 
        },

        {
            key: "users_permissions_user",
            label: "Người phụ trách",
            isDropDown: true,
            // list: convertToDropdown(listUser), 
            mappingKey: "users_permissions_user.id" 
        },
    ];


    return (
        <BoxContainer padding={'2rem'}>
            {modalType === 'add' && (
                <AddDataDialog
                    dialogTitle={dialogTitle}
                    mutationAddFunction={addWareHouseItem}
                    refetch={refetch}
                />
            )}


            {modalType === 'edit' && (
                <EditDataDialog
                    dialogTitle={dialogTitle}
                    mutationEditFunction={editWareHouseItem}
                    refetch={refetch}
                />
            )}

            <CustomTable
                title={title}
                data={listWareHouseItem?.data}
                isEdit={true}
                mutationDeleteFunction={deleteWareHouseItem}
                loading={loadingWareHouseItem}
                refetch={refetch}
            />
        </BoxContainer>
    )
}

export default WareHouseItem;