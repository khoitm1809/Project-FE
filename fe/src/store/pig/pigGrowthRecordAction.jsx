import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';
const UID = localStorage.getItem("UID")
export const pigGrowthRecordApi = createApi({
    reducerPath: 'pigGrowthRecordApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        //get list pig
        getListPigGrowthRecord: builder.query({
            query: (params) => {
                const { UID, ...rest } = params || {};
                return {
                    url: API_URL.PIG_GROWTH_RECORDS + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        // ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
                    },
                };
            },
        }),

        // add off spring
        addPigGrowthRecord: builder.mutation({
            query: (payload) => ({
                url: API_URL.PIG,
                method: 'POST',
                data: { data: payload },
            }),
        }),

        // edit off spring
        editPigGrowthRecord: builder.mutation({
            query: (body) => ({
                url: API_URL.PIG + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deletePigGrowthRecord: builder.mutation({
            query: (id) => ({
                url: API_URL.PIG + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListPigGrowthRecordQuery,
    useAddPigGrowthRecordMutation,
    useDeletePigGrowthRecordMutation,
    useEditPigGrowthRecordMutation
} = pigGrowthRecordApi;
