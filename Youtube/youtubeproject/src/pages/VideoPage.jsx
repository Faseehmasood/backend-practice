import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetVideoByIdQuery, useToggleVideoLikeMutation, useToggleSubscriptionMutation } from "../features/api/videoApiSlice"
import { AiOutlineLike } from "react-icons/ai"
import { FaBell } from "react-icons/fa"
import toast from "react-hot-toast"
import CommentSection from "../components/CommentSection"

const VideoPage = () => {
    const { videoId } = useParams()
    const { user } = useSelector((state) => state.auth)
    
    const { data, isLoading, isError } = useGetVideoByIdQuery(videoId)
    const [toggleLike] = useToggleVideoLikeMutation()
    const [toggleSubscription] = useToggleSubscriptionMutation()

    const video = data?.data

    const handleLike = async () => {
        try {
            await toggleLike(videoId).unwrap()
            toast.success("Done!")
        } catch (error) {
            toast.error("Login required!")
        }
    }

    const handleSubscribe = async () => {
        try {
            await toggleSubscription(video?.owner?._id).unwrap()
            toast.success("Done!")
        } catch (error) {
            toast.error("Login required!")
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
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                {video?.owner?.username?.[0]?.toUpperCase()}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <p className="text-white font-semibold">
                                {video?.owner?.fullname}
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
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            <AiOutlineLike className="text-xl" />
                            Like
                        </button>

                        {/* Subscribe Button */}
                        <button
                            onClick={handleSubscribe}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            <FaBell className="text-sm" />
                            Subscribe
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