import { Link } from "react-router-dom"

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`}>
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                
                {/* Thumbnail */}
                <div className="relative">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Thumbnail"
                        }}
                    />
                    {/* Duration */}
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </span>
                </div>

                {/* Info */}
                <div className="p-3 flex gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                        {video.title[0].toUpperCase()}
                    </div>

                    {/* Details */}
                    <div>
                        <h3 className="text-white font-semibold line-clamp-2 text-sm">
                            {video.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                            {video.views} views
                        </p>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default VideoCard