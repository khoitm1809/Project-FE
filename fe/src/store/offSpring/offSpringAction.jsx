import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const offSpringApi = createApi({
    reducerPath: 'offSpringApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListOffSpring: builder.query({
            query: (params) => ({
                url: API_URL.OFF_SPRING,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add off spring
        addOffSpring: builder.mutation({
            query: (body) => ({
                url: API_URL.OFF_SPRING + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // edit off spring
        editOffSpring: builder.mutation({
            query: (body) => ({
                url: API_URL.OFF_SPRING + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deleteOffSpring: builder.mutation({
            query: (id) => ({
                url: API_URL.OFF_SPRING + "/delete/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListOffSpringQuery,
    useAddOffSpringMutation,
    useDeleteOffSpringMutation,
    useEditOffSpringMutation
} = offSpringApi;
