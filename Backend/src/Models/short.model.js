
import mongoose,{Schema} from 'mongoose'

const shortSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    short:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    isPublished:{
        type:Boolean,
        required:true
    }

},{timestamps:true})


export const Short = mongoose.model('Short',shortSchema)