import mongoose, {isValidObjectId} from "mongoose"
// import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid ChannelId")
    }

    const subscribed=await Subscription.findOne({
        channel:channelId,
        subscriber:req.user?._id
    })

    if(subscribed){
       await Subscription.findByIdAndDelete(subscribed._id)
        return res.status(200).json(new ApiResponse(200,{},"Unsubscribed Successfully"))
    }else{
      const subscription=await Subscription.create({
      channel: channelId,
      subscriber: req.user?._id
})
 return res.status(200).json(new ApiResponse(200,subscription,"Subscribed Successfully"))
    }

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
         throw new ApiError(400, "Invalid Channel Id")
    }

    const listOfSubscriber = await Subscription.find({
    channel: channelId
       })

    if(!listOfSubscriber || listOfSubscriber.length === 0){

        throw new ApiError(404,"No Subscriber Found")
    
    }
    
res.status(200)
.json(new ApiResponse(200, listOfSubscriber, "All Subscribers Fetched Successfully"))

})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
         throw new ApiError(400, "Invalid Channel Id")
    }

    const channelSubscribedList=await Subscription.find({

        subscriber: subscriberId
    })

    if(!channelSubscribedList || channelSubscribedList.length === 0){
    throw new ApiError(404,"No Subscribed Channels Found")
}

res.status(200)
.json(new ApiResponse(200,channelSubscribedList,"Channel Subscriber List Fetched Successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}