

import { Subscription } from "../Models/subscription.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiResponse } from "../Utils/apiResponse.js";
import {apiError} from '../Utils/apiError.js'
import {User} from '../Models/user.model.js'

const addSubscriber = asyncHandler(async(req,res)=>{

    const {userId,channelId} = req.body
    if(!userId || !channelId){
        throw new apiError(404,'No user found')
    }
    
    try {

        const existingSuubscriber = await Subscription.findOne({
            channel:channelId,
            subscriber:userId
        })
        
        if(existingSuubscriber){
             await Subscription.findOneAndDelete({
                channel:channelId,
                subscriber:userId
            })
            return res.status(200)
            .json(
                new apiResponse(
                    200,
                    {},
                    "Unsubscribed Successfully"
                )
            )
        }

        const suscription=new Subscription({
            channel:channelId,
            subscriber:userId,
        })
        await suscription.save();

        return res.status(200)
        .json(
            new apiResponse(
                200,
                {suscription},
                "Subscribed Successfully"
            )
        )
    } catch (error) {
        
        throw new apiError(502,error.message)
    }
})

export {addSubscriber}