import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
// import { use } from "react"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description){
    throw new ApiError(400,"Name and Description are required")
    }

    const playlistFields=await Playlist.create(
        {
            name:name,
            description:description,
            owner:req.user?._id
        }
    )

    if(!playlistFields){
        throw new ApiError(500,"Error while creating playlist")
    }

    res.status(200).json(new ApiResponse(200,playlistFields,"Playlist Created Successfully"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User Id")
    }

    const playlists = await Playlist.find({
    owner: new mongoose.Types.ObjectId(userId)
    })
    

    if(!playlists || playlists.length === 0){
        throw new ApiError(404,"Playlist Not found")
    }

     res.status(200).json(new ApiResponse(200,playlists,"Playlist Fetched Successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist Id")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        }
    ])

    if(!playlist?.length){
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist[0], "Playlist Found Successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Playlist or Video Id")
    }

    const addVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $push: {
            videos: videoId
        }
    },
    { new: true }
        )

    if(!addVideo){
        throw new ApiError(500,"Error while adding video to playlist")
    }
    
     res.status(200).json(new ApiResponse(200,addVideo,"Video Added Succesfully"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) ||  !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Id Not Found")
    }

    const removevideoPlaylist=await Playlist.findByIdAndUpdate(

        playlistId,

        {
            $pull:{
                videos:videoId,
               
            }
        },
        {
            new:true
        }
        
    )

    if(!removevideoPlaylist){
        throw new ApiError(500,"Video Is Not removed")
    }

     res.status(200).json(new ApiResponse(200,removevideoPlaylist,"Video Removed Succesfully"))



})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid Id")
    }

    const deleteplaylist=await Playlist.findByIdAndDelete(playlistId)

    if(!deleteplaylist){
        throw new ApiError(500,"Error while deleting playlist")

    }

    res.status(200).json(new ApiResponse(200,deleteplaylist,"Playlist Delete Succesfully"))

    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid PlaylisID")
    }

    const updateplaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
           $set:{
            name:name,
            description:description
           }
        },
        {
            new:true
        }
    )

    if(!updateplaylist){
        throw new ApiError(500,"Playlist is Not Updated")
    }

    res.status(200).json(new ApiResponse(200,updateplaylist,"PlayList is Updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}