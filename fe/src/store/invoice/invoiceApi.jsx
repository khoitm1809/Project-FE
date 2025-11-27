import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        //get list Invoice
        getListInvoice: builder.query({
            query: (params) => {
                const { barnId, ...rest } = params || {};
                return {
                    url: API_URL.INVOICE + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                    },
                };
            },
        }),

        // add off spring
        addInvoice: builder.mutation({
            query: (payload) => ({
                url: API_URL.INVOICE,
                method: 'POST',
                data: { data: payload },
            }),
        }),

        // edit off spring
        editInvoice: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: API_URL.INVOICE + "/" + id,
                method: 'PUT',
                data: { data: rest },
            }),
        }),

        // delete off spring
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: API_URL.INVOICE + "/" + id,
                method: 'DELETE',
            }),
        }),

        // detail Invoice
        getDetailInvoice: builder.query({
            query: (params) => {
                const { InvoiceId, ...rest } = params || {};
                return {
                    url: API_URL.INVOICE + "/" + InvoiceId + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                    },
                };
            },
        }),


    }),
});

export const {
    useGetDetailInvoiceQuery,
    useGetListInvoiceQuery,
    useAddInvoiceMutation,
    useDeleteInvoiceMutation,
    useEditInvoiceMutation
} = invoiceApi;
