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
    
    }),
});

export const { useGetListFoodWarehouseQuery, useGetListMeditionWarehouseQuery  } = warehouseApi;
