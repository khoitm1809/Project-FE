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
import { ROLES } from "../../utils/rolesConstant";
import { useGetListUserQuery } from "../../store/auth/authAction";

const WareHouseItem = () => {
    const location = useLocation();
    const warehouseCategoryID = location?.state;
    const UID = localStorage.getItem("UID");
    const role = localStorage.getItem("role");
    const [addWareHouseItem] = useAddWarehouseItemMutation();
    const [editWareHouseItem] = useEditWarehouseItemMutation();
    const [deleteWareHouseItem] = useDeleteWarehouseItemMutation();
    const { modalType } = useSelector((state) => state.helper);
    console.log(warehouseCategoryID)
    const {
        data: listWareHouseItem,
        isLoading: loadingWareHouseItem,
        refetch
    } = useGetListWarehouseItemQuery({
        id: warehouseCategoryID,
        // users_permissions_user: role == ROLES.OWNER ? null : UID
    }, { refetchOnMountOrArgChange: true })

    // const {
    //     data: listWareHouseCategory,
    // } = useGetListWarehouseCategoryQuery({
    // }, { refetchOnMountOrArgChange: true })

    const {
        data: listUser,
    } = useGetListUserQuery({
        role: ROLES.WORKER
    }, { refetchOnMountOrArgChange: true })

    const title = [
        { key: "name", label: "Tên vật phẩm" },
        { key: "quantity", label: "Số lượng" },
        { key: "totalLeft", label: "Còn lại" },
        { key: "unit", label: "Đơn vị" },
        { key: "warehouse_category.name", label: "Danh mục" },
        { key: "users_permissions_user.username", label: "Người tạo" },
        { key: "createdAt", label: "Ngày tạo" },
        { key: "itemType", label: "Loại" },
    ];

    const dialogTitle = [
        { key: "name", label: "Tên vật phẩm" },
        { key: "quantity", label: "Số lượng", isNumber: true },
        { key: "totalLeft", label: "Còn lại", isNumber: true, },
        {
            key: "itemType", label: "Loại",
            isDropDown: true,
            list: [
                { label: 'feed', value: 'feed' },
                { label: 'equipment', value: 'equipment' },
                { label: 'medicine', value: 'medicine' },
                { label: 'vitamin', value: 'vitamin' },
                { label: 'tool', value: 'tool' },
                { label: 'supply', value: 'supply' },
            ]
        }, //Thêm array itemType

        {
            key: "warehouse_category",
            label: "Danh mục",
            isDisable: true,
            defaultValue: warehouseCategoryID,
            mappingKey: "warehouse_category.id"
        },

        // {
        //     key: "users_permissions_user",
        //     label: "Người phụ trách",
        //     isDropDown: true,
        //     defaultvalue: UID,
        //     list: convertToDropdown(listUser),
        //     mappingKey: "users_permissions_user.id"
        // },
        {
            key: "users_permissions_user",
            label: "Người phụ trách",
            isDisable: true,
            isDropDown: true,
            defaultvalue: UID,
            list: convertToDropdown(listUser),
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