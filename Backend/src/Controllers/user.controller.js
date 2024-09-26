import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/user.model.js";
import { cloudnaryUpload } from "../Utils/cloudinary.js";


const registerUser = asyncHandler(async(req,res)=>{

    const {userName,fullName,email,password} =req.body

    if(
        [userName,fullName,email,password].some((field)=>
            field.trim() ==='')
    ){
        throw new apiError(400,'All fields are required')
    }

    const alreadyExist = await User.findOne({
        $or:[{email},{userName}]
    })
    if (alreadyExist){
        throw new apiError(401,'User already exist')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath =req.files?.coverImage?.[0].path

    if(!avatarLocalPath){
        throw new apiError(403,'Avatar is required')
    }
    const avatar = await cloudnaryUpload(avatarLocalPath)
    if(!avatar){
        throw new apiError(403,'Avatar is required')
    }
    let coverImage =''
    if(coverImageLocalPath){
        coverImage=await cloudnaryUpload(coverImageLocalPath)
    }

    const user =await User.create({
        fullName,
        userName:userName.toLowerCase(),
        email,
        avatar,
        coverImage,
        password
    })
    
    const existUser =await User.findById(user._id).select('-password -refreshToken')

    if(!existUser){
        throw new apiError(500,'Something wrong while creating user')
    }
    return res 
    .status(200)
    .json( new apiResponse(
        200,
        existUser,
        'User created'
    ))

})

const loginUser = asyncHandler(async(req,res)=>{

    const {userName,email,password} =req.body
    console.log(req.body)

    if(!userName && !email){
        throw new apiError(400,'Username or Email is required')
    }
    if(!password){
        throw new apiError(400,'Password is required')
    }

    const isUser = await User.findOne({
        $or:[{email},{userName}]
    })

    if(!isUser){
        throw new apiError(401,'User not Exist')
    }
    const ispasswordCorrect=await isUser.isPasswordCorrect(password)

    if(!ispasswordCorrect){
        throw new apiError(404,'Password is wrong')
    }

    const accessToken=await isUser.generateAccessToken()
    const refreshToken=await isUser.generateRefreshTokenToken()
    if(!accessToken && !refreshToken){
        throw new apiError(500,'Error while generating tokens')
    }
    isUser.refreshToken=refreshToken
    await isUser.save({validateBeforeSave:false})

    const user=await User.findById(isUser._id).select('-password -refreshToken')
     
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie( 'refreshToken' ,refreshToken,options)
    .json(
        new apiResponse(
            200,
        {user:user,accessToken,refreshToken},
        'User logged in successfully'
        )
    )
})

const logoutUser =asyncHandler(async(req,res)=>{

    const id=req.user._id
    await  User.findByIdAndUpdate(
        id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(
        new apiResponse(
            200,
            {},
            'Logged out successfully'
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}