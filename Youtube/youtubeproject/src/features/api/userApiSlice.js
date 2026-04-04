import { apiSlice } from "./apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Get Channel Profile
        getChannelProfile: builder.query({
            query: (username) => ({
                url: `/users/c/${username}`,
                method: "GET"
            }),
            providesTags: ["User"]
        }),

        // Get Channel Stats
        getChannelStats: builder.query({
            query: () => ({
                url: `/dashboard/stats`,
                method: "GET"
            }),
            providesTags: ["User"]
        }),

        // Get Channel Videos
        getChannelVideos: builder.query({
            query: () => ({
                url: `/dashboard/videos`,
                method: "GET"
            }),
            providesTags: ["Video"]
        }),

        // Current User
getCurrentUser: builder.query({
    query: () => ({
        url: "/users/current-user",
        method: "GET"
    }),
    providesTags: ["User"]
}),

// Update User Details
updateUserDetails: builder.mutation({
    query: (data) => ({
        url: "/users/update-user-details",
        method: "PATCH",
        body: data
    }),
    invalidatesTags: ["User"]
}),

// Change Password
changePassword: builder.mutation({
    query: (data) => ({
        url: "/users/change-password",
        method: "POST",
        body: data
    })
}),

// Update Avatar
updateAvatar: builder.mutation({
    query: (formData) => ({
        url: "/users/avatar",
        method: "PATCH",
        body: formData
    }),
    invalidatesTags: ["User"]
}),

// Update Cover Image
updateCoverImage: builder.mutation({
    query: (formData) => ({
        url: "/users/coverImage",
        method: "PATCH",
        body: formData
    }),
    invalidatesTags: ["User"]
}),

    })
})

export const {
    useGetChannelProfileQuery,
    useGetChannelStatsQuery,
    useGetChannelVideosQuery,
    useGetCurrentUserQuery,
    useUpdateUserDetailsMutation,
    useChangePasswordMutation,
    useUpdateAvatarMutation,
    useUpdateCoverImageMutation,
} = userApiSlice