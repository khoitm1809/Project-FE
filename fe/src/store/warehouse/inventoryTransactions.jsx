import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const inventoryTransactionApi = createApi({
    reducerPath: 'inventoryTransactionApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListInventoryTransaction: builder.query({
            query: (params) => ({
                url: API_URL.INVENTORY_TRANSACTIONS + "?populate=*",
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add off spring
        addInventoryTransaction: builder.mutation({
            query: (body) => ({
                url: API_URL.INVENTORY_TRANSACTIONS,
                method: 'POST',
                data: { data: body },
            }),
        }),

        // edit off spring
        editInventoryTransaction: builder.mutation({
            query: (body) => ({
                url: API_URL.INVENTORY_TRANSACTIONS + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deleteInventoryTransaction: builder.mutation({
            query: (id) => ({
                url: API_URL.INVENTORY_TRANSACTIONS + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useAddInventoryTransactionMutation,
    useDeleteInventoryTransactionMutation,
    useEditInventoryTransactionMutation,
    useGetListInventoryTransactionQuery
} = inventoryTransactionApi;
