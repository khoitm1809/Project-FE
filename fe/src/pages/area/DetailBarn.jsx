import { useLocation } from "react-router";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddPigMutation, useDeletePigMutation, useEditPigMutation, useGetListPigQuery } from "../../store/pig/pigAction";
import { useGetListTypePigQuery } from "../../store/typePig/typePigAction";
import { convertToDropdown } from "../../components/convertToDropdown";
import AddDataDialog from "../../components/AddDataDialog";
import EditDataDialog from "../../components/EditDataDialog";
import { useSelector } from "react-redux";

const DetailBarnPage = () => {
    const location = useLocation();
    const barnId = location?.state;
    const { modalType } = useSelector((state) => state.helper);
    // API Hooks
    const [addPig] = useAddPigMutation();
    const [editPig] = useEditPigMutation();
    const [deletePig] = useDeletePigMutation();
    const {
        data: listPig,
        isLoading: loadingListPig,
        refetch
    } = useGetListPigQuery(
        { barnId },
        { refetchOnMountOrArgChange: true }
    );

    const {
        data: listPigType,
        isLoading: LoadingListPigType,
    } = useGetListTypePigQuery(
        { refetchOnMountOrArgChange: true }
    );
    // Config Table
    const title = [
        { key: "pigCode", label: "Mã heo" },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "weight", label: "Cân nặng", },
        { key: "barn.name", label: "Chuồng" },
        { key: "pig_growth_records.weight", label: "Tăng trưởng" }

    ];

    const dialogTitle = [
        { key: "pigCode", label: "Mã heo" },
        { key: "weight", label: "Cân nặng", isNumber: true },
        { key: "age", label: "Tuổi", isNumber: true },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "note", label: "Ghi chú" },

        {
            key: "barn",
            label: "Chuồng",
            isDropDown: true,
            // list: convertToDropdown(listBarns), 
            mappingKey: "barn.id"
        },

        {
            key: "type_pig",
            label: "Loại heo",
            isDropDown: true,
            list: convertToDropdown(listPigType?.data), // Giả định list Loại Lợn được truyền vào
            mappingKey: "type_pig.id"
        },

        {
            key: "users_permissions_user",
            label: "Người phụ trách",
            isDropDown: true,
            // list: convertToDropdown(listUsers), // Giả định list User được truyền vào
            mappingKey: "users_permissions_user.id"
        },
    ];

    return (
        <BoxContainer padding={'2rem'}>
            {modalType === 'add' && (
                <AddDataDialog
                    dialogTitle={dialogTitle}
                    mutationAddFunction={addPig}
                    refetch={refetch}
                />
            )}


            {modalType === 'edit' && (
                <EditDataDialog
                    dialogTitle={dialogTitle}
                    mutationEditFunction={editPig}
                    refetch={refetch}
                />
            )}

            <CustomTable
                title={title}
                data={listPig?.data}
                isEdit={true}
                mutationDeleteFunction={deletePig}
                loading={loadingListPig}
                refetch={refetch}
            />
        </BoxContainer>
    );
}

export default DetailBarnPage;