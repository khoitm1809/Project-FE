import { BoxContainer } from '../../components/commonStyled';
import { useDeleteInvoiceMutation, useGetListInvoiceQuery } from '../../store/invoice/invoiceApi';
import CustomTable from "../../components/CustomTable";
import { ROUTES } from '../../router/routerConstants';
import { formatCurrency } from '../pig/detailPig';

export function Invoice() {
    const [deleteInvoice] = useDeleteInvoiceMutation();

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
    return (
        <BoxContainer padding={'2rem'}>
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