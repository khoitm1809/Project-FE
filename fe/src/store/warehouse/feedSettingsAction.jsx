import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const feedSettingApi = createApi({
    reducerPath: 'feedSettingApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListFeedSetting: builder.query({
            query: (params) => ({
                url: API_URL.WAREHOUSE_CATEGORY + "?populate=*",
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        // add off spring
        addFeedSetting: builder.mutation({
            query: (body) => ({
                url: API_URL.WAREHOUSE_CATEGORY,
                method: 'POST',
                data: { data: body },
            }),
        }),

        // edit off spring
        editFeedSetting: builder.mutation({
            query: (body) => ({
                url: API_URL.WAREHOUSE_CATEGORY + "/" + body.id,
                method: 'PUT',
                data: body,
            }),
        }),

        // delete off spring
        deleteFeedSetting: builder.mutation({
            query: (id) => ({
                url: API_URL.WAREHOUSE_CATEGORY + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListFeedSettingQuery,
    useAddFeedSettingMutation,
    useDeleteFeedSettingMutation,
    useEditFeedSettingMutation
} = feedSettingApi;
