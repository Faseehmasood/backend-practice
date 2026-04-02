import mongoose, { get, isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content}=req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const contentcreated=await Tweet.create({
        content,
        owner:req.user?._id
    }
    )

    if(!contentcreated){
        throw new ApiError(500,"Content is Not Found")
    }

    res.status(200).json(new ApiResponse(200,contentcreated,"Tweet Is Created Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} =req.params
 

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")
    }

    const gettweet=await Tweet.find({
        owner:userId
    })

    if(!gettweet || !gettweet.length===0){
         throw new ApiError(404, "No Tweets Found")
    }

    res.status(200).json(new ApiResponse(200,gettweet,"Tweet Fetched Successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params
    const {content}=req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid Tweet ID")
    }
    if(!content){
        throw new ApiError(404,"Content Not Found")
    }

    const contentupdated=await Tweet.findByIdAndUpdate(
        
            tweetId,
            {$set:{content}},
        
        {
            new:true
        }
    )

    if(!contentupdated){
        throw new ApiError(500,"Failed To update content")
    }

    res.status(200).json(new ApiResponse(200,contentupdated,"Tweet Is Updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid Tweet Id")
    }

    const deletedTweet=await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(500,"Tweet Is Not deleted")
    }
    
    res.status(200).json(new ApiResponse(200,{},"Tweet Is Deleted Successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}