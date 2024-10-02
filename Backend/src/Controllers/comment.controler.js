
import mongoose from 'mongoose'
import {asyncHandler} from '../Utils/asyncHandler.js'
import { Comment } from '../Models/comment.model.js'
import {apiError} from '../Utils/apiError.js'
import {apiResponse} from '../Utils/apiResponse.js'

const addComment = asyncHandler(async(req,res)=>{

    const {content,videoId,userId} =req.body
    try {
        const comment = new Comment({
            content:content,
            video:videoId,
            user:userId
        })
        
        if(!comment){
            throw new apiError(500,'Unable to add comment')
        }
        comment.save()
    } catch (error) {
        throw new apiError(500,'Cant add comment')
    }

    return res.status(200)
    .json(
        new apiResponse(
            200,
            {},
            "Comment added"
        )
    )
})

export {addComment}