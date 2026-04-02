import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    
    const totalVideos = await Video.countDocuments({
        owner: req.user?._id
    })

    const totalSubscribers = await Subscription.countDocuments({
        channel: req.user?._id
    })

    const totalLikes = await Like.countDocuments({
        likedBy: req.user?._id
    })

    const totalViews = await Video.aggregate([
        { $match: { owner: req.user?._id } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews: totalViews[0]?.totalViews || 0
        }, "Channel stats fetched successfully")
    )
})


const getChannelVideos = asyncHandler(async (req, res) => {
    
    const videos = await Video.find({
        owner: req.user?._id
    })

    if(!videos || videos.length === 0){
        throw new ApiError(404, "No Videos Found")
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})



export {
    getChannelStats, 
    getChannelVideos
    }