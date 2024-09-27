import { Router } from "express";
import { getChannelDetail, getWatchHistory, loginUser, logoutUser, refreshaccessToken, registerUser } from "../Controllers/user.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { verifyLogin } from "../Middleware/auth.middleware.js";

const userRouter=Router()

userRouter.route('/register').post(upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
    {
        name:'coverImage',
        maxCount:1
    }
]),registerUser)

userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyLogin,logoutUser)
userRouter.route('/refreshToken').post(refreshaccessToken)
userRouter.route('/c/:userName').get(verifyLogin,getChannelDetail)
userRouter.route('/watch-history').get(verifyLogin,getWatchHistory)
export {userRouter}