import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';
const UID = localStorage.getItem("UID")
export const pigApi = createApi({
    reducerPath: 'piggApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        //get list pig
        getListPig: builder.query({
            query: (params) => {
                const { barnId, ...rest } = params || {};
                return {
                    url: API_URL.PIG + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(barnId ? { "filters[barn][id]": barnId } : {}),
                    },
                };
            },
        }),

        // add off spring
        addPig: builder.mutation({
            query: (payload) => ({
                url: API_URL.PIG,
                method: 'POST',
                data: { data: payload },
            }),
        }),

        // edit off spring
        editPig: builder.mutation({
            query: (body) => ({
                url: API_URL.PIG + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deletePig: builder.mutation({
            query: (id) => ({
                url: API_URL.PIG + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListPigQuery,
    useAddPigMutation,
    useDeletePigMutation,
    useEditPigMutation
} = pigApi;
