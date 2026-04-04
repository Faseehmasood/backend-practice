import { useLocation } from "react-router-dom"
import { useGetAllVideosQuery } from "../features/api/videoApiSlice"
import VideoCard from "../components/VideoCard"

const HomePage = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get("search") || ""

    const { data, isLoading, isError } = useGetAllVideosQuery({ query })

    if(isLoading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    )

    if(isError) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-500 text-xl">No Videos Found!</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 p-6">

            {/* Search Result */}
            {query && (
                <h2 className="text-gray-400 text-lg mb-4">
                    Search results for: <span className="text-white font-bold">"{query}"</span>
                </h2>
            )}

            <h2 className="text-white text-2xl font-bold mb-6">
                {query ? "Results" : "All Videos"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data?.data?.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

        </div>
    )
}

export default HomePage