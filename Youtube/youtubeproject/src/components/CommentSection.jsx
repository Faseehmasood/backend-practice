import { useState } from "react"
import { useSelector } from "react-redux"
import { useGetVideoCommentsQuery, useAddCommentMutation, useDeleteCommentMutation } from "../features/api/commentApiSlice"
import { FaTrash } from "react-icons/fa"
import toast from "react-hot-toast"

const CommentSection = ({ videoId }) => {
    const [comment, setComment] = useState("")
    const { user, isAuthenticated } = useSelector((state) => state.auth)

    const { data, isLoading } = useGetVideoCommentsQuery(videoId)
    const [addComment] = useAddCommentMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const handleAddComment = async () => {
        if(!comment.trim()) return toast.error("Comment cannot be empty!")
        try {
            await addComment({ videoId, content: comment }).unwrap()
            setComment("")
            toast.success("Comment Added!")
        } catch (error) {
            toast.error("Login required!")
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId).unwrap()
            toast.success("Comment Deleted!")
        } catch (error) {
            toast.error("Failed to delete!")
        }
    }

    return (
        <div className="mt-6">
            <h2 className="text-white text-xl font-bold mb-4">Comments</h2>

            {/* Add Comment */}
            {isAuthenticated && (
                <div className="flex gap-3 mb-6">
                    <div className="w-9 h-9 rounded-full bg-red-500 shrink-0 flex items-center justify-center text-white font-bold">
                        {user?.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <p className="text-gray-400">Loading comments...</p>
            ) : (
                <div className="space-y-4">
                    {data?.data?.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                            
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-white font-bold">
                                {comment.content[0].toUpperCase()}
                            </div>

                            {/* Comment */}
                            <div className="flex-1">
                                <p className="text-gray-400 text-sm">
                                    @{comment.owner?.username}
                                </p>
                                <p className="text-white mt-1">
                                    {comment.content}
                                </p>
                            </div>

                            {/* Delete - sirf apna comment */}
                            {user?._id === comment.owner?._id?.toString() && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentSection