import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";


const registerUser = asyncHandler(async(req,res)=>{

    res
    .status(200)
    .json({
        message:"ok tested"
    })
})

export {registerUser}