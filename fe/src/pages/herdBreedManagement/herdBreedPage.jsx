import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddBreadingMutation, useGetListBreedingQuery } from "../../store/breeding/breedingAction";
import { ROUTES } from "../../router/routerConstants";

const HerdBreedPage = () => {
    const [addBreeding] = useAddBreadingMutation();
    const title = [
        { key: "name", label: "Tên khu" },
        { key: "acreage", label: "Diện tích" },
        { key: "number_of_barns", label: "Số chuồng" },
        { key: "status", label: "Trạng thái" },
        { key: "type", label: "Loại" },
        { key: "start_date", label: "Ngày bắt đầu" },
        { key: "note", label: "Note" },
    ];
    const {
        data: listBreeding,
        isLoading: loadingListBreeding
    } = useGetListBreedingQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listBreeding}
                isEdit={true}
                detailNavigate={ROUTES.BARN}
                mutationFunction={addBreeding}
            />
        </BoxContainer>
    )
}

export default HerdBreedPage;