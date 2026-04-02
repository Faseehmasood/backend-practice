import { apiSlice } from "./apiSlice"

export const videoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        // Get All Videos
        getAllVideos: builder.query({
            query: ({ page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc" } = {}) => ({
                url: `/videos?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}&sortType=${sortType}`,
                method: "GET"
            }),
            providesTags: ["Video"]
        }),

        // Get Video By Id
        getVideoById: builder.query({
            query: (videoId) => ({
                url: `/videos/${videoId}`,
                method: "GET"
            }),
            providesTags: ["Video"]
        }),

        // Toggle Like
        toggleVideoLike: builder.mutation({
            query: (videoId) => ({
                url: `/likes/toggle/v/${videoId}`,
                method: "POST"
            }),
            invalidatesTags: ["Video"]
        }),

        // Toggle Subscription
        toggleSubscription: builder.mutation({
            query: (channelId) => ({
                url: `/subscriptions/${channelId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Subscription"]
        }),

    })
})

export const {
    useGetAllVideosQuery,
    useGetVideoByIdQuery,
    useToggleVideoLikeMutation,
    useToggleSubscriptionMutation,
} = videoApiSlice