
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { addComment } from "../Controllers/comment.controler.js";

const commentRoute = Router()

commentRoute.use(verifyLogin)

commentRoute.route('/add-comment').post(addComment)

export {commentRoute}