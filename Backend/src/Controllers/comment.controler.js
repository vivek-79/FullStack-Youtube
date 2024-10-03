
import mongoose from 'mongoose'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { Comment } from '../Models/comment.model.js'
import { apiError } from '../Utils/apiError.js'
import { apiResponse } from '../Utils/apiResponse.js'

const addComment = asyncHandler(async (req, res) => {

    const { content, videoId, userId } = req.body

    try {
        const comment = new Comment({
            content: content,
            video: videoId,
            user: userId
        })

        if (!comment) {
            throw new apiError(500, 'Unable to add comment')
        }
        comment.save()
    } catch (error) {
        throw new apiError(500, 'Cant add comment')
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

const shortComment = asyncHandler(async (req, res) => {
    const { content, shortId, userId } = req.body

    if ([content, shortId, userId].some((field) => (
        field.trim() === ''
    ))) {
        throw new apiError(400, 'All fields are compulsory')
    }
    try {
        const comment = new Comment({
            content: content,
            short: shortId,
            user: userId
        })
        await comment.save()

        //instant fetch
        const comments = await Comment.aggregate([
            {
                $match: {
                    short: comment.short,
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                userName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    user: {
                        $first: '$user'
                    }
                }
            }
        ])
        return res.status(200)
            .json(
                new apiResponse(
                    200,
                    comments,
                    "Comment added"
                )
            )
    } catch (error) {
        throw new apiError(500, 'Cant add comment')
    }
})
const getComments = asyncHandler(async (req, res) => {

    const { shortId } = req.body
    console.log(shortId)
    if (!shortId) {
        throw new apiError(400, 'No shortId found')
    }
    try {
        const comments = await Comment.aggregate([
            {
                $match: {
                    short: new mongoose.Types.ObjectId(shortId), // Match the specific short
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                userName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    user: {
                        $first: '$user'
                    }
                }
            }
        ])

        return res.status(200)
            .json(
                new apiResponse(200, comments, 'Comments fetched successfully')
            )

    } catch (error) {
        throw new apiError(500, 'Cant get comments')
    }

})
export { addComment, shortComment, getComments }