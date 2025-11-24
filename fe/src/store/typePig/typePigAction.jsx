import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const typePigApi = createApi({
    reducerPath: 'typePig',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListTypePig: builder.query({
            query: (params) => ({
                url: API_URL.TYPE_PIG,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add off spring
        addTypePig: builder.mutation({
            query: (payload) => ({
                url: API_URL.TYPE_PIG,
                method: 'POST',
                data: { data: payload },
            }),
        }),

        // edit off spring
        editTypePig: builder.mutation({
            query: (body) => ({
                url: API_URL.TYPE_PIG + "/" + body.id,
                method: 'PUT',
                data: { data: body },
            }),
        }),

        // delete off spring
        deleteTypePig: builder.mutation({
            query: (id) => ({
                url: API_URL.TYPE_PIG + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListTypePigQuery,
    useAddTypePigMutation,
    useDeleteTypePigMutation,
    useEditTypePigMutation
} = typePigApi;
