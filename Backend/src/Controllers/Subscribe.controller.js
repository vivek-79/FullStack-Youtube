

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
        console.log(existingSuubscriber)
        if(existingSuubscriber){
            throw new apiError(400,"Already Subscribed")
        }

        const suscription=new Subscription({
            channel:channelId,
            subscriber:userId
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

const deleteSubscriber = asyncHandler(async(req,res)=>{
    
    const {userId,channelId}=req.body

    if(!userId || !channelId){
        throw new apiError(404,'Required user and channel Id')
    }

    try {
        await Subscription.findOneAndDelete(
            {
                channel:channelId,
                subscriber:userId
            }
        )
        return res.status(200)
        .json( new apiResponse(
            200,
            {},
            'Unsubscribed Sucessfully'
        ))
    } catch (error) {
        throw new apiError(404,'have not subcribed channel')
    }
})
export {addSubscriber,deleteSubscriber}