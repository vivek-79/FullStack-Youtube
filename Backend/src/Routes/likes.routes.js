
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { addLikes } from "../Controllers/likes.controller.js";

const likeRoute= Router()

likeRoute.use(verifyLogin)

likeRoute.route('/add-like').post(addLikes)

export {likeRoute}