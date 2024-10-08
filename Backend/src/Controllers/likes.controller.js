
import {asyncHandler} from '../Utils/asyncHandler.js'
import {apiResponse} from '../Utils/apiResponse.js'
import {apiError} from '../Utils/apiError.js'
import { Like } from '../Models/like.model.js'


const addLikes = asyncHandler(async(req,res)=>{

    const {videoId,userId,ownerId} =req.body

    console.log(ownerId)
    if(!videoId || !userId || !ownerId){
        throw new apiError(404,'No user or video found')
    }

    const isLiked=await Like.findOne({
        video:videoId,
        likedBy:userId,
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
        likedBy:userId,
        owner:ownerId
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
const likeShort = asyncHandler(async(req,res)=>{

    const {userId,shortId,ownerId} =req.body
    if(!userId || !shortId || !ownerId){
        throw new apiError(400,'UserId or Short is missing')
    }

    const isLiked = await Like.findOne({
        likedBy:userId,
        short:shortId
    })
    
    if(isLiked){
        await Like.findOneAndDelete({
            likedBy:userId,
            short:shortId
        })
        return res.status(200)
        .json(
            new apiResponse(200,{},"Like removed")
        )
    }
    const like = new Like({
        likedBy:userId,
        short:shortId,
        owner:ownerId
    })
    if(!like){
        throw new apiError(500,'Cant add like')
    }
    like.save()
    return res.status(200)
    .json(
        new apiResponse(200,{},'Like added')
    )
})

export {
    addLikes,
    likeCount,
    likeShort
}