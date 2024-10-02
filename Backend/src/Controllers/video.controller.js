
import { apiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { cloudnaryDelete, cloudnaryUpload } from "../Utils/cloudinary.js";
import { Video } from "../Models/video.model.js";
import { apiResponse } from "../Utils/apiResponse.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

const uploadVideo = asyncHandler(async(req,res)=>{

    const videoLocalfilePath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    const {title,description,isPublished} = req.body
    
    if([title,description,isPublished].some((field)=>{
        field?.trim() ===''
    })){
        throw new apiError(401,'All fielsds are required')
    }

    if(!videoLocalfilePath || !thumbnailLocalPath){
        throw new apiError(400,"All fields are required")
    }

    const video = await cloudnaryUpload(videoLocalfilePath)

    const videoUrl =video.display_name

    const hlsurl = cloudinary.url(`${videoUrl}.m3u8`,{
        resource_type:'video',
        type:'upload',
        transformation:[
            {streaming_profile:'hd'}
        ]
    });

    const thumbnail = await cloudnaryUpload(thumbnailLocalPath)
    const duration= video.duration
    const owner = req.user._id
    const upload =await Video.create({
        title,
        videoFile:hlsurl,
        thumbnail:thumbnail.url,
        description,
        duration,
        isPublished,
        owner: new mongoose.Types.ObjectId(owner)
    })
    const uploadedVideo = await Video.findById(upload._id).populate({
        path:'owner',
        select:'avatar userName fullName '
    })
    return res.status(200)
    .json(
        new apiResponse(
            200,
        {uploadedVideo},
        'video Uploaded success'
        )
    )
})

const changeThumbnail = asyncHandler(async(req,res)=>{
    
    const {videoId} = req.params

    const video = await Video.findById(videoId).select('thumbnail')
    const videoUrl =video.thumbnail
    const parts = videoUrl.split('/')
    const last= parts.pop().split('.')[0]
    const publicId =last
    const newThumbnail= req.file.path
    if(!newThumbnail){
        throw new apiError(404,'Thumbnail is required')
    }
    const upload = await cloudnaryUpload(newThumbnail)
     if(!upload){
        throw new apiError(500,'Cloudinary upload error')
     }
    const newVideo =await  Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail:upload.url
            }
        },
        {
            new:true
        }
    )
    if(!newVideo){
        throw new apiError(500,'Something wrong while uploading')
    }
     cloudnaryDelete(publicId)
    return res.status(200)
    .json(
        new apiResponse(
            200,
            newVideo,
            'Thumbnail changed successfully'
        )
    )
})

const getVideos = asyncHandler(async(req,res)=>{
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        if(!page || ! limit){
            throw new apiError(400,'querry not found')
        }
        console.log(page,limit)
        const skip = (page-1)*limit
        const totalVideos = await Video.countDocuments()
        const totalPage = Math.ceil(totalVideos/limit)
        let video=[]
        try {
            video=await Video.aggregate([
                {
                    $skip:skip,
                },
                {
                    $limit:limit
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'owner',
                        foreignField:'_id',
                        as:'owner',
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    avatar:1
                                }
                            }
                        ]
                    },
                },
                {
                    $addFields:{
                        owner:{
                            $first:'$owner'
                        }
                    }
                }
            ])
        } catch (error) {
            throw new apiError("Cant get User")
        }
        if(!video?.length>0){
            throw new apiError('Cant get videos')
        }
        return res.status(200)
        .json(
            new apiResponse(
                200,
                {video,totalVideos,totalPage,page,limit},
                'video fetched successfullly'
            )
        )
    } catch (error) {
        throw new apiError(506,'Error while fetching')
    }
})

const getVideoDetail=asyncHandler(async(req,res,next)=>{

    const {videoId} = req.params

    if(!videoId){
        throw new apiError(404,"No params found")
    }
    console.log(videoId)
    try {
            await Video.findByIdAndUpdate(videoId,{
            $inc:{
                views:1
            }
        })
    } catch (error) {
        throw new apiError(500,'Cant add views');
        
    }
    const detail=await Video.aggregate([
        {
            $match:{
                _id :new mongoose.Types.ObjectId(videoId)
            }
        },
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
                            fullName:1,
                        },
                    }
                ]
            },
        },
        {
            $addFields:{
                owner:{
                    $first:'$owner'
                }
            }
        }
    ]).exec()

    if(!detail?.length>0){
        throw new apiError('Cant Find Video')
    }

    return res.status(200)
    .json(
        new apiResponse(
            200,
            detail[0],
            'success'
        )
    )
})


export {
    uploadVideo,
    changeThumbnail,
    getVideos,
    getVideoDetail
}