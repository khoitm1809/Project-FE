import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";
import CustomTable from "../../components/CustomTable";
import { ROUTES } from "../../router/routerConstants";
import { useAddInvoiceMutation, useDeleteInvoiceMutation, useEditInvoiceMutation, useGetListInvoiceQuery } from "../../store/invoice/invoiceAction";

const InvoicePage = () => {
    const [addInvoice] = useAddInvoiceMutation();
    const [editInvoice] = useEditInvoiceMutation();
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const title = [
        { key: "discount", label: "Giảm giá" },
        { key: "payment_status", label: "Trạng thái thanh toán" },
        { key: "creation_date", label: "Ngày tạo" },
    ];
    const {
        data: listInvoice,
        isLoading: loadingListInvoice
    } = useGetListInvoiceQuery({}, { refetchOnMountOrArgChange: true })


    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Tiêu đề</Typography>
            </Box>
            <CustomTable
                title={title}
                data={listInvoice}
                isEdit={true}
                mutationAddFunction={addInvoice}
                mutationEditFunction={editInvoice}
                mutationDeleteFunction={deleteInvoice}
                loading={loadingListInvoice}
            />
        </BoxContainer>
    )
}

export default InvoicePage;