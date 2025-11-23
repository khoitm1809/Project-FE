import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../src/utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';


export const areaApi = createApi({
    reducerPath: 'areaApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        //area
        addArea: builder.mutation({
            query: (body) => ({
                url: API_URL.AREA,
                method: 'POST',
                data: body,
            }),
        }),

        getListArea: builder.query({
            query: (params) => ({
                url: API_URL.AREA + "?populate=*",
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        editArea: builder.mutation({
            query: (body) => ({
                url: API_URL.AREA + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        deleteArea: builder.mutation({
            query: (id) => ({
                url: API_URL.AREA + "/" + id,
                method: 'DELETE',
            }),
        }),

        //barn
        addBarn: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN,
                method: 'POST',
                data: { data: body },
            }),
        }),

        getListBarn: builder.query({
            query: (params) => {
                const { areaId, UID, ...rest } = params || {};
                return {
                    url: API_URL.BARN + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(areaId ? { "filters[area][id]": areaId } : {}),
                        ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
                    },
                };
            },
        }),


        editBarn: builder.mutation({
            query: (body) => ({
                url: API_URL.BARN + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        deleteBarn: builder.mutation({
            query: (id) => ({
                url: API_URL.BARN + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useAddAreaMutation,
    useGetListAreaQuery,
    useEditAreaMutation,
    useDeleteAreaMutation,
    useAddBarnMutation,
    useGetListBarnQuery,
    useEditBarnMutation,
    useDeleteBarnMutation
} = areaApi;
