import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getListTodo: builder.query({
            query: (params) => {
                const { UID, ...rest } = params || {};
                return {
                    url: API_URL.TODO + "?populate=*",
                    method: "GET",
                    params: {
                        ...rest,
                        ...(UID ? { "filters[users_permissions_user][id]": UID } : {}),
                    },
                };
            },
        }),

        // add off spring
        addTodo: builder.mutation({
            query: (payload) => ({
                url: API_URL.TODO,
                method: 'POST',
                data: { data: payload },
            }),
        }),

        // edit off spring
        editTodo: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: API_URL.TODO + "/" + id,
                method: 'PUT',
                data: { data: updateData },
            }),
        }),

        // delete off spring
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: API_URL.TODO + "/" + id,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useGetListTodoQuery,
    useAddTodoMutation,
    useDeleteTodoMutation,
    useEditTodoMutation
} = todoApi;
