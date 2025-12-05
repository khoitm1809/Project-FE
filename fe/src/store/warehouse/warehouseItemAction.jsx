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
                const { itemType, id, ...rest } = params || {};
                return {
                    url: API_URL.WAREHOUSE_ITEM + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(itemType ? { "filters[itemType]": itemType } : {}),
                        ...(id ? { "filters[warehouse_category][id]": id } : {}),
                    },
                };
            },
        }),
        addWarehouseItem: builder.mutation({
            query: (body) => ({
                url: API_URL.WAREHOUSE_ITEM,
                method: 'POST',
                data: { data: body },
            }),
        }),

        editWarehouseItem: builder.mutation({
            query: ({ id, ...bodyData }) => ({
                url: API_URL.WAREHOUSE_ITEM + "/" + id,
                method: 'PUT',
                data: { data: bodyData },
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
    useLazyGetListWarehouseItemQuery,
    useGetListWarehouseItemQuery,
    useAddWarehouseItemMutation,
    useDeleteWarehouseItemMutation,
    useEditWarehouseItemMutation
} = warehouseItemApi;
