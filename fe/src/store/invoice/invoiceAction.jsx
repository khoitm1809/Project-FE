import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListInvoice: builder.query({
            query: (params) => ({
                url: API_URL.INVOICE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add invoice
        addInvoice: builder.mutation({
            query: (body) => ({
                url: API_URL.INVOICE + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // edit invoice
        editInvoice: builder.mutation({
            query: (body) => ({
                url: API_URL.INVOICE + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete invoice
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: API_URL.INVOICE + "/delete/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useAddInvoiceMutation,
    useGetListInvoiceQuery,
    useDeleteInvoiceMutation,
    useEditInvoiceMutation
} = invoiceApi;
