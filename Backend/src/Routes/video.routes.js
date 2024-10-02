
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import { changeThumbnail, getVideoDetail, getVideos, uploadVideo } from "../Controllers/video.controller.js";


const videoRoute=Router()

videoRoute.use(verifyLogin)

videoRoute.route('/upload').post(upload.fields(
    [
        {
            name:'thumbnail',
            maxCount:1,
        },
        {
            name:'videoFile',
            maxCount:1
        }
    ]
),uploadVideo)

videoRoute.route('/change-thumbnail/:videoId').post(upload.single('thumbnail'),changeThumbnail)
videoRoute.route('/getvideo').post(getVideos)
videoRoute.route('/getvideo-detail/:videoId').get(getVideoDetail)
export {videoRoute}