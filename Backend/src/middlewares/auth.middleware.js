import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const verifyJwt=asyncHandler(async(req,res,next)=>{
  try {
      const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
  
      if(!token){
          throw new ApiError(401,"Unauthorized request")
      }
  
     const decodedtoken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
     const user=await User.findById(decodedtoken?._id).select("-password -refereshtoken")
  
     if(!user){
      throw new ApiError(401,"invalid token")
     }
  
     req.user=user;
     next()
  } catch (error) {
    throw new ApiResponse(401,error?.message || "Invalid Access Token")
    
  }

})