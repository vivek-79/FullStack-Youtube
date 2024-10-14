
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import { changeThumbnail, getVideoDetail, getVideos, uploadVideo ,getRecomendations,getSearch,getDetails,editDetails} from "../Controllers/video.controller.js";


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
videoRoute.route('/getrecomendations').post(getRecomendations)
videoRoute.route('/getsearch').post(getSearch)
videoRoute.route('/get-video-details/:videoId').get(getDetails)
videoRoute.route('/edit-details').post(editDetails)
export {videoRoute}