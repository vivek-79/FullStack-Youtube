import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../Models/user.model.js";

const verifyLogin = asyncHandler(async(req,_,next)=>{

   try {
     const token = req.cookies?.accessToken || req.header('Autherization')?.replace('Bearer ','')
    
     if(!token){
         throw new apiError(404,'Unauthorized request')
     }
 
     const decodedInfo= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user =await  User.findById(decodedInfo._id).select('-password -refreshToken')
     if(!user){
         throw new apiError(404,'Invalid access token')
     }
     req.user =user
     next()
   } catch (error) {
    throw new apiError(404,error.message||'Something wrong while fetching token')
   }
})

export {verifyLogin}