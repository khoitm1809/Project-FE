import React from 'react';
import { BoxContainer, Column, Row } from '../../components/commonStyled';
import { useDeleteInvoiceMutation, useGetListInvoiceQuery } from '../../store/invoice/invoiceApi';
import CustomTable from "../../components/CustomTable";
import { ROUTES } from '../../router/routerConstants';

export function Invoice() {
    const [deleteInvoice] = useDeleteInvoiceMutation();

    const {
        data: listInvoice,
        isLoading: isLoadingInvoice,
        refetch
    } = useGetListInvoiceQuery({}, {
        refetchOnMountOrArgChange: true
    });


    console.log(listInvoice?.data)
    const title = [
        { key: "pigCode", label: "Mã heo" },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "weight", label: "Cân nặng", },
        { key: "barn.name", label: "Chuồng" },
        { key: "age", label: "Tuổi" },
        { key: "pig_growth_records.weight", label: "Tăng trưởng", isArray: true },
        { key: "price", label: "Giá" },
        { key: "pig_type.name", label: "Loại heo" },
        { key: "users_permissions_user.username", label: "Người tạo" }

    ];
    return (
        <BoxContainer padding={'2rem'}>
            <CustomTable
                title={title}
                data={listInvoice?.data}
                isEdit={true}
                mutationDeleteFunction={deleteInvoice}
                loading={isLoadingInvoice}
                refetch={refetch}
                detailNavigate={ROUTES.DETAIL_PIG}
            />
        </BoxContainer>
    );
}