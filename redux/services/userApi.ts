import { apiSlice } from './apiSlice';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: string[];
  avatar?: string;
  phone?: string;
  location?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'User' as const, id: _id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: string; permissions: string[] }>({
      query: ({ id, permissions }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
