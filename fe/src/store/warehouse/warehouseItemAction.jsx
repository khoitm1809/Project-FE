import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const warehouseItemApi = createApi({
    reducerPath: 'warehouseItemApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({

        getListWarehouseItem: builder.query({
            query: (params) => {
                const { warehouseCategoryID, UID, ...rest } = params || {};
                return {
                    url: API_URL.WAREHOUSE_ITEM + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(warehouseCategoryID ? { "filters[warehouse_category][id]": warehouseCategoryID } : {}),
                        ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
                    },
                };
            },
        }),
        addWarehouseItem: builder.mutation({
            query: (body) => ({
                url: API_URL.WAREHOUSE_ITEM,
                method: 'POST',
                data: body,
            }),
        }),

        editWarehouseItem: builder.mutation({
            query: (body) => ({
                url: API_URL.WAREHOUSE_ITEM + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deleteWarehouseItem: builder.mutation({
            query: (id) => ({
                url: API_URL.WAREHOUSE_ITEM + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListWarehouseItemQuery,
    useAddWarehouseItemMutation,
    useDeleteWarehouseItemMutation,
    useEditWarehouseItemMutation
} = warehouseItemApi;
