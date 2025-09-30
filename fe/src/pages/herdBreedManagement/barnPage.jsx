import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddBarnMutation, useDeleteBarnMutation, useEditBarnMutation, useGetListBarnQuery } from "../../store/breeding/breedingAction";
import { ROUTES } from "../../router/routerConstants";

const BarnPage = () => {
    const [addBarn] = useAddBarnMutation();
    const [editBarn] = useEditBarnMutation();
    const [deleteBarn] = useDeleteBarnMutation();
    const title = [
        { key: "name", label: "Tên chuồng" },
        { key: "acreage", label: "Diện tích" },
        { key: "maximum_capacity", label: "Sức chứa" },
        { key: "status", label: "Trạng thái" },
        { key: "start_date", label: "Ngày bắt đầu" },
        { key: "breedingarea.name", label: "Thuộc khu" },
        { key: "note", label: "Note" },
    ];
    const {
        data: listBarn,
        isLoading: loadingListBarn
    } = useGetListBarnQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listBarn}
                isEdit={true}
                mutationAddFunction={addBarn}
                mutationEditFunction={editBarn}
                mutationDeleteFunction={deleteBarn}
                loading={loadingListBarn}
            />
        </BoxContainer>
    )
}

export default BarnPage;