import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefereshToken= async(userId)=>{
    try {
       const user= await User.findById(userId)
       const accestoken=user.generateAccessToken()
       const refereshtoken=user.generateRefereshToken()

       user.refreshToken=refereshtoken
       await user.save({validateBeforeSave:false})

       return{accestoken,refereshtoken}

    } catch (error) {
        throw new ApiError(500,"Something Went Wrong in access and generate tokens")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    console.log("Full Request Files:", req.files); 
    
    // 2. Phir ye check karo ke avatar aa raha hai
    console.log("Avatar Object:", req.files?.avatar);

    const {fullname,email,password,username}=req.body
    console.log("email:",email)

    if([fullname,email,username,password].some((validation)=>validation?.trim()==="")){
        throw new ApiError ("All fields Are Required")
    }

   const existingUser= await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError("Username And Email is Already Exist")
    }

    const avatarLocalpath=req.files?.avatar?.[0]?.path;
    const coverImageLocalpath=req.files?.coverImage?.[0]?.path;

    console.log("Checking variable value:", avatarLocalpath);


    if(!avatarLocalpath){
        throw new ApiError(400,"Avatar Is Required")
    }

    const avatar=await uploadonCloudinary(avatarLocalpath);
    const coverImage=await uploadonCloudinary(coverImageLocalpath)
    console.log(avatar)

    if(!avatar){
         throw new ApiError(400,"Avatar Is Required")
    }

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

   const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Error During Registration ")
    }

    return res.status(201).json(
        new ApiResponse(200,"User Registered SuccessFully")
    )
})

const loginuser=asyncHandler(async(req,res)=>{

    const {username,password,email}=req.body
    
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    const user=await User.findOne({
        $or:[{email},
            {username}]
    })

    if(!user){
        throw new ApiError(404,"User doesNot Exist")
    }

    const isPasswordValid= await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password Is Required")
    }

    const {refereshtoken,accestoken}= await generateAccessAndRefereshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accesstoken",accestoken,options)
    .cookie("refereshtoken",refereshtoken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedUser,accestoken,refereshtoken
            },
            "User logged In Successfully"
        )
    )

 

})

const logoutuser=asyncHandler(async(req,res)=>{

   await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            } 
        }, 
        
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accestoken",options)
    .clearCookie("refereshtoken",options)
    .json(
        new ApiResponse(200,{},"user LoggedOut")
    )


})

const refreshaccessToken=asyncHandler(async(req,res)=>{
    const incomingrefreshtoken=req.cookies.refereshtoken || req.body.refereshtoken

    if(!incomingrefreshtoken){
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedtoken=jwt.verify(incomingrefreshtoken,process.env.REFERESH_TOKEN_SECRET)
    
        const user=await User.findById(decodedtoken?._id)
    
         if(!user){
            throw new ApiError(401,"Invalid Refresh TOken")
        }
    
        if(incomingrefreshtoken !== user?.refreshToken){
              throw new ApiError(401,"Token Is Expired")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const{accestoken,newrefereshtoken}=await generateAccessAndRefereshToken(user._id)
        return res
        .status(200)
        .cookie("accesstoken",accestoken,options)
        .cookie("refreshtoken",newrefereshtoken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accestoken,
                    refreshToken:newrefereshtoken,
                    
                },
                "Access Token Is refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh TOken")
        
    }
})

const chanagePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const user=await User.findById(req.user?._id)
    const ispasswordcorrect=await user.isPasswordCorrect(oldPassword)

    if(!ispasswordcorrect){
        throw new ApiError(400,"Invalid Password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:true})

    return res
    .status(200)
    .json(new ApiResponse (200,{},"Password Save Succcesfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"current user fetch successfullly"))
})

const updateUserDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body

    if(!fullname && !email){
        throw new ApiError(400,"All fields are Required")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email
            }

        },
        {new:true}
    ).select("=password")

    return res.status(200).json(new ApiResponse(200,user,"Accounr details Updated"))
})

const avatarLocalPath= asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar Missing")
}

const avatar= await uploadonCloudinary(avatarLocalPath)

if(!avatar.url){
     throw new ApiError(400,"Error while uplaoding on avatar")
}

const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
               avatar:avatar.url
            }

        },
        {new:true}
    ).select("=password")
    return res.status(200).json(new ApiResponse(200,user,"Avatar Updated Succesfully"))
})

const coverImageLocalPath= asyncHandler(async(req,res)=>{
    const localpath=req.file?.path

if(!localpath){
    throw new ApiError(400,"CoverImage Missing")
}

const coverImage= await uploadonCloudinary(localpath)

if(!coverImage.url){
     throw new ApiError(400,"Error while uplaoding on CoverImage")
}

const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
               coverImage:coverImage.url
            }

        },
        {new:true}
    ).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"CoverImage Updated Succesfully"))
})

const getuserChannelProfile=asyncHandler(async(req,res)=>{

    const {username}=req.params

    if(!username?.trim()){
        throw new ApiError(400,"Username is not found")
    }

    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },

        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"

            }
        },

        {
            $lookup:{
                 from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },

        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                 channelsubscribersTOCount:{
                $size:"$subscribedTo"
            },
             isSubscribedorNot:{
               $cond:{
                if:{$in:[req.user._id,"$subscribers.subscriber"]},
                then:true,
                else:false
               }

            }
            }
           
           
        },

        {
            $project:{
                fullname:1,
                channelsubscribersTOCount:1,
                channelsubscribersTOCount:1,
                isSubscribedorNot:1,
                username:1,
                avatar:1,
                coverImage:1,
                email:1

            }
        }

    ])

    if(!channel?.length){
        throw new ApiError(404,"Channel Does Not Exist")
    }

    return res.status(200).json(new ApiResponse(200,channel[0],"User Channel fetched"))

})

const getHistorywatch=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user?._id)
            }
        },

        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",

                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"Watch History Successfully"))
})





export {
    registerUser,
    loginuser,
    logoutuser,
    refreshaccessToken,
    chanagePassword,
    getCurrentUser,
    updateUserDetails,
    avatarLocalPath,
    coverImageLocalPath,
    getuserChannelProfile,
    getHistorywatch
}