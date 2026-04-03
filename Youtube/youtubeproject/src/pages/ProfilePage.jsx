import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useGetChannelProfileQuery, useGetChannelStatsQuery, useGetChannelVideosQuery } from "../features/api/userApiSlice"
import { useToggleSubscriptionMutation } from "../features/api/videoApiSlice"
import VideoCard from "../components/VideoCard"
import toast from "react-hot-toast"

const ProfilePage = () => {
    const { userId } = useParams()
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState("videos")

    // ✅ userId ki jagah user.username use karo
    const { data: profileData, isLoading } = useGetChannelProfileQuery(user?.username,
      { skip: !user?.username }
    )
    const { data: statsData } = useGetChannelStatsQuery({ skip: !user?.username })
    const { data: videosData } = useGetChannelVideosQuery({ skip: !user?.username })
    const [toggleSubscription] = useToggleSubscriptionMutation()

    const profile = profileData?.data
    const stats = statsData?.data
    const videos = videosData?.data

    const handleSubscribe = async () => {
        try {
            await toggleSubscription(profile?._id).unwrap()
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

    return (
        <div className="min-h-screen bg-gray-950">

            {/* Cover Image */}
            <div className="w-full h-48 bg-gray-800 relative">
                {profile?.coverImage ? (
                    <img
                        src={profile.coverImage}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-gray-800 to-gray-700" />
                )}
            </div>

            {/* Profile Info */}
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Avatar + Info */}
                <div className="flex items-end gap-4 -mt-12 mb-6">
                    
                    {/* Avatar */}
                    {profile?.avatar ? (
                        <img
                            src={profile.avatar}
                            alt="avatar"
                            className="w-24 h-24 rounded-full border-4 border-gray-950 object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-gray-950 bg-red-500 flex items-center justify-center text-white text-3xl font-bold">
                            {profile?.fullName?.[0]?.toUpperCase()}
                        </div>
                    )}

                    {/* Name + Stats */}
                    <div className="flex-1 pb-2">
                        <h1 className="text-white text-2xl font-bold">
                            {profile?.fullName}
                        </h1>
                        <p className="text-gray-400">
                            @{profile?.username}
                        </p>
                        
                        {/* Stats */}
                        {stats && (
                            <div className="flex gap-6 mt-2">
                                <p className="text-gray-400 text-sm">
                                    <span className="text-white font-semibold">{stats.totalSubscribers}</span> subscribers
                                </p>
                                <p className="text-gray-400 text-sm">
                                    <span className="text-white font-semibold">{stats.totalVideos}</span> videos
                                </p>
                                <p className="text-gray-400 text-sm">
                                    <span className="text-white font-semibold">{stats.totalViews}</span> views
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subscribe Button */}
                    {isAuthenticated && userId !== user?._id && (
                        <button
                            onClick={handleSubscribe}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
                        >
                            Subscribe
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-800 mb-6">
                    <button
                        onClick={() => setActiveTab("videos")}
                        className={`pb-3 font-semibold transition-colors ${
                            activeTab === "videos"
                            ? "text-white border-b-2 border-red-500"
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Videos
                    </button>
                    <button
                        onClick={() => setActiveTab("community")}
                        className={`pb-3 font-semibold transition-colors ${
                            activeTab === "community"
                            ? "text-white border-b-2 border-red-500"
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Community
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "videos" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
                        {videos?.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}

                {activeTab === "community" && (
                    <div className="pb-6">
                        <p className="text-gray-400">No posts yet!</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ProfilePage