import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useAddTypePigMutation, useDeleteTypePigMutation, useEditTypePigMutation, useGetListTypePigQuery } from "../../store/typePig/typePigAction";


export function PigTypesPage() {
    const [addPigType] = useAddTypePigMutation();
    const [editPigType] = useEditTypePigMutation();
    const [deletePigType] = useDeleteTypePigMutation();

    const {
        data: listPigTpe,
        isLoading: loadingPigType,
        refetch
    } = useGetListTypePigQuery({}, { refetchOnMountOrArgChange: true })

    const title = [
        { key: "name", label: "Tên loại lợn" },
        { key: "description", label: "Mô tả" },
    ];

    const titleDialog = [
        { key: "name", label: "Tên Loại lợn" },
        { key: "description", label: "Mô tả" },
    ];

    return (
        <BoxContainer padding={'2rem'}>

            <CustomTable
                title={title}
                data={listPigTpe?.data}
                isEdit={true}
                mutationDeleteFunction={deletePigType}
                loading={loadingPigType}
                refetch={refetch}
            />
        </BoxContainer>
    );
}
