import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useGetVideoByIdQuery, useToggleVideoLikeMutation, useToggleSubscriptionMutation } from "../features/api/videoApiSlice"
import { useGetUserPlaylistsQuery, useAddVideoToPlaylistMutation } from "../features/api/playlistApiSlice"
import { AiOutlineLike, AiFillLike } from "react-icons/ai"
import { FaBell, FaCheckCircle } from "react-icons/fa"
import { MdPlaylistAdd } from "react-icons/md"
import CommentSection from "../components/CommentSection"
import toast from "react-hot-toast"

const VideoPage = () => {
    const { videoId } = useParams()
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [showPlaylists, setShowPlaylists] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const { data, isLoading, isError } = useGetVideoByIdQuery(videoId)
    const [toggleLike] = useToggleVideoLikeMutation()
    const [toggleSubscription] = useToggleSubscriptionMutation()
    const { data: playlistsData } = useGetUserPlaylistsQuery(user?._id, {
        skip: !user?._id
    })
    const [addToPlaylist] = useAddVideoToPlaylistMutation()

    const video = data?.data
    const playlists = playlistsData?.data

    const handleLike = async () => {
        try {
            await toggleLike(videoId).unwrap()
            setIsLiked(!isLiked)
            toast.success(isLiked ? "Unliked!" : "Liked!")
        } catch (error) {
            toast.error("Login required!")
        }
    }

    const handleSubscribe = async () => {
        try {
            await toggleSubscription(video?.owner?._id).unwrap()
            setIsSubscribed(!isSubscribed)
            toast.success(isSubscribed ? "Unsubscribed!" : "Subscribed!")
        } catch (error) {
            toast.error("Login required!")
        }
    }

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await addToPlaylist({ playlistId, videoId }).unwrap()
            toast.success("Added to Playlist!")
            setShowPlaylists(false)
        } catch (error) {
            toast.error("Failed to add!")
        }
    }

    if(isLoading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    )

    if(isError) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-500 text-xl">Video Not Found!</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Video Player */}
                <video
                    src={video?.videoFile}
                    controls
                    className="w-full rounded-xl bg-black"
                    style={{ maxHeight: "500px" }}
                />

                {/* Video Info */}
                <div className="mt-4">
                    <h1 className="text-white text-2xl font-bold">
                        {video?.title}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {video?.views} views
                    </p>
                </div>

                {/* Channel Info + Buttons */}
                <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-800">

                    {/* Channel */}
                    <div className="flex items-center gap-3">
                        
                        {/* Avatar */}
                        {video?.owner?.avatar ? (
                            <img
                                src={video.owner.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                {video?.owner?.username?.[0]?.toUpperCase()}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <p className="text-white font-semibold">
                                {video?.owner?.fullName}
                            </p>
                            <p className="text-gray-400 text-sm">
                                @{video?.owner?.username}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                isLiked
                                ? "bg-blue-500 text-white"
                                : "bg-gray-800 hover:bg-gray-700 text-white"
                            }`}
                        >
                            {isLiked 
                                ? <AiFillLike className="text-xl" />
                                : <AiOutlineLike className="text-xl" />
                            }
                            {isLiked ? "Liked" : "Like"}
                        </button>

                        {/* Save to Playlist */}
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowPlaylists(!showPlaylists)}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
                                >
                                    <MdPlaylistAdd className="text-xl" />
                                    Save
                                </button>

                                {/* Playlist Dropdown */}
                                {showPlaylists && (
                                    <div className="absolute right-0 top-12 bg-gray-800 rounded-xl p-3 w-48 z-10 shadow-lg">
                                        <p className="text-gray-400 text-sm mb-2">Save to playlist:</p>
                                        {!playlists || playlists?.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No playlists!</p>
                                        ) : (
                                            playlists?.map((playlist) => (
                                                <button
                                                    key={playlist._id}
                                                    onClick={() => handleAddToPlaylist(playlist._id)}
                                                    className="w-full text-left text-white hover:bg-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    {playlist.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subscribe Button */}
                        <button
                            onClick={handleSubscribe}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                isSubscribed
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                            {isSubscribed
                                ? <FaCheckCircle className="text-sm" />
                                : <FaBell className="text-sm" />
                            }
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>

                    </div>
                </div>

                {/* Description */}
                <div className="mt-4 bg-gray-900 p-4 rounded-xl">
                    <p className="text-gray-300">
                        {video?.description}
                    </p>
                </div>

                {/* Comments */}
                <CommentSection videoId={videoId} />

            </div>
        </div>
    )
}

export default VideoPage