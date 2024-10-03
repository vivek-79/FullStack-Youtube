
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { addComment, shortComment ,getComments} from "../Controllers/comment.controler.js";

const commentRoute = Router()

commentRoute.use(verifyLogin)

commentRoute.route('/add-comment').post(addComment)
commentRoute.route('/add-comment-short').post(shortComment)
commentRoute.route('/get-comment-short').post(getComments)

export {commentRoute}