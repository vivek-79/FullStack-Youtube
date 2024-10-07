import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/user.model.js";
import { likeCount } from "./likes.controller.js";
import { cloudnaryUpload } from "../Utils/cloudinary.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { Like } from "../Models/like.model.js";
import { Subscription } from "../Models/subscription.model.js";
import { Video } from "../Models/video.model.js";
import { Short } from "../Models/short.model.js";


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

const addHistory = asyncHandler(async(req,res)=>{
    const {userId,videoId,shortId} = req.body

    if(!userId){
        throw new apiError(400,'User not found')
    }
    if(!videoId && !shortId){
        throw new apiError(400,'Nothing to add in history')
    }
    try {
        const user =await User.findById(userId)
        console.log('yaha',user)
        if(!user){
            throw new apiError(404,'No user found')
        }

        if(videoId){
            const videoObjectId=new mongoose.Types.ObjectId(videoId)
            if(!user.watchHistoryVideo.includes( videoObjectId)){
                user.watchHistoryVideo.push( videoObjectId)
            }
            else{
                throw new apiError(400,'Video already in watchHistory')
            }
        }
        if(shortId){
            const shortObjectId= new mongoose.Types.ObjectId(shortId)
            if(!user.watchHistoryShort.includes(shortObjectId)){
                 user.watchHistoryShort.push(shortObjectId)
            }
            else{
                throw new apiError(400,'Short already in watchHistory')
            }
        }
        await user.save()
        return res.status(200)
        .json(new apiResponse(200,{},'Watch history updated'))
    } 
    catch (error) {
        console.log(error.message)
    }
})
const getWatchHistory = asyncHandler(async(req,res)=>{

    const {userId} =req.body
    try {
        const user = await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:'watchHistoryVideo',
                    foreignField:'_id',
                    as:'watchHistoryVideo',
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
            },
            {
                $lookup:{
                    from:'shorts',
                    localField:'watchHistoryShort',
                    foreignField:'_id',
                    as:'watchHistoryShort',
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
                                            avatar:1,
                                            userName:1,
                                        }
                                    }
                                ]
                            }
                            
                        },
                        {
                            $addFields:{
                                owner:{
                                    $first:'$owner'
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project:{
                    watchHistoryVideo:1,
                    watchHistoryShort:1
                }
            }
        ])
        return res.status(200)
        .json(new apiResponse(
            200,
            user[0],
            'WatchHistory Fetched Successfully'
        ))
    } catch (error) {
        console.log(error.message)
    }

})

const getChannelAnalysis = asyncHandler(async(req,res)=>{

    const {userId} =req.body
    
    if(!userId){
        throw new apiError(400,'user not found')
    }
    try {
        const totalLike=await Like.countDocuments({
            owner:userId
        })
        const totalSubscribers=await Subscription.countDocuments({
            channel:userId
        })
        const totalVideos=await Video.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group:{
                    _id:null,
                    totalVideo:{$sum:1},
                    videos:{$push:'$$ROOT'}
                }
            },
            {
                $project:{
                    _id:0,
                    videos:1,
                    totalVideo:1
                }
            }
        ])
        const totalShorts=await Short.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group:{
                    _id:null,
                    totalShort:{$sum:1},
                    short:{$push:'$$ROOT'}
                }
            },
            {
                $project:{
                    _id:0,
                    totalShort:1,
                    short:1
                }
            }
        ])

        return res.status(200)
        .json(
            new apiResponse(201,{totalLike,totalSubscribers,totalVideos,totalShorts},'Information fetched successfully')
        )
    } catch (error) {
        throw new apiError(500,'Cant get information')
    }
})

const addWatchLater = asyncHandler(async(req,res)=>{

    const {videoId,userId} = req.body

    if(!videoId){
        throw new apiError(400,'Nothing to add in later')
    }
    const user = await User.findById(userId)

    if(!user){
        throw new apiError(400,'No user found')
    }
    try {
        const video = new mongoose.Types.ObjectId(videoId)
        if(!user.watchLater.includes(video)){
            user.watchLater.push(video)

            await user.save()
            return res.status(200)
            .json( new apiResponse(200,{},"Added to later"))
        }
        else{
            user.watchLater.pull(video)
            await user.save()
            return res.status(200)
            .json(new apiResponse (200,{},"Removed from later"))
        }
    } catch (error) {
        return res.status(500)
        .json(new apiResponse(500,{},"server error try later"))
    }
})

const getWatchLater = asyncHandler(async(req,res)=>{

    const {userId} = req.body
    console.log(req.body)
    if(!userId){
        throw new apiError(400,'No user found')
    }

    try {
        const laterDetail = await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
               $lookup:{
                    from:'videos',
                    localField:'watchLater',
                    foreignField:'_id',
                    as:'watchLater',
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
                        },
                        {
                            $project:{
                                owner:1,
                                thumbnail:1,
                                title:1,
                                views:1
                            }
                        }
                    ]
                } 
            },
            {
                $project:{
                    watchLater:1
                }
            }
        ]).exec()
        return res.status(200)
        .json( new apiResponse(200,laterDetail,"Videos fetched sucessfully"))
    } catch (error) {
        return res.status(500)
        .json(new apiResponse(500,{},"Unable to get videos"))
    }
})

const addPlayList= asyncHandler(async(req,res)=>{

    const {userId} = req.body

    if(!userId){
        throw new apiError(400,"userId required")
    }

    const user =await User.findById(userId)

    if(!user){
        throw new apiError(400,"No user found")
    }

    
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshaccessToken,
    getChannelDetail,
    getWatchHistory,
    getChannelAnalysis,
    addHistory,
    addWatchLater,
    getWatchLater,
    addPlayList
}