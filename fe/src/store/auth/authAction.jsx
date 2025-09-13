import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../src/utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';


export const itemApi = createApi({
    reducerPath: 'itemApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        //getItemRecommend
        userLogin: builder.query({
            query: (params) => ({
                url: API_URL.LOGIN,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        //getItemsHot

    }),
});

export const {

} = itemApi;
