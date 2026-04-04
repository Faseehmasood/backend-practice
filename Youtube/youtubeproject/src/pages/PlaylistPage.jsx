import { useState } from "react"
import { useSelector } from "react-redux"
import { useCreatePlaylistMutation, useGetUserPlaylistsQuery, useDeletePlaylistMutation, useGetPlaylistByIdQuery } from "../features/api/playlistApiSlice"
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

// Playlist Videos Component
const PlaylistVideos = ({ playlistId }) => {
    const { data, isLoading } = useGetPlaylistByIdQuery(playlistId)
    const playlist = data?.data

    if(isLoading) return <p className="text-gray-400 text-sm">Loading...</p>

    return (
        <div className="mt-3 space-y-2">
            {playlist?.videos?.length === 0 ? (
                <p className="text-gray-500 text-sm">No videos yet!</p>
            ) : (
                playlist?.videos?.map((video) => (
                    <Link
                        key={video._id}
                        to={`/video/${video._id}`}
                        className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-10 rounded object-cover"
                        />
                        <p className="text-white text-sm">{video.title}</p>
                    </Link>
                ))
            )}
        </div>
    )
}

const PlaylistPage = () => {
    const { user } = useSelector((state) => state.auth)
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [expandedPlaylist, setExpandedPlaylist] = useState(null)

    const { data, isLoading } = useGetUserPlaylistsQuery(user?._id, {
        skip: !user?._id
    })
    const [createPlaylist] = useCreatePlaylistMutation()
    const [deletePlaylist] = useDeletePlaylistMutation()

    const playlists = data?.data

    const handleCreate = async () => {
        if(!name.trim()) return toast.error("Name is required!")
        if(!description.trim()) return toast.error("Description is required!")
        try {
            await createPlaylist({ name, description }).unwrap()
            toast.success("Playlist Created!")
            setName("")
            setDescription("")
            setShowForm(false)
        } catch (error) {
            toast.error("Failed to create playlist!")
        }
    }

    const handleDelete = async (playlistId) => {
        try {
            await deletePlaylist(playlistId).unwrap()
            toast.success("Playlist Deleted!")
        } catch (error) {
            toast.error("Failed to delete!")
        }
    }

    const handleExpand = (playlistId) => {
        // same playlist click karo → close karo
        // doosri playlist click karo → open karo
        setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId)
    }

    if(isLoading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-white text-2xl font-bold">My Playlists</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                    >
                        <FaPlus />
                        New Playlist
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-gray-900 p-6 rounded-xl mb-6">
                        <h2 className="text-white font-bold mb-4">Create Playlist</h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Playlist name"
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                rows={3}
                                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCreate}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Playlists List */}
                {!playlists || playlists.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No playlists yet!</p>
                        <p className="text-gray-600 mt-2">Create your first playlist</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {playlists?.map((playlist) => (
                            <div key={playlist._id} className="bg-gray-900 p-4 rounded-xl">
                                
                                {/* Playlist Header */}
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => handleExpand(playlist._id)}
                                    >
                                        <h3 className="text-white font-semibold text-lg">
                                            {playlist.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {playlist.description}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {playlist.videos?.length} videos
                                        </p>
                                    </div>

                                    {/* Expand + Delete */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleExpand(playlist._id)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {expandedPlaylist === playlist._id 
                                                ? <FaChevronUp /> 
                                                : <FaChevronDown />
                                            }
                                        </button>
                                        <button
                                            onClick={() => handleDelete(playlist._id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Videos Expand */}
                                {expandedPlaylist === playlist._id && (
                                    <PlaylistVideos playlistId={playlist._id} />
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default PlaylistPage