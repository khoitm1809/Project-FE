import { BoxContainer } from '../../components/commonStyled';
import { useAddInvoiceMutation, useDeleteInvoiceMutation, useEditInvoiceMutation, useGetListInvoiceQuery } from '../../store/invoice/invoiceApi';
import CustomTable from "../../components/CustomTable";
import { ROUTES } from '../../router/routerConstants';
import { formatCurrency } from '../pig/detailPig';
import { useSelector } from 'react-redux';
import AddDataDialog from '../../components/AddDataDialog';
import EditDataDialog from '../../components/EditDataDialog';

export function Invoice() {
    const [addInvoice] = useAddInvoiceMutation();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const [editInvoice] = useEditInvoiceMutation();
    const { modalType } = useSelector((state) => state.helper);

    const {
        data: listInvoice,
        isLoading: isLoadingInvoice,
        refetch
    } = useGetListInvoiceQuery({}, {
        refetchOnMountOrArgChange: true
    });


    const totalPigs = listInvoice?.data?.length || 0;
    const totalValue = listInvoice?.data?.reduce((sum, pig) => sum + parseInt(pig.price, 10), 0) || 0;

    const invoiceSummaryCards = [
        {
            title: "Tổng số lợn đã xuất",
            count: totalPigs.toLocaleString(),
            iconKey: "đã xong",
        },
        {
            title: "Tổng tiền hóa đơn",
            count: formatCurrency(totalValue),
            iconKey: "tổng công việc",
        },

    ];
    const title = [
        { key: "pigCode", label: "Mã heo" },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "weight", label: "Cân nặng", },
        { key: "age", label: "Tuổi" },
        { key: "price", label: "Giá" },
        { key: "pig_type.name", label: "Loại heo" },
        { key: "users_permissions_user.username", label: "Người xuất" }

    ];

    const titleDialog = [
        { key: "pigCode", label: "Mã heo" },
        { key: "healthStatus", label: "Sức khỏe" },
        { key: "weight", label: "Cân nặng", },
        { key: "age", label: "Tuổi" },
        { key: "price", label: "Giá" },
        { key: "pig_type.name", label: "Loại heo" },
        {
            key: "users_permissions_user.username",
            label: "Người xuất",
            mappingKey: "users_permissions_user.id"
        }
    ];
    return (
        <BoxContainer padding={'2rem'}>
            {modalType === 'add' && (
                <AddDataDialog
                    dialogTitle={titleDialog}
                    mutationAddFunction={addInvoice}
                    refetch={refetch}
                />
            )}

            {modalType === 'edit' && (
                <EditDataDialog
                    dialogTitle={titleDialog}
                    mutationEditFunction={editInvoice}
                    refetch={refetch}
                />
            )}
            <CustomTable
                title={title}
                data={listInvoice?.data}
                isEdit={true}
                mutationDeleteFunction={deleteInvoice}
                loading={isLoadingInvoice}
                refetch={refetch}
                // detailNavigate={ROUTES.DETAIL_PIG}
                invoice={true}
                invoiceSummary={invoiceSummaryCards}
            />
        </BoxContainer>
    );
}