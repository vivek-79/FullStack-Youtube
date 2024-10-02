
import { Router } from "express";
import { verifyLogin } from "../Middleware/auth.middleware.js";
import { addSubscriber} from "../Controllers/Subscribe.controller.js";

const subscriptionRoute=Router()

subscriptionRoute.use(verifyLogin)

subscriptionRoute.route('/addSubscribe').post(addSubscriber)
export {subscriptionRoute}