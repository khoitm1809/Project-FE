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
                const { barnId, UID, ...rest } = params || {};
                return {
                    url: API_URL.PIG + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(barnId ? { "filters[barn][id]": barnId } : {}),
                        ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
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
            query: ({ id, ...rest }) => ({
                url: API_URL.PIG + "/" + id,
                method: 'PUT',
                data: { data: rest },
            }),
        }),

        // delete off spring
        deletePig: builder.mutation({
            query: (id) => ({
                url: `${API_URL.PIG}/${id}`,
                method: 'DELETE',
            }),
        }),

        // detail pig
        getDetaiPig: builder.query({
            query: (params) => {
                const { pigId, ...rest } = params || {};
                return {
                    url: API_URL.PIG + "/" + pigId + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                    },
                };
            },
        }),


    }),
});

export const {
    useGetDetaiPigQuery,
    useGetListPigQuery,
    useAddPigMutation,
    useDeletePigMutation,
    useEditPigMutation
} = pigApi;
