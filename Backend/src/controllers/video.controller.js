import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadonCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const skip = (page - 1) * limit
    
    const videos = await Video.aggregate([

        {
            $match:{

                isPublished: true,
                
                ...(query && {
                    title:{

                    $regex:query,
                    "$options":"i"

                }}),

                ...(userId && {
                    
                        owner:new mongoose.Types.ObjectId(userId)
 
                })
            }
        },

        {
            $sort:{
                [sortBy]:sortType=== "asc"?1:-1
            }
        },

        {
            $skip:skip
        },

        {
            $limit:parseInt(limit)
        }
          
])

if(!videos || videos.length===0){
    throw new ApiError(404,"Videos Is Not Found")
}

res.status(200)
.json(new ApiResponse(200,videos,"Videos fetched successfully"))



})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400,"Video Is Not Found")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail Is Not Found")
    }

    const video=await uploadonCloudinary(videoLocalPath)
    const thumbnail=await uploadonCloudinary(thumbnailLocalPath)

    if(!video){
    throw new ApiError(500,"Error while uploading video")
    }

    if(!thumbnail){
    throw new ApiError(500,"Error while uploading thumbnail")
    }

    const newVideo=await Video.create(
        {
            title,
            thumbnail:thumbnail.url,
            videoFile:video.url,
            description,
            owner: req.user?._id ,
            duration: video.duration,
            isPublished: true

        }
    )

    if(!newVideo){
        throw new ApiError(500,"Video Is not Uploded")
    }

    res.status(200).json(new ApiResponse(200,newVideo,"Video Published Successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

        const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    ])

    if(!video?.length){
        throw new ApiError(404,"Video is not found")
    }

    res.status(200).json(
    new ApiResponse(200, video[0], "Video fetched successfully")
)
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const {title,description}=req.body
    
    const thumbnailLocalPath = req.file?.path

    if(!title){
        throw new ApiError(400,"Title is required")
    }
    if(!description){
        throw new ApiError(400,"description is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail is required")
    }

    const uploadThumbnail=await uploadonCloudinary(thumbnailLocalPath)

    if(!uploadThumbnail){
        throw new ApiError(500,"Error while uploading thumbnail")
    }

    const videoUpdate=await Video.findByIdAndUpdate(
        videoId,
       {
         $set:{
            title,
            description,
            thumbnail:uploadThumbnail.url
        }
       },
       {
        new:true
       }
    )

    if(!videoUpdate){
        throw new ApiError(404,"Video Not Found")
    }

    res.status(200).json(new ApiResponse(200,videoUpdate,"Video updated Successfully"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
     if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    const deleteIt=await Video.findByIdAndDelete(videoId)

    if(!deleteIt){
        throw new ApiError(404,"Video is Not Found")
    }

    res.status(200).json(new ApiResponse(200,{},"Video is Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

   if(!isValidObjectId(videoId)){
     throw new ApiError(400, "Invalid Video Id")
   }

   const video = await Video.findById(videoId)

   if(!video){
    throw new ApiError(404, "Video Not Found")
   }

   const toggleVideo = await Video.findByIdAndUpdate(
    videoId,
    {
        $set: {
            isPublished: !video.isPublished
        }
    },
    { new: true }
)

if(!toggleVideo){
    throw new ApiError(404, "Video not found")
}

res.status(200).json(
    new ApiResponse(200, toggleVideo, "Video status toggled successfully")
)

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}