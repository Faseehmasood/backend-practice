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

    })
})

export const {
    useGetChannelProfileQuery,
    useGetChannelStatsQuery,
    useGetChannelVideosQuery,
    useGetCurrentUserQuery,
} = userApiSlice