import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const serviceApi = createApi({
    reducerPath: 'serviceApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getListService: builder.query({
            query: (params) => ({
                url: API_URL.SERVICE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        addService: builder.mutation({
            query: (body) => ({
                url: API_URL.SERVICE + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        editService: builder.mutation({
            query: (body) => ({
                url: API_URL.SERVICE + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        deleteService: builder.mutation({
            query: (id) => ({
                url: API_URL.SERVICE + "/delete/" + id,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetListServiceQuery,
    useAddServiceMutation,
    useDeleteServiceMutation,
    useEditServiceMutation
} = serviceApi;
