import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const breedingApi = createApi({
    reducerPath: 'breedingApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Breeding
        getListBreeding: builder.query({
            query: (params) => ({
                url: API_URL.BREEDING,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),
        // Get List Barn
        getListBarn: builder.query({
            query: (params) => ({
                url: API_URL.BARN,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add breeding
        addBreading: builder.mutation({
            query: (body) => ({
                url: API_URL.BREEDING + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // add barn
        addBarn: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN + "/add",
                method: 'POST',
                data: body,
            }),
        }),

        // edit breeding
        editBreading: builder.mutation({
            query: (body) => ({
                url: API_URL.BREEDING + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // edit barn
        editBarn: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN + "/edit/" + body._id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete breeding
        deleteBreading: builder.mutation({
            query: (id) => ({
                url: API_URL.BREEDING + "/delete/" + id,
                method: 'DELETE',
            }),
        }),

        // delete barn
        deleteBarn: builder.mutation({
            query: (id) => ({
                url: API_URL.BREEDING + "/delete/" + id,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetListBreedingQuery,
    useGetListBarnQuery,
    useAddBreadingMutation,
    useAddBarnMutation,
    useEditBreadingMutation,
    useEditBarnMutation,
    useDeleteBarnMutation,
    useDeleteBreadingMutation
} = breedingApi;
