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

    })
})

export const {
    useGetChannelProfileQuery,
    useGetChannelStatsQuery,
    useGetChannelVideosQuery,
} = userApiSlice