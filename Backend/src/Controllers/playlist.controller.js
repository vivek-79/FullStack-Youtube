import mongoose from "mongoose";
import { Playlist } from "../Models/playlist.model.js";
import { User } from "../Models/user.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";



const createPlaylist = asyncHandler((async (req, res) => {

    const { userId, title } = req.body
    console.log(req.body, userId, title)
    try {
        if (!userId) {
            throw new apiError(400, "UserId required")
        }
        if (!title) {
            title = 'New Playlist'
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new apiError(400, "No user found")
        }

        const playLists = await Playlist.findOne({
            owner: userId,
            name: title
        })

        if (playLists) {
            return res.status(400)
                .json(new apiResponse(400, {}, "Playlist already exists"))
        }

        const newPlayList = new Playlist({
            owner: userId,
            name: title
        })

        await newPlayList.save()

        if (!newPlayList) {
            throw new apiError(500, "Cant create playlist")
        }
        return res.status(200).json(200, {}, "PlayList Created")
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(500, {}, "Server error while creeating playlist")
    }
}))

const getPlayList = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!userId) {
        throw new apiError(400, 'UserId is missing')
    }

    try {
        const playlists = await Playlist.find({
            owner: userId
        })
        if (!playlists) {
            throw new apiError(400, "No playlist found")
        }
        return res.status(200)
            .json(new apiResponse(200, { playlists }, "Playlist fetched successfully"))
    } catch (error) {
        return res.status(500)
            .json(new apiResponse(500, {}, "Cant get playlist"))
    }
})

const addToPlaylist = asyncHandler(async (req, res) => {

    const { videoId, playlistId } = req.body

    try {
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new apiError(400, "No playlist Found")
        }
        if (playlist.videos.includes(videoId)) {
            return res.status(400)
                .json(new apiResponse(400, {}, "Already exists"))
        }
        else {
            playlist.videos.push(videoId)
            await playlist.save()

            return res.status(200)
                .json(new apiResponse(200, {}, "Added to playlist"))
        }
    } catch (error) {
        return res.status(500)
            .json(new apiResponse(500, {}, "Server error"))
    }
})

const getVideos = asyncHandler(async (req, res) => {

    const { userId } = req.body

    if (!userId) {
        throw new apiError(400, "UserId not found")
    }

    try {
        const playlist =await Playlist.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos',
                    pipeline: [
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
                                ]
                            }
                        },
                        {
                            $project: {
                                thumbnail: 1,
                                title: 1,
                                owner: 1,
                            }
                        }
                    ]
                }
            }
        ]).exec()
        return res.status(200)
        .json(new apiResponse(200,playlist,"Playlist fetched successfullly"))
    } catch (error) {
        return res.status(500)
        .json(new apiResponse(500,{},"Server Error"))
    }
})
export {
    createPlaylist,
    getPlayList,
    addToPlaylist,
    getVideos
}