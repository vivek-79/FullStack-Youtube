import { Router } from "express";
import { getChannelDetail, getWatchHistory, loginUser, logoutUser, refreshaccessToken, registerUser,getChannelAnalysis,addHistory ,addWatchLater,getWatchLater,getSubscription,getChannelVideos,getUserDetails} from "../Controllers/user.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { verifyLogin } from "../Middleware/auth.middleware.js";

const userRouter=Router()

userRouter.route('/register').post(upload.fields([
    {
        name:'avatar',
    },
    {
        name:'coverImage',
    },
]),registerUser)

userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyLogin,logoutUser)
userRouter.route('/refreshToken').post(refreshaccessToken)
userRouter.route('/c').post(verifyLogin,getChannelDetail)
userRouter.route('/watch-history').post(verifyLogin,getWatchHistory)
userRouter.route('/get-channel-analysis').post(verifyLogin,getChannelAnalysis)
userRouter.route('/add-history').post(verifyLogin,addHistory)
userRouter.route('/add-watch-later').post(verifyLogin,addWatchLater)
userRouter.route('/get-watch-history').post(verifyLogin,getWatchLater)
userRouter.route('/get-Subscription').post(verifyLogin,getSubscription)
userRouter.route('/get-channel-video').post(verifyLogin,getChannelVideos)
userRouter.route('/get-user-details').get(verifyLogin,getUserDetails)
export {userRouter}