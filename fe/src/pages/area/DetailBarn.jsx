import { useLocation } from "react-router";
import { BoxContainer, Row } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddPigMutation, useDeletePigMutation, useEditPigMutation, useGetListPigQuery } from "../../store/pig/pigAction";

const DetailBarnPage = () => {
    const location = useLocation();
    const barnId = location?.state
    const role = localStorage.getItem("role");
    const [addPig] = useAddPigMutation();
    const [editPig] = useEditPigMutation();
    const [deletePig] = useDeletePigMutation();
    const title = [
        { key: "pigCode", label: "pigCode" },
        { key: "type_pig", label: "type_pig" },
        { key: "healthStatus", label: "healthStatus" },
        { key: "weight", label: "weight" },
        { key: "createdAt", label: "createdAt" },
    ];
    const {
        data: listPig,
        isLoading: loadingListPig,
        refetch
    } = useGetListPigQuery({
        // barnId
    }, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <CustomTable
                title={title}
                data={listPig}
                isEdit={true}
                mutationAddFunction={addPig}
                mutationEditFunction={editPig}
                mutationDeleteFunction={deletePig}
                loading={loadingListPig}
                refetch={refetch}
            />
        </BoxContainer>
    )
}
export default DetailBarnPage;