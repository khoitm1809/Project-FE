import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { useDeleteUserMutation, useEditUserMutation, useGetListRoleQuery, useGetListUserQuery, useGetUserRoleQuery, useUserRegisterMutation } from "../../store/auth/authAction";
import AddDataDialog from "../../components/AddDataDialog";
import EditDataDialog from "../../components/EditDataDialog";
import { useSelector } from "react-redux";
import { convertToDropdown } from "../../components/convertToDropdown";

const ListUserPage = () => {
    const [registerUser] = useUserRegisterMutation();
    const [editUser] = useEditUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const { modalType } = useSelector((state) => state.helper);

    const {
        data: listRole,
    } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })

    const title = [
        { key: "username", label: "Tên người dùng" },
        { key: "email", label: "Email" },
        { key: "createdAt", label: "Ngày tạo" },
        { key: "password", label: "Mật khẩu" },
    ];

    const titleDialog = [
        { key: "username", label: "Tên người dùng" },
        { key: "email", label: "Email" },
        { key: "password", label: "Mật khẩu", isHiddenInEdit: true }, // Nên ẩn mật khẩu khi Edit
        { key: "role", label: "Role", isDropDown: true, list: convertToDropdown(listRole?.roles), mappingKey: "role.id" },
    ];
    const {
        data: listUser,
        isLoading: loadingListUser,
        refetch
    } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })

    return (
        <BoxContainer padding={'2rem'}>
            {modalType === 'add' && (
                <AddDataDialog
                    dialogTitle={titleDialog}
                    mutationAddFunction={registerUser}
                    refetch={refetch}
                />
            )}

            {modalType === 'edit' && (
                <EditDataDialog
                    dialogTitle={titleDialog}
                    mutationEditFunction={editUser}
                    refetch={refetch}
                />
            )}

            <CustomTable
                title={title}
                data={listUser}
                isEdit={true}
                mutationDeleteFunction={deleteUser}
                loading={loadingListUser}
                refetch={refetch}
                isListUser={true}
            />
        </BoxContainer>
    )
}

export default ListUserPage;