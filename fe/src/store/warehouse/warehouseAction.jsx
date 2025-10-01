import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const warehouseApi = createApi({
    reducerPath: 'warehouseApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List food warehouse
        getListFoodWarehouse: builder.query({
            query: (params) => ({
                url: API_URL.FOOD_WAREHOUSE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // Get List medition warehouse
        getListMeditionWarehouse: builder.query({
            query: (params) => ({
                url: API_URL.MEDITION_WAREHOUSE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add food warehouse
        addFoodWarehouse: builder.mutation({
            query: (body) => ({
                url: API_URL.FOOD_WAREHOUSE + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // add medition warehouse
        addMeditionWarehouse: builder.mutation({
            query: (body) => ({
                url: API_URL.MEDITION_WAREHOUSE + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // edit food warehouse
        editFoodWarehouse: builder.mutation({
            query: (body) => ({
                url: API_URL.FOOD_WAREHOUSE + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete food warehouse
        deleteFoodWarehouse: builder.mutation({
            query: (id) => ({
                url: API_URL.FOOD_WAREHOUSE + "/delete/" + id,
                method: 'DELETE',
            }),
        }),

        // edit medition warehouse
        editMeditionWarehouse: builder.mutation({
            query: (body) => ({
                url: API_URL.MEDITION_WAREHOUSE + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete medition warehouse
        deleteMeditionWarehouse: builder.mutation({
            query: (id) => ({
                url: API_URL.MEDITION_WAREHOUSE + "/delete/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListFoodWarehouseQuery,
    useGetListMeditionWarehouseQuery,
    useAddFoodWarehouseMutation,
    useAddMeditionWarehouseMutation,
    useDeleteFoodWarehouseMutation,
    useDeleteMeditionWarehouseMutation,
    useEditFoodWarehouseMutation,
    useEditMeditionWarehouseMutation
} = warehouseApi;
