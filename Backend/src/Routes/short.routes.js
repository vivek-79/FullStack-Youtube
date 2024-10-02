
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import { getShorts, uploadShort } from "../Controllers/short.controller.js";


const shortRoute=Router()

shortRoute.use(verifyLogin)

shortRoute.route('/upload').post(upload.single('short'),uploadShort)
shortRoute.route('/get-shorts').get(getShorts)

export {shortRoute}