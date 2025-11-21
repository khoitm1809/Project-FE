import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { useAddPigMutation, useDeletePigMutation, useEditPigMutation, useGetListPigQuery } from "../../store/pig/pigAction";
// import { useGetListBarnQuery } from "../../store/breeding/breedingAction";
// import { useGetListTypePigQuery } from "../../store/typePig/typePigAction";
import { convertToDropdown } from "../../components/convertToDropdown";

export const status = [
    { value: "true", label: "Khỏe" },
    { value: "false", label: "yếu" },
];


const PigPage = () => {
    const [addPig] = useAddPigMutation();
    const [editPig] = useEditPigMutation();
    const [deletePig] = useDeletePigMutation();
    // const {
    //     data: listBarn,
    //     // isLoading: loadingListBarn,
    // } = useGetListBarnQuery({}, { refetchOnMountOrArgChange: true })

    // const {
    //     data: listTypePig,
    //     // isLoading: loadingTypePig,
    // } = useGetListTypePigQuery({}, { refetchOnMountOrArgChange: true })
    // console.log(listTypePig)
    // const titleAdd = [
    //     { key: "pigCode", label: "pigCode" }, //hiện
    //     { key: "weight", label: "weight" }, //hiện
    //     { key: "age", label: "age" }, // hiện
    //     { key: "healthStatus", label: "healthStatus", isDropDown: true, list: status }, // true, false
    //     { key: "barn", label: "barn", isDropDown: true, list: convertToDropdown(listBarn?.data) }, //api list barn 
    //     { key: "type_pig", label: "type_pig", isDropDown: true, list: convertToDropdown(listTypePig?.data) }, //api type pig
    //     { key: "pig_growth_records", label: "pig_growth_records" }, // ẩn trên dialog
    //     { key: "users_permissions_user", label: "users_permissions_user" }, //người tạo
    // ];
    // const {
    //     data: listPig,
    //     isLoading: loadingListPig,
    //     refetch
    // } = useGetListPigQuery({}, { refetchOnMountOrArgChange: true })


    return (
        <BoxContainer padding={'2rem'}>
            {/* <CustomTable
                title={title}
                titleAdd={titleAdd}
                data={listPig?.data}
                isEdit={true}
                mutationAddFunction={addPig}
                mutationEditFunction={editPig}
                mutationDeleteFunction={deletePig}
                loading={loadingListPig}
                refetch={refetch}
            /> */}
        </BoxContainer>
    )
}

export default PigPage;