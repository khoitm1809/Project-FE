import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../../src/utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // userLogin
        userLogin: builder.mutation({
            query: (body) => ({
                url: API_URL.LOGIN,
                method: 'POST',
                data: body,
            }),
        }),

        getUserRole: builder.query({
            query: (params) => ({
                url: API_URL.ROLE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        userRegister: builder.mutation({
            query: (body) => ({
                url: API_URL.REGISTER,
                method: 'POST',
                data: body,
            }),
        }),

    }),
});

export const { useUserLoginMutation, useLazyGetUserRoleQuery, useUserRegisterMutation } = authApi;
