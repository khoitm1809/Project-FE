import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../utils/ApiConstants';
import { LOCAL_STORAGE_NAME } from '../../utils/constant';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Get List Off Spring
        getListTodo: builder.query({
            query: (params) => ({
                url: API_URL.TODO,
                method: 'GET',
                params: {
                    ...params,
                },
            }),
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
            query: (body) => ({
                url: API_URL.TODO + "/" + body.id,
                method: 'PUT',
                data: { data: body },
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
