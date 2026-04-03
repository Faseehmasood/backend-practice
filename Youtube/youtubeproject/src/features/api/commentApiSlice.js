import { apiSlice } from "./apiSlice"

export const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Get Video Comments
        getVideoComments: builder.query({
            query: (videoId) => ({
                url: `/comments/${videoId}`,
                method: "GET"
            }),
            providesTags: ["Comment"]
        }),

        // Add Comment
        addComment: builder.mutation({
            query: ({ videoId, content }) => ({
                url: `/comments/${videoId}`,
                method: "POST",
                body: { content }
            }),
            invalidatesTags: ["Comment"]
        }),

        // Delete Comment
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `/comments/c/${commentId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Comment"]
        }),

    })
})

export const {
    useGetVideoCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
} = commentApiSlice