import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { convertToDropdown } from "../../components/convertToDropdown";
import { useAddPigGrowthRecordMutation, useDeletePigGrowthRecordMutation, useEditPigGrowthRecordMutation, useGetListPigGrowthRecordQuery } from "../../store/pig/pigGrowthRecordAction";
import { useSelector } from "react-redux";
import AddDataDialog from "../../components/AddDataDialog";
import EditDataDialog from "../../components/EditDataDialog";

export const status = [
    { value: "true", label: "Khỏe" },
    { value: "false", label: "yếu" },
];


const PigGrowthRecord = () => {
    const { modalType } = useSelector((state) => state.helper);
    const UID = localStorage.getItem("UID");

    const [addPigGrowthRecord] = useAddPigGrowthRecordMutation();
    const [editPigGrowthRecord] = useEditPigGrowthRecordMutation();
    const [deletePigGrowthRecord] = useDeletePigGrowthRecordMutation();
    // const {
    //     data: listBarn,
    //     // isLoading: loadingListBarn,
    // } = useGetListBarnQuery({}, { refetchOnMountOrArgChange: true })

    const {
        data: listTypePigGrowthRecord,
        isLoading: loadingTypePigGrowthRecord,
        refetch
    } = useGetListPigGrowthRecordQuery({
        UID: UID
    }, { refetchOnMountOrArgChange: true })
    const title = [
        { key: "recordDate", label: "Ngày ghi nhận", isDateTime: true },
        { key: "weight", label: "Cân nặng (kg)" },
        // Hiển thị Mã lợn (lồng nhau)
        { key: "pig.pigCode", label: "Mã lợn" },
        // Hiển thị tên Người ghi nhận (lồng nhau)
        { key: "users_permissions_user.username", label: "Người phụ trách" },
        { key: "note", label: "Ghi chú" },
    ];
    const dialogTitle = [ // Truyền danh sách Lợn và User vào
        { key: "recordDate", label: "Ngày ghi nhận", isDateTime: true }, // Ngày tháng
        { key: "weight", label: "Cân nặng", isNumber: true },

        // {
        //     key: "pig",
        //     label: "Lợn",
        //     isDropDown: true,
        //     // list: convertToDropdown(listPigs), // Giả định list Lợn được truyền vào
        //     mappingKey: "pig.id" // 🛑 Lấy ID của Lợn
        // },

        // {
        //     key: "users_permissions_user",
        //     label: "Người ghi nhận",
        //     isDropDown: true,
        //     // list: convertToDropdown(listUsers), // Giả định list User được truyền vào
        //     mappingKey: "users_permissions_user.id" // 🛑 Lấy ID của User
        // },

        { key: "note", label: "Ghi chú" },
    ];


    return (
        <BoxContainer padding={'2rem'}>
            {modalType === 'add' && (
                <AddDataDialog
                    dialogTitle={dialogTitle}
                    mutationAddFunction={addPigGrowthRecord}
                    refetch={refetch}
                />
            )}


            {modalType === 'edit' && (
                <EditDataDialog
                    dialogTitle={dialogTitle}
                    mutationEditFunction={editPigGrowthRecord}
                    refetch={refetch}
                />
            )}

            <CustomTable
                title={title}
                data={listTypePigGrowthRecord?.data}
                isEdit={true}
                mutationDeleteFunction={deletePigGrowthRecord}
                loading={loadingTypePigGrowthRecord}
                refetch={refetch}
            />
        </BoxContainer>
    )
}

export default PigGrowthRecord;