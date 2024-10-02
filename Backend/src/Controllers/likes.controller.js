
import {asyncHandler} from '../Utils/asyncHandler.js'
import {apiResponse} from '../Utils/apiResponse.js'
import {apiError} from '../Utils/apiError.js'
import { Like } from '../Models/like.model.js'
import mongoose from 'mongoose'

const addLikes = asyncHandler(async(req,res)=>{

    const {videoId,userId} =req.body

    if(!videoId || !userId){
        throw new apiError(404,'No user or video found')
    }

    const isLiked=await Like.findOne({
        video:videoId,
        likedBy:userId
    })

    if(isLiked){
        await Like.findOneAndDelete({
            video:videoId,
            likedBy:userId
        })
        return res.status(200)
        .json(new apiResponse(200,{},'Like removed'))
    }
    const newLike = await new Like({
        video:videoId,
        likedBy:userId
    })
    await newLike.save()
    if(!newLike){
        throw new apiError(500,"Cant add like")
    }

    return res.status(200)
    .json( new apiResponse(200,{},'Like added sucessfully'))

})

const likeCount = async(videoId,userId)=>{
    try {
        if(!videoId || !userId){
            throw new apiError(404,'No video id found')
        }
        const likes = await Like.countDocuments({video:videoId})
        const liked= await Like.findOne({video:videoId,likedBy:userId})
        if(liked){
            const isLiked =true
            return {likes,isLiked}
        }
        const isLiked =false
        return {likes,isLiked}
    } catch (error) {
        throw new apiError(500,'Unable to find likes')
    }
}
export {
    addLikes,
    likeCount
}