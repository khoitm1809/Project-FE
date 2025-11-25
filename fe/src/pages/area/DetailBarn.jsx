import { useLocation } from "react-router";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddPigMutation, useDeletePigMutation, useEditPigMutation, useGetListPigQuery } from "../../store/pig/pigAction";
import { useGetListTypePigQuery } from "../../store/typePig/typePigAction";
import { convertToDropdown } from "../../components/convertToDropdown";
import AddDataDialog from "../../components/AddDataDialog";
import EditDataDialog from "../../components/EditDataDialog";
import { useSelector } from "react-redux";
import { useGetCurrentUserQuery, useGetListUserQuery } from "../../store/auth/authAction";
import { useGetListBarnQuery } from "../../store/area/areaAction";

const DetailBarnPage = () => {
    const UID = localStorage.getItem("UID");
    const location = useLocation();
    const { state } = location;
    const barnId = state?.barnId;
    const areaId = state?.areaId;
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

    const {
        data: user,
        isLoading: loadingUser,
    } = useGetCurrentUserQuery({ UID }, { refetchOnMountOrArgChange: true })


    const {
        data: listBarn,
        isLoading: loadingBarn,
    } = useGetListBarnQuery({
        areaId: areaId,
    }, { refetchOnMountOrArgChange: true })
    // Config Table
    const title = [
        { key: "pigCode", label: "Mã heo" },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "weight", label: "Cân nặng", },
        { key: "barn.name", label: "Chuồng" },
        { key: "pig_growth_records.weight", label: "Tăng trưởng" },
        { key: "price", label: "Giá" }

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
            defaultValue: barnId, // Set giá trị mặc định là barnId
            isDisable: true, // Khóa chỉnh sửa
            mappingKey: "barn.id"
        },

        {
            key: "pig_type",
            label: "Loại heo",
            isDropDown: true,
            list: convertToDropdown(listPigType?.data),
            mappingKey: "pig_type.id"
        },

        {
            key: "users_permissions_user",
            label: "Người phụ trách",
            isDisable: true,
            defaultValue: user?.id,
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