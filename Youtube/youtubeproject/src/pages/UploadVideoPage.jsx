import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useUploadVideoMutation } from "../features/api/videoApiSlice"
import toast from "react-hot-toast"

const uploadSchema = z.object({
    title: z.string().min(3, "Title must be 3 characters"),
    description: z.string().min(10, "Description must be 10 characters"),
    videoFile: z.any().refine(files => files?.length > 0, "Video is required"),
    thumbnail: z.any().refine(files => files?.length > 0, "Thumbnail is required"),
})

const UploadVideoPage = () => {
    const navigate = useNavigate()
    const [uploadVideo, { isLoading }] = useUploadVideoMutation()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(uploadSchema)
    })

    const onSubmit = async (data) => {
        try {
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("videoFile", data.videoFile[0])
            formData.append("thumbnail", data.thumbnail[0])

            await uploadVideo(formData).unwrap()
            toast.success("Video Uploaded Successfully!")
            navigate("/")
        } catch (error) {
            toast.error(error?.data?.message || "Upload Failed!")
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-lg">
                
                {/* Header */}
                <h1 className="text-white text-2xl font-bold mb-6">
                    Upload Video
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Title</label>
                        <input
                            {...register("title")}
                            placeholder="Enter title"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Enter description"
                            rows={4}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Video File */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Video File</label>
                        <input
                            {...register("videoFile")}
                            type="file"
                            accept="video/*"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {errors.videoFile && <p className="text-red-500 text-sm mt-1">{errors.videoFile.message}</p>}
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Thumbnail</label>
                        <input
                            {...register("thumbnail")}
                            type="file"
                            accept="image/*"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Uploading..." : "Upload Video"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default UploadVideoPage