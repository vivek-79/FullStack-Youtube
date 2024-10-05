
import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    userName:{
        type:String,
        requireD:true,
        unique:true,
        lowerCase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true
    },
    avatar:{
        type:String,//cloudanary
        required:true
    },
    coverImage:{
        type:String,//cloudanary
    },
    watchHistoryVideo:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    watchHistoryShort:[
        {
            type:Schema.Types.ObjectId,
            ref:"Short"
        }
    ],
    watchLater:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,//bcrypt
        required:[true,"Password Is Required"],
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})


//bcrypt

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next ()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

//jwt

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshTokenToken= function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SERET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",userSchema)