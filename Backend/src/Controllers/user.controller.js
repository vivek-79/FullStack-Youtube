import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/user.model.js";
import { likeCount } from "./likes.controller.js";
import { cloudnaryUpload } from "../Utils/cloudinary.js";
import { Comment } from "../Models/comment.model.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";


const registerUser = asyncHandler(async(req,res)=>{

    const {userName,fullName,email,password} =req.body

    if(
        [userName,fullName,email,password].some((field)=>
            field.trim() ==='')
    ){
        throw new apiError(400,'All fields are required')
    }

    const alreadyExist = await User.findOne({
        $or:[{email},{userName}]
    })
    if (alreadyExist){
        throw new apiError(401,'User already exist')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath =req.files?.coverImage?.[0].path

    if(!avatarLocalPath){
        throw new apiError(403,'Avatar is required')
    }
    const avatar = await cloudnaryUpload(avatarLocalPath)
    if(!avatar){
        throw new apiError(403,'Avatar is required')
    }
    let coverImage =''
    if(coverImageLocalPath){
        coverImage=await cloudnaryUpload(coverImageLocalPath)
    }

    const user =await User.create({
        fullName,
        userName:userName.toLowerCase(),
        email,
        avatar:avatar.url,
        coverImage:coverImage.url,
        password
    })
    
    const existUser =await User.findById(user._id).select('-password -refreshToken')

    if(!existUser){
        throw new apiError(500,'Something wrong while creating user')
    }
    return res 
    .status(200)
    .json( new apiResponse(
        200,
        existUser,
        'User created'
    ))

})

const loginUser = asyncHandler(async(req,res)=>{

    const {userName,email,password} =req.body
    console.log(req.body)

    if(!userName && !email){
        throw new apiError(400,'Username or Email is required')
    }
    if(!password){
        throw new apiError(400,'Password is required')
    }

    const isUser = await User.findOne({
        $or:[{email},{userName}]
    })

    if(!isUser){
        throw new apiError(401,'User not Exist')
    }
    const ispasswordCorrect=await isUser.isPasswordCorrect(password)

    if(!ispasswordCorrect){
        throw new apiError(404,'Password is wrong')
    }

    const accessToken=await isUser.generateAccessToken()
    const refreshToken=await isUser.generateRefreshTokenToken()
    if(!accessToken && !refreshToken){
        throw new apiError(500,'Error while generating tokens')
    }
    isUser.refreshToken=refreshToken
    await isUser.save({validateBeforeSave:false})

    const user=await User.findById(isUser._id).select('-password -refreshToken')
     
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie( 'refreshToken' ,refreshToken,options)
    .json(
        new apiResponse(
            200,
        {user:user,accessToken,refreshToken},
        'User logged in successfully'
        )
    )
})

const logoutUser =asyncHandler(async(req,res)=>{

    const id=req.user._id
    await  User.findByIdAndUpdate(
        id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(
        new apiResponse(
            200,
            {},
            'Logged out successfully'
        )
    )
})

const refreshaccessToken = asyncHandler(async(req,res)=>{

    const inconimgRefreshToken = req.cookie?.refreshToken || req.body.refreshToken
    if(!inconimgRefreshToken){
        throw new apiError(404,'Unauthorized request')
    }

    try {
        const token =jwt.verify(inconimgRefreshToken,process.env.REFRESH_TOKEN_SERET)
    
        if(!token){
            throw new apiError(404,'Token is not valid')
        }
    
        const id = token._id
        const isUser = await User.findById(id)
        if(inconimgRefreshToken !==isUser?.refreshToken){
            throw new apiError(404,'Invalid refresh token')
        }
        
        const accessToken=await isUser.generateAccessToken()
        const refreshToken=await isUser.generateRefreshTokenToken()
        if(!accessToken && !refreshToken){
            throw new apiError(500,'Error while generating tokens')
        }
        isUser.refreshToken=refreshToken
        await isUser.save({validateBeforeSave:false})
    
        const options = {
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken',refreshToken,options)
        .json(new apiResponse(
            200,
            {accessToken,refreshToken},
            'Access Token Fetched Successfully'
        ))
    } catch (error) {
        throw new apiError(404,'Invalid Refresh Token')
    }
})

const getChannelDetail = asyncHandler(async(req,res)=>{

    const {userName,userId,videoId} = req.body
    console.log(req.body)
    if(!userName?.trim()){
        throw new apiError(404,'Username not found')
    }

    const channel =await User.aggregate([
        {
            $match:{
                userName:userName.trim()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:'_id',
                foreignField:'channel',
                as:'subscribers'
            }
        },
        {
            $lookup:{
                from:'subscriptions',
                localField:'_id',
                foreignField:'subscriber',
                as:'subscribedTo'
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                },
                channelSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscriber:{
                    $cond:{
                        if:{
                            $in:[
                                new mongoose.Types.ObjectId(userId),{$map:{input:'$subscribers',as:'sub',in:'$$sub.subscriber'}}
                            ]
                        },
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                userName:1,
                fullName:1,
                email:1,
                avatar:1,
                coverImage:1,
                subscriberCount:1,
                channelSubscribedToCount:1,
                isSubscriber:1
            }
        }
    ])

    const comments =await Comment.find({video:videoId}).select('-user -video')
    if(!comments){
        throw new apiError(404,'No comments found')
    }
    channel[0].comments=comments
    if(videoId){
        const {likes,isLiked} = await likeCount(videoId,userId)
        channel[0].totalLikes=likes
        channel[0].isLiked=isLiked
    }

    if(!channel?.length){
        throw new apiError(404,'Channel not exist')
    }
    return res.status(200)
    .json(
        new apiResponse(
            200,
            channel[0],
            "Account fetched successfully"
        )
    )
})

const getWatchHistory = asyncHandler(async(req,res)=>{

    const user = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:'watchHistory',
                foreignField:'_id',
                as:'watchHistory',
                pipeline:[
                    {
                       $lookup:{
                        from:'users',
                        localField:'owner',
                        foreignField:'_id',
                        as:'owner',
                        pipeline:[
                            {
                               $project:{
                                userName:1,
                                fullName:1,
                                avatar:1
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
                ]
            }
        }
    ])

    return res.status(200)
    .json(new apiResponse(
        200,
        user[0].watchHistory,
        'WatchHistory Fetched Successfully'
    ))
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshaccessToken,
    getChannelDetail,
    getWatchHistory
}