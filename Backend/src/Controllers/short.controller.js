import { Like } from "../Models/like.model.js";
import { Short } from "../Models/short.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { cloudnaryUpload } from "../Utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';


const uploadShort = asyncHandler(async (req, res) => {

    const { title, description, isPublished, userId } = req.body
    const localFilePath = req.file?.path

    console.log(title, description, isPublished, userId, localFilePath)
    if ([title, description, isPublished, localFilePath].some((field) =>
        field?.trim() == ''
    )) {
        throw new apiError('All fields are required')
    }

    const video = await cloudnaryUpload(localFilePath)
    const videoUrl = video.display_name

    const hslUrl = cloudinary.url(`${videoUrl}.m3u8`, {
        resource_type: 'video',
        type: 'upload',
        transformation: [
            { streaming_profile: 'hd' }
        ]
    });

    const data = await Short.create({
        title,
        description,
        owner: userId,
        isPublished,
        short: hslUrl
    })

    if (!data) {
        throw new apiError(501, 'Uploading failed')
    }
    return res.status(200)
        .json(
            new apiResponse(201, {}, 'Short uploaded successfully')
        )
})

const getShorts = asyncHandler(async (req, res) => {

    const { userId } = req.body
    let short = []
    try {
        short = await Short.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                userName: 1,
                                avatar: 1
                            }
                        }
                    ],
                }
            },
            {
                $project: {
                    owner: {
                        $first: '$owner'
                    },
                    title: 1,
                    short: 1
                }
            },
        ]).exec();

        let result = []
        const checkLiked = async () => {

            for (let item of short) {
                let shortId = item._id.toString()

                let isLiked = await Like.findOne({
                    short: shortId,
                    likedBy: userId
                });

                item.isLiked = !!isLiked
                result.push(item)
            }
            return res.status(200)
                .json(
                    new apiResponse(200, result, 'Short fetched sucessfully')
                )
        }
        checkLiked()
    } catch (error) {
        throw new apiError(502, 'Cant get shorts', error.message)
    }

})

export {
    uploadShort,
    getShorts
}