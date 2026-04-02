import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video ID")
    }

    const likevideo=await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })
    if(likevideo){
        await Like.findByIdAndDelete(likevideo._id)
        return res.status(200).json(new ApiResponse(200,{},"Unliked Successfully"))
    }else{
        await Like.create({
            video:videoId,
            likedBy:req.user?._id
        })

        return res.status(200).json(new ApiResponse(200,{},"Liked Successfully"))
    }


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment ID")
    }
    
    const commentedVideo=await Like.findOne(
        {
            comment:commentId,
            likedBy:req.user?._id
        }
    )

    if(commentedVideo){
        await Like.findByIdAndDelete(commentedVideo._id)
        return res.status(200).json(new ApiResponse(200,{},"UnComment Successfully"))
    }else{
        await Like.create({
            comment:commentId,
            likedBy:req.user?._id
        })

        return res.status(200).json(new ApiResponse(200,{},"Liked Comment Successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid Tweet ID")
    }
    const tweetedvideo=await Like.findOne(
        {
            tweet:tweetId,
            likedBy:req.user?._id
        }
    )

    if(tweetedvideo){
        await Like.findByIdAndDelete(tweetedvideo._id)
        return res.status(200).json(new ApiResponse(200,{},"Un tweeted Successfully"))
    }else{
        await Like.create({
            tweet:tweetId,
            likedBy:req.user?._id
        })

        return res.status(200).json(new ApiResponse(200,{},"Liked Tweet Successfully"))
    }
    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    
    const likedVideos = await Like.find({
    likedBy: req.user?._id,
    video: { $exists: true }
})

if(!likedVideos || likedVideos.length === 0){
    throw new ApiError(404, "No Liked Videos Found")
}

res.status(200).json(new ApiResponse(200,likedVideos,"Liked Video Fetched Successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}