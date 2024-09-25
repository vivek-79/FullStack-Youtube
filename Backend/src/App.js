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

//routes import
import { userRouter } from "./Routes/user.routes.js"

//route declare

app.use('/api/v1/users',userRouter)

export {app}