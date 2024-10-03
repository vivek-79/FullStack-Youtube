
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { addLikes,likeShort } from "../Controllers/likes.controller.js";

const likeRoute= Router()

likeRoute.use(verifyLogin)

likeRoute.route('/add-like').post(addLikes)
likeRoute.route('/add-like/like-short').post(likeShort)

export {likeRoute}