import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useDeleteUserMutation, useEditUserMutation, useGetListUserQuery, useUserRegisterMutation } from "../../store/auth/authAction";

const ListUserPage = () => {
    const [registerUser] = useUserRegisterMutation();
    const [editUser] = useEditUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const title = [
        { key: "username", label: "Tên người dùng" },
        { key: "email", label: "Email" },
        { key: "createdAt", label: "Ngày tạo" },
        { key: "password", label: "Mật khẩu" },
    ];
    const {
        data: listUser,
        isLoading: loadingListUser,
        refetch
    } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })
    return (
        <BoxContainer padding={'2rem'}>
            <CustomTable
                title={title}
                data={listUser}
                isEdit={true}
                mutationAddFunction={registerUser}
                mutationEditFunction={editUser}
                mutationDeleteFunction={deleteUser}
                loading={loadingListUser}
                refetch={refetch}
            />
        </BoxContainer>
    )
}

export default ListUserPage;