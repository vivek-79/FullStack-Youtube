import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"


const app =express()

app.use(cors({
    origin:process.env.CORS_ORIGIN 
}))

app.use(express.json({limit:"20kb"}))

app.use(express.urlencoded({extended:true,limit:"20kb"}))

app.use(express.static("public"))

app.use(cookieparser())

app.use(express.json())

//routes import
import { userRouter } from "./Routes/user.routes.js"
import { videoRoute } from "./Routes/video.routes.js"
import { subscriptionRoute } from "./Routes/subscribtion.routes.js"
import { likeRoute } from "./Routes/likes.routes.js"

//route declare

app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRoute)
app.use('/api/v1/subscription',subscriptionRoute)
app.use('/api/v1/likes',likeRoute)

export {app}