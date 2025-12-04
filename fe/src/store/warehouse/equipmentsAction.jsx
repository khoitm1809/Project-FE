import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const equipmentApi = createApi({
    reducerPath: 'equipmentApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListEquipment: builder.query({
            query: (params) => ({
                url: API_URL.BARN_EQUIPMENT + "?populate=*",
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add off spring
        addEquipment: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN_EQUIPMENT,
                method: 'POST',
                data: { data: body },
            }),
        }),

        // edit off spring
        editEquipment: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN_EQUIPMENT + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deleteEquipment: builder.mutation({
            query: (id) => ({
                url: API_URL.BARN_EQUIPMENT + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListEquipmentQuery,
    useAddEquipmentMutation,
    useDeleteEquipmentMutation,
    useEditEquipmentMutation
} = equipmentApi;
