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

        getListRole: builder.query({
            query: (params) => ({
                url: API_URL.LIST_ROLE,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
        }),

        getListUser: builder.query({
            query: (params) => {
                const { role, ...rest } = params || {};
                return {
                    url: API_URL.LIST_USER + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(role ? { "filters[role][type]": role } : {}),
                    },
                };
            },
        }),

        getCurrentUser: builder.query({
            query: (params) => {
                const { UID, ...rest } = params || {};
                return {
                    url: API_URL.LIST_USER + '/' + UID + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        // ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
                    },
                };
            },
        }),

        userRegister: builder.mutation({
            query: (body) => ({
                url: API_URL.LIST_USER,
                method: 'POST',
                data: body,
            }),
        }),

        imageUpload: builder.mutation({
            query: (body) => ({
                url: API_URL.UPLOAD,
                method: 'POST',
                data: body,
            }),
        }),

        // edit user
        editUser: builder.mutation({
            query: ({ UID, avatar }) => ({
                url: API_URL.LIST_USER + '/' + UID + "?populate=*",
                method: 'PUT',
                data: avatar,

            }),
        }),

        // delete user
        deleteUser: builder.mutation({
            query: (id) => ({
                url: API_URL.LIST_USER + "/" + id,
                method: 'DELETE',
            }),
        }),


    }),
});

export const { useUserLoginMutation, useImageUploadMutation, useGetListRoleQuery, useLazyGetUserRoleQuery, useGetListUserQuery, useGetCurrentUserQuery, useUserRegisterMutation, useDeleteUserMutation, useEditUserMutation } = authApi;
