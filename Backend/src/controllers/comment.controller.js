import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const videocomment = await Comment.aggregate([
        {
            $match: { 
                video: new mongoose.Types.ObjectId(videoId) 
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
                            fullname: 1,
                            username: 1,
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
        },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
    ])

    if(!videocomment || videocomment.length === 0){
        throw new ApiError(404, "No Comments Found")
    }

    res.status(200).json(
        new ApiResponse(200, videocomment, "Video Comment fetched Successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId}=req.params
    const {content}=req.body

     if(!content){
        throw new ApiError(404,"Comment Is Requried")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id
})

if(!comment){
        throw new ApiError(500, "Error while adding comment")
    }

    res.status(200).json(new ApiResponse(200,comment,"Comment Is Added Successfully"))
})

const updateComment = asyncHandler(async (req, res) => {

    const {commentId}=req.params
    const {content}=req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment Id")
    }

    const commentUpgrade=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {
            new:true
        }
    )

    if(!commentUpgrade){
        throw new ApiError(500,"Comment Is Not Updated")
    }

      res.status(200).json(new ApiResponse(200,commentUpgrade,"Comment Is Updated Successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params
 
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment Id")
    }

    const commentdeleted=await Comment.findByIdAndDelete(commentId)

    if(!commentdeleted){
        throw new ApiError(500, "Error while deleting comment")
    }

    res.status(200).json(new ApiResponse(200,{},"Comment Is deleted Successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }