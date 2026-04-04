import { apiSlice } from "./apiSlice"

export const playlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Create Playlist
        createPlaylist: builder.mutation({
            query: (data) => ({
                url: "/playlists",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Playlist"]
        }),

        // Get User Playlists
        getUserPlaylists: builder.query({
            query: (userId) => ({
                url: `/playlists/user/${userId}`,
                method: "GET"
            }),
            providesTags: ["Playlist"]
        }),

        // Delete Playlist
        deletePlaylist: builder.mutation({
            query: (playlistId) => ({
                url: `/playlists/${playlistId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Playlist"]
        }),
        
        // Add Video to Playlist
addVideoToPlaylist: builder.mutation({
    query: ({ playlistId, videoId }) => ({
        url: `/playlists/${playlistId}/${videoId}`,
        method: "PATCH"
    }),
    invalidatesTags: ["Playlist"]
}),

// Get Playlist By Id
getPlaylistById: builder.query({
    query: (playlistId) => ({
        url: `/playlists/${playlistId}`,
        method: "GET"
    }),
    providesTags: ["Playlist"]
}),

    })
})

export const {
    useCreatePlaylistMutation,
    useGetUserPlaylistsQuery,
    useDeletePlaylistMutation,
    useAddVideoToPlaylistMutation,
    useGetPlaylistByIdQuery,
} = playlistApiSlice